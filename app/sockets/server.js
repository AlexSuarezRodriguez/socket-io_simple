const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const socketIO = require("socket.io");
const io = socketIO(server);

server.listen(3000);

app.use(express.static('public'))

// Creando arrays dinámicos de personas conectadas
let UserOnId = {};
let IdsOnUser = {};

// Evento cuando un nuevo cliente se conecta
io.on('connection', (socket) => {
  console.log(`Nueva conexión id: ${socket?.id}`);

  socket.on('datos_usuario', (data) => {
    const id_socket = socket?.id;
    const { usuario } = data;

    // Guardando user por Id
    UserOnId[id_socket] = usuario;

    // Guardando Id por user
    if (!IdsOnUser[usuario]) {
      IdsOnUser[usuario] = [];
    }

    IdsOnUser[usuario].push(id_socket);

    console.log('--------Usuarios conectados------------');
    console.log({ UserOnId });
    console.log({ IdsOnUser });
    console.log({ countUser: Object.keys(IdsOnUser).length });
    console.log('***************************************');

    // Notificar a todos sobre el nuevo usuario
    io.emit('nuevo_usuario', { user: usuario });
  });

  // Evento para enviar un mensaje
  socket.on('enviar_mensaje', (data) => {
    console.log(`${data?.usuario} está enviando un mensaje`);
    const { usuario, mensaje, receptor } = data;

    if (receptor) {
      const id_onlines = IdsOnUser[receptor];

      if (id_onlines) {
        for (const idConnect of id_onlines) {
          io.to(idConnect).emit('nuevo_mensaje', { usuario, mensaje });
        }
        // Enviar el mensaje también al emisor
        io.to(socket.id).emit('nuevo_mensaje', { usuario, mensaje });
      } else {
        console.log(`Receptor ${receptor} no está conectado.`);
      }
    } else {
      io.emit('nuevo_mensaje', { usuario, mensaje });
    }
  });

  // Evento cuando un usuario se desconecta
  socket.on('disconnect', () => {
    const id_socket = socket?.id;
    const usuario = UserOnId[id_socket];

    if (usuario) {
      // Eliminar el ID del usuario desconectado
      delete UserOnId[id_socket];
      const array_ids = IdsOnUser[usuario];

      if (array_ids) {
        const indexDelete = array_ids.indexOf(id_socket);

        if (indexDelete !== -1) {
          array_ids.splice(indexDelete, 1);
        }

        // Si no hay más conexiones, eliminar al usuario
        if (array_ids.length < 1) {
          delete IdsOnUser[usuario];
        }

        console.log(`Usuario: ${usuario} desconectado`);
        console.log('--------Usuarios conectados------------');
        console.log({ UserOnId });
        console.log({ IdsOnUser });
        console.log({ countUser: Object.keys(IdsOnUser).length });
        console.log('***************************************');
      }
    }
  });
});
