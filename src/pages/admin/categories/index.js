import { useEffect, useState, useContext } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { DataContext } from '../../../store/GlobalState';
import AdminLayout from '../../../layout/AdminLayout';
import Link from 'next/link';

const AdminCategories = () => {
    const { state } = useContext(DataContext);
    const { auth } = state;
    const router = useRouter();
    
    const [categories, setCategories] = useState([]);
    const [categoryData, setCategoryData] = useState({});
    const [loading, setLoading] = useState(true);
    const [selectedLang, setSelectedLang] = useState('all');

    useEffect(() => {
        if (!auth.user || auth.user.role !== 'admin') {
            router.push('/signin');
            return;
        }
        loadCategoriesData();
    }, [auth.user, router, selectedLang]);

    const loadCategoriesData = async () => {
        try {
            setLoading(true);
            
            // Cargar categorías disponibles
            const categoriesRes = await fetch('/api/trip/categories');
            const categoriesJson = await categoriesRes.json();
            
            if (categoriesJson.success) {
                const cats = categoriesJson.categories;
                setCategories(cats);
                
                // Cargar tours de cada categoría
                const data = {};
                for (const cat of cats) {
                    const tripsRes = await fetch(`/api/trip?category=${cat}&locale=${selectedLang}&fields=_id,title,slug,lang,gallery,navbar_description,linkedTripId`);
                    const trips = await tripsRes.json();
                    data[cat] = Array.isArray(trips) ? trips : [];
                }
                setCategoryData(data);
            }
            
            setLoading(false);
        } catch (error) {
            console.error('Error loading categories:', error);
            setLoading(false);
        }
    };

    const getCategoryTitle = (slug) => {
        return slug
            .split('-')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    };

    const stripHtml = (html) => {
        if (!html) return '';
        const tmp = document.createElement('div');
        tmp.innerHTML = html;
        return tmp.textContent || tmp.innerText || '';
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-cream via-white to-gray-50">
            <Head>
                <title>Categories & Services Manager - Admin</title>
            </Head>

            {/* Header */}
            <nav className="bg-gradient-to-r from-primary to-alternative sticky top-0 border-b border-secondary z-20 shadow-xl">
                <div className="container mx-auto flex justify-between items-center p-4">
                    <button
                        className="flex items-center gap-2 text-white hover:text-secondary px-4 py-2 rounded-lg transition-all hover:bg-white hover:bg-opacity-10"
                        onClick={() => router.back()}>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                            <path fillRule="evenodd" d="M7.72 12.53a.75.75 0 010-1.06l7.5-7.5a.75.75 0 111.06 1.06L9.31 12l6.97 6.97a.75.75 0 11-1.06 1.06l-7.5-7.5z" clipRule="evenodd" />
                        </svg>
                        Back
                    </button>
                    <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7">
                            <path d="M11.644 1.59a.75.75 0 01.712 0l9.75 5.25a.75.75 0 010 1.32l-9.75 5.25a.75.75 0 01-.712 0l-9.75-5.25a.75.75 0 010-1.32l9.75-5.25z" />
                            <path d="M3.265 10.602l7.668 4.129a2.25 2.25 0 002.134 0l7.668-4.13 1.37.739a.75.75 0 010 1.32l-9.75 5.25a.75.75 0 01-.71 0l-9.75-5.25a.75.75 0 010-1.32l1.37-.738z" />
                            <path d="M10.933 19.231l-7.668-4.13-1.37.739a.75.75 0 000 1.32l9.75 5.25c.221.12.489.12.71 0l9.75-5.25a.75.75 0 000-1.32l-1.37-.738-7.668 4.13a2.25 2.25 0 01-2.134-.001z" />
                        </svg>
                        Categories & Services Manager
                    </h1>
                    <div className="flex items-center gap-4">
                        {/* Language Filter */}
                        <select 
                            value={selectedLang}
                            onChange={(e) => setSelectedLang(e.target.value)}
                            className="px-4 py-2 rounded-lg border-2 border-white text-primary font-semibold focus:outline-none focus:ring-2 focus:ring-secondary"
                        >
                            <option value="all">All Languages</option>
                            <option value="es">🇪🇸 Español</option>
                            <option value="en">🇺🇸 English</option>
                        </select>
                        <button
                            onClick={loadCategoriesData}
                            className="flex items-center gap-2 bg-secondary hover:bg-yellow text-primary font-bold px-4 py-2 rounded-lg shadow-lg transition-all">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                                <path fillRule="evenodd" d="M4.755 10.059a7.5 7.5 0 0112.548-3.364l1.903 1.903h-3.183a.75.75 0 100 1.5h4.992a.75.75 0 00.75-.75V4.356a.75.75 0 00-1.5 0v3.18l-1.9-1.9A9 9 0 003.306 9.67a.75.75 0 101.45.388zm15.408 3.352a.75.75 0 00-.919.53 7.5 7.5 0 01-12.548 3.364l-1.902-1.903h3.183a.75.75 0 000-1.5H2.984a.75.75 0 00-.75.75v4.992a.75.75 0 001.5 0v-3.18l1.9 1.9a9 9 0 0015.059-4.035.75.75 0 00-.53-.918z" clipRule="evenodd" />
                            </svg>
                            Refresh
                        </button>
                    </div>
                </div>
            </nav>

            <div className="container mx-auto px-4 py-8">
                {loading ? (
                    <div className="flex items-center justify-center h-64">
                        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary"></div>
                    </div>
                ) : (
                    <>
                        {/* Summary Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                            <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-primary">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-gray-600 text-sm font-medium">Total Categories</p>
                                        <p className="text-4xl font-bold text-primary">{categories.length}</p>
                                    </div>
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-12 h-12 text-primary opacity-20">
                                        <path d="M11.644 1.59a.75.75 0 01.712 0l9.75 5.25a.75.75 0 010 1.32l-9.75 5.25a.75.75 0 01-.712 0l-9.75-5.25a.75.75 0 010-1.32l9.75-5.25z" />
                                    </svg>
                                </div>
                            </div>
                            
                            <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-alternative">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-gray-600 text-sm font-medium">Total Services</p>
                                        <p className="text-4xl font-bold text-alternative">
                                            {Object.values(categoryData).reduce((acc, trips) => acc + trips.length, 0)}
                                        </p>
                                    </div>
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-12 h-12 text-alternative opacity-20">
                                        <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm8.706-1.442c1.146-.573 2.437.463 2.126 1.706l-.709 2.836.042-.02a.75.75 0 01.67 1.34l-.04.022c-1.147.573-2.438-.463-2.127-1.706l.71-2.836-.042.02a.75.75 0 11-.671-1.34l.041-.022zM12 9a.75.75 0 100-1.5.75.75 0 000 1.5z" clipRule="evenodd" />
                                    </svg>
                                </div>
                            </div>
                            
                            <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-secondary">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-gray-600 text-sm font-medium">Average per Category</p>
                                        <p className="text-4xl font-bold text-secondary">
                                            {categories.length > 0 
                                                ? (Object.values(categoryData).reduce((acc, trips) => acc + trips.length, 0) / categories.length).toFixed(1)
                                                : 0}
                                        </p>
                                    </div>
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-12 h-12 text-secondary opacity-20">
                                        <path fillRule="evenodd" d="M2.25 13.5a8.25 8.25 0 018.25-8.25.75.75 0 01.75.75v6.75H18a.75.75 0 01.75.75 8.25 8.25 0 01-16.5 0z" clipRule="evenodd" />
                                        <path fillRule="evenodd" d="M12.75 3a.75.75 0 01.75-.75 8.25 8.25 0 018.25 8.25.75.75 0 01-.75.75h-7.5a.75.75 0 01-.75-.75V3z" clipRule="evenodd" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        {/* Categories List */}
                        <div className="space-y-6">
                            {categories.map((category) => {
                                const trips = categoryData[category] || [];
                                const esTrips = trips.filter(t => t.lang === 'es');
                                const enTrips = trips.filter(t => t.lang === 'en');
                                
                                return (
                                    <div key={category} className="bg-white rounded-xl shadow-xl overflow-hidden border border-gray-200">
                                        {/* Category Header */}
                                        <div className="bg-gradient-to-r from-primary to-alternative p-6">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <h2 className="text-2xl font-bold text-white mb-2">
                                                        {getCategoryTitle(category)}
                                                    </h2>
                                                    <div className="flex items-center gap-4 text-white text-sm">
                                                        <span className="bg-white bg-opacity-20 px-3 py-1 rounded-full font-semibold">
                                                            📦 {trips.length} services
                                                        </span>
                                                        <span className="bg-white bg-opacity-20 px-3 py-1 rounded-full">
                                                            🇪🇸 {esTrips.length} ES
                                                        </span>
                                                        <span className="bg-white bg-opacity-20 px-3 py-1 rounded-full">
                                                            🇺🇸 {enTrips.length} EN
                                                        </span>
                                                    </div>
                                                </div>
                                                <Link 
                                                    href={`/${category}`}
                                                    target="_blank"
                                                    className="flex items-center gap-2 bg-white text-primary px-4 py-2 rounded-lg font-semibold hover:bg-secondary transition-colors"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                                                        <path d="M12 15a3 3 0 100-6 3 3 0 000 6z" />
                                                        <path fillRule="evenodd" d="M1.323 11.447C2.811 6.976 7.028 3.75 12.001 3.75c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113-1.487 4.471-5.705 7.697-10.677 7.697-4.97 0-9.186-3.223-10.675-7.69a1.762 1.762 0 010-1.113zM17.25 12a5.25 5.25 0 11-10.5 0 5.25 5.25 0 0110.5 0z" clipRule="evenodd" />
                                                    </svg>
                                                    View Page
                                                </Link>
                                            </div>
                                        </div>

                                        {/* Services Grid */}
                                        {trips.length > 0 ? (
                                            <div className="p-6">
                                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                                    {trips.map((trip) => (
                                                        <div key={trip._id} className="border-2 border-gray-200 rounded-lg overflow-hidden hover:border-primary hover:shadow-lg transition-all">
                                                            {/* Image */}
                                                            {trip.gallery && trip.gallery.length > 0 && (
                                                                <div className="relative h-48 bg-gray-100">
                                                                    <img 
                                                                        src={trip.gallery[0].url} 
                                                                        alt={trip.title}
                                                                        className="w-full h-full object-cover"
                                                                    />
                                                                    <div className="absolute top-2 left-2 bg-black bg-opacity-70 text-white px-3 py-1 rounded-full text-sm font-semibold">
                                                                        {trip.lang === 'es' ? '🇪🇸 ES' : '🇺🇸 EN'}
                                                                    </div>
                                                                    {trip.linkedTripId && (
                                                                        <div className="absolute top-2 right-2 bg-blue bg-opacity-90 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                                                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                                                                                <path fillRule="evenodd" d="M12.577 4.878a.75.75 0 01.919-.53l4.78 1.281a.75.75 0 01.531.919l-1.281 4.78a.75.75 0 01-1.449-.387l.81-3.022a19.407 19.407 0 00-5.594 5.203.75.75 0 01-1.139.093L7 10.06l-4.72 4.72a.75.75 0 01-1.06-1.061l5.25-5.25a.75.75 0 011.06 0l3.074 3.073a20.923 20.923 0 015.545-4.931l-3.042-.815a.75.75 0 01-.53-.919z" clipRule="evenodd" />
                                                                            </svg>
                                                                            Linked
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            )}
                                                            
                                                            {/* Content */}
                                                            <div className="p-4">
                                                                <h3 className="text-lg font-bold text-primary mb-2 line-clamp-2">
                                                                    {trip.title}
                                                                </h3>
                                                                
                                                                {/* Navbar Description */}
                                                                {trip.navbar_description && (
                                                                    <div className="mb-3 p-3 bg-cream rounded-lg">
                                                                        <p className="text-xs font-semibold text-alternative mb-1 flex items-center gap-1">
                                                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                                                                                <path d="M3.5 2.75a.75.75 0 00-1.5 0v14.5a.75.75 0 001.5 0v-4.392l1.657-.348a6.449 6.449 0 014.271.572 7.948 7.948 0 005.965.524l2.078-.64A.75.75 0 0018 12.25v-8.5a.75.75 0 00-.904-.734l-2.38.501a7.25 7.25 0 01-4.186-.363l-.502-.2a8.75 8.75 0 00-5.053-.439l-1.475.31V2.75z" />
                                                                            </svg>
                                                                            Navbar Description:
                                                                        </p>
                                                                        <p className="text-xs text-gray-700 line-clamp-2">
                                                                            {stripHtml(trip.navbar_description)}
                                                                        </p>
                                                                    </div>
                                                                )}
                                                                
                                                                {/* Actions */}
                                                                <div className="flex gap-2 mt-4">
                                                                    <Link
                                                                        href={`/admin/trip/create/${trip._id}`}
                                                                        className="flex-1 flex items-center justify-center gap-2 bg-primary hover:bg-alternative text-white px-4 py-2 rounded-lg font-semibold transition-colors"
                                                                    >
                                                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                                                                            <path d="M5.433 13.917l1.262-3.155A4 4 0 017.58 9.42l6.92-6.918a2.121 2.121 0 013 3l-6.92 6.918c-.383.383-.84.685-1.343.886l-3.154 1.262a.5.5 0 01-.65-.65z" />
                                                                            <path d="M3.5 5.75c0-.69.56-1.25 1.25-1.25H10A.75.75 0 0010 3H4.75A2.75 2.75 0 002 5.75v9.5A2.75 2.75 0 004.75 18h9.5A2.75 2.75 0 0017 15.25V10a.75.75 0 00-1.5 0v5.25c0 .69-.56 1.25-1.25 1.25h-9.5c-.69 0-1.25-.56-1.25-1.25v-9.5z" />
                                                                        </svg>
                                                                        Edit
                                                                    </Link>
                                                                    <Link
                                                                        href={`/${category}/${trip.slug}`}
                                                                        target="_blank"
                                                                        className="flex items-center justify-center gap-2 bg-secondary hover:bg-yellow text-primary px-4 py-2 rounded-lg font-semibold transition-colors"
                                                                    >
                                                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                                                                            <path fillRule="evenodd" d="M4.25 5.5a.75.75 0 00-.75.75v8.5c0 .414.336.75.75.75h8.5a.75.75 0 00.75-.75v-4a.75.75 0 011.5 0v4A2.25 2.25 0 0112.75 17h-8.5A2.25 2.25 0 012 14.75v-8.5A2.25 2.25 0 014.25 4h5a.75.75 0 010 1.5h-5z" clipRule="evenodd" />
                                                                            <path fillRule="evenodd" d="M6.194 12.753a.75.75 0 001.06.053L16.5 4.44v2.81a.75.75 0 001.5 0v-4.5a.75.75 0 00-.75-.75h-4.5a.75.75 0 000 1.5h2.553l-9.056 8.194a.75.75 0 00-.053 1.06z" clipRule="evenodd" />
                                                                        </svg>
                                                                        View
                                                                    </Link>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="p-12 text-center text-gray-400">
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-16 h-16 mx-auto mb-4 opacity-50">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5m6 4.125l2.25 2.25m0 0l2.25 2.25M12 13.875l2.25-2.25M12 13.875l-2.25 2.25M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
                                                </svg>
                                                <p className="text-lg font-semibold">No services in this category</p>
                                                <Link 
                                                    href="/admin/trip/create"
                                                    className="inline-block mt-4 text-primary hover:text-alternative font-semibold"
                                                >
                                                    + Create first service
                                                </Link>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default AdminCategories;
