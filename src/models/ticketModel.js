import mongoose from 'mongoose';

const ticketSchema = new mongoose.Schema({
    code: {
        type: String,
        unique: true,
        required: true,
    },
	purchase_datetime: {
        type: Date,
        required: true,
        default: Date.now,
    },
});

ticketSchema.pre('save', async function (next) {
    if (!this.code) {
      // Generar el código de forma única (puedes usar cualquier lógica para generar el código)
      this.code = generateUniqueCode();
    }
    next();
});

export const TicketModel = mongoose.model('messages', ticketSchema);

function generateUniqueCode() {
    const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let code = '';
    for (let i = 0; i < 8; i++) {
      code += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
    }
    return code;
}