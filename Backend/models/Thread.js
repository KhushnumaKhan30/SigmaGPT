
import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  role: {
    type: String,
    enum: ["user", "assistant"],
    required: true
  },
  content: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

const threadSchema = new mongoose.Schema({

  // Identify the owner of this conversation
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  threadId: {
    type: String,
    required: true,
    unique: true
  },

  title: {
    type: String,
    required: true,
    default: "New Chat"
  },

  messages: [messageSchema],

  createdAt: {
    type: Date,
    default: Date.now
  },

  updatedAt: {
    type: Date,
    default: Date.now
  }

});

export default mongoose.model('Thread', threadSchema);
