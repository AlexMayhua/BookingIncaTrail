import { useRouter } from 'next/router';
import Link from 'next/link';
import { NextSeo } from 'next-seo';

export default function Custom404() {
  const router = useRouter();

  return (
    <>
      <NextSeo
        title="Página no encontrada - 404"
        description="La página que buscas no existe o ha sido movida."
        noindex={true}
      />
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full text-center">
          <div className="mb-8">
            <h1 className="text-9xl font-bold text-primary">404</h1>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Página no encontrada
            </h2>
            <p className="text-gray-600 mb-8">
              Lo sentimos, la página que buscas no existe o ha sido movida.
            </p>
          </div>
          
          <div className="space-y-4">
            <Link
              href="/"
              className="inline-block bg-primary hover:bg-secondary text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200">
              
                Volver al inicio
              
            </Link>
            
            <div className="mt-4">
              <button
                onClick={() => router.back()}
                className="text-primary hover:text-secondary font-medium underline"
              >
                Volver atrás
              </button>
            </div>
          </div>
          
          <div className="mt-8 text-sm text-gray-500">
            <p>Si crees que esto es un error, por favor contáctanos.</p>
          </div>
        </div>
      </div>
    </>
  );
}