import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { API_BASE } from "../../config.js";

export const fetchMessages = createAsyncThunk(
  "messages/fetchByWaId",
  async (wa_id) => {
    const res = await axios.get(`${API_BASE}/api/messages/${wa_id}`);
    return { wa_id, messages: res.data || [] };
  }
);

export const sendMessage = createAsyncThunk(
  "messages/send",
  async ({ wa_id, text }) => {
    const res = await axios.post(`${API_BASE}/message`, {
      wa_id,
      from: "me",
      to: wa_id,
      text,
    });
    return res.data;
  }
);

const messagesSlice = createSlice({
  name: "messages",
  initialState: {
    byChat: {},
    status: "idle",
    error: null,
  },
  extraReducers(builder) {
    builder
      .addCase(fetchMessages.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchMessages.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.byChat[action.payload.wa_id] = action.payload.messages;
      })
      .addCase(fetchMessages.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        const m = action.payload;
        const wa_id = m.wa_id || m.to || m.from;
        if (!wa_id) return;
        if (!state.byChat[wa_id]) state.byChat[wa_id] = [];
        state.byChat[wa_id].push(m);
      });
  },
});

export default messagesSlice.reducer;
