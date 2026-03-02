import Users from '../../../models/userModel'
import jwt from 'jsonwebtoken'
import { createAccessToken } from '../../../utils/generateToken'
import { dbConnect } from "../../../utils/db";

dbConnect();

export default async (req, res) => {
    try {
        const rf_token = req.cookies.refreshtoken;
        if (!rf_token) {
            // No mostrar error en consola si simplemente no hay cookie (normal al cargar la página)
            return res.status(401).json({ err: 'Please login now!' })
        }

        // SEGURIDAD: Usar variable sin NEXT_PUBLIC_ (mejora de Claude)
        const result = jwt.verify(rf_token, process.env.REFRESH_TOKEN_SECRET)
        if (!result || !result.id) {
            return res.status(401).json({ err: 'Your login session has expired. Please try again!' })
        }

        // SEGURIDAD: Seleccionar solo campos necesarios (mejora de Claude)
        const user = await Users.findById(result.id).select('_id name email role avatar root');
        if (!user) {
            return res.status(404).json({ err: 'User does not exist.' })
        }

        const access_token = createAccessToken({ id: user._id })
        res.json({
            access_token,
            user: {
                name: user.name,
                email: user.email,
                role: user.role,
                avatar: user.avatar,
                root: user.root
            }
        })
    } catch (err) {
        console.error('Access token refresh error:', err);
        if (err.name === 'JsonWebTokenError') {
            return res.status(401).json({ err: 'Invalid refresh token.' })
        } else if (err.name === 'TokenExpiredError') {
            return res.status(401).json({ err: 'Refresh token has expired. Please login again.' })
        }
        return res.status(500).json({ err: 'Authentication failed. Please login again.' })
    }
}

