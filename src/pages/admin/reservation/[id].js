import Link from "next/link";
import { API_URL } from "../../../lib/constants"


export default function Reservation({ reservation }) {

    return (
        <div className="overflow-x-auto mx-2 md:mx-4 my-8 text-gray-800 flex justify-center text-center">
            <div className="container mx-auto p-4 sm:px-6 lg:px-40">
                <section className="p-6 bg-white shadow-md rounded">
                <Link
                    href={`/${reservation.tour.category}/${reservation.tour.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-2xl md:text-3xl font-extrabold text-gray-800 mb-4 hover:underline cursor-pointer">

                    <h1>
                        {reservation.tour.title}
                    </h1>

                </Link>
                    <div className="text-gray-600">
                        <h3 className="text-base md:text-lg font-medium mb-2">
                        Fecha de Inicio del Tour: 
                        <span className="font-semibold">
                            {new Date(reservation.date).toLocaleDateString()}
                        </span>
                        </h3>
                        <h3 className="text-base md:text-lg font-medium">
                        Fecha de Pago Realizado:  
                        <span className="font-semibold">
                            {new Date(reservation.createdAt).toLocaleDateString()}
                        </span> 
                        Hora: 
                        <span className="font-semibold">
                            {new Date(reservation.createdAt).toLocaleTimeString()}
                        </span>
                        </h3>
                    </div>
                </section>

                <h2 className="text-md sm:text-lg md:text-xl font-semibold mb-2 py-5">Información de Viajeros</h2>
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border border-gray-300 shadow-sm">
                        <thead className="bg-gray-100 text-gray-700 font-medium text-xs sm:text-sm">
                            <tr>
                                <th className="py-2 px-1 sm:px-2 md:px-4 border-b border-gray-300 text-center">Nº</th>
                                <th className="py-2 px-1 sm:px-2 md:px-4 border-b border-gray-300 text-center">Nombre</th>
                                <th className="py-2 px-1 sm:px-2 md:px-4 border-b border-gray-300 text-center">Documento</th>
                                <th className="py-2 px-1 sm:px-2 md:px-4 border-b border-gray-300 text-center">Genero</th>
                                <th className="py-2 px-1 sm:px-2 md:px-4 border-b border-gray-300 text-center">Fecha de Nacimiento</th>
                                <th className="py-2 px-1 sm:px-2 md:px-4 border-b border-gray-300 text-center">País</th>
                                <th className="py-2 px-1 sm:px-2 md:px-4 border-b border-gray-300 text-center">Email</th>
                                <th className="py-2 px-1 sm:px-2 md:px-4 border-b border-gray-300 text-center">Telefono</th>
                            </tr>
                        </thead>
                        <tbody className="text-gray-800 text-xs sm:text-sm">
                            {reservation.userData.map((traveler, index) => {
                                return (
                                    <tr key={index} className="traveler-details mb-4">
                                        <td className="font-medium py-2 px-1 sm:px-2 md:px-4 border-b border-gray-300 text-center">Viajero {index + 1}</td>
                                        <td className="py-2 px-1 sm:px-2 md:px-4 border-b border-gray-300 text-center">
                                            <p>{traveler.firstName} {traveler.lastName}</p>
                                        </td>
                                        <td className="py-2 px-1 sm:px-2 md:px-4 border-b border-gray-300 text-center">
                                            <p><strong>{traveler.documentType}:</strong> {traveler.documentNum}</p>
                                        </td>
                                        <td className="py-2 px-1 sm:px-2 md:px-4 border-b border-gray-300 text-center">
                                            <p>{traveler.gender}</p>
                                        </td>
                                        <td className="py-2 px-1 sm:px-2 md:px-4 border-b border-gray-300 text-center">
                                            <p>{traveler.birthDay}/{traveler.birthMonth}/{traveler.birthYear}</p>
                                        </td>
                                        <td className="py-2 px-1 sm:px-2 md:px-4 border-b border-gray-300 text-center">
                                            <p>{traveler.country}</p>
                                        </td>
                                        {index === 0 && (
                                            <>
                                                <td className="py-2 px-1 sm:px-2 md:px-4 border-b border-gray-300 text-center">
                                                    <p>{traveler.email}</p>
                                                </td>
                                                <td className="py-2 px-1 sm:px-2 md:px-4 border-b border-gray-300 text-center">
                                                    <p>{traveler.phone}</p>
                                                </td>
                                            </>
                                        )}
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                <h2 className="text-md sm:text-lg md:text-xl font-semibold mb-2 mt-4">Información de Pagos</h2>
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border border-gray-300 shadow-sm">
                        <thead className="bg-gray-100 text-gray-700 font-medium text-xs sm:text-sm">
                            <tr>
                                <th className="py-2 px-1 sm:px-2 md:px-4 border-b border-gray-300 text-center">Pago realizado</th>
                                <th className="py-2 px-1 sm:px-2 md:px-4 border-b border-gray-300 text-center">Balance pendiente</th>
                                <th className="py-2 px-1 sm:px-2 md:px-4 border-b border-gray-300 text-center">Precio total del tour</th>
                                <th className="py-2 px-1 sm:px-2 md:px-4 border-b border-gray-300 text-center">Cupones</th>
                            </tr>
                        </thead>
                        <tbody className="text-gray-800 text-xs sm:text-sm">
                            <tr>
                                <td className="font-medium py-2 px-1 sm:px-2 md:px-4 border-l border-b border-gray-300 text-center">${reservation.balance.payment}</td>
                                <td className="font-medium py-2 px-1 sm:px-2 md:px-4 border-l border-b border-gray-300 text-center">${reservation.balance.balance}</td>
                                <td className="font-medium py-2 px-1 sm:px-2 md:px-4 border-l border-b border-gray-300 text-center">${reservation.totalPay}</td>
                                <td className="font-medium py-2 px-1 sm:px-2 md:px-4 border-l border-b border-gray-300 text-center">{reservation.coupons?.code} - %{reservation.coupons?.discount}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export async function getServerSideProps({ params: { id } }) {
    const res = await fetch(`${API_URL}/api/admin/reservation/${id}`)
    const reservation = await res.json()

    return {
        props: {
            reservation
        }
    }
}