const express = require("express");
const app = express();
const http = require("http");
const socketIo = require("socket.io");

const server = http.createServer(app);

const io = socketIo(server);
const users = {};

app.set("view engine","ejs");

io.on("connection",(socket)=>{
    
    socket.on("new-user",(name)=>{
        users[socket.id] = name;
        socket.broadcast.emit("user-connected",name)
    })
    socket.on("message",function(data){
        console.log(data);
        socket.broadcast.emit("messagee",{data:data , name:users[socket.id]});
    })
    socket.on("disconnect",()=>{
        socket.broadcast.emit("user-disconnected",users[socket.id])
       delete users[socket.id]
   })
})
app.get("/",(req,res)=>{
    res.render("index");
})


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});