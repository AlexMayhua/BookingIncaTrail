import jwt from 'jsonwebtoken'
import Users from '../models/userModel'

/**
 * Middleware de autenticación para proteger rutas de API
 * @param {object} req - Request de Next.js
 * @param {object} res - Response de Next.js
 * @returns {Promise<object|null>} Información del usuario autenticado o null si falla
 */
const auth = async (req, res) => {
    try {
        const token = req.headers.authorization;

        if (!token) {
            res.status(401).json({ err: 'Authentication token is required.' });
            return null;
        }

        // SEGURIDAD: Usar variable de entorno sin NEXT_PUBLIC_
        // para que NO se exponga al cliente
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

        if (!decoded || !decoded.id) {
            res.status(401).json({ err: 'Invalid authentication token.' });
            return null;
        }

        const user = await Users.findOne({ _id: decoded.id }).select('_id role root');

        if (!user) {
            res.status(401).json({ err: 'User not found.' });
            return null;
        }

        return { id: user._id, role: user.role, root: user.root };
    } catch (err) {
        // Manejo específico de errores de JWT
        if (err.name === 'JsonWebTokenError') {
            res.status(401).json({ err: 'Invalid authentication token.' });
        } else if (err.name === 'TokenExpiredError') {
            res.status(401).json({ err: 'Authentication token has expired.' });
        } else {
            console.error('Auth middleware error:', err);
            res.status(500).json({ err: 'Authentication failed.' });
        }
        return null;
    }
}

export default auth