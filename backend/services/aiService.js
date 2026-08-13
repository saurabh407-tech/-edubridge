const { GoogleGenerativeAI } = require("@google/generative-ai");
const User = require("../models/User");
const Resource = require("../models/Resource");

let genAI = null;
let model = null;

try {
  if (process.env.GEMINI_API_KEY) {
    genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    model = genAI.getGenerativeModel({
  model: "gemini-3.1-flash-lite"
});
    console.log("✅ Gemini AI initialized");
  }
} catch (err) {
  console.warn("Gemini init failed:", err.message);
}

async function askGemini(prompt) {
  if (!model) {
    console.error("❌ Gemini model is not initialized");
    return null;
  }

  try {
    const result = await model.generateContent(prompt);

    const text = result.response.text().trim();

    console.log("🤖 Gemini Response:", text);

    // Remove ```json ... ``` if Gemini returns markdown
    let cleanedText = text
      .replace(/^```json\s*/i, "")
      .replace(/^```\s*/i, "")
      .replace(/\s*```$/i, "")
      .trim();

    // Direct JSON parsing
    try {
      return JSON.parse(cleanedText);
    } catch (parseError) {
      console.warn("⚠️ Direct JSON parsing failed");

      // Try JSON object
      const objectMatch = cleanedText.match(/\{[\s\S]*\}/);

      if (objectMatch) {
        try {
          return JSON.parse(objectMatch[0]);
        } catch (err) {
          console.error("❌ Object JSON parsing failed");
        }
      }

      // Try JSON array
      const arrayMatch = cleanedText.match(/\[[\s\S]*\]/);

      if (arrayMatch) {
        try {
          return JSON.parse(arrayMatch[0]);
        } catch (err) {
          console.error("❌ Array JSON parsing failed");
        }
      }

      return null;
    }

  } catch (err) {
    console.error("❌ Gemini API Error:", err.message);
    return null;
  }
}

// ─────────────────────────────────────────────
// 1. AI Resource Recommendations
// FIXED: Works even without skills — uses branch/semester fallback
// ─────────────────────────────────────────────
exports.getResourceRecommendations = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (!user) return [];

    // Step 1: Try to get resources matching user's branch + semester first
    const query = { isActive: true };
    if (user.branch) query.branch = user.branch;
    if (user.semester) query.semester = parseInt(user.semester);

    let resources = await Resource.find(query)
      .populate("uploadedBy", "name profilePhoto")
      .sort({ downloadCount: -1, createdAt: -1 })
      .limit(10);

    // Step 2: If no branch/semester match, get popular resources
    if (resources.length === 0) {
      resources = await Resource.find({ isActive: true })
        .populate("uploadedBy", "name profilePhoto")
        .sort({ downloadCount: -1, createdAt: -1 })
        .limit(10);
    }

    if (resources.length === 0) return [];

    // Step 3: If Gemini available + user has skills, use AI to rerank
    if (model && (user.skills?.length > 0 || user.branch)) {
      try {
        const prompt = `
You are a resource recommendation system for students.

Student:
- Skills: ${user.skills?.join(", ") || "Not specified"}
- Branch: ${user.branch || "Not specified"}
- Semester: ${user.semester || "Not specified"}

Available Resources (pick top 2 most relevant):
${JSON.stringify(resources.map(r => ({
  id: r._id.toString(),
  title: r.title,
  category: r.category,
  subject: r.subject,
  semester: r.semester,
  branch: r.branch,
}))).slice(0, 2000)}

Return ONLY a JSON array of exactly 2 IDs most relevant to this student:
["id1", "id2"]
        `;

        const ids = await askGemini(prompt);
        if (Array.isArray(ids) && ids.length > 0) {
          const aiPicked = await Resource.find({ _id: { $in: ids } })
            .populate("uploadedBy", "name profilePhoto")
            .limit(2);
          if (aiPicked.length > 0) return aiPicked;
        }
      } catch (aiErr) {
        console.warn("Gemini reranking failed, using fallback:", aiErr.message);
      }
    }

    // Step 4: Return top 2 by downloads (fallback)
    return resources.slice(0, 2);

  } catch (err) {
    console.error("Resource Recommendation error:", err.message);
    return [];
  }
};

// ─────────────────────────────────────────────
// 2. AI Team Matching
// ─────────────────────────────────────────────
exports.findTeamMatches = async (project) => {
  try {
    if (!model) return [];
    const candidates = await User.find({
      skills: { $in: project.requiredSkills || [] },
      _id: { $nin: [project.creator, ...project.members.map(m => m.user)] },
      isActive: true,
    }).limit(30).select("_id name skills branch semester contributionScore");

    if (candidates.length === 0) return [];

    const prompt = `
You are a team formation assistant.
Project: "${project.title}"
Required Skills: ${project.requiredSkills?.join(", ")}
Candidates: ${JSON.stringify(candidates.map(c => ({ id: c._id, name: c.name, skills: c.skills, branch: c.branch })))}
Return top 5 matches as JSON array:
[{"userId":"id","matchScore":90,"reason":"Has required skills"}]
    `;
    const matches = await askGemini(prompt);
    return Array.isArray(matches) ? matches.slice(0, 5) : [];
  } catch (err) {
    console.error("Team Matching error:", err.message);
    return [];
  }
};

// ─────────────────────────────────────────────
// 3. Duplicate Detection
// ─────────────────────────────────────────────
exports.detectDuplicate = async (fileUrl, title) => {
  try {
    const existing = await Resource.find({ isActive: true }).select("_id title").limit(100);
    const titleLower = title.toLowerCase();
    const duplicate = existing.find(r => {
      const existingTitle = r.title.toLowerCase();
      return existingTitle === titleLower ||
        (existingTitle.length > 10 && existingTitle.includes(titleLower.slice(0, 15)));
    });
    return duplicate
      ? { isDuplicate: true, duplicateId: duplicate._id }
      : { isDuplicate: false, duplicateId: null };
  } catch {
    return { isDuplicate: false, duplicateId: null };
  }
};

// ─────────────────────────────────────────────
// 4. Career Recommendations
// ─────────────────────────────────────────────
exports.getCareerRecommendations = async (skills) => {
  try {
    if (!model) return getFallbackCareers(skills);
    const prompt = `
Career counselor for Indian engineering students.
Student Skills: ${skills.join(", ")}
Suggest 5 best matching career paths. Return ONLY JSON array:
[{
  "title": "Full Stack Developer",
  "match": 92,
  "description": "Brief 1-line description",
  "nextSteps": ["Step 1", "Step 2", "Step 3"],
  "avgSalary": "₹8-15 LPA",
  "companies": ["Company1", "Company2", "Company3"]
}]
    `;
    const result = await askGemini(prompt);
    return Array.isArray(result) ? result : getFallbackCareers(skills);
  } catch (err) {
    return getFallbackCareers(skills);
  }
};

function getFallbackCareers(skills) {
  const s = skills.map(x => x.toLowerCase());
  const careers = [];
  if (s.some(x => ["react","node","express","mongodb","javascript"].includes(x)))
    careers.push({ title: "Full Stack Developer", match: 90, description: "Build complete web applications", nextSteps: ["Learn Docker", "Build 2 projects", "System Design"], avgSalary: "₹8-15 LPA", companies: ["Flipkart", "Swiggy", "Razorpay"] });
  if (s.some(x => ["python","ml","tensorflow","keras","ai"].includes(x)))
    careers.push({ title: "ML Engineer", match: 88, description: "Build machine learning models", nextSteps: ["Kaggle", "Research papers", "MLOps"], avgSalary: "₹12-25 LPA", companies: ["Google", "Microsoft", "Nvidia"] });
  careers.push({ title: "Software Engineer", match: 85, description: "General software development", nextSteps: ["DSA practice", "LeetCode", "System Design"], avgSalary: "₹6-20 LPA", companies: ["TCS", "Infosys", "Amazon"] });
  return careers;
}

// ─────────────────────────────────────────────
// 5. Resume Analyzer
// ─────────────────────────────────────────────
exports.analyzeResume = async (resumeText, userSkills) => {
  try {
    if (!model) return { error: "AI not configured. Add GEMINI_API_KEY to backend/.env" };
    const prompt = `
ATS resume analyzer for tech students.
Skills: ${userSkills.join(", ")}
Resume: ${resumeText.slice(0, 3000)}
Return ONLY JSON:
{
  "atsScore": 75,
  "strengths": ["strength1","strength2"],
  "gaps": ["gap1","gap2"],
  "suggestions": ["suggestion1","suggestion2"],
  "missingKeywords": ["keyword1","keyword2"],
  "overallFeedback": "Overall feedback here",
  "sectionScores": {"summary":70,"experience":65,"skills":85,"education":90,"projects":75}
}
    `;
    const result = await askGemini(prompt);
    return result || { error: "Analysis failed. Try again." };
  } catch (err) {
    return { error: "Analysis failed" };
  }
};

// ─────────────────────────────────────────────
// 6. Smart Search
// ─────────────────────────────────────────────
exports.smartSearch = async (query) => {
  try {
    // -----------------------------------------
    // STEP 1: Ask Gemini to understand query
    // -----------------------------------------

    let aiParams = {
      category: null,
      subject: null,
      semester: null,
      branch: null,
      keywords: [query],
      intent: query,
    };

    if (model) {
      const prompt = `
You are an AI search assistant for a college student resource platform.

Understand the student's search query and convert it into structured search parameters.

Student Query:
"${query}"

Return ONLY valid JSON in this exact format:

{
  "category": null,
  "subject": null,
  "semester": null,
  "branch": null,
  "keywords": [],
  "intent": ""
}

Rules:

1. category can ONLY be:
notes,
pyq,
assignments,
lab_manuals,
placement,
interview_questions,
projects,
research_papers

2. If semester is not mentioned, use null.

3. If branch is not mentioned, use null.

4. If subject is not mentioned, use null.

5. keywords should contain important search terms from the query.

6. Do not invent information.

Example:

Query:
"DBMS 4th semester PYQ"

Return:
{
  "category": "pyq",
  "subject": "DBMS",
  "semester": 4,
  "branch": null,
  "keywords": ["DBMS", "PYQ"],
  "intent": "Looking for DBMS previous year questions for semester 4"
}
`;

      const result = await askGemini(prompt);

      if (result && typeof result === "object") {
        aiParams = {
          ...aiParams,
          ...result,
        };
      }
    }

    console.log("🤖 AI Search Parameters:", aiParams);

    // -----------------------------------------
    // STEP 2: Build MongoDB search query
    // -----------------------------------------

    const mongoQuery = {
      isActive: true,
    };

    // Category
    if (aiParams.category) {
      mongoQuery.category = new RegExp(
        `^${escapeRegex(aiParams.category)}$`,
        "i"
      );
    }

    // Subject
    if (aiParams.subject) {
      mongoQuery.subject = new RegExp(
        escapeRegex(aiParams.subject),
        "i"
      );
    }

    // Branch
    if (aiParams.branch) {
      mongoQuery.branch = new RegExp(
        escapeRegex(aiParams.branch),
        "i"
      );
    }

    // Semester
    if (aiParams.semester !== null && aiParams.semester !== undefined) {
      mongoQuery.semester = Number(aiParams.semester);
    }

    // -----------------------------------------
    // STEP 3: Search database
    // -----------------------------------------

    let resources = await Resource.find(mongoQuery)
      .populate("uploadedBy", "name profilePhoto")
      .sort({
        downloadCount: -1,
        createdAt: -1,
      })
      .limit(20);

    // -----------------------------------------
    // STEP 4: If strict filters give no result,
    // perform broader keyword search
    // -----------------------------------------

    if (resources.length === 0) {
      const keywords = Array.isArray(aiParams.keywords)
        ? aiParams.keywords.filter(Boolean)
        : [query];

      const keywordRegex = keywords.map((keyword) =>
        escapeRegex(keyword)
      );

      resources = await Resource.find({
        isActive: true,
        $or: [
          {
            title: {
              $in: keywordRegex.map(
                (keyword) => new RegExp(keyword, "i")
              ),
            },
          },
          {
            description: {
              $in: keywordRegex.map(
                (keyword) => new RegExp(keyword, "i")
              ),
            },
          },
          {
            subject: {
              $in: keywordRegex.map(
                (keyword) => new RegExp(keyword, "i")
              ),
            },
          },
        ],
      })
        .populate("uploadedBy", "name profilePhoto")
        .sort({
          downloadCount: -1,
          createdAt: -1,
        })
        .limit(20);
    }

    console.log(`🔎 Search results found: ${resources.length}`);

    // -----------------------------------------
    // STEP 5: Return AI params + DB results
    // -----------------------------------------

    return {
      query,
      filters: aiParams,
      results: resources,
      count: resources.length,
    };

  } catch (err) {
    console.error("❌ Smart Search Error:", err);

    return {
      query,
      filters: {
        keywords: [query],
      },
      results: [],
      count: 0,
      error: "Search failed",
    };
  }
};

// ─────────────────────────────────────────────
// 7. Internship Recommendations
// ─────────────────────────────────────────────
exports.getInternshipRecommendations = async (userId) => {
  try {
    if (!model) return [];
    const user = await User.findById(userId);
    if (!user) return [];
    const prompt = `
Internship recommendations for Indian college student.
Skills: ${user.skills?.join(", ") || "General"}
Branch: ${user.branch || "CSE"}
Semester: ${user.semester || 4}
Suggest 5 internships. Return ONLY JSON array:
[{
  "company": "Google",
  "role": "SWE Intern",
  "skills": ["Python","DSA"],
  "stipend": "₹80,000/month",
  "duration": "3 months",
  "applyLink": "https://careers.google.com",
  "matchScore": 92,
  "tips": "Focus on DSA preparation"
}]
    `;
    const result = await askGemini(prompt);
    return Array.isArray(result) ? result : [];
  } catch (err) {
    return [];
  }
};

function escapeRegex(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}