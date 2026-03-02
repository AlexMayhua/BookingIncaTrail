import React, { useState } from "react";
import Link from "next/link";

const WhatsAppChat = () => {
    // Estado para controlar la visibilidad de la ventana de chat
    const [showChat, setShowChat] = useState(false);

    return (
        <div className="relative w-full">
            {/* Botón principal de WhatsApp */}
            <div className="fixed bottom-2 right-4">
                <button onClick={() => setShowChat(!showChat)} className="whatsapp-button group">
                    <img
                        src="/assets/whatsapp.svg"
                        alt="WhatsApp"
                        title="WhatsApp"
                        className="h-16 animate-bounce"
                    />
                </button>
            </div>
            {/* Chat emergente */}
            {showChat && (
                <div className="fixed lg:bottom-20 bottom-16 lg:right-8 right-4 w-72 bg-white rounded shadow-lg border border-gray-200 overflow-hidden z-30">
                    {/* Encabezado del chat */}
                    <div className="bg-green-600 text-white p-3 flex items-center">
                        <img
                            src="/assets/whatsapp.svg"
                            alt="Contact Profile"
                            className="w-10 h-10 rounded-full mr-3"
                        />
                        <div>
                            <h3 className="font-semibold ">Booking Inca Trail</h3>
                            <p className="text-xs opacity-80 text-secondary"><strong>Typically replies within a day</strong></p>
                        </div>
                        <button
                            onClick={() => setShowChat(false)}
                            className=" absolute ml-auto text-white opacity-80 hover:opacity-100 top-2 right-2"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6 w-7 h-7">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
                            </svg>

                        </button>
                    </div>

                    {/* Cuerpo del mensaje */}
                    <div className="p-3 bg-gray-100">
                        <div className="bg-white p-2 rounded-lg shadow-sm mb-2">
                            <p className="text-sm">Hi there 👋</p>
                            <p className="text-sm">How can I help you?</p>
                            <span className="text-xs text-gray-400 float-right">Now</span>
                        </div>
                    </div>

                    {/* Botón de chat en WhatsApp */}
                    <div className="p-3">
                        <Link
                            href="https://api.whatsapp.com/send/?phone=51970811976&text&type=phone_number&app_absent"
                            className="flex items-center justify-center bg-green-600 text-white py-2 rounded shadow-md hover:bg-green-500 mb-2 text-xs"
                            target="_blank">

                            <img
                                src="/assets/avatarHwhatsapp.webp"
                                alt="WhatsApp"
                                className="w-10 h-10 mr-2 rounded-full"
                            />Chat on WhatsApp
                                                        
                        </Link>
                        <Link
                            href="https://api.whatsapp.com/send/?phone=51970811976&text&type=phone_number&app_absent"
                            className="flex items-center justify-center bg-green-600 text-white py-2 rounded shadow-md hover:bg-green-500 text-xs"
                            target="_blank">

                            <img
                                src="/assets/avatarMwhatsapp.webp"
                                alt="WhatsApp"
                                className="w-10 h-10 mr-2 rounded-full"
                            />Chat on WhatsApp
                                                        
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
};

export default WhatsAppChat;

