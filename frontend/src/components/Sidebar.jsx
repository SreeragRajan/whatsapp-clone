import React, { useState, useMemo, useEffect } from "react";
import { EllipsisVerticalIcon, Search } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import {
  setActiveWaId,
  fetchConversations,
} from "../redux/slices/conversationsSlice.js";

const Sidebar = ({ onSelectChat }) => {
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState("");
  const conversations = useSelector((s) => s.conversations.list || []);
  const activeWaId = useSelector((s) => s.conversations.activeWaId);

  useEffect(() => {
    dispatch(fetchConversations()); // fixed: call the function
  }, [dispatch]);

  // map conversations to a display-friendly array
  const chats = useMemo(() => {
    return conversations.map((c) => ({
      wa_id: c.wa_id,
      name: c.lastMessage?.from || c.wa_id,
      text: c.lastMessage?.text || "",
      timestamp: c.lastMessage?.timestamp,
    }));
  }, [conversations]);

  // filtered results
  const filteredChats = chats.filter((chat) =>
    chat.name.toLowerCase().startsWith(searchTerm.toLowerCase().trim())
  );

  return (
    <div className="w-full min-h-screen border-r border-zinc-700">
      {/* Header */}
      <div className="py-4 px-4 sm:px-6">
        <h1 className="text-lg sm:text-[22px] font-semibold">WhatsApp</h1>

        {/* Search bar */}
        <div className="mt-4 h-10 flex gap-x-4 items-center bg-[#2E2F2F] px-4 py-2 rounded-full focus-within:border focus-within:border-green-400">
          <Search size={18} />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full outline-none bg-transparent text-white placeholder:text-xs sm:placeholder:text-sm"
            placeholder="Search or start a new chat"
          />
        </div>
      </div>

      {/* Chats list */}
      <div className="custom-scroll chats flex flex-col gap-1 p-3 sm:p-4 h-[80%] overflow-y-scroll wrap-anywhere">
        <h1 className="text-base sm:text-xl pl-2 font-base opacity-80 mb-2">
          Chats
        </h1>

        {filteredChats.length > 0 ? (
          filteredChats.map((chat, index) => (
            <div
              key={chat.wa_id + index}
              onClick={() => {
                dispatch(setActiveWaId(chat.wa_id));
                if (onSelectChat) onSelectChat();
              }}
              className={`flex items-center gap-3 sm:gap-4 ${
                activeWaId === chat.wa_id ? "bg-[#2E2F2F]" : ""
              } hover:bg-[#2E2F2F] rounded-xl px-2 py-3 sm:py-4 cursor-pointer`}
            >
              {/* Avatar */}
              <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full overflow-hidden">
                <div className="h-full w-full flex items-center justify-center bg-slate-600 text-white rounded-full text-sm sm:text-base">
                  {chat.name?.charAt(0)?.toUpperCase() || "U"}
                </div>
              </div>

              {/* Name & message */}
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center">
                  <h2 className="font-light text-sm sm:text-base truncate">
                    {chat.name}
                  </h2>
                  <div className="text-[10px] sm:text-xs opacity-60 whitespace-nowrap ml-2">
                    {chat.timestamp
                      ? new Date(chat.timestamp).toLocaleString()
                      : ""}
                  </div>
                </div>
                <div className="text-xs sm:text-sm opacity-70 truncate max-w-full">
                  {chat.text}
                </div>
              </div>
            </div>
          ))
        ) : (
          <h1 className="h-full text-center font-light w-full flex items-center justify-center opacity-80 text-sm sm:text-base">
            No Contact Found
          </h1>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
