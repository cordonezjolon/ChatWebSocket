const url = (window.location.hostname.includes('localhost'))
    ? 'http://localhost:8080/api/auth/'
    : 'https://restserver-curso-fher.herokuapp.com/api/auth/';


let usuario = null;
let socket = null;


const txtUid = document.querySelector('#txtUid');
const txtMensaje = document.querySelector('#txtMensaje');
const ulUsuarios = document.querySelector('#ulUsuarios');
const ulMensajes = document.querySelector('#ulMensajes');
const btnSalir = document.querySelector('#btnSalir');



const validarJWT = async () => {
    const token = localStorage.getItem('token') || '';

    if (token.length <= 10) {
        window.location = 'index.html';
        throw new Error('No hay token en el servidor');
    }

    const resp = await fetch(url , {
        headers: { 'x-token': token }
    });

    const { usuario: userDB, token: tokenDB } = await resp.json();
    localStorage.setItem('token', tokenDB);
    document.title = userDB.nombre;
    conectarSocket();

}

const conectarSocket = () => {
     socket = io({
        'extraHeaders': {
            'x-token': localStorage.getItem('token')
        }
    });

    socket.on('connect', () => {
        console.log('Sockets online');
    });

    socket.on('disconnect', () => {
        console.log('Sockets offline');
    });

    socket.on('recibir-mensajes', (payload) => {
       dibujarMensajes(payload);
    });

    socket.on('usuarios-activos', (payload) => {
        dibujarUsuarios(payload);
    });

    socket.on('mensaje-privado', (payload) => {
        console.log('Privado: ', payload);
    });

}

txtMensaje.addEventListener('keyup', ({ keyCode }) => {
    console.log(txtMensaje.value);
    
    const mensaje = txtMensaje.value;
    const uid = txtUid.value;

    if (keyCode !== 13) { return; }
    if (mensaje.length === 0) { return; }

    socket.emit('enviar-mensaje', { mensaje , uid });
});


const main = async () => {

    await validarJWT();


}

const dibujarUsuarios = (usuarios = []) => {
    
        let usersHtml = '';
        usuarios.forEach(({ nombre, uid }) => {
    
            usersHtml += `
                <li>
                    <p>
                        <h5 class="text-success">${nombre}</h5>
                        <span class="fs-6 text-muted">${uid}</span>
                    </p>
                </li>
            `;
    
        });
    
        ulUsuarios.innerHTML = usersHtml;
    
}
const dibujarMensajes = (mensajes = []) => {
    
    let mensajesHtml = '';
    mensajes.forEach(({ nombre, mensaje }) => {

        mensajesHtml += `
            <li>
                <p>
                    <span class="text-primary">Nombre: ${nombre}</span>
                    <span>${mensaje}</span>
                </p>
            </li>
        `;

    });

    ulMensajes.innerHTML = mensajesHtml;

}

main();


//const socket = io();

