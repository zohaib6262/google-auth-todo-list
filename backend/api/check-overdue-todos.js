// api/check-overdue-todos.js
const { checkOverdueTodos } = require("../lib/brevo.js");

module.exports = async (req, res) => {
  // Verify karo ke ye Vercel cron se hi call ho raha hai
  if (req.headers.authorization !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    await checkOverdueTodos();
    res.status(200).json({
      success: true,
      message: "Overdue todos checked successfully",
    });
  } catch (error) {
    console.error("Error checking overdue todos:", error);
    res.status(500).json({
      error: "Failed to check overdue todos",
      details: error.message,
    });
  }
};
