import express from "express";
import Thread from "../models/Thread.js";
const router = express.Router();
import getOpenAIResponse  from "../utiles/openai.js";


router.post("/test", async (req, res) => {
    try{
        const newThread = new Thread({
            message: req.body.message,
        });
        const savedThread = await newThread.save();
        res.status(201).json(savedThread);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


// get all threads---
router.get("/thread", async (req, res) => {
    try {
        const threads = await Thread.find({}).sort({ updatedAt: -1 });
        // decending order based on updatedAt field...most recent data will be on top of the list
        res.status(200).json(threads);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch threads" });
    }
});


// get a specific thread by ID
router.get("/thread/:threadId", async (req, res) => {
    try {
          const thread = await Thread.findOne({
            threadId: req.params.threadId
        });
        if (!thread) {
            return res.status(404).json({ error: "Thread not found" });
        }
        res.status(200).json(thread);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch thread" });
    }
});


 // Delete a specific thread by threadId
router.delete("/thread/:threadId", async (req, res) => {
    try {
        const deletedThread = await Thread.findOneAndDelete({
            threadId: req.params.threadId
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


//post a new message to a specific thread

router.post("/chat", async (req, res) => {
    const { threadId, message } = req.body;

    // Validate request data
    if (!threadId || !message) {
        return res.status(400).json({
            error: "Thread ID and message are required"
        });
    }

    try {
        // Find the existing thread
        let thread = await Thread.findOne({ threadId });

        // Create a new thread if it doesn't exist
        if (!thread) {
            thread = new Thread({
                threadId,
                title: message,
                messages: []
            });
        }

        // Save the user's message
        thread.messages.push({
            role: "user",
            content: message
        });

        // Get the AI response
        const openAIResponse = await getOpenAIResponse(message);

        // Save the AI response
        thread.messages.push({
            role: "assistant",
            content: openAIResponse
        });

        thread.updatedAt = new Date();

        // Save the thread to MongoDB
        await thread.save();

        return res.status(200).json({
            threadId: thread.threadId,
            reply: openAIResponse
        });

    } catch (error) {
        console.error("Error posting message:", error);

        return res.status(500).json({
            error: "Failed to post message",
            details: error.message
        });
    }
});

export default router;






