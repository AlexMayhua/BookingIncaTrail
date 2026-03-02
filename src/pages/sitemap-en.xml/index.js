import { BRAND } from '../../lib/brandConfig'
import { API_URL } from "../../lib/constants";

export async function getServerSideProps({ res }) {
    const baseUrl = BRAND.siteUrl;

    let tours = [];

    try {
        const res1 = await fetch(`${API_URL}/api/trip?locale=en&fields=slug,category`);
        const data = await res1.json();

        // Verifica si data es un array válido
        if (Array.isArray(data)) {
            tours = data.filter((tour) => tour.slug && tour.category); // Filtra tours que no tengan 'slug' o 'category'
        } else {
            console.error("La respuesta no es un array:", data);
        }

    } catch (err) {
        console.error("Error al obtener slugs:", err.message);
    }

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">    
        ${tours
            .map((tour) => {
                return `
        <url>
            <loc>${baseUrl}/${tour.category}/${tour.slug}</loc>
            <lastmod>${new Date().toISOString()}</lastmod>
            <changefreq>weekly</changefreq>
            <priority>0.8</priority>
        </url>`;
            })
            .join('')}
    </urlset>`;

    res.setHeader('Content-Type', 'application/xml');
    res.write(sitemap);
    res.end();

    return { props: {} };
}

export default function Sitemap() {
    return null;
}



