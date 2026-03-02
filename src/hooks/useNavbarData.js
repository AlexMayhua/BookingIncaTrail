import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

// Cache en memoria para evitar fetches repetidos
const navbarCache = {
    data: null,
    locale: null,
    timestamp: null,
    CACHE_DURATION: 30 * 60 * 1000 // 30 minutos
};

/**
 * Hook personalizado para obtener datos de tours desde la API para el navbar
 * Incluye sistema de caché para optimizar performance
 */
const useNavbarData = () => {
    const [toursData, setToursData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { locale } = useRouter();

    useEffect(() => {
        const fetchToursData = async () => {
            try {
                // Verificar si hay datos en caché válidos
                const now = Date.now();
                const cacheValid = navbarCache.data
                    && navbarCache.locale === locale
                    && navbarCache.timestamp
                    && (now - navbarCache.timestamp) < navbarCache.CACHE_DURATION;

                if (cacheValid) {
                    // Usar datos del caché
                    setToursData(navbarCache.data);
                    setLoading(false);
                    return;
                }

                setLoading(true);
                setError(null);

                // Obtener todos los tours con los campos necesarios para el navbar
                const response = await fetch(`/api/trip?locale=${locale}&fields=title,slug,category,gallery,navbar_description,meta_description`);

                if (!response.ok) {
                    throw new Error(`Error fetching tours: ${response.status}`);
                }

                const data = await response.json();
                
                // Procesar los datos para incluir la imagen de portada
                const processedTours = data.map(tour => ({
                    ...tour,
                    // Usar la primera imagen de la galería como imagen de portada
                    coverImage: tour.gallery && tour.gallery.length > 0
                        ? tour.gallery[0].url
                        : null,
                    // Mantener compatibilidad con el formato anterior
                    _id: tour._id,
                    title: tour.title,
                    category: tour.category,
                    slug: tour.slug
                }));

                // Guardar en caché
                navbarCache.data = processedTours;
                navbarCache.locale = locale;
                navbarCache.timestamp = Date.now();

                setToursData(processedTours);
            } catch (err) {
                console.error('Error fetching navbar tours data:', err);
                setError(err.message);
                // En caso de error, usar array vacío para evitar crashes
                setToursData([]);
            } finally {
                setLoading(false);
            }
        };

        fetchToursData();
    }, [locale]);

    // Funciones helper para filtrar tours por categoría
    const getToursByCategory = (category) => {
        return toursData.filter(tour => tour.category === category);
    };

    // Función para obtener la imagen de un tour específico
    const getTourImage = (slug) => {
        const tour = toursData.find(t => t.slug === slug);
        return tour?.coverImage || null;
    };

    // Función para obtener la descripción de un tour específico para el navbar
    const getTourDescription = (slug) => {
        const tour = toursData.find(t => t.slug === slug);
        // Priorizar navbar_description (HTML rico), si no existe usar meta_description
        return tour?.navbar_description || tour?.meta_description || '';
    };

    return {
        toursData,
        loading,
        error,
        getToursByCategory,
        getTourImage,
        getTourDescription
    };
};

export default useNavbarData;