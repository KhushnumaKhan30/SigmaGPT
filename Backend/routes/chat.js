
import express from "express";
import mongoose from "mongoose";
import Thread from "../models/Thread.js";
import getOpenAIResponse from "../utiles/openai.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// Protect every route below this line
router.use(authMiddleware);


// Create a test thread
router.post("/test", async (req, res) => {
    try {
        const message = req.body.message;

        if (typeof message !== "string" || !message.trim()) {
            return res.status(400).json({
                error: "Message is required"
            });
        }

        const newThread = new Thread({
            userId: req.userId,
            threadId: new mongoose.Types.ObjectId().toString(),
            title: message,
            messages: [{
                role: "user",
                content: message
            }]
        });

        const savedThread = await newThread.save();

        res.status(201).json(savedThread);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


// Get all threads belonging to the logged-in user
router.get("/thread", async (req, res) => {
    try {
        const threads = await Thread.find({
            userId: req.userId
        }).sort({ updatedAt: -1 });

        res.status(200).json(threads);

    } catch (error) {
        res.status(500).json({
            error: "Failed to fetch threads"
        });
    }
});





// Get a specific thread belonging to the logged-in user
router.get("/thread/:threadId", async (req, res) => {
    try {
        const thread = await Thread.findOne({
            threadId: req.params.threadId,
            userId: req.userId
        });

        if (!thread) {
            return res.status(404).json({
                error: "Thread not found"
            });
        }

        res.status(200).json(thread);

    } catch (error) {
        res.status(500).json({
            error: "Failed to fetch thread"
        });
    }
});


// Delete only the logged-in user's thread
router.delete("/thread/:threadId", async (req, res) => {
    try {
        const deletedThread = await Thread.findOneAndDelete({
            threadId: req.params.threadId,
            userId: req.userId
        });

        if (!deletedThread) {
            return res.status(404).json({
                error: "Thread not found"
            });
        }

        return res.status(200).json({
            message: "Thread deleted successfully"
        });

    } catch (error) {
        console.error("Error deleting thread:", error);

        return res.status(500).json({
            error: "Failed to delete thread"
        });
    }
});


// Send a message and get an AI response
router.post("/chat", async (req, res) => {
    const { threadId, message } = req.body;

    if (
        typeof threadId !== "string" ||
        !threadId.trim() ||
        typeof message !== "string" ||
        !message.trim()
    ) {
        return res.status(400).json({
            error: "Thread ID and message are required"
        });
    }

    try {
        // Find a thread owned by the logged-in user
        let thread = await Thread.findOne({
            threadId,
            userId: req.userId
        });

        // If this ID belongs to another or legacy thread,
        // do not overwrite or access it.
        if (!thread) {
            const existingThread = await Thread.findOne({ threadId });

            if (existingThread) {
                return res.status(409).json({
                    error: "This thread ID is unavailable. Please start a new chat."
                });
            }

            // Create a new thread for this user
            thread = new Thread({
                userId: req.userId,
                threadId,
                title: message.trim(),
                messages: []
            });
        }

        // Save user's message
        thread.messages.push({
            role: "user",
            content: message.trim()
        });

        // Get AI response
        const openAIResponse = await getOpenAIResponse(message);

        // Save AI response
        thread.messages.push({
            role: "assistant",
            content: openAIResponse
        });

        thread.updatedAt = new Date();

        await thread.save();

        return res.status(200).json({
            threadId: thread.threadId,
            reply: openAIResponse
        });

    } catch (error) {
        console.error("Error posting message:", error);

        return res.status(500).json({
            error: "Failed to post message"
        });
    }
});

export default router;







