import { useContext, useEffect, useState } from 'react'
import { DataContext } from '../../../store/GlobalState'
import Link from 'next/link'
import { API_URL } from '../../../lib/constants'
import { useRouter } from 'next/router'

export default function BlogAdmin() {
    const { state, dispatch } = useContext(DataContext)
    const { auth } = state
    const router = useRouter()

    const [blogs, setBlogs] = useState([])
    const [loading, setLoading] = useState(true)
    const [page, setPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)

    useEffect(() => {
        if (!auth?.user || auth.user.role !== 'admin') {
            router.push('/signin')
        }
    }, [auth, router])

    useEffect(() => {
        if (auth?.user && auth.user.role === 'admin') {
            loadBlogs()
        }
    }, [auth, page])

    const loadBlogs = async () => {
        setLoading(true)
        try {
            const res = await fetch(`${API_URL}/api/admin/blog?page=${page}&limit=10`)
            const data = await res.json()
            if (Array.isArray(data)) {
                setBlogs(data)
            } else if (data.blogs) {
                setBlogs(data.blogs)
                setTotalPages(data.totalPages || 1)
            }
        } catch (error) {
            console.error('Error loading blogs:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleNextPage = () => {
        if (page < totalPages) setPage(page + 1)
    }

    const handlePrevPage = () => {
        if (page > 1) setPage(page - 1)
    }

    if (!auth?.user || auth.user.role !== 'admin') {
        return null
    }

    return (
        <div className="mx-4 mt-8 text-gray-700">
            <div className="mb-6 flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-800">Blog Posts</h2>
                <Link
                    href="/admin/blog/create"
                    className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                    Create New Blog
                </Link>
            </div>

            <div className="overflow-x-auto shadow-lg rounded-lg">
                <table className="min-w-full bg-white">
                    <thead className="bg-gray-200 border-b">
                        <tr>
                            <th className="py-3 px-5 text-left font-semibold text-gray-600">Nº</th>
                            <th className="py-3 px-5 text-left font-semibold text-gray-600">Title</th>
                            <th className="py-3 px-5 text-left font-semibold text-gray-600">URL</th>
                            <th className="py-3 px-5 text-left font-semibold text-gray-600">Language</th>
                            <th className="py-3 px-5 text-left font-semibold text-gray-600">Actions</th>
                        </tr>
                    </thead>
                    <tbody className={`relative ${loading ? 'bg-white' : ''}`}>
                        {loading ? (
                            <tr>
                                <td colSpan="5" className="py-10">
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
                        ) : blogs.length === 0 ? (
                            <tr>
                                <td colSpan="5" className="py-10 text-center text-gray-500">
                                    No blogs found. Create your first blog post!
                                </td>
                            </tr>
                        ) : (
                            blogs.map((item, i) => (
                                <tr key={item._id || i} className="border-b hover:bg-gray-100 transition-colors">
                                    <td className="py-3 px-5">{i + 1 + (page - 1) * 10}</td>
                                    <td className="py-3 px-5">{item.title}</td>
                                    <td className="py-3 px-5">{item.slug}</td>
                                    <td className="py-3 px-5">
                                        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-medium">
                                            {item.lang}
                                        </span>
                                    </td>
                                    <td className="py-3 px-5 flex gap-3">
                                        <Link
                                            href={`/admin/blog/create/${item._id}`}
                                            className="bg-alternative hover:bg-blue text-white px-3 py-1 rounded text-xs font-medium transition-colors">
                                            Edit
                                        </Link>
                                        <button
                                            className="bg-brown hover:bg-dark-brown text-white px-3 py-1 rounded text-xs font-medium transition-colors"
                                            onClick={() => dispatch({
                                                type: 'ADD_MODAL',
                                                payload: [{
                                                    data: '',
                                                    id: item._id,
                                                    title: item.title,
                                                    type: 'DELETE_BLOG'
                                                }]
                                            })}>
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {totalPages > 1 && (
                <div className="flex justify-center gap-5 items-center mt-6">
                    <button
                        onClick={handlePrevPage}
                        disabled={page === 1}
                        className="bg-gray-300 text-gray-600 px-4 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-400 transition">
                        Previous
                    </button>
                    <span className="text-gray-600">
                        Page {page} of {totalPages}
                    </span>
                    <button
                        onClick={handleNextPage}
                        disabled={page === totalPages}
                        className="bg-gray-300 text-gray-600 px-4 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-400 transition">
                        Next
                    </button>
                </div>
            )}
        </div>
    )
}