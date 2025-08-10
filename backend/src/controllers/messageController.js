import Message from "../models/Message.js";

export async function getConversations(req, res) {
  try {
    const conv = await Message.aggregate([
      { $sort: { timestamp: -1 } },
      {
        $group: {
          _id: "$wa_id",
          lastMessage: { $first: "$$ROOT" },
          count: { $sum: 1 },
        },
      },
      { $project: { wa_id: "$_id", lastMessage: 1, count: 1, _id: 0 } },
      { $sort: { "lastMessage.timestamp": -1 } },
    ]);
    res.json(conv);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
}

export async function getMessagesByWaId(req, res) {
  try {
    const { wa_id } = req.params;
    const msgs = await Message.find({ wa_id }).sort({ timestamp: 1 });
    res.json(msgs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
}

export async function postMessage(req, res) {
  try {
    const { wa_id, from, to, text, type = "text" } = req.body;
    const message = new Message({
      message_id: `local-${Date.now()}`,
      meta_msg_id: null,
      wa_id,
      from,
      to,
      text,
      type,
      timestamp: new Date(),
      status: "sent",
      raw: null,
    });
    await message.save();

    res.status(201).json(message);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
}
