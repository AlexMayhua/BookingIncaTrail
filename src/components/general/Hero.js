import { useState, useEffect } from 'react'
import Image from 'next/image'

export default function Hero({ image, image_min, title }) {
  const [width, setWidth] = useState(0); // default width, detect on server.
  const handleResize = () => setWidth(window.innerWidth);
  useEffect(() => {
    handleResize()
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  const isMobile = width <= 767;
  if (isMobile === true) {
    return (
      <div className='h-2xl bg-gray-50 relative object-cover'>
        <Image src={image_min} className='object-cover  w-full' priority fill sizes="100vw" alt='Group Booking Inca Trail' />
        <div className='absolute bottom-12 text-white mx-3'>
          <h1 className='text-3xl font-black mb-2'>{title}</h1>
          <hr className='border-4 border-white w-24' />
        </div>
      </div>
    )
  } else {
    return (
      <div className='h-2xl bg-gray-50 relative object-cover'>
        <Image src={image} className='object-cover  w-full' priority fill sizes="100vw" alt='Group Booking Inca Trail' />
        <div className='absolute bottom-12 text-white xl:mx-16 mx-3'>
          <h1 className=' text-7xl  text-white font-bold mb-2 lg:mr-96'>{title}</h1>
        </div>
      </div>
    )
  }


}
