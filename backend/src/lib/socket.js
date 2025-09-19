import {Server} from 'socket.io'
import express from 'express'
import http from 'http'



const app = express()

const server = http.createServer(app)

const io = new Server(server,{
    cors:{
        origin:"http://localhost:5173",
    }
})


export function getReciverSocketId(user_id){
     return userSocketMap[user_id]
}


const userSocketMap ={}

io.on("connection",(socket)=>{
    console.log("A user is connected ",socket.id)
    const user_id= socket.handshake.query.user_id
    if(user_id) userSocketMap[user_id]=socket.id

    io.emit("getOnlineUsers",Object.keys(userSocketMap))

    socket.on("disconnect",()=>{
        console.log("A user is disconnected ", socket.id)
        delete userSocketMap[user_id]
        io.emit("getOnlineUsers",Object.keys(userSocketMap))
    })
})

export {io, server,app}