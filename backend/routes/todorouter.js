const express = require("express");
const router = express();
// const { authenticate } = require("../middleware/authMiddleware");
const { authenticate } = require("../middleware/authMiddleware");
const TodoController = require("../controllers/todoController");

router.post("/create-todo", authenticate, TodoController.createTodo);
router.get("/get-todos", authenticate, TodoController.getTodos);
router.put("/update-todo/:id", authenticate, TodoController.updateTodo);
router.delete("/delete-todo/:id", authenticate, TodoController.deleteTodo);
router.get("/search", async (req, res) => {
  const { name } = req.query;

  if (!name || !name.trim()) {
    return res
      .status(400)
      .json({ status: false, message: "City name is required" });
  }

  try {
    const url = `https://www.hotelscombined.com/Islamabad-Hotels.33609.hotelist.ksp`;

    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    await page.goto(url);

    const items = await page.evaluate(() => {
      const hotelNodes = document.querySelectorAll(".CxUq-link-item > a");
      return Array.from(hotelNodes).map((el) => ({
        title: el.innerText.trim(),
        link: el.href,
      }));
    });

    await browser.close();

    // Filter hotels where title includes search query (case-insensitive)
    const filtered = items.filter((hotel) =>
      hotel.title.toLowerCase().includes(name.trim().toLowerCase())
    );

    return res.status(200).json(filtered);
  } catch (err) {
    console.error("Puppeteer Error:", err);
    return res.status(500).json({
      status: false,
      message: "Failed to fetch hotel data",
      error: err.message,
    });
  }
});
module.exports = { todorouter: router };
