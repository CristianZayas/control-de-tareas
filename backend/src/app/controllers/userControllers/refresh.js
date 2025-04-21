const jwt = require('jsonwebtoken');
const RefreshToken = require('../../db/schemas/refreshTokenSchema');
const User = require('../../db/schemas/userSchema');
const ms = require('ms');
const cookieParser = require('cookie-parser'); // Necesitarás este middleware en tu app Express

// Asegúrate de usar cookieParser en tu app principal: app.use(cookieParser());

const refreshTokenHandler = async (request, response) => {
    const incomingRefreshToken = request.cookies.refreshToken; // Obtener de la cookie
    console.log({cookies: incomingRefreshToken})
    if (!incomingRefreshToken) {
        return response.status(401).json({ message: 'Refresh token not found' });
    }

    try {
        // 1. Busca el token en la BD (si lo guardaste tal cual o busca por hash si lo hasheaste)
        const storedToken = await RefreshToken.findOne({ token: incomingRefreshToken });

        if (!storedToken || !storedToken.isValid || storedToken.expiresAt < new Date()) {
             // Si no existe, no es válido, o expiró en la BD -> No autorizado
             // Opcional: Limpia la cookie inválida si existe
             if (storedToken) {
                 storedToken.isValid = false;
                 await storedToken.save(); // O eliminarlo: await storedToken.deleteOne();
             }
             response.clearCookie('refreshToken', { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'Strict' });
             return response.status(403).json({ message: 'Invalid or expired refresh token' });
        }

        // 2. Verifica la firma y expiración del propio JWT (doble chequeo)
        let decoded;
        try {
             decoded = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET);
             // Asegúrate que el userId del token coincide con el guardado en BD
             console.log(decoded._id)
             console.log(storedToken.userId.toString())
             if (decoded._id !== storedToken.userId.toString()) {
                 throw new Error('User ID mismatch');
             }
        } catch (jwtError) {
             // Si la verificación JWT falla (firma inválida, expirado según JWT)
             storedToken.isValid = false;
             await storedToken.save(); // Invalida en BD
             response.clearCookie('refreshToken', { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'Strict' });
             console.error("JWT Refresh token verification failed:", jwtError);
             return response.status(403).json({ message: 'Refresh token verification failed' });
        }

        // 3. Opcional pero MUY recomendado: Verifica que el usuario aún existe
        const user = await User.findById(decoded._id);
         if (!user) {
             storedToken.isValid = false;
             await storedToken.save();
             response.clearCookie('refreshToken', { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'Strict' });
             return response.status(403).json({ message: 'User not found' });
         }


        // --- ¡Refresh Token Válido! Genera nuevo Access Token ---

        const newAccessTokenPayload = { id: user._id };
        const newAccessToken = jwt.sign(newAccessTokenPayload, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRATION,
            algorithm: process.env.JWT_ALGORITHM
        });

        // --- Opcional: Rotación de Refresh Token ---
        // Invalida el viejo y crea uno nuevo
        // storedToken.isValid = false;
        // await storedToken.save(); // o deleteOne()

        // const newRefreshTokenPayload = { id: user._id };
        // const newRefreshToken = jwt.sign(newRefreshTokenPayload, process.env.REFRESH_TOKEN_SECRET, { expiresIn: process.env.REFRESH_TOKEN_EXPIRATION });
        // const newExpiryDate = new Date(Date.now() + ms(process.env.REFRESH_TOKEN_EXPIRATION));
        // await RefreshToken.create({ userId: user._id, token: newRefreshToken, expiresAt: newExpiryDate });
        // response.cookie('refreshToken', newRefreshToken, { /* ... opciones de cookie ... */ });
        // --- Fin Rotación ---


        // Envía el nuevo Access Token
        response.status(200).json({
            accessToken: newAccessToken
        });

    } catch (error) {
        console.error("Error during token refresh:", error);
        response.status(500).json({ message: 'Internal server error during token refresh' });
    }
};

module.exports = {
    refreshTokenHandler
}