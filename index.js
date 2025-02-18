const express = require("express")
const http = require("http")
const path = require("path")
const {Server} = require("socket.io")





const PORT = 8000

const app = express()
const server = http.createServer(app)

const io = new Server(server)

// For connection with socket.io

io.on("connection", (socket)=>{
    socket.on("UserMessage", message =>{
        io.emit("UserMessage", message)
    })
})

app.use(express.static(path.resolve("./public")))


app.get("/", (req, res)=>{
    return res.sendFile("/public/index.html")
})


server.listen(PORT, ()=>{
    console.log("Server listening on:", PORT)
})