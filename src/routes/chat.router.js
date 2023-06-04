import { Router } from 'express';
import { Server } from "socket.io";
import messageService from '../dao/message.service.js';

const messageRouter = Router();

// Configuración de Socket.IO
const server = new Server();
const io = server.io;

messageRouter.get('/', async (req, res) => {
	try {
		const messages = await messageService.obtenerMensajes()
		res.send(messages);
	} catch (err) {
		res.status(500).send({ err });
	}
});

export { messageRouter };