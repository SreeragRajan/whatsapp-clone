import { Schema, model } from "mongoose";

const MessageSchema = new Schema(
  {
    message_id: { type: String, index: true },
    meta_msg_id: { type: String, index: true, sparse: true },
    wa_id: { type: String, index: true },
    from: String,
    to: String,
    text: String,
    type: String,
    timestamp: { type: Date },
    status: {
      type: String,
      enum: ["created", "sent", "delivered", "read"],
      default: "created",
    },
    raw: { type: Object },
  },
  { timestamps: true }
);

export default model("Message", MessageSchema);
