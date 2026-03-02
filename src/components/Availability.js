'use client';

import { useState, useEffect } from 'react';

const Calendar = ({ data, updatedAt, title, messages, tourDays, idTour, language }) => {
    const [currentDate, setCurrentDate] = useState(null);

    // Inicializar fecha al montar
    useEffect(() => {
        setCurrentDate(new Date());
    }, []);

    if (!currentDate) return null;

    const currentYear = new Date().getFullYear();

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = new Date(year, month, 1).getDay();

    const availabilityData = data.reduce((acc, monthData) => {
        Object.entries(monthData).forEach(([date, availability]) => {
            acc[date] = availability;
        });
        return acc;
    }, {});

    const days = [];
    for (let i = 1; i <= daysInMonth; i++) {
        const date = new Date(year, month, i).toISOString().split('T')[0];
        days.push({ day: i, date, availability: availabilityData[date] || 0 });
    }

    const handleOpenIframe = (date) => {
        const startDate = `${date}T17:00:00.000Z`;
        const end = new Date(date);
        end.setDate(end.getDate() + tourDays);
        const endDate = `${end.toISOString().split('T')[0]}T17:00:00.000Z`;

        const url = `https://www.wetravel.com/checkout_embed?uuid=${idTour}&date=${encodeURIComponent(
            JSON.stringify({ startDate, endDate })
        )}&source=widget_calendar`;

        // Abrir en nueva ventana o pestaña
        window.open(url, '_blank');
    };

    const twoDaysFromNow = new Date();
    twoDaysFromNow.setDate(new Date().getDate() + 2);

    return (
        <div className="p-4">
            <h3 className="text-xl font-bold text-center p-0 m-0">
                {/* {currentDate.toLocaleString('default', { month: 'long' })} */} {year}
            </h3>
            <div className="flex justify-between items-center p-4 bg-white rounded-lg">
                <button onClick={() => setCurrentDate(new Date(currentDate.setMonth(month - 1)))}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 text-primary hover:text-secondary" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m18.75 4.5-7.5 7.5 7.5 7.5m-6-15L5.25 12l7.5 7.5" />
                    </svg>
                </button>

                <select
                    value={month}
                    onChange={(e) => {
                        const newDate = new Date(currentDate);
                        newDate.setMonth(parseInt(e.target.value));
                        setCurrentDate(newDate);
                    }}
                    className="px-6 py-3 border-1 border-green-500 rounded bg-yellow-100 text-lg font-medium text-primary focus:ring-2 capitalize focus:ring-secondary transition-all duration-300 shadow-md shadow-secondary"
                >
                    {Array.from({ length: 12 }, (_, i) => (
                        <option key={i} value={i}>
                            {new Date(year, i).toLocaleString(language === 'en' ? 'en-US' : 'es-ES', { month: 'long' })}
                        </option>
                    ))}
                </select>

                <button onClick={() => setCurrentDate(new Date(currentDate.setMonth(month + 1)))}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 text-primary hover:text-secondary" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m5.25 4.5 7.5 7.5-7.5 7.5m6-15 7.5 7.5-7.5 7.5" />
                    </svg>
                </button>
            </div>            

            <div className="grid grid-cols-7 gap-1 text-center font-bold text-gray-700 my-1">
                {(language === 'en' ? ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] : ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']).map((day) => (
                    <div key={day} className="py-1 bg-gray-200 rounded-md">{day}</div>
                ))}
            </div>

            <div className="grid grid-cols-7 gap-0.5">
                {Array(firstDayOfMonth).fill(null).map((_, index) => (
                    <div key={`empty-${index}`} className="p-2"></div>
                ))}

                {days.map(({ day, date, availability }) => (
                    <bottom
                        key={date}
                        onClick={() => {
                            const phoneNumber = '51970811976';
                            let message = "";
                            if (availability === 0 && year===currentYear || month === 1 || new Date(year, month, day) < twoDaysFromNow) {
                                message = `${messages[2].message_red_start} ${title} - ${date}${messages[2].message_red_end}`;
                                const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
                                window.open(url, '_blank');
                            } else if (availability >= 1 && availability <= 5) {
                                message = `${messages[1].message_orange_start} ${title} - ${date}${messages[1].message_orange_end}`;
                                const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
                                window.open(url, '_blank');
                            } else {
                                handleOpenIframe(date);
                            }
                        }}
                        className={`border p-2 rounded text-center flex flex-col items-center justify-start relative cursor-pointer
                            ${availability === 0 && year===currentYear || month === 1 || new Date(year, month, day) < twoDaysFromNow ? 'bg-red-50 border-gray-300' :
                            availability >= 1 && availability <= 5 ?  'bg-orange-50 border-orange-300 hover:shadow-md hover:scale-100 transition-all duration-200' :
                            'bg-green-50 border-green-300 hover:shadow-md hover:scale-100 transition-all duration-200'}`}
                    >
                        <div className="text-xs text-gray-400 absolute top-1 right-1">{day}</div>
                        {availability !== undefined && (
                            <div className={`mt-3 px-2 py-1 text-sm font-semibold rounded ${availability === 0 && year===currentYear  || month === 1 /* || new Date(year, month, day) < twoDaysFromNow */ ? 'text-red-400' :
                                availability >= 1 && availability <= 5 ? 'text-white bg-orange-400' :
                                'text-white bg-green-400'}`}
                            >   
                                {year===currentYear  || month === 1 ? availability : Math.floor(Math.random() * (400 - 200 + 1)) + 200}
                            </div>
                        )}
                    </bottom>
                ))}
            </div>

            <p className="text-center text-primary font-extrabold p-0 pt-2">{language === 'en' ? "Select your date and book now." : "Selecciona tu fecha y reserva ahora."}</p>
            
            <span className="block text-center text-sm text-gray-500 font-bold p-0">
                {language === 'en' ? "Last update:" : "Última actualización:"} {new Date(updatedAt).toLocaleDateString(language === 'en' ? 'en-US' : 'es-ES', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                })}
            </span>
        </div>
    );
};

export default Calendar;