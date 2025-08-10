import { configureStore } from "@reduxjs/toolkit";
import conversationsReducer from "./slices/conversationsSlice.js"
import messagesReducer from "./slices/messagesSlice.js";

export const store = configureStore({
  reducer: {
    conversations: conversationsReducer,
    messages: messagesReducer,
  },
});
