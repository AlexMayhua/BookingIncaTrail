import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import { DataContext } from "../../store/GlobalState";
import Link from 'next/link';

export default function AdminDashboard() {
    const router = useRouter();
    const { state } = useContext(DataContext);
    const { auth } = state;
    
    const [stats, setStats] = useState({
        trips: '-',
        reservations: '-',
        categories: '-'
    });

    useEffect(() => {
        if (!auth.user || auth.user.role !== 'admin') {
            router.push("/signin");
        } else {
            loadStats();
        }
    }, [auth, router]);
    
    const loadStats = async () => {
        try {
            // Cargar estadísticas de trips
            const tripsRes = await fetch('/api/admin/trip?page=1&limit=10');
            const tripsData = await tripsRes.json();
            
            // Cargar estadísticas de categorías
            const categoriesRes = await fetch('/api/trip/categories');
            const categoriesData = await categoriesRes.json();
            
            setStats({
                trips: tripsData.totalTrips || '-',
                reservations: '-',
                categories: categoriesData.success ? categoriesData.count : '-'
            });
        } catch (error) {
            console.error('Error loading stats:', error);
        }
    };

    if (!auth.user || auth.user.role !== 'admin') {
        return null;
    }

    return (
        <div>
            {/* Header simple */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-primary">Dashboard</h1>
                <p className="text-gray-600 text-sm mt-1">Welcome, {auth.user.name}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Panel: Trips */}
                <div className="p-5 bg-white rounded-lg border border-gray-200 hover:border-alternative transition-colors">
                    <h2 className="text-lg font-bold text-primary mb-1">Trips</h2>
                    <p className="text-xs text-gray-500 mb-4">Manage tour packages</p>
                    <div className="flex gap-2">
                        <Link
                            href='/admin/trip'
                            className="flex-1 text-center bg-alternative hover:bg-blue text-white text-sm py-2 px-3 rounded transition-colors">
                            View All
                        </Link>
                        <Link
                            href='/admin/trip/create'
                            className="flex-1 text-center bg-secondary hover:bg-yellow text-primary text-sm py-2 px-3 rounded transition-colors font-medium">
                            Create
                        </Link>
                    </div>
                </div>

                {/* Panel: Blogs */}
                <div className="p-5 bg-white rounded-lg border border-gray-200 hover:border-brown transition-colors">
                    <h2 className="text-lg font-bold text-primary mb-1">Blogs</h2>
                    <p className="text-xs text-gray-500 mb-4">Manage blog posts</p>
                    <div className="flex gap-2">
                        <Link
                            href='/admin/blog'
                            className="flex-1 text-center bg-brown hover:bg-dark-brown text-white text-sm py-2 px-3 rounded transition-colors">
                            View All
                        </Link>
                        <Link
                            href='/admin/blog/create'
                            className="flex-1 text-center bg-secondary hover:bg-yellow text-primary text-sm py-2 px-3 rounded transition-colors font-medium">
                            Create
                        </Link>
                    </div>
                </div>

                {/* Panel: Reservations */}
                <div className="p-5 bg-white rounded-lg border border-gray-200 hover:border-primary transition-colors">
                    <h2 className="text-lg font-bold text-primary mb-1">Reservations</h2>
                    <p className="text-xs text-gray-500 mb-4">View all bookings</p>
                    <Link
                        href='/admin/reservation'
                        className="block text-center bg-primary hover:bg-dark text-white text-sm py-2 px-3 rounded transition-colors">
                        View All
                    </Link>
                </div>

                {/* Panel: Coupons */}
                <div className="p-5 bg-white rounded-lg border border-gray-200 hover:border-secondary transition-colors">
                    <h2 className="text-lg font-bold text-primary mb-1">Coupons</h2>
                    <p className="text-xs text-gray-500 mb-4">Discount codes</p>
                    <Link
                        href='/admin/coupons'
                        className="block text-center bg-secondary hover:bg-yellow text-primary text-sm py-2 px-3 rounded transition-colors font-medium">
                        Manage
                    </Link>
                </div>

                {/* Panel: Statistics */}
                <div className="p-5 bg-white rounded-lg border border-gray-200 shadow-sm">
                    <h2 className="text-lg font-bold text-primary mb-1">Statistics</h2>
                    <p className="text-xs text-gray-700 mb-4 font-medium">Quick overview</p>
                    <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                            <span className="text-gray-800 font-medium">Trips:</span>
                            <span className="font-bold text-alternative">{stats.trips}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-800 font-medium">Reservations:</span>
                            <span className="font-bold text-primary">{stats.reservations}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-800 font-medium">Categories:</span>
                            <span className="font-bold text-brown">{stats.categories}</span>
                        </div>
                    </div>
                </div>

                {/* Panel: Account */}
                <div className="p-5 bg-primary rounded-lg border border-primary text-white shadow-lg">
                    <h2 className="text-lg font-bold mb-1 text-white">Account</h2>
                    <p className="text-xs text-secondary mb-4 font-medium">Your information</p>
                    <div className="space-y-3 text-sm">
                        <div>
                            <p className="text-xs text-secondary font-semibold mb-1">Email</p>
                            <p className="font-medium truncate text-white bg-white bg-opacity-10 px-2 py-1 rounded">{auth.user.email}</p>
                        </div>
                        <div>
                            <p className="text-xs text-secondary font-semibold mb-1">Role</p>
                            <span className="inline-block bg-secondary text-primary px-3 py-1 rounded text-xs font-bold uppercase shadow-sm">{auth.user.role}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
