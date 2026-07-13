require("dotenv").config();
const express = require("express");
const cors = require("cors");

const uploadRoutes = require("./routes/upload");
const summarizeRoutes = require("./routes/summarize");
const errorHandler = require("./middlewares/errorHandler");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Meeting Summarizer API is running");
});

app.use("/upload", uploadRoutes);
app.use("/summarize", summarizeRoutes);

// error handler has to be registered last
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
