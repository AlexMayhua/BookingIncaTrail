import { useContext, useState, useEffect } from 'react'
import { DataContext } from '../../../store/GlobalState'
import Link from 'next/link'
import { API_URL } from '../../../lib/constants'
import { useRouter } from 'next/router'

export default function Trip({ reservations }) {

    const router = useRouter()
    const { state } = useContext(DataContext)
    const { auth } = state;

    useEffect(() => {

        if (auth.user?.role !== 'admin') {

            router.push('/signin');
        }
    }, [auth, router]);

    const [searchTerm, setSearchTerm] = useState("");
    const [paymentStatus, setPaymentStatus] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 10;

    const calculateValues = (item) => {
        const totalPay = Number(item.totalPay) || 0;
        const discount = Number(item.coupons?.discount) || 0;
        const newTotalPay = totalPay - (discount * totalPay / 100);
        const isPaid = newTotalPay === Number(item.balance.payment);

        return { totalPay, discount, newTotalPay, isPaid };
    };

    const handleDelete = async (id) => {
        const isConfirmed = window.confirm("Are you sure you want to delete this reservation?");
        if (!isConfirmed) {
            return; // Exit if the user cancels the action
        }

        try {
            const response = await fetch(`${API_URL}/api/admin/reservation?id=${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Error deleting reservation');
            }

            router.replace(router.asPath); // Refresh the page to reflect changes

        } catch (error) {
            console.error('Failed to delete reservation:', error);
        }
    };

    // Filter 
    const filteredData = reservations.filter((item) => {
        const { isPaid } = calculateValues(item);

        const matchesSearchTerm = (
            `${item.userData[0].firstName} ${item.userData[0].lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.tour.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.userData.length.toString().includes(searchTerm) ||
            new Date(item.date).toLocaleDateString().includes(searchTerm) ||
            item.totalPay.toString().includes(searchTerm) ||
            item.balance.payment.toString().includes(searchTerm) ||
            (item.coupons?.code || "").toLowerCase().includes(searchTerm) ||
            (item.coupons?.discount || "").toString().includes(searchTerm)
        );

        // Filtrar por estado de pago si está seleccionado
        const matchesPaymentStatus = paymentStatus === "" ||
            (paymentStatus === "paid" && isPaid) ||
            (paymentStatus === "pending" && !isPaid);

        return matchesSearchTerm && matchesPaymentStatus;
    });



    const indexOfLastRow = currentPage * rowsPerPage;
    const indexOfFirstRow = indexOfLastRow - rowsPerPage;
    const currentRows = filteredData.slice(indexOfFirstRow, indexOfLastRow);

    const totalPages = Math.ceil(filteredData.length / rowsPerPage);


    const paginate = (pageNumber) => {
        if (pageNumber > 0 && pageNumber <= totalPages) {
            setCurrentPage(pageNumber);
        }
    };

    return (
        <div className="overflow-x-auto mx-4 my-8 text-gray-800">
            <h2 className="text-2xl font-bold mb-4">Reservations Datatable</h2>
            <div className='flex-none lg:flex md:ml-auto w-full md:py-8 mt-8 md:mt-0 gap-6 justify-between'>

                <select
                    value={paymentStatus}
                    onChange={(e) => setPaymentStatus(e.target.value)}
                    className="mb-4 p-2 border rounded lg:w-1/6 w-full"
                >
                    <option value="">All</option>
                    <option value="paid">Completed</option>
                    <option value="pending">Balance Pending</option>
                </select>

                <input
                    type="text"
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="mb-4 p-2 border rounded lg:w-1/2 w-full"
                />


            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-300 shadow">
                    <thead className="bg-gray-100 text-gray-700 font-medium text-sm">
                        <tr>
                            {/* Columnas */}
                            <th className="py-2 px-4 border-b border-gray-300 text-center">Nº</th>
                            <th className="py-2 px-4 border-b border-gray-300 text-center">Full Name</th>
                            <th className="py-2 px-4 border-b border-gray-300 text-center">Travellers</th>
                            <th className="py-2 px-4 border-b border-gray-300 text-center">Tours</th>
                            <th className="py-2 px-4 border-b border-gray-300 text-center">Date</th>
                            <th className="py-2 px-4 border-b border-gray-300 text-center">Price</th>
                            <th className="py-2 px-4 border-b border-gray-300 text-center">Payment</th>
                            <th className="py-2 px-4 border-b border-gray-300 text-center">Discount Coupon</th>
                            <th className="py-2 px-4 border-b border-gray-300 text-center">Payment Status</th>
                            <th className="py-2 px-4 border-b border-gray-300 text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="text-gray-800 text-sm">
                        {currentRows.map((item, i) => {
                            const { isPaid } = calculateValues(item);
                            return (
                                <tr key={i} className={`bg-white transition-all hover:bg-green-50 ${isPaid ? 'bg-green-100' : 'bg-[#ffeeca]'}`}>
                                    <td className="py-2 px-4 border-b border-gray-300 text-center">{indexOfFirstRow + i + 1}</td>
                                    <td className="py-2 px-4 border-b border-gray-300 text-center">
                                        <Link
                                            href={`/admin/reservation/${item._id}`}
                                            className="text-blue-600 hover:underline">
                                            {item.userData[0].firstName} {item.userData[0].lastName}
                                        </Link>
                                    </td>
                                    <td className="py-2 px-4 border-b border-gray-300 text-center">{item.userData.length}</td>
                                    <td className="py-2 px-4 border-b border-gray-300 text-center">{item.tour.title}</td>
                                    <td className="py-2 px-4 border-b border-gray-300 text-center">{new Date(item.date).toLocaleDateString()}</td>
                                    <td className="py-2 px-4 border-b border-gray-300 text-center">${item.totalPay}</td>
                                    <td className="py-2 px-4 border-b border-gray-300 text-center">${item.balance.payment}</td>
                                    <td className="py-2 px-4 border-b border-gray-300 text-center">{item.coupons?.code} - %{item.coupons?.discount}</td>
                                    <td className="py-2 px-4 border-b border-gray-300 text-center">
                                        {isPaid ? (
                                            <div className="flex items-center space-x-2">

                                                <span className="text-[#005249] text-xl flex justify-center">
                                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6 h-4 w-4">
                                                        <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z" clipRule="evenodd" />
                                                    </svg>
                                                </span>

                                                <span className="font-medium text-xs text-emerald-600">Completed</span>
                                            </div>

                                        ) : (
                                            <div className="flex items-center space-x-2">
                                                <span className="text-[#FABF02] text-xl flex justify-center">
                                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6 h-4 w-4">
                                                        <path fillRule="evenodd" d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003ZM12 8.25a.75.75 0 0 1 .75.75v3.75a.75.75 0 0 1-1.5 0V9a.75.75 0 0 1 .75-.75Zm0 8.25a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z" clipRule="evenodd" />
                                                    </svg>
                                                </span>
                                                <span className="font-medium text-xs text-amber-600">Balance Pending</span>
                                            </div>
                                        )}
                                    </td>
                                    <td className="py-2 px-4 border-b border-gray-300 text-center">
                                        <button
                                            onClick={() => handleDelete(item._id)}
                                            className="text-red-600 hover:text-red-800"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6 h-5 w-5">
                                                <path fillRule="evenodd" d="M16.5 4.478v.227a48.816 48.816 0 0 1 3.878.512.75.75 0 1 1-.256 1.478l-.209-.035-1.005 13.07a3 3 0 0 1-2.991 2.77H8.084a3 3 0 0 1-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 0 1-.256-1.478A48.567 48.567 0 0 1 7.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 0 1 3.369 0c1.603.051 2.815 1.387 2.815 2.951Zm-6.136-1.452a51.196 51.196 0 0 1 3.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 0 0-6 0v-.113c0-.794.609-1.428 1.364-1.452Zm-.355 5.945a.75.75 0 1 0-1.5.058l.347 9a.75.75 0 1 0 1.499-.058l-.346-9Zm5.48.058a.75.75 0 1 0-1.498-.058l-.347 9a.75.75 0 0 0 1.5.058l.345-9Z" clipRule="evenodd" />
                                            </svg>
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
            {/* Paginación */}
            <div className="flex justify-center text-center mt-4 items-center">
                <button
                    onClick={() => paginate(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-4 py-2 bg-gray-200 rounded"
                >
                    Previous
                </button>
                <span>Page {currentPage} of {totalPages}</span>
                <button
                    onClick={() => paginate(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 bg-gray-200 rounded"
                >
                    Next
                </button>
            </div>
        </div>
    );
}


export async function getServerSideProps({ ctx }) {
    const res1 = await fetch(`${API_URL}/api/admin/reservation`)
    const reservations = await res1.json()

    return {
        props: {
            reservations,
        },
    }
}