import { createSlice } from "@reduxjs/toolkit";

const chatSlice = createSlice({
  name: "chat",
  initialState: {
    conversations: [],
    activeConversation: null,
    messages: {},
    onlineUsers: [],
    typingUsers: {},
    unreadMessageCount: 0,
  },
  reducers: {
    setConversations: (state, action) => {
      state.conversations = action.payload;
    },
    setActiveConversation: (state, action) => {
      state.activeConversation = action.payload;
    },
    setMessages: (state, action) => {
      const { conversationId, messages } = action.payload;
      state.messages[conversationId] = messages;
    },
    addMessage: (state, action) => {
      const msg = action.payload;
      const convId = msg.conversationId;
      if (!convId) return;
      if (!state.messages[convId]) state.messages[convId] = [];

      // Duplicate check
      const exists = state.messages[convId].some(m => m._id === msg._id);
      if (!exists) {
        state.messages[convId].push(msg);
      }
    },
    setOnlineUsers: (state, action) => {
      state.onlineUsers = action.payload;
    },
    addOnlineUser: (state, action) => {
      if (!state.onlineUsers.includes(action.payload)) {
        state.onlineUsers.push(action.payload);
      }
    },
    removeOnlineUser: (state, action) => {
      state.onlineUsers = state.onlineUsers.filter(u => u !== action.payload);
    },
    setTyping: (state, action) => {
      const { userId, isTyping } = action.payload;
      if (isTyping) {
        state.typingUsers[userId] = true;
      } else {
        delete state.typingUsers[userId];
      }
    },
    incrementUnreadMessages: (state) => {
      state.unreadMessageCount += 1;
    },
    resetUnreadMessages: (state) => {
      state.unreadMessageCount = 0;
    },
  },
});

export const {
  setConversations, setActiveConversation, setMessages,
  addMessage, setOnlineUsers, addOnlineUser, removeOnlineUser,
  setTyping, incrementUnreadMessages, resetUnreadMessages,
} = chatSlice.actions;

export default chatSlice.reducer;