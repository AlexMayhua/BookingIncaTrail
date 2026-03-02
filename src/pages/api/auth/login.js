import Users from '../../../models/userModel'
import bcrypt from 'bcrypt'
import { createAccessToken, createRefreshToken } from '../../../utils/generateToken'
import { dbConnect } from "../../../utils/db";
import { applyCors } from '../../../utils/cors';

dbConnect();

export default async (req, res) => {
    // Aplicar CORS seguro
    await applyCors(req, res);

    // Validar método HTTP
    if (req.method !== 'POST') {
        return res.status(405).json({ err: 'Method not allowed' });
    }

    try {
        const { email, password } = req.body;

        // Validar entrada
        if (!email || !password) {
            return res.status(400).json({ err: 'Email and password are required.' });
        }

        // Buscar usuario
        const user = await Users.findOne({ email }).select('+password');
        if (!user) {
            return res.status(401).json({ err: 'Invalid email or password.' });
        }

        // Verificar password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ err: 'Invalid email or password.' });
        }

        // Generar tokens
        const access_token = createAccessToken({ id: user._id });
        const refresh_token = createRefreshToken({ id: user._id });

        // Enviar respuesta
        res.json({
            msg: "Login Success!",
            refresh_token,
            access_token,
            user: {
                name: user.name,
                email: user.email,
                role: user.role,
                avatar: user.avatar,
                root: user.root
            }
        });

    } catch (err) {
        console.error('Login error:', err);
        return res.status(500).json({ err: 'Authentication failed. Please try again.' });
    }
}