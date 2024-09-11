const socket = io.connect();

socket.on("nuevo_usuario", (data) => {
  alert(`Nuevo usuario conectado: ${data?.user}`)
});
socket.on("nuevo_mensaje", (data) => {
  const {usuario,mensaje}=data;
  $('#cont_mensajes').append(`<p><strong>${usuario}:</strong> ${mensaje}</p>`)
});

const login=(correo,usuario)=>{
  socket.emit("datos_usuario", {correo,usuario});
}

const enviar_msj=(mensaje,usuario)=>{
  socket.emit("enviar_mensaje", {mensaje, usuario});
}