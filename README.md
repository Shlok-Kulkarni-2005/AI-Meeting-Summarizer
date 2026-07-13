<div align="center">

# 🤖 AI Meeting Summarizer

<p>
  <img src="screenshots/home.png" alt="AI Meeting Summarizer" width="900"/>
</p>

<p>
An AI-powered web application that converts meeting audio recordings into structured transcripts, intelligent summaries, key decisions, actionable tasks, and meeting insights using Speech-to-Text and Large Language Models.
</p>

<p>

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)
![Node.js](https://img.shields.io/badge/Node.js-Express-339933?logo=node.js)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4-38B2AC?logo=tailwind-css)
![Groq](https://img.shields.io/badge/Groq-AI-black)
![License](https://img.shields.io/badge/License-Educational-blue)

</p>

</div>

---

## 📑 Table of Contents

- Overview
- Features
- Tech Stack
- Project Structure
- Installation
- Environment Variables
- Running the Application
- Application Workflow
- API Endpoints
- Screenshots
- Future Improvements
- License
- Author

---

# 📖 Overview

The **AI Meeting Summarizer** is a full-stack web application that automatically converts meeting recordings into structured meeting notes.

Users can upload meeting audio recordings and receive:

- Accurate speech-to-text transcription
- AI-generated meeting summary
- Key decisions
- Action items
- Meeting insights
- Keywords
- Metadata
- Downloadable reports

The application leverages **Whisper Large V3 Turbo** for speech recognition and **GPT OSS 120B** for intelligent summarization.

---

# ✨ Features

- 🎤 Audio upload with drag-and-drop support
- 📝 Automatic speech-to-text transcription
- 🤖 AI-generated meeting summaries
- 📌 Key decision extraction
- ✅ Action item generation
- 🏷 Suggested meeting title & category
- 😊 Sentiment analysis
- 🔑 Keyword extraction
- 📊 Meeting insights & metadata
- 🔍 Transcript search
- 📋 Copy to clipboard
- 📄 Export as PDF, Markdown & TXT
- 📱 Fully responsive user interface

---

# 🛠 Tech Stack

## Frontend

- React (Vite)
- Tailwind CSS
- Axios
- Lucide React
- jsPDF

## Backend

- Node.js
- Express.js
- Multer

## AI Services

- Groq API
- Whisper Large V3 Turbo
- GPT OSS 120B

---

# 📂 Project Structure

```text
meeting-summarizer/
│
├── client/
│   ├── src/
│   ├── public/
│   └── package.json
│
├── server/
│   ├── config/
│   ├── controllers/
│   ├── middlewares/
│   ├── routes/
│   ├── services/
│   ├── uploads/
│   ├── utils/
│   └── package.json
│
├── screenshots/
│
└── README.md
```

---

# ⚙️ Installation

Clone the repository

```bash
git clone https://github.com/Shlok-Kulkarni-2005/AI-Meeting-Summarizer.git
```

## Install Backend

```bash
cd server
npm install
```

## Install Frontend

```bash
cd ../client
npm install
```

---

# 🔐 Environment Variables

Create a `.env` file inside the **server** directory.

```env
PORT=5000
GROQ_API_KEY=your_groq_api_key
```

(Optional)

```env
VITE_API_BASE_URL=http://localhost:5000
```

---

# ▶️ Running the Application

## Backend

```bash
cd server
npm run dev
```

## Frontend

```bash
cd client
npm run dev
```

Open your browser:

```
http://localhost:5173
```

---

# 🔄 Application Workflow

```text
             Upload Audio
                  │
                  ▼
      Speech-to-Text (Whisper)
                  │
                  ▼
      Transcript Generation
                  │
                  ▼
      LLM Processing (GPT OSS)
                  │
      ┌───────────┼───────────┐
      ▼           ▼           ▼
   Summary   Key Decisions  Action Items
      │           │           │
      └───────────┼───────────┘
                  ▼
        Meeting Insights
                  │
                  ▼
      Export Report (PDF / TXT / MD)
```

---

# 🌐 API Endpoints

| Method | Endpoint | Description |
|---------|----------|-------------|
| POST | `/upload` | Upload meeting audio |
| POST | `/summarize` | Generate transcript, summary and action items |

---

# 📸 Screenshots

## Upload Interface

![Upload](screenshots/upload.png)

---

## Transcript

![Transcript](screenshots/transcript.png)

---

## Generated Summary

![Summary](screenshots/summary.png)

---

## Action Items

![Action Items](screenshots/action-items.png)

---

## Meeting Insights

![Insights](screenshots/insights.png)

---

# 🚀 Future Improvements

- Speaker diarization
- Multi-language transcription
- Longer meeting support
- Cloud storage integration
- Calendar integration
- Real-time meeting transcription
- AI-generated meeting timeline

---

# 📄 License

This project is intended for educational and learning purposes.

---

# 👨‍💻 Author

**Shlok Kulkarni**

B.Tech in Information Technology  
Vishwakarma Institute of Information Technology (VIIT), Pune

**GitHub:** https://github.com/Shlok-Kulkarni-2005

**LinkedIn:** https://www.linkedin.com/in/shlok-d-kulkarni/

---

<div align="center">

⭐ If you found this project useful, consider giving it a star.

</div>
