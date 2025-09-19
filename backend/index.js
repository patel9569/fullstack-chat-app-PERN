import express from 'express';
import cookieParser from "cookie-parser";
import authRoutes from './src/routes/authRoutes.js';
import messageRoutes from './src/routes/messageRoutes.js';
import cors from 'cors';
import path from 'path';
import db, { initDB } from './src/lib/db.js';
import { app, server, io } from './src/lib/socket.js';
import { config } from 'dotenv';

config()

app.use(express.json({ limit: '10mb' }));
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
app.use(cookieParser());
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.use('/api/auth', authRoutes);
app.use('/api/message', messageRoutes);

const port = process.env.PORT;
const __dirname = path.resolve()


if(process.env.NODE_ENV==="production"){
  app.use(express.static(path.join(__dirname,"../frontend/dist")))

   app.use((req, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
  });

}

(async () => {
  try {
    
    await initDB();

    server.listen(port,() => {
      console.log("server is running on", port);
    });
  } catch (err) {
    console.error("Error starting server:", err);
  }
})();
