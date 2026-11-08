
import express from "express";
import mongoose from "mongoose";
import rateLimit from "express-rate-limit";
import Thread from "../models/Thread.js";
import getOpenAIResponse from "../utiles/openai.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// Rate limiter for chat completions (protects OpenAI API credits & prevents DoS)
const chatLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 20, // 20 messages per minute per IP
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: "Too many messages sent. Please slow down and wait a minute."
  }
});

// Protect all chat routes
router.use(authMiddleware);

// Safe regex for threadId (UUID or Mongo ObjectId format, 8-64 alphanumeric/hyphen/underscore)
const threadIdRegex = /^[a-zA-Z0-9_-]{8,64}$/;

  // Test thread creation (available only in non-production)
  if (process.env.NODE_ENV !== "production") {
    router.post("/test", async (req, res) => {
      try {
        const message = req.body.message;

      if(typeof message !== "string" || !message.trim() || message.length > 2000) {
            return res.status(400).json({
              error: "Message is required (maximum 2000 characters)."
            });
      }

      const newThread = new Thread({
        userId: req.userId,
        threadId: new mongoose.Types.ObjectId().toString(),
        title: message.trim().slice(0, 80),
        messages: [{
          role: "user",
          content: message.trim()
        }]
      });

      const savedThread = await newThread.save();
      res.status(201).json(savedThread);

    } catch (error) {
      console.error("Test thread creation error:", error.message);
      res.status(500).json({ error: "Failed to create test thread." });
    }
  });
}

// Get all threads belonging to the logged-in user
router.get("/thread", async (req, res) => {
    try {
      const threads = await Thread.find({
        userId: req.userId
      }).sort({ updatedAt: -1 });

      res.status(200).json(threads);

  } catch (error) {
    console.error("Fetch threads error:", error.message);
    res.status(500).json({
      error: "Failed to fetch threads."
    });
  }
});

// Get a specific thread belonging to the logged-in user
router.get("/thread/:threadId", async (req, res) => {
    try {
      const { threadId } = req.params;

      if (!threadIdRegex.test(threadId)) {
        return res.status(400).json({ error: "Invalid thread ID format." });
      }

      const thread = await Thread.findOne({
        threadId,
        userId: req.userId
      });

      if (!thread) {
        return res.status(404).json({
          error: "Thread not found."
        });
      }

      res.status(200).json(thread);

    } catch (error) {
      console.error("Fetch thread error:", error.message);
      res.status(500).json({
        error: "Failed to fetch thread."
      });
    }
  });

// Delete only the logged-in user's thread
router.delete("/thread/:threadId", async (req, res) => {
    try {
      const { threadId } = req.params;

      if (!threadIdRegex.test(threadId)) {
        return res.status(400).json({ error: "Invalid thread ID format." });
      }

      const deletedThread = await Thread.findOneAndDelete({
        threadId,
        userId: req.userId
      });

      if (!deletedThread) {
        return res.status(404).json({
          error: "Thread not found."
        });
      }

return res.status(200).json({
  message: "Thread deleted successfully."
});

} catch (error) {
  console.error("Error deleting thread:", error.message);
  return res.status(500).json({
    error: "Failed to delete thread."
  });
}
});

// Send a message and get an AI response (rate-limited, sanitized)
router.post("/chat", chatLimiter, async (req, res) => {
  const { threadId, message } = req.body;

    if (
      typeof threadId !== "string" ||
      !threadIdRegex.test(threadId.trim()) ||
      typeof message !== "string" ||
      !message.trim() ||
      message.trim().length > 2000
    ) {
      return res.status(400).json({
        error: "Valid threadId and message (1-2000 characters) are required."
      });
    }

      const cleanMessage = message.trim();
      const cleanThreadId = threadId.trim();

      try {
        // Find a thread owned by the logged-in user
        let thread = await Thread.findOne({
          threadId: cleanThreadId,
          userId: req.userId
        });

    if (!thread) {
        const existingThread = await Thread.findOne({ threadId: cleanThreadId });

      if(existingThread) {
            return res.status(409).json({
              error: "This thread ID is unavailable. Please start a new chat."
            });
          }

          // Create a new thread for this user
          thread = new Thread({
            userId: req.userId,
            threadId: cleanThreadId,
            title: cleanMessage.slice(0, 80),
            messages: []
          });
        }

        // Append user's message
        thread.messages.push({
          role: "user",
          content: cleanMessage
        });

        // Get AI response with token bounds
        const openAIResponse = await getOpenAIResponse(cleanMessage);

        // Append AI response
        thread.messages.push({
          role: "assistant",
          content: openAIResponse
        });

    thread.updatedAt = new Date();

          try {
            await thread.save();
          } catch(saveError) {
            if (saveError.code === 11000) {
              return res.status(409).json({
                error: "Thread creation conflict. Please start a new chat."
              });
            }
            throw saveError;
          }

          return res.status(200).json({
            threadId: thread.threadId,
            reply: openAIResponse
          });

      } catch (error) {
        console.error("Error posting message:", error.message);

        return res.status(500).json({
          error: "Unable to process chat message. Please try again."
        });
      }
    });

export default router;







