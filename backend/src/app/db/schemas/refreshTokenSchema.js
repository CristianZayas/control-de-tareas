const mongoose = require('mongoose');

const refreshTokenSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User' // Referencia a tu modelo de Usuario
    },
    token: { // Podrías guardar el token hasheado aquí por seguridad extra
        type: String,
        required: true,
        unique: true
    },
    expiresAt: {
        type: Date,
        required: true
    },
    isValid: { // Para poder invalidarlo fácilmente (ej. en logout)
        type: Boolean,
        default: true
    }
}, { timestamps: true });

// Índice para búsquedas rápidas y para expiración automática si tu DB lo soporta
refreshTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });


module.exports = mongoose.model('RefreshToken', refreshTokenSchema);