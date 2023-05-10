

const { Socket } = require("socket.io");
const { comprobarJWT } = require("../helpers/generar-jwt");
const { ChatMensajes } = require("../models");

const chatMensajes = new ChatMensajes();

const socketController = async ( socket = new Socket(), io) => {
    console.log(socket.handshake.headers['x-token']);    
    const usuario = await comprobarJWT( socket.handshake.headers['x-token'] );
    
    if ( !usuario ) {
        return socket.disconnect();
    }

    chatMensajes.conectarUsuario( usuario );
    io.emit('usuarios-activos',  chatMensajes.usuariosArr);
    socket.emit('recibir-mensajes', chatMensajes.ultimos10);


    //Conectarlo a una sala especial
    socket.join( usuario.id ); 



    //Limpiar desconexion
    socket.on('disconnect', () => {
        chatMensajes.desconectarUsuario( usuario.id );
        io.emit('usuarios-activos',  chatMensajes.usuariosArr);
    });

    //Escuchar mensaje
    socket.on('enviar-mensaje', ({mensaje , uid}) => {
        if ( uid ) {
            //Mensaje privado
            socket.to( uid ).emit('mensaje-privado', { de: usuario.nombre, mensaje });
        } else {

        chatMensajes.enviarMensaje( usuario.id, usuario.nombre, mensaje );
        io.emit('recibir-mensajes', chatMensajes.ultimos10);
        }
    });
}

module.exports = {
    socketController
}
