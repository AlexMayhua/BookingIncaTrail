import auth from '../../../../middleware/auth'
import { dbConnect } from "../../../../utils/db";
import Trips from '../../../../models/tripModel'
import { applyCors } from '../../../../utils/cors';

dbConnect();

export default async (req, res) => {
    // Aplicar CORS seguro
    await applyCors(req, res);

    switch (req.method) {
        case "GET":
            await getTrip(req, res)
            break;
        case "POST":
            await createTrip(req, res)
            break;
        default:
            res.status(405).json({ err: 'Method not allowed' });
    }
}

const getTrip = async (req, res) => {
    const { category, page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    try {
        const query = category ? { category } : {};
        const totalTrips = await Trips.countDocuments(query);

        // Optimización: Usar lean() y seleccionar solo los campos necesarios
        const packages = await Trips.find(query)
            //.sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit))
            .lean()  // Devuelve documentos como objetos planos para mejorar rendimiento
            .select('title category price slug lang createdAt');  // Selecciona solo los campos necesarios

        return res.status(200).json({
            packages,
            totalPages: Math.ceil(totalTrips / limit),
            currentPage: parseInt(page),
            totalTrips
        });
    } catch (error) {
        return res.status(400).json({ msg: error.message });
    }
};

const createTrip = async (req, res) => {
    try {
        // Verificar autenticación
        const result = await auth(req, res);

        // Si auth retorna null, significa que ya envió la respuesta de error
        if (!result) {
            return;
        }

        // Verificar que el usuario es admin
        if (result.role !== 'admin') {
            return res.status(403).json({ err: 'Access denied. Admin role required.' });
        }

        const {
            title,
            sub_title,
            highlight,
            price,
            duration,
            category,
            wetravel,
            lang,
            description,
            information,
            gallery,
            quickstats,
            slug,
            discount,
            offer,
            isDeals,
            meta_title,
            meta_description,
            url_brochure,
            enableDiscount,
            ardiscounts
        } = req.body;

        // Validación básica de campos requeridos
        if (!title || !price || !category || !lang) {
            return res.status(400).json({
                err: 'Missing required fields: title, price, category, and lang are required.'
            });
        }

        // Validar que el precio sea un número positivo
        if (typeof price !== 'number' || price <= 0) {
            return res.status(400).json({ err: 'Price must be a positive number.' });
        }

        const saveData = await Trips.create({
            title,
            sub_title,
            highlight,
            price,
            duration,
            category,
            wetravel,
            lang,
            description,
            information,
            gallery,
            quickstats,
            slug,
            discount,
            offer,
            isDeals,
            meta_title,
            meta_description,
            url_brochure,
            enableDiscount,
            ardiscounts
        });

        res.status(201).json({
            msg: 'Success! Created a new trip',
            trip: saveData
        });

    } catch (err) {
        console.error('Create trip error:', err);

        // Manejar errores de validación de Mongoose
        if (err.name === 'ValidationError') {
            return res.status(400).json({
                err: 'Validation failed',
                details: err.message
            });
        }

        // Manejar duplicados (slug único, etc.)
        if (err.code === 11000) {
            return res.status(409).json({
                err: 'A trip with this slug already exists.'
            });
        }

        return res.status(500).json({ err: 'Failed to create trip. Please try again.' });
    }
}