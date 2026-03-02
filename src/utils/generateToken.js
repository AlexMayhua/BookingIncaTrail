import jwt from 'jsonwebtoken'

/**
 * Crea un access token JWT con expiración de 30 minutos
 * SEGURIDAD: Usa variables de entorno SIN NEXT_PUBLIC_ para mantener secrets seguros
 * @param {object} payload - Datos a incluir en el token (ej: {id: userId})
 * @returns {string} JWT token
 */
export const createAccessToken = (payload) => {
    return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '30m' })
}

/**
 * Crea un refresh token JWT con expiración de 7 días
 * SEGURIDAD: Usa variables de entorno SIN NEXT_PUBLIC_ para mantener secrets seguros
 * @param {object} payload - Datos a incluir en el token (ej: {id: userId})
 * @returns {string} JWT token
 */
export const createRefreshToken = (payload) => {
    return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' })
}
