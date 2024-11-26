const API_URL_SALAS = 'http://localhost:3500/salas';
const API_URL_RESERVAS = 'http://localhost:3500/reservas';
const WS_URL = 'ws://localhost:3500';

let socket;

function initWebSocket() {
    socket = new WebSocket(WS_URL);

    socket.addEventListener('open', () => {
        console.log('Conectado al servidor WebSocket');
    });

    socket.addEventListener('message', (event) => {
        const message = JSON.parse(event.data);
        switch (message.action) {
            case 'add':
                // Acción cuando se añade algo
                break;
            case 'update':
                // Acción cuando se actualiza algo
                break;
            case 'delete':
                // Acción cuando se elimina algo
                break;
        }
    });

    socket.addEventListener('close', () => {
        console.log('Desconectado del servidor WebSocket');
        setTimeout(initWebSocket, 5000);
    });
}

async function loadSalas() {
    try {
        const response = await fetch(API_URL_SALAS);
        const salas = await response.json();
        // Manipula la interfaz con las salas cargadas
    } catch (error) {
        alert('Error al cargar salas: ' + error.message);
    }
}

async function loadReservations() {
    try {
        const response = await fetch(API_URL_RESERVAS);
        const reservas = await response.json();
        // Manipula la interfaz con las reservas cargadas
    } catch (error) {
        alert('Error al cargar reservas: ' + error.message);
    }
}

initWebSocket();
loadSalas();
loadReservations();
