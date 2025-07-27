// services/aiService.js
require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize the Google AI client with your API key
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function analyzePitchDeckText(text) {
  // Specify the Gemini model we want to use
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash-latest' });

  // This is the prompt. It's a detailed instruction for the AI.
  const prompt = `
    As an expert investment analyst, your task is to analyze the following text extracted from a startup's pitch deck. 
    Evaluate the pitch deck against the nine predefined categories.
    The output MUST be a single, valid JSON object and nothing else. Do not wrap it in markdown backticks.

    The pitch deck text is as follows:
    ---
    ${text}
    ---

    Based on the text, provide a detailed analysis in the following JSON format:
    {
      "investmentRecommendation": "A string value of 'Strong Buy', 'Hold', or 'Pass'",
      "overallScore": "An integer between 0 and 100, calculated as a weighted average of the category scores.",
      "confidenceScore": "An integer between 0 and 100, reflecting your certainty in this analysis based on the completeness and coherence of the provided text.",
      "strengths": [
        "A bullet point string of a key positive finding.",
        "A bullet point string of another key positive finding.",
        "A bullet point string of a third key positive finding."
      ],
      "weaknesses": [
        "A bullet point string of a key risk or gap.",
        "A bullet point string of another key risk or gap.",
        "A bullet point string of a third key risk or gap."
      ],
      "recommendations": "A 100-200 word string of actionable advice for the startup or for investors considering this startup.",
      "categoryAnalysis": [
        { "category": "Problem Statement", "score": "integer 0-10", "weight": 10, "feedback": "50-150 words of qualitative feedback." },
        { "category": "Solution/Product", "score": "integer 0-10", "weight": 15, "feedback": "50-150 words of qualitative feedback." },
        { "category": "Market Opportunity", "score": "integer 0-10", "weight": 20, "feedback": "50-150 words of qualitative feedback." },
        { "category": "Business Model", "score": "integer 0-10", "weight": 15, "feedback": "50-150 words of qualitative feedback." },
        { "category": "Competitive Landscape", "score": "integer 0-10", "weight": 10, "feedback": "50-150 words of qualitative feedback." },
        { "category": "Team", "score": "integer 0-10", "weight": 15, "feedback": "50-150 words of qualitative feedback." },
        { "category": "Traction/Milestones", "score": "integer 0-10", "weight": 10, "feedback": "50-150 words of qualitative feedback." },
        { "category": "Financial Projections", "score": "integer 0-10", "weight": 10, "feedback": "50-150 words of qualitative feedback." },
        { "category": "Clarity and Presentation", "score": "integer 0-10", "weight": 5, "feedback": "50-150 words of qualitative feedback." }
      ]
    }
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const responseText = response.text();
    console.log("--- RAW AI RESPONSE ---:\n", responseText); 
    // The AI's response is a string, which we need to parse into a real JSON object.
    return JSON.parse(responseText);

  } catch (error) {
    console.error('Error calling the Gemini API:', error);
    throw new Error('Failed to get analysis from AI service.');
  }
}

module.exports = { analyzePitchDeckText };