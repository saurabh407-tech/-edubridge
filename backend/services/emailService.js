const https = require("https");

exports.sendEmail = async ({ to, subject, html, text }) => {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({
      sender: {
        name: "EduBridge",
        email: process.env.SMTP_FROM,
      },
      to: [
        {
          email: to,
        },
      ],
      subject,
      htmlContent: html,
      textContent: text || "",
    });

    const options = {
      hostname: "api.brevo.com",
      path: "/v3/smtp/email",
      method: "POST",
      headers: {
        "api-key": process.env.BREVO_API_KEY,
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(data),
      },
    };

    const request = https.request(options, (response) => {
      let responseData = "";

      response.on("data", (chunk) => {
        responseData += chunk;
      });

      response.on("end", () => {
        if (response.statusCode >= 200 && response.statusCode < 300) {
          console.log("✅ Email sent successfully:", responseData);

          try {
            resolve(JSON.parse(responseData || "{}"));
          } catch {
            resolve(responseData);
          }
        } else {
          console.error(
            "❌ Brevo API Error:",
            response.statusCode,
            responseData
          );

          reject(
            new Error(
              `Brevo API Error ${response.statusCode}: ${responseData}`
            )
          );
        }
      });
    });

    request.on("error", (error) => {
      console.error("❌ Email request error:", error.message);
      reject(error);
    });

    request.write(data);
    request.end();
  });
};