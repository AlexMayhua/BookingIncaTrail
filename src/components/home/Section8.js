import { useEffect, useState } from 'react';
import { LazyLoadImage } from "react-lazy-load-image-component";
import Link from 'next/link';

export default function PopupWindow() {
  const [isVisible, setIsVisible] = useState(false);

 
  const togglePopup = () => {
    setIsVisible(false);
   
  };

  useEffect(() => {
    const popupClosed = sessionStorage.getItem('popupClosed');

    
    if (!popupClosed) {
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 3000); // 3 segundos

      return () => clearTimeout(timer); // Limpiar el temporizador al desmontar el componente
    }
  }, []);

  return (
    <div>
      {isVisible && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50 lg:p-20 p-0">
          <div className="bg-white rounded shadow sm:w-1/2 xxl:w-1/3 w-2/3 overflow-hidden relative border-4 border-secondary"> 
              
            <Link href="/trekking/classic-inca-trail" ariaLabel='popup inca trail'>
              <LazyLoadImage
                src="/home/inca-trail-2025-popup.webp"
                alt='inca trail panoramic view' 
              />
            </Link>
            <button aria-label='Cerrar ventana emergente' onClick={togglePopup} className="absolute top-2 right-2 bg-primary text-white p-2 rounded-full hover:bg-secondary transition duration-300">
              <span className="relative flex  ">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6 w-7 h-7 relative">
                    <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm-1.72 6.97a.75.75 0 1 0-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 1 0 1.06 1.06L12 13.06l1.72 1.72a.75.75 0 1 0 1.06-1.06L13.06 12l1.72-1.72a.75.75 0 1 0-1.06-1.06L12 10.94l-1.72-1.72Z" clipRule="evenodd" />
                </svg>   
              </span>
            </button>
          </div>
        </div>
      )}
    </div>

  );
}
