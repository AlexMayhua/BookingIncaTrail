// pages/api/trip/update.js
import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        const { array_tour, lang } = req.body;

        if (!array_tour || !lang) {
            return res.status(400).json({ message: 'array_tour o lang faltante' });
        }

        if (!['en', 'es'].includes(lang)) {
            return res.status(400).json({ message: 'Idioma no válido' });
        }

        // Construimos la ruta según el idioma
        const filePath = path.join(process.cwd(), `src/lang/${lang}/navbar.js`);
        if (!fs.existsSync(filePath)) {
            return res.status(404).json({ message: `Archivo navbar.js no encontrado para ${lang}` });
        }

        let content = fs.readFileSync(filePath, 'utf8');

        // Reemplazamos array_tour
        content = content.replace(/array_tour\s*:\s*\[[\s\S]*?\]/m, `array_tour: ${JSON.stringify(array_tour, null, 4)}`);

        fs.writeFileSync(filePath, content, 'utf8');

        return res.status(200).json({ message: `array_tour actualizado correctamente en ${lang}` });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error actualizando array_tour', error: error.message });
    }
}