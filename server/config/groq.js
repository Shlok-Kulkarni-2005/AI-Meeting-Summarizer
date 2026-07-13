const Groq = require("groq-sdk");

if (!process.env.GROQ_API_KEY) {
  console.warn("Warning: GROQ_API_KEY is not set in .env");
}

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

module.exports = groq;
