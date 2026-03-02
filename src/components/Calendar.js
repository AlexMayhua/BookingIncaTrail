import { useState } from "react";

export default function Calendar({ dataget }) {
    const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];
    const currentMonthIndex = new Date().getMonth();
    const year = new Date().getFullYear();
    const [activeTab, setActiveTab] = useState(currentMonthIndex);

    const daysInMonth = new Date(year, activeTab + 1, 0).getDate();
    const firstDay = new Date(year, activeTab, 1).getDay();

    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
    const emptyDays = Array.from({ length: firstDay }, (_, i) => '');

    const totalDays = [...emptyDays, ...days];
    const weeks = Math.ceil(totalDays.length / 7);

    const currentMonthData = dataget.find(item => item.month === activeTab + 1 && item.year === year);

    const updateDate = new Date(currentMonthData?.update).toLocaleString('es-ES', { day: 'numeric', month: 'long', year: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' })
    return (
        <>
            <div className="lg:text-white my-6">
                <span className="flex justify-center">{currentMonthData?.schedule}</span>
                <span className="flex justify-center">{updateDate}</span>
            </div>


            <div className="mt-4 p-4 bg-white  shadow-md">
                <div className="flex justify-between items-center my-2">
                    <button
                        className={`px-4 py-2 rounded ${activeTab > currentMonthIndex ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'
                            }`}
                        onClick={() => setActiveTab(Math.max(currentMonthIndex, activeTab - 1))}
                    >
                        &lt;
                    </button>
                    <h2 className="text-lg font-semibold ">{months[activeTab]} {year}</h2>

                    <button
                        className={`px-4 py-2 rounded ${activeTab < 11 ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'
                            }`}
                        onClick={() => setActiveTab(Math.min(11, activeTab + 1))}
                    >
                        &gt;
                    </button>
                </div>
                <table className="w-full border-collapse">
                    <thead>
                        <tr className="bg-gray-100">
                            {['Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab'].map((day) => (
                                <th key={day} className="py-2 text-center border">{day}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {Array.from({ length: weeks }, (_, week) => (
                            <tr key={week}>
                                {Array.from({ length: 7 }, (_, dayOfWeek) => {
                                    const dayIndex = week * 7 + dayOfWeek;
                                    const day = totalDays[dayIndex];
                                    const dayAvailability = currentMonthData?.data[day];

                                    return (
                                        <td
                                            key={dayIndex}
                                            className={`text-center border ${day && day <= daysInMonth ? 'cursor-pointer hover:bg-gray-200 ' : 'bg-gray-50 '}`}>
                                            {day <= daysInMonth ? (
                                                <div className='relative h-10'>
                                                    <div className='absolute top-1 left-0 ml-1 text-xs '>{day}</div>


                                                    <div className={`absolute inset-0 flex items-center justify-center ${dayAvailability <= 0 ? 'text-red-500 font-bold lg:text-2xl text-xs' : 'text-green-500 font-bold lg:text-2xl text-xs'}`}>{dayAvailability}</div>

                                                </div>
                                            ) : null}
                                        </td>
                                    );
                                })}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    )
}