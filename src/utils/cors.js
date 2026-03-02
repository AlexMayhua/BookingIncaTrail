/**
 * Configuración centralizada de CORS para las APIs
 *
 * SEGURIDAD: En producción, CORS debe estar restringido solo a dominios autorizados
 * NO usar origin: '*' en producción
 */

import NextCors from 'nextjs-cors';

/**
 * Obtiene los orígenes permitidos basados en el entorno
 * @returns {string|string[]} Origen(es) permitido(s)
 */
const getAllowedOrigins = () => {
    // En desarrollo, permitir localhost
    if (process.env.NODE_ENV === 'development') {
        return [
            'http://localhost:3000',
            'http://localhost:3001',
            'http://127.0.0.1:3000',
        ];
    }

    // En producción, usar solo el dominio configurado
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
    if (siteUrl) {
        return siteUrl;
    }

    // Fallback seguro: denegar todo
    console.warn('⚠️  ADVERTENCIA: NEXT_PUBLIC_SITE_URL no está configurado. CORS bloqueará todas las solicitudes.');
    return 'https://none.invalid';
};

/**
 * Configuración de CORS segura para APIs
 */
export const corsConfig = {
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
    origin: getAllowedOrigins(),
    optionsSuccessStatus: 200,
    credentials: true, // Permitir cookies
};

/**
 * Aplica CORS middleware a una ruta de API
 * @param {object} req - Request de Next.js
 * @param {object} res - Response de Next.js
 * @returns {Promise<void>}
 */
export const applyCors = async (req, res) => {
    await NextCors(req, res, corsConfig);
};

/**
 * SOLO para desarrollo/testing: CORS abierto
 * ⚠️ NO USAR EN PRODUCCIÓN
 */
export const applyOpenCors = async (req, res) => {
    if (process.env.NODE_ENV === 'production') {
        console.error('⚠️  ERROR: applyOpenCors() llamado en producción. Usando CORS seguro.');
        return applyCors(req, res);
    }

    await NextCors(req, res, {
        ...corsConfig,
        origin: '*',
    });
};

export default applyCors;
