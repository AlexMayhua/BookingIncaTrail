import React, { useMemo, useRef, useState } from 'react';
import Select from 'react-select';
import countryList from 'react-select-country-list';
import ReCAPTCHA from 'react-google-recaptcha';
import { BRAND } from '../../lib/brandConfig';
import Link from 'next/link';

function EmailFormulary({ t = {}, tourName = '' }) {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [tour, setTour] = useState(tourName);
  const [message, setMessage] = useState('');
  const [country, setCountry] = useState('');
  const [travelers, setTravelers] = useState('');
  const [hotelQuality, setHotelQuality] = useState('');
  const [submitStatus, setSubmitStatus] = useState('idle');
  const [recaptchaToken, setRecaptchaToken] = useState(null);
  const recaptchaRef = useRef(null);

  const countries = useMemo(() => countryList().getData(), []);
  const selectStyles = useMemo(
    () => ({
      control: (base, state) => ({
        ...base,
        minHeight: '48px',
        borderRadius: '0.75rem',
        borderColor: state.isFocused ? '#e6c200' : '#cbd5e1',
        boxShadow: state.isFocused
          ? '0 0 0 3px rgba(230, 194, 0, 0.2)'
          : 'none',
        '&:hover': {
          borderColor: '#e6c200',
        },
      }),
      placeholder: (base) => ({
        ...base,
        color: '#94a3b8',
      }),
      option: (base, state) => ({
        ...base,
        backgroundColor: state.isSelected
          ? '#0d1117'
          : state.isFocused
            ? 'rgba(230, 194, 0, 0.12)'
            : '#ffffff',
        color: state.isSelected ? '#ffffff' : '#0d1117',
      }),
      menu: (base) => ({
        ...base,
        borderRadius: '0.75rem',
        overflow: 'hidden',
      }),
    }),
    [],
  );

  const labelClass = 'mb-2 block text-sm font-semibold text-primary/85';
  const inputClass =
    'w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-secondary focus:ring-2 focus:ring-secondary/25';

  const handleHotelQualityChange = (e) => {
    setHotelQuality(e.target.value);
  };

  const resetForm = () => {
    setName('');
    setEmail('');
    setTour(tourName);
    setMessage('');
    setCountry('');
    setTravelers('');
    setHotelQuality('');
    setRecaptchaToken(null);
    recaptchaRef.current?.reset();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitStatus('idle');

    if (!recaptchaToken) {
      alert(t.recaptcha_required);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert(t.invalid_email);
      return;
    }

    const data = {
      name,
      email,
      country,
      travelers,
      hotelQuality,
      message,
      tour,
    };

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          Accept: 'application/json, text/plain, */*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        resetForm();
        setSubmitStatus('success');
      } else {
        setSubmitStatus('error');
      }
    } catch {
      setSubmitStatus('error');
    }
  };

  return (
    <section className='relative overflow-hidden py-10 sm:py-14'>
      <div className='mx-auto w-full max-w-[1300px] px-4 md:px-6'>
        <div className='rounded-3xl border border-slate-200 bg-white p-4 sm:p-6 md:p-8'>
          <div className='mx-auto max-w-3xl text-center'>
            <h1 className='text-2xl font-bold text-primary sm:text-3xl'>
              {t.title}
            </h1>
            <p className='mt-3 text-sm leading-relaxed text-slate-600 sm:text-base'>
              {t.description}
            </p>
          </div>

          <div className='mt-8 grid gap-6 lg:mt-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-8'>
            <div className='rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6'>
              <form onSubmit={handleSubmit} className='space-y-6'>
                <div>
                  <h2 className='text-lg font-bold text-primary'>
                    {t.personal_info_title}
                  </h2>
                </div>

                <div className='grid gap-4 sm:grid-cols-2'>
                  <div>
                    <label htmlFor='name' className={labelClass}>
                      {t.name}
                    </label>
                    <input
                      type='text'
                      id='name'
                      name='name'
                      className={inputClass}
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor='email' className={labelClass}>
                      {t.email}
                    </label>
                    <input
                      type='email'
                      id='email'
                      name='email'
                      className={inputClass}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div>
                  <h2 className='text-lg font-bold text-primary'>
                    {t.tour_info_title}
                  </h2>
                </div>

                <div className='grid gap-4 sm:grid-cols-2'>
                  <div>
                    <label htmlFor='travelers' className={labelClass}>
                      {t.travelers}
                    </label>
                    <input
                      type='number'
                      id='travelers'
                      className={inputClass}
                      placeholder={t.travelers_placeholder}
                      value={travelers}
                      onChange={(e) => setTravelers(e.target.value)}
                      min='1'
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor='country' className={labelClass}>
                      {t.country}
                    </label>
                    <Select
                      inputId='country'
                      options={countries}
                      styles={selectStyles}
                      className='text-sm'
                      placeholder={t.country_placeholder}
                      onChange={(selectedOption) =>
                        setCountry(selectedOption?.label || '')
                      }
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor='tour' className={labelClass}>
                    {t.tour}
                  </label>
                  <input
                    type='text'
                    id='tour'
                    name='tour'
                    className={inputClass}
                    placeholder={t.tour_placeholder}
                    value={tour}
                    onChange={(e) => setTour(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <h2 className='text-lg font-bold text-primary'>
                    {t.tour_info_help}
                  </h2>
                </div>
                <div>
                  <label htmlFor='message' className={labelClass}>
                    {t.question}
                  </label>
                  <textarea
                    id='message'
                    name='message'
                    className={`${inputClass} h-32 resize-none`}
                    value={message}
                    placeholder={t.about_placeholder}
                    onChange={(e) => setMessage(e.target.value)}
                    required
                  />
                  <p className='mt-2 text-xs text-slate-500'>
                    {t.question_help}
                  </p>
                </div>

                <div className='flex justify-center overflow-x-auto py-1'>
                  <ReCAPTCHA
                    ref={recaptchaRef}
                    sitekey='6LdP-BYqAAAAABjwvBwSlkGY3265CH2uzwLqkerc'
                    onChange={(token) => setRecaptchaToken(token)}
                  />
                </div>

                <div className='rounded-2xl border border-slate-200 bg-cream px-4 py-4'>
                  <button
                    className='w-full rounded-xl bg-gradient-to-r from-secondary to-yellow-dark px-6 py-3 text-sm font-bold uppercase tracking-[0.1em] text-primary transition hover:brightness-95 focus:outline-none focus:ring-2 focus:ring-secondary/50'
                    type='submit'>
                    {t.btn_send}
                  </button>
                  <p className='mt-3 text-center text-xs leading-relaxed text-slate-500'>
                    {t.privacy}
                  </p>
                  {submitStatus === 'success' && (
                    <p className='mt-3 text-center text-sm font-medium text-green-700'>
                      {t.submit_success}
                    </p>
                  )}
                  {submitStatus === 'error' && (
                    <p className='mt-3 text-center text-sm font-medium text-red-700'>
                      {t.submit_error}
                    </p>
                  )}
                </div>
              </form>
            </div>

            <div className='relative flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6'>
              <div className='overflow-hidden rounded-xl border border-slate-200 mb-6'>
                <iframe
                  width='100%'
                  height='100%'
                  className='h-[200px] w-full sm:h-[240px]'
                  title='map'
                  src='https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3879.2704282072555!2d-71.98792588816477!3d-13.518988671004552!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x916dd7137eafb33f%3A0xdc9bc9abc16f5912!2sLife%20Expeditions%20-%20Machu%20Picchu%20Trips!5e0!3m2!1ses-419!2spe!4v1724709545876!5m2!1ses-419!2spe'
                  style={{ filter: 'contrast(0.9) opacity(1)' }}
                />
              </div>

              <h3 className='text-xl font-semibold text-primary'>
                {t.talk_expert_title}
              </h3>
              <p className='mt-2 text-sm text-gray-600'>
                {t.talk_expert_description}
              </p>

              <dl className='mt-6 space-y-5 text-sm text-gray-800'>
                {/* Phone & WhatsApp */}
                <div className='flex flex-col items-center gap-3 sm:flex-row sm:items-start sm:text-left'>
                  <span
                    className='mt-1 inline-flex h-8 w-8 flex-none items-center justify-center rounded-full bg-primary/10 text-primary'
                    aria-hidden='true'>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      viewBox='0 0 24 24'
                      fill='currentColor'
                      className='h-5 w-5'>
                      <path d='M6.62 10.79a15.559 15.559 0 0 0 6.59 6.59l2.2-2.2a1 1 0 0 1 1.01-.24c1.12.37 2.33.57 3.58.57a1 1 0 0 1 1 1v3.6a1 1 0 0 1-1 1C10.07 21.12 2.88 13.93 2.88 4.99a1 1 0 0 1 1-1h3.6a1 1 0 0 1 1 1c0 1.25.19 2.46.57 3.58a1 1 0 0 1-.25 1.01l-2.2 2.21Z' />
                    </svg>
                  </span>
                  <div className='text-center sm:text-left'>
                    <dt className='text-xs font-semibold uppercase tracking-[0.2em] text-gray-500'>
                      {t.phone_whatsapp}
                    </dt>
                    <dd className='mt-1 space-y-1'>
                      <a
                        href={`tel:${BRAND.contactPhone}`}
                        className='block text-base font-medium text-gray-900 hover:text-primary'>
                        {BRAND.contactPhone}
                      </a>
                      <a
                        href='https://api.whatsapp.com/send/?phone=51970811976'
                        className='block text-xs font-medium text-secondary hover:text-primary'>
                        WhatsApp
                      </a>
                    </dd>
                  </div>
                </div>

                {/* Email */}
                <div className='flex flex-col items-center gap-3 sm:flex-row sm:items-start sm:text-left'>
                  <span
                    className='mt-1 inline-flex h-8 w-8 flex-none items-center justify-center rounded-full bg-primary/10 text-primary'
                    aria-hidden='true'>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      viewBox='0 0 24 24'
                      fill='currentColor'
                      className='h-5 w-5'>
                      <path d='M2 5.75A1.75 1.75 0 0 1 3.75 4h16.5A1.75 1.75 0 0 1 22 5.75v12.5A1.75 1.75 0 0 1 20.25 20H3.75A1.75 1.75 0 0 1 2 18.25V5.75Zm3.03-.25a.25.25 0 0 0-.18.43l6.4 5.13a.75.75 0 0 0 .94 0l6.4-5.13a.25.25 0 0 0-.18-.43H5.03Zm-.28 1.3a.25.25 0 0 0-.4.2v11.5c0 .14.11.25.25.25h14.8a.25.25 0 0 0 .25-.25V7c0-.2-.23-.32-.4-.2l-6.87 5.5a1.75 1.75 0 0 1-2.18 0l-6.85-5.5Z' />
                    </svg>
                  </span>
                  <div className='text-center sm:text-left'>
                    <dt className='text-xs font-semibold uppercase tracking-[0.2em] text-gray-500'>
                      {t.email}
                    </dt>
                    <dd className='mt-1'>
                      <a
                        href={`mailto:${BRAND.contactEmail}`}
                        className='text-base font-medium text-gray-900 hover:text-primary'>
                        {BRAND.contactEmail}
                      </a>
                    </dd>
                  </div>
                </div>

                {/* Office */}
                <div className='flex flex-col items-center gap-3 sm:flex-row sm:items-start sm:text-left'>
                  <span
                    className='mt-1 inline-flex h-8 w-8 flex-none items-center justify-center rounded-full bg-primary/10 text-primary'
                    aria-hidden='true'>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      viewBox='0 0 24 24'
                      fill='currentColor'
                      className='h-5 w-5'>
                      <path d='M12 2a7 7 0 0 1 7 7c0 4.42-3.74 9.65-6.08 12.41a1.18 1.18 0 0 1-1.84 0C8.74 18.65 5 13.42 5 9a7 7 0 0 1 7-7Zm0 2a5 5 0 0 0-5 5c0 3.2 2.6 7.51 5 10.44 2.4-2.93 5-7.2 5-10.44a5 5 0 0 0-5-5Zm0 2.8a2.2 2.2 0 1 1 0 4.4 2.2 2.2 0 0 1 0-4.4Z' />
                    </svg>
                  </span>
                  <div className='text-center sm:text-left'>
                    <dt className='text-xs font-semibold uppercase tracking-[0.2em] text-gray-500'>
                      {t.office}
                    </dt>
                    <dd className='mt-1 text-base font-medium text-gray-900'>
                      <a
                        href='https://maps.google.com/?q=C.+Nueva+Alta+470,+Cusco+08000'
                        target='_blank'
                        rel='noopener noreferrer'
                        className='hover:text-primary'>
                        C. Nueva Alta 470, Cusco 08000, Peru
                      </a>
                    </dd>
                  </div>
                </div>

                {/* Office hours */}
                <div className='flex flex-col items-center gap-3 sm:flex-row sm:items-start sm:text-left'>
                  <span
                    className='mt-1 inline-flex h-8 w-8 flex-none items-center justify-center rounded-full bg-primary/10 text-primary'
                    aria-hidden='true'>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      viewBox='0 0 24 24'
                      fill='currentColor'
                      className='h-5 w-5'>
                      <path d='M12 5a1 1 0 0 1 1 1v5.28l3.4 2.04a1 1 0 1 1-1 1.72l-4-2.4A1 1 0 0 1 11 11V6a1 1 0 0 1 1-1Zm0-3a10 10 0 1 1 0 20 10 10 0 0 1 0-20Zm0 2a8 8 0 1 0 0 16 8 8 0 0 0 0-16Z' />
                    </svg>
                  </span>
                  <div className='text-center sm:text-left'>
                    <dt className='text-xs font-semibold uppercase tracking-[0.2em] text-gray-500'>
                      {t.office_hours}
                    </dt>
                    <dd className='mt-1 text-base font-medium text-gray-900'>
                      {t.office_hours_value}
                    </dd>
                  </div>
                </div>
              </dl>

              <p className='mt-8 text-center text-xs font-semibold uppercase tracking-[0.2em] text-secondary sm:text-left sm:tracking-[0.3em]'>
                {t.avg_response}
              </p>

              <div className='mt-6 flex flex-col items-center gap-3 sm:flex-row sm:items-center sm:justify-start'>
                <Link
                  href='https://api.whatsapp.com/send/?phone=51970811976'
                  className='inline-flex items-center justify-center rounded-full bg-primary px-5 py-2 text-sm font-semibold text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-primary/90'>
                  {t.chat_whatsapp}
                </Link>
                <Link
                  href={`tel:${BRAND.contactPhone}`}
                  className='inline-flex items-center justify-center rounded-full bg-secondary/10 px-5 py-2 text-sm font-semibold text-secondary transition hover:bg-secondary/20 hover:-translate-y-0.5'>
                  {t.call_now}
                </Link>
                <Link
                  href={`mailto:${BRAND.contactEmail}`}
                  className='inline-flex items-center justify-center rounded-full border border-primary px-5 py-2 text-sm font-semibold text-primary transition hover:border-secondary hover:text-secondary hover:-translate-y-0.5'>
                  {t.send_email}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default EmailFormulary;
