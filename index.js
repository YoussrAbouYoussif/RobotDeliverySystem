const express = require('express')
const mongoose = require('mongoose')
const parser = require('body-parser')
const users = require('./routes/api/users')
const robots = require('./routes/api/robots')
const routes = require('./routes/api/routes')
const requests = require('./routes/api/requests')
const offices = require('./routes/api/offices')
const http = require('http'),
app = express(),
server = http.createServer(app),

io = require('socket.io').listen(server);


const db = require('./config/keys').mongoURI

mongoose
    .connect(db)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.log(err))

// Init middleware
app.use(parser.urlencoded({
  extended: false
}));
app.use(express.json())
app.use(express.urlencoded({extended: false}))

app.get('/', (req,res) => {
   console.log("nadine here")
   io.emit('message', "hi" )

       console.log("nada here") 
        res.send(`<h1>Robots</h1>`)

})


app.use('/api/users', users)
app.use('/api/robots', robots)
app.use('/api/routes', routes)
app.use('/api/requests', requests)
app.use('/api/offices', offices)



app.use((req,res) =>

res.status(404).send(`<h1>Can not find what you're looking for</h1>`))



io.on('connection', (socket) => {

  // console.log('user connected')
  
  socket.on('join', function(userNickname) {
  
          console.log(userNickname +" : has joined the chat "  )
  
          socket.emit('join',{msg:"hihihi"})
          console.log(userNickname+"haaayyyy")
      });

      socket.on('login', function(userNickname) {
  
        console.log(userNickname +" : has loged in"  )

        socket.emit('login',{msg:"you are logged in"})
        console.log(userNickname+"haaayyyy login")
    });    

    
  
  });


const port = process.env.PORT || 3000
server.listen(port, () => console.log(`Server on ${port}`))
