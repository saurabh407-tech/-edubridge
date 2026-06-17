const { GoogleGenerativeAI } = require("@google/generative-ai");
const User = require("../models/User");
const Resource = require("../models/Resource");

let genAI = null;
let model = null;

try {
  if (process.env.GEMINI_API_KEY) {
    genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    console.log("✅ Gemini AI initialized");
  }
} catch (err) {
  console.warn("Gemini init failed:", err.message);
}

async function askGemini(prompt) {
  if (!model) return null;
  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text().trim();
    const jsonMatch = text.match(/```json\n?([\s\S]*?)\n?```/) || text.match(/(\[[\s\S]*\]|\{[\s\S]*\})/);
    if (jsonMatch) return JSON.parse(jsonMatch[1] || jsonMatch[0]);
    return JSON.parse(text);
  } catch (err) {
    console.error("Gemini parse error:", err.message);
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
    if (!model) return { keywords: [query] };
    const prompt = `
Convert this student search query to structured params.
Query: "${query}"
Return ONLY JSON:
{
  "category": "pyq",
  "subject": "DBMS",
  "semester": 4,
  "branch": "CSE",
  "keywords": ["DBMS","questions"],
  "intent": "Looking for DBMS PYQ"
}
Valid categories: notes,pyq,assignments,lab_manuals,placement,interview_questions,projects,research_papers
Use null for fields not applicable.
    `;
    const result = await askGemini(prompt);
    return result || { keywords: [query] };
  } catch {
    return { keywords: [query] };
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