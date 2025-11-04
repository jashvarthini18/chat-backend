import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { getMessages, getUsersForSidebar, sendMessage, getReplySuggestionsController } from "../controllers/message.controller.js";

const router = express.Router();

router.get("/", (req, res) => {
  res.json({ msg: "Messages route working 🚀" });
});

router.get("/users", protectRoute, getUsersForSidebar);
router.get("/:id", protectRoute, getMessages);
router.get("/:id/suggestions", protectRoute, getReplySuggestionsController);

router.post("/send/:id", protectRoute, sendMessage);

export default router;
