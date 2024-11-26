// Requerimos las dependencias necesarias
const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

app.use(cors());
app.use(bodyParser.json());

// Definir las salas y reservas en memoria
let salas = [];
let reservas = [];

// Ruta para obtener todas las salas
app.get("/salas", (req, res) => {
    res.json(salas);
});

// Ruta para agregar una nueva sala
app.post("/salas", (req, res) => {
    const sala = req.body;
    salas.push(sala);
    broadcast({ action: "add", sala });
    res.status(201).json(sala);
});

// Ruta para actualizar una sala
app.put('/salas/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = salas.findIndex(s => s.id === id);

    if (index === -1) {
        return res.status(404).json({ mensaje: "La sala no existe" });
    }

    salas[index] = req.body;
    broadcast({ action: 'update', sala: salas[index] });
    res.json(salas[index]);
});

// Ruta para eliminar una sala
app.delete('/salas/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = salas.findIndex(s => s.id === id);

    if (index === -1) {
        return res.status(404).json({ mensaje: 'Sala no encontrada' });
    }

    const salaEliminada = salas.splice(index, 1)[0];
    broadcast({ action: 'delete', sala: salaEliminada });
    res.json(salaEliminada);
});

// Rutas para manejar reservas
app.get("/reservas", (req, res) => {
    res.json(reservas);
});

app.post("/reservas", (req, res) => {
    const reserva = req.body;
    reservas.push(reserva);
    broadcast({ action: "add", reserva });
    res.status(201).json(reserva);
});

app.put('/reservas/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = reservas.findIndex(r => r.id === id);

    if (index === -1) {
        return res.status(404).json({ mensaje: "La reserva no existe" });
    }

    reservas[index] = req.body;
    broadcast({ action: 'update', reserva: reservas[index] });
    res.json(reservas[index]);
});

app.delete('/reservas/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = reservas.findIndex(r => r.id === id);

    if (index === -1) {
        return res.status(404).json({ mensaje: 'Reserva no encontrada' });
    }

    const reservaEliminada = reservas.splice(index, 1)[0];
    broadcast({ action: 'delete', reserva: reservaEliminada });
    res.json(reservaEliminada);
});

// Configurar el WebSocket para transmisión en tiempo real
wss.on('connection', (ws) => {
    console.log('Cliente conectado');

    ws.on('close', () => {
        console.log('Cliente desconectado');
    });
});

// Función para enviar datos a todos los clientes conectados
function broadcast(data) {
    wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(data));
        }
    });
}

// Iniciar el servidor en el puerto 3500
const PORT = 3500;
server.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
