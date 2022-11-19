const Database = require("./database");
const fs=require('fs');
const express = require('express')
const { Server: SocketServer} = require('socket.io')
const { Server: HttpServer} = require('http')
const messages = require("./messages.json")
const db = new Database;


const app = express();

const httpServer = new HttpServer(app);

const io = new SocketServer(httpServer);

app.use(express.static('public'))

io.on('connection', (socket) => {
    console.log("socket id: ", socket.id);

    socket.emit('products', db.getAll());

    socket.emit('conversation', messages);

    socket.on('new-message', (newMessage)=> {
        console.log({newMessage});
        messages.push(newMessage);
        io.sockets.emit('conversation', messages);
        console.log(messages);
        const newData = messages
        fs.writeFile('messages.json', JSON.stringify(newData), 'utf-8', function(err){
            if (err) throw err;
        })

    });

  

    
});



app.use(express.urlencoded({ extended: true }));
app.use(express.json());


app.get('/', (req, res) => {
    
    
});

app.post('/', (req, res) => {
  console.log(req.body);
  db.save(req.body);
  
  io.sockets.emit('products', db.getAll())

  res.redirect('/');
});


app.get('/productos', (req, res) => {
    res.json(db.getAll());
});


const connectedServer = httpServer.listen(8080, () => {
    console.log(`Servidor Http con Websockets escuchando en el puerto ${connectedServer.address().port}`)
  })
  connectedServer.on('error', error => console.log(`Error en servidor ${error}`))
  
