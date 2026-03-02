import { useContext, useState, useEffect } from 'react';
import { DataContext } from '../../../store/GlobalState';
import Link from 'next/link';
import { API_URL } from '../../../lib/constants';
import { useRouter } from 'next/router';

export default function Trip() {
    const router = useRouter();
    const { state, dispatch } = useContext(DataContext);
    const { auth } = state;

    const [tripsCache, setTripsCache] = useState({});
    const [trips, setTrips] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Verificar autenticación y rol
        if (!auth?.user || auth.user.role !== 'admin') {
            router.push('/signin');
        } else {
            // Cargar la primera página si aún no se ha cargado
            if (trips.length === 0 && !loading) {
                loadTrips(1);
            }
        }
    }, [auth, router]);

    useEffect(() => {
        if (tripsCache[page]) {
            setTrips(tripsCache[page]);
        } else {
            loadTrips(page);
        }
    }, [page]);

    const loadTrips = async (page) => {
        setLoading(true);
        try {
            const res = await fetch(`/api/admin/trip?page=${page}&limit=10`);
            const data = await res.json();
            setTripsCache((prevCache) => ({ ...prevCache, [page]: data.packages }));
            setTrips(data.packages || []);
            setTotalPages(data.totalPages || 1);
        } catch (error) {
            console.error('Error loading trips:', error);
            setTrips([]);
        } finally {
            setLoading(false);
        }
    };

    const handleNextPage = () => {
        if (page < totalPages) setPage(page + 1);
    };

    const handlePrevPage = () => {
        if (page > 1) setPage(page - 1);
    };

    if (!auth?.user || auth.user.role !== 'admin') {
        return null; // No renderizar contenido si no está autenticado
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-primary">Trips</h2>
                <Link
                    href="/admin/trip/create"
                    className="bg-secondary hover:bg-yellow text-primary px-4 py-2 rounded font-medium transition-colors text-sm">
                    Create New Trip
                </Link>
            </div>

            <div className="overflow-x-auto border border-gray-200 rounded-lg">
                <table className="min-w-full bg-white">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr className="text-xs uppercase text-gray-600">
                            <th className="py-3 px-4 text-left font-semibold">Nº</th>
                            <th className="py-3 px-4 text-left font-semibold">Title</th>
                            <th className="py-3 px-4 text-left font-semibold">Price</th>
                            <th className="py-3 px-4 text-left font-semibold">Category</th>
                            <th className="py-3 px-4 text-left font-semibold">URL</th>
                            <th className="py-3 px-4 text-left font-semibold">Lang</th>
                            <th className="py-3 px-4 text-left font-semibold">Actions</th>
                        </tr>
                    </thead>
                    <tbody className={`relative ${loading ? 'bg-white' : ''}`}>
                        {loading ? (
                            <tr>
                                <td colSpan="7" className="py-10">
                                    <div className="flex justify-center items-center">
                                        <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12"></div>
                                    </div>
                                    <style jsx>{`
                                        .loader {
                                            border-top-color: #3498db;
                                            animation: spinner 0.6s linear infinite;
                                        }
                                        @keyframes spinner {
                                            0% { transform: rotate(0deg); }
                                            100% { transform: rotate(360deg); }
                                        }
                                    `}</style>
                                </td>
                            </tr>
                        ) : trips.length === 0 ? (
                            <tr>
                                <td colSpan="7" className="py-10 text-center text-gray-500">
                                    No trips found. Create your first trip!
                                </td>
                            </tr>
                        ) : (
                            trips.map((item, i) => (
                                <tr key={i} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                                    <td className="py-3 px-4 text-sm">{i + 1 + (page - 1) * 10}</td>
                                    <td className="py-3 px-4 text-sm font-medium">{item.title}</td>
                                    <td className="py-3 px-4 text-sm">${item.price}</td>
                                    <td className="py-3 px-4 text-sm">
                                        <span className="px-2 py-1 bg-alternative bg-opacity-10 text-alternative rounded text-xs">
                                            {item.category}
                                        </span>
                                    </td>
                                    <td className="py-3 px-4 text-sm text-gray-600">{item.slug}</td>
                                    <td className="py-3 px-4 text-sm">
                                        <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs uppercase font-medium">
                                            {item.lang}
                                        </span>
                                    </td>
                                    <td className="py-3 px-4">
                                        <div className="flex gap-2">
                                            <Link
                                                href={`/admin/trip/create/${item._id}`}
                                                className="bg-alternative hover:bg-blue text-white px-3 py-1 rounded text-xs font-medium transition-colors">
                                                Edit
                                            </Link>
                                            <button
                                                className="bg-brown hover:bg-dark-brown text-white px-3 py-1 rounded text-xs font-medium transition-colors"
                                                onClick={() => dispatch({
                                                    type: 'ADD_MODAL',
                                                    payload: [{ data: '', id: item._id, title: item.title, type: 'DELETE_TRIP' }]
                                                })}>
                                                Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
            {totalPages > 1 && (
                <div className="flex justify-center gap-3 items-center mt-4">
                    <button
                        onClick={handlePrevPage}
                        disabled={page === 1}
                        className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded disabled:opacity-30 disabled:cursor-not-allowed hover:border-alternative transition text-sm">
                        Previous
                    </button>
                    <span className="text-sm text-gray-600">
                        Page {page} of {totalPages}
                    </span>
                    <button
                        onClick={handleNextPage}
                        disabled={page === totalPages}
                        className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded disabled:opacity-30 disabled:cursor-not-allowed hover:border-alternative transition text-sm">
                        Next
                    </button>
                </div>
            )}
        </div>
    );
}
