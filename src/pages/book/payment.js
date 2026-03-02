import { useRouter } from 'next/router';
import { useState } from 'react';
import { PayPalButton } from 'react-paypal-button-v2';
import { API_URL, PAYPAL_CLIENT_ID } from '../../lib/constants';

export default function PaymentPage({ reservation }) {
  const router = useRouter();

  const [paymentPercentage, setPaymentPercentage] = useState(1);
  const [cuponCode, setCuponCode] = useState('');
  const [mensajeCupon, setMensajeCupon] = useState('');
  const [cuponValido, setCuponValido] = useState(false);
  const [descuento, setDescuento] = useState(0);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [hasCoupon, setHasCoupon] = useState(false);

  const validarCupon = async () => {
    try {
      const response = await fetch(`${API_URL}/api/admin/coupons/validate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ codigo: cuponCode }),
      });

      const data = await response.json();

      if (response.ok) {
        setMensajeCupon('Valid Coupon');
        setCuponValido(true);
        setDescuento(data.descuento);
        setIsPopupOpen(true); // Abrir el popup cuando el cupón es válido
      } else {
        setMensajeCupon('Invalid Coupon');
        setCuponValido(false);
        setDescuento(0);
      }
    } catch (error) {
      console.error('Error al validar el cupón:', error);
      setMensajeCupon('Error al validar el cupón');
      setCuponValido(false);
      setDescuento(0);
    }
  };

  const calculatePaymentAmount = () => {
    return reservation.totalPay * paymentPercentage;
  };

  const calcularPrecioFinal = () => {
    let precioBase = reservation.totalPay;
    if (descuento > 0) {
      precioBase = precioBase * (1 - descuento / 100);
    }
    return precioBase;
  };

  const calcularPagoActual = () => {
    return calcularPrecioFinal() * paymentPercentage;
  };

  const calcularSaldoPendiente = () => {
    return calcularPrecioFinal() - calcularPagoActual();
  };

  const calcularDescuento = () =>{
    return reservation.totalPay - calcularPrecioFinal();
  };

  const handlePaymentSuccess = async () => {
    const response = await fetch(`${API_URL}/api/reservation/payment?id=${reservation._id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ balance: { balance: calcularSaldoPendiente().toFixed(2), payment: calcularPagoActual().toFixed(2)}, coupons: { code: cuponCode, discount: descuento } }),
    });

    if (response.ok) {
      const data = await response.json();

      fetch(`${API_URL}/api/email-confirmation?id=` + data._id);

      router.push(`/book/confirmation?id=${data._id}`);
    } else {
      // Error al realizar la reserva
    }
  };

  const handlePaymentError = (err) => {
    console.error('Ocurrió un error al procesar el pago:', err);
  };

  const handlePaymentCancel = (data) => {
    // Pago cancelado por el usuario
  };

  
  return (
    <>
      <h1 className="text-center text-2xl font-bold my-4">Details of the reserve</h1>
      <div className="max-w-md mx-auto bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <div>
          <img
            src={reservation.tour.image}
            alt={reservation.tour.title}
            className="w-full h-50 object-cover rounded shadow mb-4"
          />
          <div className='text-center mb-5'>
            <h2 className="text-2xl font-semibold text-gray-800 mb-2 text-primary">{reservation.tour.title}</h2>
            {descuento > 0 ? (
              <div className='flex flex-col text-center text-2xl'>
                <span className="ml-2 line-through text-gray-500 text-center"> PRICE:$ {reservation.totalPay.toFixed(2)}</span>
                <span className="ml-2 text-green-600 text-center">NEW PRICE: $ {calcularPrecioFinal().toFixed(2)}</span>
              </div>
            ) : (
              <span className="ml-2 text-2xl">PRICE:$ {reservation.totalPay.toFixed(2)}</span>
            )}

          </div>
          
          <div className="grid grid-cols-1 gap-4 text-gray-700">
            <div className="flex items-center text-lg">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-yellow-500 mr-2">
                <path fillRule="evenodd" d="M5.625 1.5c-1.036 0-1.875.84-1.875 1.875v17.25c0 1.035.84 1.875 1.875 1.875h12.75c1.035 0 1.875-.84 1.875-1.875V12.75A3.75 3.75 0 0 0 16.5 9h-1.875a1.875 1.875 0 0 1-1.875-1.875V5.25A3.75 3.75 0 0 0 9 1.5H5.625ZM7.5 15a.75.75 0 0 1 .75-.75h7.5a.75.75 0 0 1 0 1.5h-7.5A.75.75 0 0 1 7.5 15Zm.75 2.25a.75.75 0 0 0 0 1.5H12a.75.75 0 0 0 0-1.5H8.25Z" clipRule="evenodd" />
                <path d="M12.971 1.816A5.23 5.23 0 0 1 14.25 5.25v1.875c0 .207.168.375.375.375H16.5a5.23 5.23 0 0 1 3.434 1.279 9.768 9.768 0 0 0-6.963-6.963Z" />
              </svg>
              <span className="font-medium">Reservation Date:</span>
              <span className="ml-2 text-gray-800">{new Date(reservation.date).toLocaleDateString()}</span>
            </div>

            <div className="flex items-center text-lg">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-yellow-500 mr-2">
                <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z" clipRule="evenodd" />
              </svg>
              <span className="font-medium">Contact Traveller:</span>
              <span className="ml-2 text-gray-800">{reservation.userData[0].firstName} {reservation.userData[0].lastName}</span>
            </div>
            <div className="flex items-center text-lg">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-yellow-500 mr-2">
                <path d="M1.5 8.67v8.58a3 3 0 0 0 3 3h15a3 3 0 0 0 3-3V8.67l-8.928 5.493a3 3 0 0 1-3.144 0L1.5 8.67Z" />
                <path d="M22.5 6.908V6.75a3 3 0 0 0-3-3h-15a3 3 0 0 0-3 3v.158l9.714 5.978a1.5 1.5 0 0 0 1.572 0L22.5 6.908Z" />
              </svg>
              <span className="font-medium">E-mail:</span>
              <span className="ml-2 text-gray-800">{reservation.userData[0].email}</span>
            </div>
          </div>
        </div>

        <div className='pt-5  flex flex-row font-semibold text-lg items-center'>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-2 w-6 h-6 text-[#fbbf00]">
            <path d="M10.464 8.746c.227-.18.497-.311.786-.394v2.795a2.252 2.252 0 0 1-.786-.393c-.394-.313-.546-.681-.546-1.004 0-.323.152-.691.546-1.004ZM12.75 15.662v-2.824c.347.085.664.228.921.421.427.32.579.686.579.991 0 .305-.152.671-.579.991a2.534 2.534 0 0 1-.921.42Z" />
            <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM12.75 6a.75.75 0 0 0-1.5 0v.816a3.836 3.836 0 0 0-1.72.756c-.712.566-1.112 1.35-1.112 2.178 0 .829.4 1.612 1.113 2.178.502.4 1.102.647 1.719.756v2.978a2.536 2.536 0 0 1-.921-.421l-.879-.66a.75.75 0 0 0-.9 1.2l.879.66c.533.4 1.169.645 1.821.75V18a.75.75 0 0 0 1.5 0v-.81a4.124 4.124 0 0 0 1.821-.749c.745-.559 1.179-1.344 1.179-2.191 0-.847-.434-1.632-1.179-2.191a4.122 4.122 0 0 0-1.821-.75V8.354c.29.082.559.213.786.393l.415.33a.75.75 0 0 0 .933-1.175l-.415-.33a3.836 3.836 0 0 0-1.719-.755V6Z" clipRule="evenodd" />
          </svg>
          {descuento > 0 ? (
            <div className='flex flex-col sm:flex-row'>
            <span className="ml-2 text-green-600">Pay now: $ {calcularPagoActual().toFixed(2)}</span>
          </div>
          ) : (
            <span className="ml-2">Pay now:$ {calcularPagoActual().toFixed(2)}</span>
          )}
        </div>
        {
          /*<div>
            <h4>Pagar ahora: $ {calcularPagoActual().toFixed(2)}</h4>
          </div>*/
        }

        {/* Coupon question */}
        <div className="mt-4">
          <h2 className="text-lg font-semibold mb-2">Do you have a coupon code?</h2>
          <div className="flex items-center mb-4 text-gray-500">
            <input
              type="radio"
              id="yes"
              name="hasCoupon"
              checked={hasCoupon}
              onChange={() => setHasCoupon(true)}
              className="mr-2 cursor-pointer"
            />
            <label htmlFor="yes" className="mr-4">Yes</label>
            <input
              type="radio"
              id="no"
              name="hasCoupon"
              checked={!hasCoupon}
              onChange={() => setHasCoupon(false)}
              className="mr-2 cursor-pointer"
            />
            <label htmlFor="no">No</label>
          </div>
          {hasCoupon && (
            <div>
              <h2 className="text-lg font-semibold mb-2">Coupon code</h2>
              <div className="flex items-center">
                <input
                  type="text"
                  className="border rounded-l px-3 py-2 w-full"
                  placeholder="Enter coupon code"
                  value={cuponCode}
                  onChange={(e) => setCuponCode(e.target.value)}
                />
                <button
                  className="bg-[#005249] text-white px-4 py-2 rounded-r"
                  onClick={validarCupon}
                >
                  Validate
                </button>
              </div>
              {mensajeCupon && (
                <p className={`mt-2 ${cuponValido ? 'text-center text-green-600' : 'text-center text-red-600'}`}>
                  {descuento > 0? `${mensajeCupon} ${descuento} % ( - $ ${calcularDescuento().toFixed(2)})` : mensajeCupon}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Popup */}
        {isPopupOpen && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-4 rounded shadow-lg text-center">
              <h2 className="text-lg font-semibold mb-4 ">Valid Coupon</h2>
              <div className='flex justify-center text-green-600'>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-5 h-7 w-7">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.182 15.182a4.5 4.5 0 0 1-6.364 0M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75Zm-.375 0h.008v.015h-.008V9.75Zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75Zm-.375 0h.008v.015h-.008V9.75Z" />
                </svg>
              </div>
              <p className='text-green-600'>{descuento} % Discount (- ${calcularDescuento().toFixed(2)})</p>
              <p>New Price: $ {calcularPrecioFinal().toFixed(2)}</p>

              <button
                onClick={() => setIsPopupOpen(false)}
                className="mt-4 bg-primary text-white px-4 py-2 rounded"
              >
                Continue to
              </button>
            </div>
          </div>
        )}

        <div className='flex gap-4 my-4 '>
          <button
            onClick={() => setPaymentPercentage(0.3)}
            className={` rounded w-full py-4 ${paymentPercentage === 0.3 ? 'bg-primary text-white' : 'bg-gray-200 text-black'}`}
          >
            Pay 30%
          </button>
          <button
            onClick={() => setPaymentPercentage(1)}
            className={` rounded w-full py-4 ${paymentPercentage === 1 ? 'bg-primary text-white' : 'bg-gray-200 text-black'}`}
          >
            Pay 100%
          </button>
        </div>
        {/*
          
          <button
              onClick={() => handlePaymentSuccess()}
              className={` rounded w-full py-4`}
            >
              Pagar Test
          </button>
          
       */}
        <PayPalButton
          amount={calcularPagoActual()} // Debes reemplazar con el monto total de la reserva
          onSuccess={handlePaymentSuccess}
          onError={handlePaymentError}
          onCancel={handlePaymentCancel}
          options={{
            clientId: PAYPAL_CLIENT_ID, // Reemplaza con tu clientId de PayPal
          }}
          className="mt-4"
        />
      </div>
    </>
  );
}

export async function getServerSideProps(context) {
  const { query } = context;
  const { id } = query;
  const res = await fetch(`${API_URL}/api/reservation?id=${id}`, { method: 'GET' });
  const data = await res.json();

  return {
    props: {
      reservation: data || 'No se seleccionó ningún tour',
    },
  };
}
