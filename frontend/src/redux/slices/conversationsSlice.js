import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { API_BASE } from "../../config.js";


export const fetchConversations = createAsyncThunk(
  "conversations/fetchAll",
  async () => {
    const res = await axios.get(`${API_BASE}/api/conversations`);
   
    return res.data || [];
  }
);

const conversationsSlice = createSlice({
  name: "conversations",
  initialState: {
    list: [],           
    activeWaId: null,   
    status: "idle",
    error: null,
  },
  reducers: {
    setActiveWaId(state, action) {
      state.activeWaId = action.payload;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchConversations.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchConversations.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.list = action.payload;
        if (!state.activeWaId && action.payload.length) {
          state.activeWaId = action.payload[0].wa_id;
        }
      })
      .addCase(fetchConversations.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export const { setActiveWaId } = conversationsSlice.actions;
export default conversationsSlice.reducer;
