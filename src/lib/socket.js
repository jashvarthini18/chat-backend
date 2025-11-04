// import { Server } from "socket.io";
// import http from "http";
// import express from "express";

// const app = express();
// const server = http.createServer(app);

// const io = new Server(server, {
//   cors: {
//     origin: ["http://localhost:5173",
//       "https://chat-frontend-psi-eight.vercel.app"
//     ],
//   },
// });

// export function getReceiverSocketId(userId) {
//   return userSocketMap[userId];
// }

// // used to store online users
// const userSocketMap = {}; // {userId: socketId}

// io.on("connection", (socket) => {
//   console.log("A user connected", socket.id);

//   const userId = socket.handshake.query.userId;
//   if (userId) userSocketMap[userId] = socket.id;

//   // io.emit() is used to send events to all the connected clients
//   io.emit("getOnlineUsers", Object.keys(userSocketMap));

//   socket.on("disconnect", () => {
//     console.log("A user disconnected", socket.id);
//     delete userSocketMap[userId];
//     io.emit("getOnlineUsers", Object.keys(userSocketMap));
//   });
// });

// export { io, app, server };

// import { Server } from "socket.io";
// import http from "http";
// import express from "express";

// const app = express();
// const server = http.createServer(app);

// const io = new Server(server, {
//   cors: {
//     origin: [
//       "http://localhost:5173",
//       "https://chat-frontend-psi-eight.vercel.app",
//       "https://chat-frontend-omega-navy.vercel.app"
//     ],
//     methods: ["GET", "POST"],
//     credentials: true,
//   },
// });

// // store online users
// const userSocketMap = {}; // {userId: socketId}

// // helper
// export function getReceiverSocketId(userId) {
//   return userSocketMap[userId];
// }

// io.on("connection", (socket) => {
//   console.log("A user connected", socket.id);

//   const userId = socket.handshake.query.userId;
//   if (userId) userSocketMap[userId] = socket.id;

//   io.emit("getOnlineUsers", Object.keys(userSocketMap));

//   socket.on("disconnect", () => {
//     console.log("A user disconnected", socket.id);
//     delete userSocketMap[userId];
//     io.emit("getOnlineUsers", Object.keys(userSocketMap));
//   });
// });

// export { io, app, server };

// import { Server } from "socket.io";
// import http from "http";
// import express from "express";

// const app = express();
// const server = http.createServer(app);

// const io = new Server(server, {
//   cors: {
//     origin: [
//       "http://localhost:5173",
//       "https://chat-frontend-psi-eight.vercel.app",
//       "https://chat-frontend-omega-navy.vercel.app"
//     ],
//     methods: ["GET", "POST"],
//     credentials: true
//   },
//   allowEIO3: true,
//   pingTimeout: 10000,
//   pingInterval: 5000,
//   cookie: false
// });

// // Debug connection events
// io.on('connection', (socket) => {
//   console.log(`New connection: ${socket.id}`);
  
//   socket.on('disconnect', (reason) => {
//     console.log(`Client disconnected: ${socket.id} - ${reason}`);
//   });
  
//   socket.on('error', (error) => {
//     console.error(`Socket error (${socket.id}):`, error);
//   });
// });

// // store online users
// const userSocketMap = {}; // {userId: socketId}

// // helper
// function getReceiverSocketId(userId) {
//   return userSocketMap[userId];
// }

// io.on("connection", (socket) => {
//   console.log("A user connected", socket.id);
//   console.log("Handshake query:", socket.handshake.query);

//   const userId = socket.handshake.query.userId;
//   if (userId) {
//     userSocketMap[userId] = socket.id;
//     console.log(`User ${userId} connected with socket ${socket.id}`);
//   }

//   // Send online users to all connected clients
//   io.emit("getOnlineUsers", Object.keys(userSocketMap));

//   // Handle new message with acknowledgement
//   socket.on("sendMessage", (message, ack) => {
//     console.log("Received message:", message);
//     const { chatId, sender, text, image } = message;
    
//     if (!chatId) {
//       console.error("No chatId in message:", message);
//       if (typeof ack === 'function') ack({ success: false, error: 'Missing chatId' });
//       return;
//     }
    
//     console.log(`Broadcasting message to chat ${chatId}`);
    
//     // Broadcast the message to all users in the chat
//     const messageToSend = {
//       ...message,
//       createdAt: new Date().toISOString(),
//     };
    
//     io.to(chatId).emit("newMessage", messageToSend);
//     console.log("Message broadcasted:", messageToSend);

//     // Acknowledge back to sender
//     if (typeof ack === 'function') {
//       ack({ success: true, message: messageToSend });
//     }
//   });

//   // Join a chat room
//   socket.on("joinChat", (chatId) => {
//     socket.join(chatId);
//     console.log(`User ${socket.id} joined chat ${chatId}`);
//   });

//   // Leave a chat room
//   socket.on("leaveChat", (chatId) => {
//     socket.leave(chatId);
//     console.log(`User ${socket.id} left chat ${chatId}`);
//   });

//   socket.on("disconnect", () => {
//     console.log("A user disconnected", socket.id);
    
//     // Remove user from active users
//     const userId = Object.keys(userSocketMap).find(
//       (key) => userSocketMap[key] === socket.id
//     );
    
//     if (userId) {
//       delete userSocketMap[userId];
//       io.emit("getOnlineUsers", Object.keys(userSocketMap));
//     }
//   });
// });

// export { io, app, server, getReceiverSocketId };
import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:5173",
      "https://chat-frontend-omega-navy.vercel.app",
    ],
    methods: ["GET", "POST"],
    credentials: true,
  },
  pingTimeout: 20000,
  pingInterval: 25000,
});

const userSocketMap = {}; // { userId: socketId }

export function getReceiverSocketId(userId) {
  return userSocketMap[userId];
}

io.on("connection", (socket) => {
  console.log(`✅ Socket Connected: ${socket.id}`);

  const userId = socket.handshake.query.userId;

  if (userId) {
    userSocketMap[userId] = socket.id;
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  }

  socket.on("joinChat", (chatId) => {
    socket.join(chatId);
  });

  socket.on("leaveChat", (chatId) => {
    socket.leave(chatId);
  });

  socket.on("sendMessage", (message, ack) => {
    const { chatId } = message;
    if (!chatId) return ack?.({ success: false });

    const msg = { ...message, createdAt: new Date().toISOString() };
    io.to(chatId).emit("newMessage", msg);
    ack?.({ success: true, message: msg });
  });

  socket.on("disconnect", () => {
    const userId = Object.keys(userSocketMap).find(
      (key) => userSocketMap[key] === socket.id
    );

    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

export { io, app, server };
