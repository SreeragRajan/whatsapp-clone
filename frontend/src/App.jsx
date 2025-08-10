import React, { useEffect, useState } from "react";
import Sidebar from "./components/Sidebar";
import Chatbox from "./components/Chatbox";
import { useDispatch } from "react-redux";
import { fetchConversations } from "./redux/slices/conversationsSlice.js";

const App = () => {
  const dispatch = useDispatch();
  const [showChat, setShowChat] = useState(false); 

  useEffect(() => {
    dispatch(fetchConversations());
  }, [dispatch]);

  return (
    <div className="h-screen w-full flex bg-[#161717] text-white">
      {/* Sidebar */}
      <div
        className={`${showChat ? "hidden" : "flex"} md:flex w-full md:w-[30%]`}
      >
        <Sidebar onSelectChat={() => setShowChat(true)} />
      </div>

      {/* Chatbox */}
      <div
        className={`${showChat ? "flex" : "hidden"} md:flex w-full md:w-[70%]`}
      >
        <Chatbox onBack={() => setShowChat(false)} />
      </div>
    </div>
  );
};

export default App;
