
const axios = require("axios");

const getAIRecommendation = async (candidate, jobs) => {
  try {
     const prompt = `
You are an intelligent AI job recommendation system for a Job Portal.

Your task is to compare the candidate profile with every available job
and calculate a realistic match percentage from 0 to 100.

IMPORTANT SCORING RULES:

1. Skills match = 50% weight
2. Preferred role vs job title = 25% weight
3. Experience match = 15% weight
4. Education/background relevance = 10% weight

Candidate Profile:
Name: ${candidate.name}
Skills: ${candidate.skills.join(", ")}
Preferred Role: ${candidate.preferredRole}
Experience: ${candidate.experience}
Education: ${candidate.education}
Bio: ${candidate.bio}

Available Jobs:

${jobs
  .map(
    (job, index) => `
Job ${index + 1}
Job ID: ${job._id}
Title: ${job.title}
Company: ${job.company}
Description: ${job.description}
Skills: ${job.skills.join(", ")}
Experience Required: ${job.experience}
Location: ${job.location}
Salary: ${job.salary}
Job Type: ${job.jobType}
`
  )
  .join("\n")}

ANALYSIS INSTRUCTIONS:

For every job:

- Compare candidate skills with required job skills.
- Give higher score when more required skills match.
- Compare candidate preferredRole with the job title.
- Check whether candidate experience matches the required experience.
- Consider education and bio when relevant.
- Do not give every job the same score.
- Be realistic.
- A very strong match should normally be 85-100.
- A good match should normally be 70-84.
- A moderate match should normally be 50-69.
- A weak match should normally be below 50.
- Only recommend jobs with matchPercentage >= 50.
- Give a short, specific reason explaining why the job matches.
- Do not invent candidate skills or experience.

Return ONLY valid JSON.

Required format:

{
  "recommendations": [
    {
      "jobId": "exact job id",
      "matchPercentage": 95,
      "reason": "Strong match because the candidate has React, Node.js and MongoDB skills and the preferred Full Stack Developer role closely matches the position."
    }
  ]
}
`;

    const response = await axios.post(
      "http://localhost:11434/api/generate",
      {
        model: "qwen2.5:0.5b",
        prompt: prompt,
        stream: false,
        format: "json",
      }
    );

    return JSON.parse(response.data.response);
  } catch (error) {
    console.error("AI Recommendation Error:", error.message);
    throw error;
  }
};

module.exports = {
  getAIRecommendation,
};