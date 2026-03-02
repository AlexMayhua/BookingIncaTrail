import { dbConnect } from "../../../utils/db";
import Trips from '../../../models/tripModel'
import NextCors from 'nextjs-cors';

export default async (req, res) => {

    // Run the cors middleware
    await NextCors(req, res, {
        // Options
        methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
        origin: '*',
        optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
    })

    try {
        const { category, locale, fields, isDeals } = req.query;

        if (!locale) {
            return res.status(400).json({ msg: "El parámetro 'locale' es requerido" });
        }

        // Asegurar conexión a la base de datos antes de proceder
        await dbConnect();

        // Filtro base: incluir trips del idioma solicitado Y trips con lang='all'
        // Si locale='all', mostrar todos los trips sin filtrar por idioma
        const filter = {};
        
        if (locale !== 'all') {
            filter.$or = [
                { lang: locale },
                { lang: 'all' }
            ];
        }
        
        // Filtrar por categoría (una o varias)
        if (category && category !== "") {
            const categoriesArray = Array.isArray(category)
                ? category
                : category.split(',').map(cat => cat.trim());
            filter.category = { $in: categoriesArray };
        }

        // Filtrar por isDeals = true si está presente
        if (isDeals === 'true') {
            filter.isDeals = true;
        }

        // Selección de campos válida
        const selectedFields = fields && fields !== "" ? fields.split(",").join(" ") : null;

        // Consulta con o sin `.select()`
        const query = Trips.find(filter);
        if (selectedFields) {
            query.select(selectedFields);
        }

        const packages = await query;

        return res.status(200).json(packages);
    } catch (error) {
        return res.status(500).json({ msg: "Error interno del servidor", error: error.message });
    }
}