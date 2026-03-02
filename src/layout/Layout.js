import { useRouter } from 'next/router';
import { useEffect } from 'react';
import Footer from '../components/navbar/Footer'
import Head from 'next/head';
import Notify from '../components/Notify';
import Modal from '../components/Modal';
import Navbar from '../components/navbar/Navbar';
import ScrollToTop from '../components/ScrollToTop';
import WhatsAppChat from '../components/whatsapp';
import AdminLayout from './AdminLayout';

export default function Layout({ children }) {

  const router = useRouter();
  const isAdminRoute = router.pathname.startsWith('/admin');

  // Si estamos en una ruta de admin, usamos AdminLayout
  if (isAdminRoute) {
    return <AdminLayout>{children}</AdminLayout>;
  }

  return (
    <>
      <Head />

      <Navbar />

      <main className="bg-fixed bg-[url('/home/bg25.webp')] lg:text-justify layoud-spacing">
        <Notify />
        
        <Modal />
        
        {children}
        
      </main>

      <Footer />
      <ScrollToTop/>
      <WhatsAppChat/>
    </>
  )
}