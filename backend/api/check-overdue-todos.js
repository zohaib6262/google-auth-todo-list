// api/check-overdue-todos.js
const { checkOverdueTodos } = require("../lib/brevo.js");

module.exports = async (req, res) => {
  // Security check - Vercel cron se hi call ho
  const authHeader = req.headers.authorization;

  // Vercel cron automatically Bearer token bhejta hai
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      error: "Unauthorized",
      message: "This endpoint can only be called by Vercel Cron",
    });
  }

  try {
    console.log("⏰ Cron job started: Checking overdue todos...");

    await checkOverdueTodos();

    console.log("✅ Cron job completed successfully");

    res.status(200).json({
      success: true,
      message: "Overdue todos checked successfully",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("❌ Cron job failed:", error);

    res.status(500).json({
      success: false,
      error: "Failed to check overdue todos",
      details: error.message,
      timestamp: new Date().toISOString(),
    });
  }
};
