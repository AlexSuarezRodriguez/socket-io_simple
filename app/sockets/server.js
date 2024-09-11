const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const socketIO = require("socket.io");
const io = socketIO(server);

server.listen(3000);

app.use(express.static('public'))

io.on('connection', (socket) => {
  console.log(`Nueva conexion id: ${socket?.id}`);

  socket.on('datos_usuario',(data)=>{
    console.log(data);

    io.emit('nuevo_usuario',{user: data?.usuario});
  });

  socket.on('enviar_mensaje',(data)=>{
    console.log(`${data?.usuario} esta enviando un mensaje`);
    const {usuario,mensaje}=data
    io.emit('nuevo_mensaje',{usuario, mensaje});
  });

});
