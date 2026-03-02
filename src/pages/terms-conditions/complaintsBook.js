import { useState } from 'react';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import en from '../../lang/en/complaints'
import es from '../../lang/es/complaints'
import { useRouter } from 'next/router'
export default function ComplaintForm() {

  const router = useRouter()
  const { locale } = router;
  const t = locale === 'en' ? en : es;

  const [formData, setFormData] = useState({
    name: '',
    dni: '',
    email: '',
    phone: '',
    complaint: '',
    responseMethod: 'email', // default
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Envío de datos del formulario de quejas
    alert('¡Gracias por tu mensaje! Nos pondremos en contacto contigo pronto.');
  };

  return (
    <div className="2xl:container mx-auto">
      <section className='lg:mx-20 mx-2 my-8'>
        <h1 className="text-3xl font-bold mb-4 text-center">{t.h1title}</h1>
        <div className='lg:flex gap-8 bg-white rounded shadow lg:p-10 p-3 w-full"'>
          <div className='lg:w-1/3 shadow-t-lg'>
            <div className='bg-gray-100 content-center rounded-t grid place-content-center text-center'>
              <LazyLoadImage src='/img/other/drAbraham.webp' className='w-60 h-60 rounded-full'/>
              <span><strong>{t.expert}</strong></span>
              <p className="text-gray-600 mb-4">Cr. Abraham</p>
             
              <button className="w-full h-10 flex items-center justify-center rounded bg-white shadow group transition-all duration-300 mb-8 text-primary hover:text-secondary">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6 w-5 h-5">
                  <path fillRule="evenodd" d="M15 3.75a.75.75 0 0 1 .75-.75h4.5a.75.75 0 0 1 .75.75v4.5a.75.75 0 0 1-1.5 0V5.56l-4.72 4.72a.75.75 0 1 1-1.06-1.06l4.72-4.72h-2.69a.75.75 0 0 1-.75-.75Z" clipRule="evenodd" />
                  <path fillRule="evenodd" d="M1.5 4.5a3 3 0 0 1 3-3h1.372c.86 0 1.61.586 1.819 1.42l1.105 4.423a1.875 1.875 0 0 1-.694 1.955l-1.293.97c-.135.101-.164.249-.126.352a11.285 11.285 0 0 0 6.697 6.697c.103.038.25.009.352-.126l.97-1.293a1.875 1.875 0 0 1 1.955-.694l4.423 1.105c.834.209 1.42.959 1.42 1.82V19.5a3 3 0 0 1-3 3h-2.25C8.552 22.5 1.5 15.448 1.5 6.75V4.5Z" clipRule="evenodd" />
                </svg>&nbsp;
                <span> +51 970811976</span>
              </button>
              <button className="w-full h-10 flex items-center justify-center rounded bg-white shadow group transition-all duration-300 mb-8 text-primary hover:text-secondary">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6 w-5 h-5">
                  <path d="M1.5 8.67v8.58a3 3 0 0 0 3 3h15a3 3 0 0 0 3-3V8.67l-8.928 5.493a3 3 0 0 1-3.144 0L1.5 8.67Z" />
                  <path d="M22.5 6.908V6.75a3 3 0 0 0-3-3h-15a3 3 0 0 0-3 3v.158l9.714 5.978a1.5 1.5 0 0 0 1.572 0L22.5 6.908Z" />
                </svg>&nbsp;
                <span> abraham@gmail.com</span>
              </button>
            </div>
            <div className='bg-gray-100 px-5 text-center'>
              <h2>{t.h2Opinion}</h2>
              <p>{t.pDescriptionOp}</p>
              <span className='text-'><strong>{t.thanks}</strong></span>
            </div>
            <div class="relative bottom-0 left-0 w-full overflow-hidden leading-none bg-gray-100">
              <svg class="relative block w-[calc(100%+1.3px)] h-[98px]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
                  <path d="M598.97 114.72L0 0 0 120 1200 120 1200 0 598.97 114.72z" className="fill-white "></path>
              </svg>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="col-1 bg-white p-3 rounded pt-8 lg:pt-0 lg:w-2/3">
            <p className="mb-4 text-start text-gray-600">{t.tellUs}</p>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                {t.f_fullname} <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded"
                placeholder={t.f_writename}
                required
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="dni">
                {t.f_numDocument} <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="dni"
                name="dni"
                value={formData.dni}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded"
                placeholder={t.f_writedocument}
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                {t.f_mail}<span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded"
                placeholder={t.f_writemail}
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="phone">
                {t.f_phone} <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded"
                placeholder={t.f_writephone}
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="complaint">
                {t.f_details} <span className="text-red-500">*</span>
              </label>
              <textarea
                id="complaint"
                name="complaint"
                value={formData.complaint}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded"
                rows="5"
                placeholder={t.f_writedetails}
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                {t.f_response}
              </label>
              <div>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="responseMethod"
                    value="email"
                    checked={formData.responseMethod === 'email'}
                    onChange={handleInputChange}
                    className="form-radio accent-primary"
                  />
                  <span className="ml-2 text-sm">{t.f_mail}</span>
                </label>
              </div>
              <div>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="responseMethod"
                    value="phone"
                    checked={formData.responseMethod === 'phone'}
                    onChange={handleInputChange}
                    className="form-radio accent-primary"
                  />
                  <span className="ml-2 text-sm">{t.f_phone}</span>
                </label>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-secondary text-white font-bold py-2 px-4 rounded hover:bg-primary"
            >
              {t.f_btnSend}
            </button>
          </form>
      </div>
      </section>
    </div>
  );
}
