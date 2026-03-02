import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import DatePicker from 'react-datepicker';
import { API_URL } from '../../lib/constants';
import Link from 'next/link';
import useMediaQuery from '../../components/useMediaQuery';
import Select from 'react-select';
import countryList from 'react-select-country-list';
import { IconBase } from 'react-icons';
import Rentitems from './rent';


export default function CheckoutPage({ tour, cantidadPeople }) {
    const router = useRouter()
    const isSmallScreen = useMediaQuery("(max-width: 1023px)");


    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    const [showAlert, setShowAlert] = useState(false);

    //const [passengers, setPassengers] = useState([{ id: 1, email: '', phone: '', documentType: '', isValid: false }]);
    const [passengers, setPassengers] = useState(
        Array.from({ length: cantidadPeople }, (_, i) => ({
            id: i + 1,
            email: '',
            phone: '',
            documentType: '',
            isValid: false,
        }))
    );

    const [tourDate, setTourDate] = useState(tomorrow);
    const [isGroup, setIsGroup] = useState(false);
    const [isPrivate, setIsPrivate] = useState(false);
    const countries = countryList().getData();


    //descuentos
    const calculateDiscountedPrice = (enableDiscount, basePrice, discounts, numPassengers) => {

        if (!enableDiscount) return basePrice;

        if (!discounts || discounts.length === 0) return basePrice;


        const sortedDiscounts = discounts.sort((a, b) => a.persons - b.persons);


        let applicableDiscount = 0;
        for (const discount of sortedDiscounts) {
            if (numPassengers >= discount.persons) {
                applicableDiscount = discount.pdiscount;
            } else {
                break;
            }
        }


        return basePrice * (1 - applicableDiscount / 100);
    };


    const [unitPrice, setUnitPrice] = useState(tour.price);
    const [totalPrice, setTotalPrice] = useState(tour.price * cantidadPeople);
    const [appliedDiscount, setAppliedDiscount] = useState(0)


    const recalculatePrices = (numPassengers) => {
        const discountedPrice = calculateDiscountedPrice(tour.enableDiscount, tour.price, tour.ardiscounts, numPassengers);
        setUnitPrice(discountedPrice);
        setTotalPrice(discountedPrice * numPassengers);
        //
        const discountValue = tour.enableDiscount && discountedPrice < tour.price ? ((tour.price - discountedPrice) / tour.price) * 100 : 0;
        setAppliedDiscount(discountValue);
    };


    useEffect(() => {
        recalculatePrices(cantidadPeople);
    }, [cantidadPeople]);

    // Modificar las funciones de agregar/eliminar pasajeros
    const addPassenger = () => {
        const newPassengers = [...passengers, { id: passengers.length + 1, isValid: false }];
        setPassengers(newPassengers);
        recalculatePrices(newPassengers.length);
    };

    const removePassenger = (id) => {
        const newPassengers = passengers.filter(passenger => passenger.id !== id);
        setPassengers(newPassengers);
        recalculatePrices(newPassengers.length);
    };
    //
    const handleGroupChange = () => {
        setIsGroup(!isGroup);
        if (isPrivate) setIsPrivate(false);
    };

    const handlePrivateChange = () => {
        setIsPrivate(!isPrivate);
        if (isGroup) setIsGroup(false);
    };

    const handleInputChange = (id, field, value) => {
        const updatedPassengers = passengers.map(passenger =>
            passenger.id === id ? { ...passenger, [field]: value } : passenger
        );

        // Check if the passenger's form is valid
        const isValid = validatePassenger(updatedPassengers.find(p => p.id === id));
        setPassengers(updatedPassengers.map(passenger =>
            passenger.id === id ? { ...passenger, isValid } : passenger
        ));
    };

    const validatePassenger = (passenger) => {
        // Define los campos requeridos para todos los pasajeros
        const requiredFields = ['firstName', 'gender', 'lastName', 'birthDay', 'birthMonth', 'birthYear', 'country', 'documentNum', 'documentType'];
        // Verifica si todos los campos requeridos están llenos
        const allFieldsFilled = requiredFields.every(field => passenger[field]);
        // Verifica la validez del email si es el primer pasajero
        const emailValid = passenger.id === 1 ? (passenger.email && isValidEmail(passenger.email)) : true;
        const phoneValid = passenger.id === 1 ? (passenger.phone && passenger.phone) : true;
        return allFieldsFilled && emailValid && phoneValid;
    };

    const isValidEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };
    const isValidPhone = (phone) => {
        const phoneRegex = /^\+([1-9]\d{0,2})(?:\s?\d{1,15})$/;
        return phoneRegex.test(phone);
    };
    function isValidNumberInput(event) {
        return /\d/.test(event.key) || event.key === 'Backspace' || event.key === 'ArrowLeft' || event.key === 'ArrowRight';
    }
    function isValidLettersInput(event) {
        return /[a-zA-Z\s]/.test(e.key) || event.key === 'Backspace' || event.key === 'ArrowLeft' || event.key === 'ArrowRight';
    }

    //en tour data se debe enviar, eprecio unitario u original del tour, tambien enviar los valores del descuento, si se ha aplicado ( 3 personas, descuento 40%)
    const handleSubmit = async () => {
        const tourData = {
            slug: tour.slug,
            title: tour.title,
            image: tour.gallery[0].url,
            duration: tour.duration,
            appliedDiscount: tour.enableDiscount ? appliedDiscount : 0 //Nuevo dato para mostrar en la interfaz de mi sitio web.
        }
        const reservationData = {
            tour: tourData,
            date: tourDate,
            serviceType: isGroup ? 'Group' : 'Private',
            totalPay: totalPrice.toFixed(2),
            userData: passengers
        };

        const allFieldsFilled = passengers.every(passenger => {
            // Define los campos requeridos para todos los pasajeros
            const requiredFields = ['firstName', 'gender', 'lastName', 'birthDay', 'birthMonth', 'birthYear', 'country', 'documentNum', 'documentType'];
            // Verifica si todos los campos requeridos están llenos
            for (let field of requiredFields) {
                if (!passenger[field]) {
                    setShowAlert(true);
                    return false;
                }
            }
            // Adicionalmente, verifica el email y el teléfono para el primer pasajero
            if (passenger.id === 1) {
                if (!passenger.email || !passenger.phone || !isValidEmail(passenger.email) || !passenger.phone) {
                    setShowAlert(true);
                    return false;
                }
            }
            return true;
        });

        setShowAlert(!allFieldsFilled);

        if (!allFieldsFilled) {
            return;
        }

        const response = await fetch('/api/reservation', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(reservationData)
        });


        if (response.ok) {
            // Redirect or clear the form 
            const data = await response.json()
            router.push('/book/payment?id=' + data._id)
        } else {
            alert('Error al realizar la reserva');
        }

    };

    return (
        <div className="container mx-auto p-4 lg:px-30 p-5">
            <h1 className="text-2xl font-bold mb-4">{tour.title}</h1>
            <section className="bg-white mb-4 grid lg:grid-cols-3 grid-cols-1  gap-4 shadow-lg shadow-lg rounded-lg lg:p-10 p-5">
                <div className='col-span-2'>
                    <h2 className=" text-[#fbbf00] text-xl font-semibold mb-2">Select a departure date below</h2>

                    {
                        isSmallScreen ? (
                            <div className="border border-[#005249] p-4 mb-4 rounded-lg">
                                <label className="block text-gray-700">Departure Date:</label>
                                <div className='flex flex-row items-center'>
                                    <DatePicker
                                        selected={tourDate}
                                        onChange={(date) => setTourDate(date)}
                                        dateFormat="dd/MM/yyyy"
                                        className="w-full px-4 py-2 border focus:outline-none focus:ring-2 f rounded"
                                        withPortal
                                        readOnly={isSmallScreen ? false : true}
                                        minDate={tomorrow}
                                    />
                                    <span className='absolute mx-40 text-[#005249]'>
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6 h-5 w-5">
                                            <path d="M12.75 12.75a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM7.5 15.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5ZM8.25 17.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM9.75 15.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5ZM10.5 17.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM12 15.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5ZM12.75 17.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM14.25 15.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5ZM15 17.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM16.5 15.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5ZM15 12.75a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM16.5 13.5a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z" />
                                            <path fillRule="evenodd" d="M6.75 2.25A.75.75 0 0 1 7.5 3v1.5h9V3A.75.75 0 0 1 18 3v1.5h.75a3 3 0 0 1 3 3v11.25a3 3 0 0 1-3 3H5.25a3 3 0 0 1-3-3V7.5a3 3 0 0 1 3-3H6V3a.75.75 0 0 1 .75-.75Zm13.5 9a1.5 1.5 0 0 0-1.5-1.5H5.25a1.5 1.5 0 0 0-1.5 1.5v7.5a1.5 1.5 0 0 0 1.5 1.5h13.5a1.5 1.5 0 0 0 1.5-1.5v-7.5Z" clipRule="evenodd" />
                                        </svg>
                                    </span>
                                </div>
                            </div>
                        ) : (
                            <div className="border border-[#005249] p-4 mb-4 rounded-lg">
                                <label className="block text-gray-700">Departure Date:</label>
                                <div className='flex flex-row items-center'>
                                    <DatePicker
                                        selected={tourDate}
                                        onChange={(date) => setTourDate(date)}
                                        dateFormat="dd/MM/yyyy"
                                        className="w-full px-4 py-2 border focus:outline-none focus:ring-2 focus:ring-blue-600 rounded"
                                        minDate={tomorrow}
                                    />
                                    <span className='absolute mx-40 text-[#005249]'>
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6 h-5 w-5">
                                            <path d="M12.75 12.75a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM7.5 15.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5ZM8.25 17.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM9.75 15.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5ZM10.5 17.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM12 15.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5ZM12.75 17.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM14.25 15.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5ZM15 17.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM16.5 15.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5ZM15 12.75a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM16.5 13.5a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z" />
                                            <path fillRule="evenodd" d="M6.75 2.25A.75.75 0 0 1 7.5 3v1.5h9V3A.75.75 0 0 1 18 3v1.5h.75a3 3 0 0 1 3 3v11.25a3 3 0 0 1-3 3H5.25a3 3 0 0 1-3-3V7.5a3 3 0 0 1 3-3H6V3a.75.75 0 0 1 .75-.75Zm13.5 9a1.5 1.5 0 0 0-1.5-1.5H5.25a1.5 1.5 0 0 0-1.5 1.5v7.5a1.5 1.5 0 0 0 1.5 1.5h13.5a1.5 1.5 0 0 0 1.5-1.5v-7.5Z" clipRule="evenodd" />
                                        </svg>
                                    </span>
                                </div>

                            </div>
                        )
                    }


                    <div>
                        <h2 className="text-[#e6c200] text-xl font-semibold mb-2">Do you want a group or private service?</h2>
                        <div className="inline-flex items-center">
                            <label className="relative flex items-center p-3 rounded-full cursor-pointer" htmlFor="groupService"
                                data-ripple-dark="true">
                                <input id="groupService" type="checkbox" onChange={handleGroupChange} checked={isGroup}
                                    className=" before:content[''] peer relative h-5 w-5 cursor-pointer appearance-none rounded-md border border-blue-gray-200 transition-all before:absolute before:top-2/4 before:left-2/4 before:block before:h-12 before:w-12 before:-translate-y-2/4 before:-translate-x-2/4 before:rounded-full before:bg-blue-gray-500 before:opacity-0 before:transition-opacity checked:border-gray-900 checked:bg-[#005249] checked:before:bg-gray-900 hover:before:opacity-10" />
                                <span
                                    className="absolute text-white transition-opacity opacity-0 pointer-events-none top-2/4 left-2/4 -translate-y-2/4 -translate-x-2/4 peer-checked:opacity-100">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor"
                                        stroke="currentColor" strokeWidth="1">
                                        <path fillRule="evenodd"
                                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                            clipRule="evenodd"></path>
                                    </svg>
                                </span>
                            </label>
                            <label className="mt-px font-light text-gray-700 cursor-pointer select-none" htmlFor="groupService">Group Service</label>
                        </div>
                        <div className="inline-flex items-center">
                            <label className="relative flex items-center p-3 rounded-full cursor-pointer" htmlFor="privateService">
                                <input id="privateService" type="checkbox" onChange={handlePrivateChange} checked={isPrivate}
                                    className="before:content[''] peer relative h-5 w-5 cursor-pointer appearance-none rounded-md border border-blue-gray-200 transition-all before:absolute before:top-2/4 before:left-2/4 before:block before:h-12 before:w-12 before:-translate-y-2/4 before:-translate-x-2/4 before:rounded-full before:bg-blue-gray-500 before:opacity-0 before:transition-opacity checked:border-gray-900 checked:bg-[#005249] checked:before:bg-gray-900 hover:before:opacity-10" />
                                <span
                                    className="absolute text-white transition-opacity opacity-0 pointer-events-none top-2/4 left-2/4 -translate-y-2/4 -translate-x-2/4 peer-checked:opacity-100">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor"
                                        stroke="currentColor" strokeWidth="1">
                                        <path fillRule="evenodd"
                                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                            clipRule="evenodd"></path>
                                    </svg>
                                </span>
                            </label>
                            <label className="mt-px font-light text-gray-700 cursor-pointer select-none" htmlFor="privateService">Private Service</label>
                        </div>
                    </div>

                    <div>
                        <h2 className="text-[#fbbf00] text-xl font-semibold mb-2 ">Who's travelling?</h2>

                        {passengers.map((passenger, index) => (
                            <div key={passenger.id} className={`border p-4 mb-4 rounded-lg ${passenger.isValid ? 'border-green-500 bg-green-100' : 'border-[#005249]'}`}>
                                {index >= 1 && (
                                    <>
                                        <div className='flex justify-between my-2'>
                                            <div className='flex items-center justify-start'>
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6 w-5 h-5 text-[#fbbf00]">
                                                    <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z" clipRule="evenodd" />
                                                </svg>
                                                <h4 className='font-semibold mr-2 text-[#005249]'>Traveller {passenger.id}</h4>
                                            </div>
                                            <div className='flex justify-end'>
                                                <button
                                                    onClick={() => removePassenger(passenger.id)}
                                                    className="text-red-500 px-4 py-2 0"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6 w-6 h-6">
                                                        <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm3 10.5a.75.75 0 0 0 0-1.5H9a.75.75 0 0 0 0 1.5h6Z" clipRule="evenodd" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </div>
                                    </>
                                )}

                                <div className='flex flex-col lg:flex-row gap-2'>
                                    <div className="mb-4 w-full lg:w-[27rem]">
                                        <label className="block text-gray-700">Gender:</label>
                                        <select
                                            required
                                            className="rounded-lg px-4 w-full py-2 border focus:outline-none focus:ring-2 focus:ring-[#005249] bg-[#f4f5f7]"
                                            onChange={(e) => handleInputChange(passenger.id, 'gender', e.target.value)}
                                        >
                                            <option value="">Select Gender</option>
                                            <option value="male">Male</option>
                                            <option value="female">Female</option>
                                        </select>
                                    </div>
                                    <div className="mb-4 w-full">
                                        <label className="block text-gray-700">First Name:</label>
                                        <input
                                            type="text"
                                            required
                                            className="rounded-lg w-full px-4 py-2 border focus:outline-none focus:ring-2 focus:ring-[#0d1117] bg-[#FAF6E9] focus:shadow-md focus:shadow-[#0d1117]"
                                            placeholder="First Name*"
                                            onChange={(e) => handleInputChange(passenger.id, 'firstName', e.target.value)}
                                            onKeyPress={(e) => {
                                                if (!/[a-zA-ZñÑ\s]/.test(e.key) && e.key !== 'Backspace' && e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') {
                                                    e.preventDefault();
                                                }
                                            }}
                                        />
                                    </div>
                                    <div className="mb-4 w-full">
                                        <label className="block text-gray-700">Last Name:</label>
                                        <input
                                            type="text"
                                            required
                                            className="rounded-lg w-full px-4 py-2 border focus:outline-none focus:ring-2 focus:ring-[#0d1117] bg-[#FAF6E9]"
                                            placeholder="Last Name*"
                                            onChange={(e) => handleInputChange(passenger.id, 'lastName', e.target.value)}
                                            onKeyPress={(e) => {
                                                if (!/[a-zA-ZñÑ\s]/.test(e.key) && e.key !== 'Backspace' && e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') {
                                                    e.preventDefault();
                                                }
                                            }}
                                        />
                                    </div>
                                </div>

                                <div className='mb-4 lg:flex flex-none gap-2 '>
                                    <div className='w-full'>
                                        <label>Date of birth *</label>
                                        <div className='flex gap-2'>
                                            <select
                                                required
                                                className="rounded-lg px-4 w-full py-2 border focus:outline-none focus:ring-2 focus:ring-[#005249] bg-[#f4f5f7]"
                                                onChange={(e) => handleInputChange(passenger.id, 'birthDay', e.target.value)}
                                            >
                                                <option value="" disabled selected>Day</option>
                                                {Array.from({ length: 31 }, (_, i) => (
                                                    <option key={i + 1} value={i + 1}>{i + 1}</option>
                                                ))}
                                            </select>
                                            <select
                                                required
                                                className="rounded-lg px-4 w-full py-2 border focus:outline-none focus:ring-2 focus:ring-[#005249] bg-[#f4f5f7]"
                                                onChange={(e) => handleInputChange(passenger.id, 'birthMonth', e.target.value)}
                                            >
                                                <option value="" disabled selected>Month</option>
                                                {['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'].map((month, index) => (
                                                    <option key={index} value={index + 1}>{month}</option>
                                                ))}
                                            </select>
                                            <select
                                                required
                                                className="rounded-lg px-4 w-full py-2 border focus:outline-none focus:ring-2 focus:ring-[#005249] bg-[#f4f5f7]"
                                                onChange={(e) => handleInputChange(passenger.id, 'birthYear', e.target.value)}
                                            >
                                                <option value="" disabled selected>Year</option>
                                                {Array.from({ length: 100 }, (_, i) => (
                                                    <option key={i} value={new Date().getFullYear() - i}>{new Date().getFullYear() - i}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                    <div className='w-full'>
                                        <label className="block text-gray-700">Country:</label>
                                        <Select
                                            options={countries}
                                            className="font-normal w-full"
                                            placeholder="Select your country*"
                                            onChange={(selectedOption) => handleInputChange(passenger.id, 'country', selectedOption.label)}
                                        />
                                    </div>
                                </div>



                                <div className="mb-4">
                                    <label className="block text-gray-700">Document</label>
                                    <div className="flex gap-2">
                                        <select onChange={(e) => handleInputChange(passenger.id, 'documentType', e.target.value)}
                                            className="rounded-lg lg:w-96 w-40 px-4 py-2 border focus:outline-none focus:ring-2 focus:ring-[#005249] bg-[#f4f5f7]">


                                            <option value="">Select Document</option>
                                            <option value="PASAPORTE">PASAPORTE</option>
                                            <option value="DNI">DNI</option>
                                            <option value="ID">ID</option>
                                            <option value="CARNET-DE-EXTRANJERIA">CARNET DE EXTRANJERIA</option>
                                        </select>
                                        <input required onChange={(e) => handleInputChange(passenger.id, 'documentNum', e.target.value)} className="rounded-lg w-full px-4 py-2 border focus:outline-none focus:ring-2 focus:ring-[#005249] bg-[#f4f5f7]" name="documentNum" placeholder="Document Number*" />
                                    </div>
                                </div>

                                {index === 0 && (
                                    <>
                                        <h4 className='font-semibold my-4'>Contact details</h4>
                                        <div className='lg:flex flex-none gap-2'>
                                            <div className="mb-4 w-full">
                                                <label className="block text-gray-700">E-mail:</label>
                                                <input
                                                    required
                                                    type="email"
                                                    className="rounded-lg w-full px-4 py-2 border focus:outline-none focus:ring-2 focus:ring-[#005249] bg-[#f4f5f7]"
                                                    placeholder="Email*"
                                                    onChange={(e) => handleInputChange(passenger.id, 'email', e.target.value)}
                                                />
                                            </div>
                                            <div className="mb-4 w-full">
                                                <label className="block text-gray-700">Phone Number:</label>
                                                <input
                                                    required
                                                    type="tel"
                                                    className="rounded-lg w-full px-4 py-2 border focus:outline-none focus:ring-2 focus:ring-[#005249] bg-[#f4f5f7]"
                                                    placeholder="Ej: +999 999999999999"
                                                    onChange={(e) => handleInputChange(passenger.id, 'phone', e.target.value)}
                                                    onKeyPress={(e) => {
                                                        if (!/\d|\s|\+/.test(e.key) && e.key !== 'Backspace' && e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') {
                                                            e.preventDefault();
                                                        }
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>
                        ))}

                        <div className='flex justify-start'>
                            <button
                                onClick={addPassenger}
                                className="mt-4 bg-secondary text-white px-4 py-2 hover:bg-primary rounded-lg"
                            >
                                Add Traveller
                            </button>
                        </div>
                    </div>

                </div>
                <div className='col-span-1'>

                    {/*COLUMA PARA VER LOS PRECION DE FORMA DINAMICA*/}
                    <div className="lg:col-span-2 col-span-6 lg:order-none order-first sticky top-14 z-30 bg-gray-200  rounded p-3 ">
                        {/* Tour Image */}
                        <div className="relative">
                            <img
                                src={tour.gallery[0].url}
                                alt={tour.gallery[0].alt}
                                className="rounded-lg w-full h-48 object-cover mb-4"
                            />
                            {tour.enableDiscount && (
                                <span className="absolute top-3 left-3 bg-green-500 text-white text-xs font-semibold px-2 py-1 rounded-lg shadow-md">
                                    Discount Available
                                </span>
                            )}
                        </div>

                        {/* Discount Details */}
                        {tour.enableDiscount && tour.price.toFixed(2) !== unitPrice.toFixed(2) && (
                            <div className="bg-green-50 border border-green-200 p-4 rounded-lg mb-4">
                                <h6 className="text-green-600 font-semibold text-lg mb-1">
                                    Discounts Applied!
                                </h6>
                                <p className="text-sm text-gray-700">
                                    <span className="font-semibold">Base Price:</span> ${tour.price.toFixed(2)} <br />
                                    <span className="font-semibold">Discounted Price:</span> ${unitPrice.toFixed(2)} per person
                                </p>
                            </div>
                        )}

                        {/* Price Breakdown */}
                        <div className="bg-gray-50 border border-gray-200 p-4 rounded-lg mb-4">
                            <h6 className="text-gray-800 text-lg font-medium">
                                {passengers.length} Traveller(s) x ${unitPrice.toFixed(2)}
                            </h6>
                            <h6 className="text-gray-900 text-2xl font-bold mt-2">
                                Total: ${totalPrice.toFixed(2)}
                            </h6>
                            <p className="text-xs text-gray-500 mt-1">
                                Taxes and reservation fees not included.
                            </p>
                        </div>

                        {/* renta de items
                        <div className='flex-none'>
                            
                            <span>VER ITEMS</span>
                            {/*BOTON PARA REALIZAR LA RENTA DE DIFERENTES ACCESORIOS PARA REALIZAR TREKINK O MEJORA DE ALGUNOS SERVICIOS*
                            <button> RENT ITEMS</button>
                            <Rentitems/>
                        </div>*/}



                        <div>
                            {showAlert && (
                                <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50 p-2">
                                    <div className="bg-white p-6 rounded shadow-lg text-center">
                                        <h2 className="text-xl font-bold mb-4">Incomplete Information</h2>
                                        <p className="mb-4 border-b-2">Please complete all passenger fields with valid information.
                                            <br />Make sure that the e-mail address is correct.</p>
                                        <button
                                            onClick={() => setShowAlert(false)}
                                            className="bg-blue text-white px-4 py-2 hover:bg-dark rounded"
                                        >
                                            Close
                                        </button>
                                    </div>
                                </div>
                            )}
                            <button
                                onClick={handleSubmit}
                                className="mt-4 bg-blue text-white px-4 py-2 hover:bg-dark rounded w-full"
                            >
                                Continue to Payment
                            </button>
                        </div>
                    </div>

                </div>


            </section>
        </div>
    );
}

export async function getServerSideProps(context) {
    const { query } = context;
    const { tour, cantidadPeople } = query;

    // Redirect to homepage if no tour slug is provided
    if (!tour) {
        return {
            redirect: {
                destination: '/',
                permanent: false,
            },
        };
    }

    const lang = context.locale;

    const res = await fetch(`${API_URL}/api/trip/${tour}?locale=${lang}`);
    const resJSON = await res.json();

    // Redirect to homepage if the tour doesn't exist or API returns an error
    if (resJSON.err || !resJSON.gallery || !resJSON.price) {
        return {
            redirect: {
                destination: '/',
                permanent: false,
            },
        };
    }

    return {
        props: {
            tour: resJSON,
            cantidadPeople: parseInt(cantidadPeople) || 1,
        },
    };
}
