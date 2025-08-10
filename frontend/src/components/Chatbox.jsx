import React, { useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchMessages, sendMessage } from "../redux/slices/messagesSlice.js";

const Chatbox = ({ onBack }) => {
  const dispatch = useDispatch();
  const activeWaId = useSelector((s) => s.conversations.activeWaId);
  const messages = useSelector((s) => (s.messages.byChat[activeWaId] || []));
  const [text, setText] = useState("");
  const boxRef = useRef(null);

  useEffect(() => {
    if (activeWaId) {
      dispatch(fetchMessages(activeWaId));
    }
  }, [activeWaId, dispatch]);

  useEffect(() => {
    setTimeout(() => {
      if (boxRef.current) boxRef.current.scrollTop = boxRef.current.scrollHeight;
    }, 50);
  }, [messages]);

  const handleSend = async (e) => {
    e && e.preventDefault();
    if (!text.trim() || !activeWaId) return;
    try {
      await dispatch(sendMessage({ wa_id: activeWaId, text })).unwrap();
      setText("");
    } catch (err) {
      console.error("Send failed", err);
    }
  };

  if (!activeWaId) {
    return <div className="w-full h-screen p-6">Select a chat</div>;
  }

  return (
    <div className="w-full h-screen relative overflow-hidden">
      <div className=" bg-[#161717] flex gap-4 items-center p-3 border-b border-zinc-700">
        
        <button
          onClick={onBack}
          className="md:hidden text-white text-lg mr-2"
        >
          ←
        </button>

        <div className="h-10 w-10 rounded-full overflow-hidden">
          <div className="h-10 w-10 flex items-center justify-center bg-slate-600 text-white rounded-full">
            {activeWaId?.charAt(0)?.toUpperCase() || "U"}
          </div>
        </div>
        <div className="flex flex-col">
          <h2 className="font-medium">{activeWaId}</h2>
          <h3 className="text-sm font-extralight opacity-70">offline</h3>
        </div>
      </div>

      <div className={`h-full w-full bg-[url('/chat_bg.png')] bg-cover relative`}>
        <div className="overlay h-full w-full bg-black/80 absolute top-0 left-0 z-1"></div>

        <div
          ref={boxRef}
          className="relative z-10 h-[calc(100%-160px)] overflow-auto p-6 flex flex-col gap-4"
        >
          {messages.length === 0 ? (
            <div className="text-center opacity-60">No messages yet</div>
          ) : (
            messages.map((m) => {
              const mine = m.message_id && m.message_id.startsWith("local-");
              return (
                <div
                  key={m._id || m.message_id || Math.random()}
                  className={`max-w-[70%] ${mine ? "ml-auto text-right" : ""}`}
                >
                  <div
                    className={`inline-block p-3 rounded-xl ${
                      mine
                        ? "bg-sky-500 text-white"
                        : "bg-white text-black shadow"
                    }`}
                  >
                    <div className="text-sm">
                      {m.text ||
                        (m.raw && (m.raw.text?.body || JSON.stringify(m.raw))) ||
                        "—"}
                    </div>
                    <div className="text-[10px] text-slate-900 opacity-80 mt-1">
                      {m.timestamp ? new Date(m.timestamp).toLocaleString() : ""}{" "}
                      {m.status ? `• ${m.status}` : ""}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      <div className="message absolute bottom-3 left-0 z-20 w-full px-4">
  <form
    onSubmit={handleSend}
    className="w-full flex gap-x-2 items-end justify-center"
  >
    <textarea
      className="flex-1 min-w-0 px-4 sm:px-6 py-2 sm:py-3 bg-[#454545] rounded-lg outline-none text-sm sm:text-base resize-none overflow-y-auto leading-snug"
      placeholder="Type a message"
      rows={1}
      value={text}
      onChange={(e) => {
        setText(e.target.value);
        e.target.style.height = "auto"; 
        e.target.style.height = e.target.scrollHeight + "px";
      }}
      style={{ maxHeight: "150px" }} 
    />
    <button
      type="submit"
      className="shrink-0 cursor-pointer px-4 sm:px-6 py-2 sm:py-3 bg-green-600 font-semibold text-white rounded-lg text-sm sm:text-base"
    >
      Send
    </button>
  </form>
</div>




    </div>
  );
};

export default Chatbox;
