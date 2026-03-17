import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      maxlength: 60
    },
    relationship: {
      type: String,
      required: true,
      trim: true
    },
    relationshipOther: {
      type: String,
      trim: true,
      maxlength: 120
    },
    message: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1200
    }
  },
  {
    timestamps: {
      createdAt: true,
      updatedAt: false
    }
  }
);

const Message = mongoose.model("Message", messageSchema);

export default Message;
