require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const fileUpload = require('express-fileupload')
const cookieParser = require('cookie-parser')



const app = express()
app.use(cors())
const server = require('http').createServer(app)
const io = require("socket.io")(server, {
    cors: {
      origin: "http://localhost:3000",
      methods: ["GET", "POST"]
    }
  })
app.use(express.json())
app.use(cookieParser())

app.use(fileUpload({
    useTempFiles: true
}))

// Routes
app.use('/' , require('./routes/index'))


// Connect to mongodb
mongoose.connect(process.env.MONGODB_URL, {
    useCreateIndex: true,
    useFindAndModify: false,
    useNewUrlParser: true,
    useUnifiedTopology: true
}, err =>{
    if(err) throw err;
    console.log('Connected to MongoDB')
})




const PORT = process.env.PORT || 5000
server.listen(PORT, () =>{
    console.log('Server is running on port', PORT)
})


//socket io chat
io.on('connection', (socket) => { 
    console.log("A new client ")
    socket.emit('getId', socket.id)

    socket.on("sendDataClient", data =>{
       
        socket.local.emit('sendDataServer', data)
    })

    socket.on("disconnect", () => {
        console.log("Client disconnected"); // Khi client disconnect thì log ra terminal.
      });

    
});