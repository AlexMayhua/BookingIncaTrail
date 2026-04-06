import { useRouter } from 'next/router';
import Footer from '../components/navbar/Footer';
import Head from 'next/head';
import Notify from '../components/Notify';
import Modal from '../components/Modal';
import ScrollToTop from '../components/ScrollToTop';
import WhatsAppChat from '../components/whatsapp';
import Image from 'next/image';
import Header from '@/components/navbar/Header';

export default function Layout({ children }) {
  return (
    <>
      <Head />
      <Header />

      <div className='fixed inset-0 -z-10 w-screen h-screen'>
        <Image
          src='/home/bg25.webp'
          alt='Background'
          fill
          priority
          sizes='100vw'
          className='object-cover'
        />
      </div>

      <main className='relative lg:text-justify '>
        <Notify />
        <Modal />
        {children}
      </main>

      <Footer />
      <ScrollToTop />
      <WhatsAppChat />
    </>
  );
}
