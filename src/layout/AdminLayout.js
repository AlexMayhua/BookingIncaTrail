// components/AdminLayout.js
import { useContext, useEffect } from "react";
import { DataContext } from "../store/GlobalState";
import { useRouter } from "next/router";
import Link from 'next/link';
import Notify from '../components/Notify';
import Modal from '../components/Modal';
import Cookie from 'js-cookie';

const AdminLayout = ({ children }) => {
    const router = useRouter();
    const { state, dispatch } = useContext(DataContext);
    const { auth } = state;

    useEffect(() => {
        if (!auth.user || auth.user.role !== 'admin') {
            router.push("/signin");
        }
    }, [auth, router]);

    if (!auth.user || auth.user.role !== 'admin') {
        return null;
    }

    const handleLogout = () => {
        Cookie.remove('refreshtoken', { path: 'api/auth/accessToken' });
        localStorage.removeItem('firstLogin');
        dispatch({ type: 'AUTH', payload: {} });
        router.push('/signin');
    };

    const isActive = (path) => {
        return router.pathname === path;
    };

    return (
        <div className="flex h-screen bg-white">
            {/* Sidebar */}
            <aside className="w-60 bg-primary text-white p-5 flex flex-col border-r border-gray-200">
                <div className="mb-6">
                    <h2 className="text-secondary text-xl font-bold mb-3">Admin Panel</h2>
                    <div className="text-xs space-y-1">
                        <p className="text-cream">Logged as:</p>
                        <p className="text-white font-semibold truncate">{auth.user.name}</p>
                    </div>
                </div>

                <section className="flex-1 overflow-y-auto">
                    <nav>
                        <ul className="space-y-1 text-sm">
                            <li>
                                <Link
                                    href="/admin"
                                    className={`block py-2 px-3 rounded transition-colors ${
                                        isActive('/admin')
                                            ? 'bg-secondary text-primary font-semibold'
                                            : 'text-white hover:bg-white hover:bg-opacity-10'
                                    }`}>
                                    Dashboard
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/admin/trip"
                                    className={`block py-2 px-3 rounded transition-colors ${
                                        isActive('/admin/trip')
                                            ? 'bg-secondary text-primary font-semibold'
                                            : 'text-white hover:bg-white hover:bg-opacity-10'
                                    }`}>
                                    All Trips
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/admin/trip/create"
                                    className="block py-2 px-3 rounded text-white hover:bg-white hover:bg-opacity-10 transition-colors">
                                    Create Trip
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/admin/categories"
                                    className={`block py-2 px-3 rounded transition-colors ${
                                        isActive('/admin/categories')
                                            ? 'bg-secondary text-primary font-semibold'
                                            : 'text-white hover:bg-white hover:bg-opacity-10'
                                    }`}>
                                    Categories & Services
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/admin/blog"
                                    className={`block py-2 px-3 rounded transition-colors ${
                                        isActive('/admin/blog')
                                            ? 'bg-secondary text-primary font-semibold'
                                            : 'text-white hover:bg-white hover:bg-opacity-10'
                                    }`}>
                                    All Blogs
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/admin/blog/create"
                                    className="block py-2 px-3 rounded text-white hover:bg-white hover:bg-opacity-10 transition-colors">
                                    Create Blog
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/admin/reservation"
                                    className={`block py-2 px-3 rounded transition-colors ${
                                        isActive('/admin/reservation')
                                            ? 'bg-secondary text-primary font-semibold'
                                            : 'text-white hover:bg-white hover:bg-opacity-10'
                                    }`}>
                                    Reservations
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/admin/coupons"
                                    className={`block py-2 px-3 rounded transition-colors ${
                                        isActive('/admin/coupons')
                                            ? 'bg-secondary text-primary font-semibold'
                                            : 'text-white hover:bg-white hover:bg-opacity-10'
                                    }`}>
                                    Coupons
                                </Link>
                            </li>
                        </ul>
                    </nav>
                </section>

                <div className="border-t border-white border-opacity-20 pt-3 mt-4">
                    <button
                        onClick={handleLogout}
                        className="w-full text-center text-sm py-2 px-3 bg-brown hover:bg-dark-brown rounded transition-colors">
                        Logout
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 bg-white p-6 overflow-y-auto">
                <Notify />
                <Modal />
                {children}
            </main>
        </div>
    );
};

export default AdminLayout;
