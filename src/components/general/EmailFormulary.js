import React, { useState } from "react"
import en from '../../lang/en/contact'
import es from '../../lang/es/contact'
import { useRouter } from "next/router";
import Select from 'react-select';
import countryList from 'react-select-country-list';
import ReCAPTCHA from "react-google-recaptcha";
import { BRAND } from '../../lib/brandConfig';

function EmailFormulary({ tourName, days }) {

    const router = useRouter();
    const { locale } = router;
    const t = locale === 'en' ? en : es;

    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [tour, setTour] = useState("");
    const [message, setMessage] = useState("");
    const [country, setCountry] = useState("");
    const [travelers, setTravelers] = useState("");
    const [hotelQuality, setHotelQuality] = useState("");
    const [submitted, setSubmitted] = useState(false);

    const [recaptchaToken, setRecaptchaToken] = useState(null);
    const countries = countryList().getData();

    // Manejar la selección de hotel
    const handleHotelQualityChange = (e) => {
    setHotelQuality(e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Validación de reCAPTCHA
        if (!recaptchaToken) {
        alert("Por favor, completa el reCAPTCHA.");
        return;
        }

        // Validación de email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
        alert("Por favor, introduce un correo electrónico válido.");
        return;
        }

        // Preparar los datos para enviar
        const data = {
        name,
        email,
        country,
        travelers,
        hotelQuality,
        message,
        tour,
        };

        // Enviar datos a la API
        fetch("/api/contact", {
        method: "POST",
        headers: {
            "Accept": "application/json, text/plain, */*",
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
        }).then((res) => {
        if (res.status === 200) {
            setSubmitted(true);
            // Limpiar los campos del formulario
            setName("");
            setEmail("");
            setTour("");
            setMessage("");
            setCountry("");
            setTravelers("");
            setHotelQuality("");
        }
        });
    };

    return (
        <section className="text-gray-600 body-font relative">
            <div className="container py-10 mx-auto">
                <div className="lg:w-full p-5  bg-white  md:ml-auto w-full md:py-8 mt-8 md:mt-0 shadow">
                    
                    <h1 className="text-2xl font-bold text-center">{t.title}</h1>
                    <p className="leading-relaxed mb-5 text-gray-600">{t.description}</p>
                    <div className="flex-none lg:flex md:ml-auto w-full md:py-8 mt-8 md:mt-0 gap-6">
                        <div className="lg:w-1/2 w-full">
                            <form onSubmit={handleSubmit} className="">
                                
                                <h2 className="text-lg mb-10 title-font text-center">
                                Your personal information
                                </h2>
                                <div className="lg:flex gap-4">
                                <div className="mb-4 lg:w-1/2 w-full">
                                    <label
                                    htmlFor="name"
                                    className="block text-sm text-gray-600"
                                    >
                                    {t.name}
                                    </label>
                                    <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    className="rounded w-full px-4 py-2 border focus:outline-none focus:ring-2 focus:ring-[#005249] bg-[#f4f5f7] focus:shadow-md focus:shadow-[#005249]"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                    />
                                </div>
                                <div className="mb-4 lg:w-1/2 w-full">
                                    <label
                                    htmlFor="email"
                                    className="block text-sm text-gray-600"
                                    >
                                    {t.email}
                                    </label>
                                    <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    className="w-full bg-white rounded border border-gray-300 focus:border-primary focus:ring-1 focus:ring-primary text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    />
                                </div>
                                </div>

                                <h2 className="text-lg mb-10 title-font text-center">
                                About the tour you are interested in
                                </h2>
                                <div className="lg:flex gap-4">
                                <div className="mb-4 lg:w-1/2 w-full">
                                    <label
                                    htmlFor="travelers"
                                    className="block text-sm text-gray-600"
                                    >
                                    How many of you are travelling?
                                    </label>
                                    <input
                                    type="number"
                                    id="travelers"
                                    className="w-full bg-white rounded border border-gray-300 focus:border-primary focus:ring-1 focus:ring-primary text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                                    placeholder="N° de Travellers"
                                    value={travelers}
                                    onChange={(e) => setTravelers(e.target.value)}
                                    min="1"
                                    required
                                    />
                                </div>
                                <div className="mb-4 lg:w-1/2 w-full">
                                    <label
                                    htmlFor="country"
                                    className="block text-sm text-gray-600"
                                    >
                                    Country
                                    </label>
                                    <Select
                                    options={countries}
                                    className="font-normal w-full"
                                    placeholder="Select your country*"
                                    onChange={(selectedOption) =>
                                        setCountry(selectedOption.label)
                                    }
                                    />
                                </div>
                                </div>

                                <div className="relative mb-4">
                                <label htmlFor="tour" className="leading-7 text-sm text-gray-600">
                                    {t.tour}
                                </label>
                                <input
                                    type="text"
                                    id="tour"
                                    name="tour"
                                    className="w-full bg-white rounded border border-gray-300 focus:border-primary focus:ring-1 focus:ring-primary text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                                    value={tour}
                                    onChange={(e) => setTour(e.target.value)}
                                    required
                                />
                                </div>

                                <div className="relative mb-4">
                                <label htmlFor="hotel" className="block text-sm text-gray-600">
                                    Select the hotel quality you want
                                </label>
                                <select
                                    id="hotel"
                                    className="w-full bg-white rounded border border-gray-300 focus:border-primary focus:ring-1 focus:ring-primary py-2 px-3 leading-8"
                                    value={hotelQuality}
                                    onChange={handleHotelQualityChange}
                                    required
                                >
                                    <option value="without hotel">Select hotel quality</option>
                                    <option value="best-value">Best Value</option>
                                    <option value="superior">Superior</option>
                                    <option value="luxury">Luxury</option>
                                </select>
                                </div>

                                <div className="relative mb-4">
                                <label
                                    htmlFor="message"
                                    className="leading-7 text-sm text-gray-600"
                                >
                                    Could you please let us know if you have any food preferences,
                                    dietary restrictions or allergies?
                                </label>
                                <textarea
                                    id="message"
                                    name="message"
                                    className="w-full bg-white rounded border border-gray-300 focus:border-primary focus:ring-1 focus:ring-primary h-32 text-base outline-none text-gray-700 py-1 px-3 resize-none leading-6 transition-colors duration-200 ease-in-out"
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    required
                                ></textarea>
                                <p className="text-xs">This will help us to better organize the tour and adapt the meals to your needs.</p>
                                <span className="icon-[twemoji--flag-for-flag-french-guiana]"></span>
                                </div>
                                    
                               
                                
                            </form>
                            <div className="flex justify-center">
                                    <ReCAPTCHA
                                        sitekey="6LdP-BYqAAAAABjwvBwSlkGY3265CH2uzwLqkerc"
                                        onChange={(token) => setRecaptchaToken(token)}
                                    />
                                </div>
                                
                            <div className="flex flex-col items-center justify-center px-5">
                                
                                

                                <button
                                    className="mt-4 text-white bg-primary border-0 py-2 px-6 focus:outline-none hover:bg-secondary rounded text-lg"
                                    type="submit"
                                    onClick={handleSubmit}
                                >
                                    {t.btn_send}
                                </button>
                                <p className="text-xs text-gray-500 mt-3 text-center">{t.privacy}</p>
                            </div>
                        </div>
                        <div className="lg:w-1/2 w-full">
                            <h2 className="text-lg mb-10 title-font text-center">Our location</h2>
                            <div className="w-full bg-white rounded overflow-hidden sm:mr-10    justify-start relative">
                                
                                <div className="shadow rounded">
                                    <iframe
                                        width="100%"
                                        height="100%"
                                        className="h-2xl shadow"
                                        frameBorder="0"
                                        title="map"
                                        marginHeight="0"
                                        marginWidth="0"
                                        scrolling="no"
                                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3879.2704282072555!2d-71.98792588816477!3d-13.518988671004552!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x916dd7137eafb33f%3A0xdc9bc9abc16f5912!2sLife%20Expeditions%20-%20Machu%20Picchu%20Trips!5e0!3m2!1ses-419!2spe!4v1724709545876!5m2!1ses-419!2spe"
                                        style={{ filter: " contrast(0.9) opacity(1)" }}
                                    ></iframe>
                                </div>
                                
                                <div className="bg-white relative flex flex-wrap py-6">
                                    <div className="lg:w-1/2 px-6">
                                        <h2 className="title-font font-semibold text-gray-900 tracking-widest text-xs">{t.address}</h2>
                                        <p className="mt-1">C.Nueva Alta 470, Cusco 08000</p>
                                    </div>
                                    <div className="lg:w-1/2 px-6 mt-4 lg:mt-0">
                                        <h2 className="title-font font-semibold text-gray-900 tracking-widest text-xs">{t.email}</h2>
                                        <a href={`mailto:${BRAND.contactEmail}`} className="flex text-lg hover:text-[#fabf02]">                                                
                                                <span className="truncate">{BRAND.contactEmail}</span>
                                        </a>
                                        <h2 className="title-font font-semibold text-gray-900 tracking-widest text-xs mt-4">{t.cell}</h2>
                                        <a href={`tel:${BRAND.contactPhone}`} className="flex text-lg hover:text-[#fabf02]">                                
                                                <span className="truncate">{BRAND.contactPhone}</span>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>                   

                </div>
            </div>
        </section>
    );
}

export default EmailFormulary

