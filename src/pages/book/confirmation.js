import { API_URL } from "../../lib/constants";
import Link from "next/link";
export default function ConfirmationPage({ reservation }) {
  return (
    <>
      <div className="mt-10 max-w-md mx-auto px-2 ">
        <div className=" bg-white shadow rounded overflow-hidden">

          <div className="bg-gradient-to-r from-primary to-secondary p-6 text-center">
            <h1 className="text-3xl md:text-4xl font-extrabold text-white">
              Reservation Confirmation
            </h1>
            <p className="text-white text-lg md:text-xl mt-2">
              Your reservation has been successfully completed.
            </p>
          </div>

          <div className="px-5 py-8">
            


            <div className="text-center">
              <Link
                href={`/${reservation.tour.category}/${reservation.tour.slug}`}
                className="text-2xl md:text-3xl font-bold text-primary hover:text-secondary transition duration-300 mb-4 block"
                target="_blank"
                rel="noopener noreferrer">

                {reservation.tour.title}

              </Link>
              <p className="text-gray-600 text-lg md:text-xl">
                Booked by:{" "}
                <span className="font-semibold">
                  {reservation.userData[0].firstName} {reservation.userData[0].lastName}
                </span>
              </p>
            </div>

       
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mt-6">
              <h2 className="text-lg font-bold text-gray-800 mb-3 text-center">
                Contact Information
              </h2>
              <p className="text-gray-600 text-center">
                An email confirmation has been sent to:{" "}
                <span className="font-semibold text-gray-800">
                  {reservation.userData[0].email}
                </span>
              </p>
            </div>
          </div>

  
          <div className="bg-gray-100 p-4 text-center">
            <p className="text-sm md:text-base text-gray-500">
              Thank you for choosing our services! If you have any questions, feel free
              to contact our support team.
            </p>
            <button
              onClick={() => window.location.href = '/contact'}
              className="mt-4 bg-primary hover:bg-secondary text-white px-6 py-2 rounded-lg shadow-md text-lg font-bold"
            >
              Contact Support
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export async function getServerSideProps(context) {
  const { query } = context;
  const { id } = query;
  // Especificar que la solicitud es un GET
  const res = await fetch(`${API_URL}/api/reservation?id=${id}`, { method: 'GET' });
  const data = await res.json();

  return {
    props: {
      reservation: data || 'No se seleccionó ningún tour',
    },
  };
}