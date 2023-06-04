import  { ChatModel }  from '../dao/models/chatModel.js'

class MessageService {
  constructor(io) {
    this.io = io;
  }

  async obtenerMensajes() {
    try {
      const mensajes = await ChatModel.find().lean();
      return mensajes;
    } catch (error) {
      throw error;
    }
  }

  async guardarMensaje(user, message) {
    try {
      const nuevoMensaje = new chatModel({ user, message });
      await nuevoMensaje.save();
      this.io.emit('message', { user, message }); // Emitir el nuevo mensaje a todos los clientes conectados
    } catch (error) {
      throw error;
    }
  }
}

const messageService = new MessageService();
export default messageService;


