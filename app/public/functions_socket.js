const socket = io.connect();
let currentUser;

socket.on("nuevo_usuario", (data) => {
    addSystemMessage(`Nuevo usuario conectado: ${data?.user}`);
});

socket.on("nuevo_mensaje", (data) => {
    const {usuario, mensaje} = data;
    addMessage(usuario, mensaje);
});

const login = (correo, usuario) => {
    socket.emit("datos_usuario", {correo, usuario});
};

const enviar_msj = (mensaje, usuario, receptor = null) => {
    socket.emit("enviar_mensaje", {mensaje, usuario, receptor});
};

const getInto = () => {
    const correo = $("#correo").val();
    currentUser = $("#usuario").val();
    if (correo && currentUser) {
        login(correo, currentUser);
        $("#login_form").hide();
        $("#chat_area").removeClass('hidden');
    } else {
        alert("Por favor, completa todos los campos.");
    }
};

const sendMessage = () => {
    const mensaje = $("#mensaje").val();
    const receptor = $('#receptor').val();
    if (mensaje) {
        enviar_msj(mensaje, currentUser, receptor);
        $("#mensaje").val('');
    } else {
        alert("Por favor, escribe un mensaje.");
    }
};

function addMessage(sender, message) {
    const isCurrentUser = sender === currentUser;
    const messageElement = `
        <div class="message ${isCurrentUser ? 'message-self' : 'message-other'}">
            <div class="font-bold">${sender}</div>
            <div>${message}</div>
        </div>
    `;
    $("#cont_mensajes").append(messageElement);
    $("#cont_mensajes").scrollTop($("#cont_mensajes")[0].scrollHeight);
}

function addSystemMessage(message) {
    const messageElement = `
        <div class="message system-message">
            <div class="text-yellow-700">${message}</div>
        </div>
    `;
    $("#cont_mensajes").append(messageElement);
    $("#cont_mensajes").scrollTop($("#cont_mensajes")[0].scrollHeight);
}

$("#mensaje").keypress(function (e) {
    if(e.which == 13 && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
    }
});