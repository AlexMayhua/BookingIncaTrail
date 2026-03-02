import parser from 'html-react-parser';
import Link from "next/link"
import en from '../../lang/en/terms'
import es from '../../lang/es/terms'
import { useRouter } from 'next/router';
import { NextSeo } from 'next-seo';
import { BRAND, absoluteUrl } from '../../lib/brandConfig'

export default function TermsConditions() {
    const router = useRouter()
    const { locale } = router;
    const t = locale === 'en' ? en : es;

    return (
        <>
            <NextSeo
                title={t.meta_title}
                description={t.meta_description}
                canonical={absoluteUrl('/terms-conditions')}
                openGraph={{
                    url: absoluteUrl('/terms-conditions'),
                    title: t.meta_title,
                    description: t.meta_description,
                    images: [
                        {
                            url: '/img/hero/hero-slider-1.jpeg',
                            width: 1400,
                            height: 465,
                            type: 'image/jpg',
                        }
                    ],
                    site_name: BRAND.name
                }}
            />
            <div className='2xl:container mx-auto'>
                <section className='lg:mx-20 mx-2 my-8 '>
                    <h1 className='text-4xl font-bold text-center'>{t.title}</h1>
                    <div className="lg:flex gap-8 bg-white rounded shadow lg:p-5 p-3 w-full">
                        
                        <div className='lg:w-1/3'>
                            <div className="bg-gray-100 p-6 rounded shadow">
                                <img src="/home/complaints-book.svg" alt="Foto del experto" className="rounded-full mx-auto w-48 h-48 object-cover"/>
                                
                                <button className="w-full h-10 rounded bg-white shadow group transition-all duration-300 mb-8 text-primary hover:text-secondary">
                                    <a href='/terms-conditions/complaintsBook' className='flex items-center justify-center'>
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6 w-5 h-5">
                                            <path d="M11.25 4.533A9.707 9.707 0 0 0 6 3a9.735 9.735 0 0 0-3.25.555.75.75 0 0 0-.5.707v14.25a.75.75 0 0 0 1 .707A8.237 8.237 0 0 1 6 18.75c1.995 0 3.823.707 5.25 1.886V4.533ZM12.75 20.636A8.214 8.214 0 0 1 18 18.75c.966 0 1.89.166 2.75.47a.75.75 0 0 0 1-.708V4.262a.75.75 0 0 0-.5-.707A9.735 9.735 0 0 0 18 3a9.707 9.707 0 0 0-5.25 1.533v16.103Z" />
                                        </svg>&nbsp;
                                        <div className=''> {t.bookComplaints}</div>
                                    </a>
                                    
                                </button>
                                
                                <p className="text-center text-gray-600 mb-4">Cr. Abraham O.</p>
                                <div className="space-y-2 m-auto">
                                    <Link
                                        href={`mailto:${BRAND.contactEmail}`}
                                        className="flex justify-center text-base hover:text-[#e6c200]">

                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 mr-2 text-blue">
                                            <path d="M1.5 8.67v8.58a3 3 0 0 0 3 3h15a3 3 0 0 0 3-3V8.67l-8.928 5.493a3 3 0 0 1-3.144 0L1.5 8.67Z" />
                                            <path d="M22.5 6.908V6.75a3 3 0 0 0-3-3h-15a3 3 0 0 0-3 3v.158l9.714 5.978a1.5 1.5 0 0 0 1.572 0L22.5 6.908Z" />
                                        </svg>
                                        <span className="truncate">{BRAND.contactEmail}</span>

                                    </Link>
                                    <Link
                                        href='tel:+51970811976'
                                        className="flex justify-center text-base hover:text-[#e6c200]">

                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 mr-2 text-blue">
                                        <path fillRule="evenodd" d="M1.5 4.5a3 3 0 0 1 3-3h1.372c.86 0 1.61.586 1.819 1.42l1.105 4.423a1.875 1.875 0 0 1-.694 1.955l-1.293.97c-.135.101-.164.249-.126.352a11.285 11.285 0 0 0 6.697 6.697c.103.038.25.009.352-.126l.97-1.293a1.875 1.875 0 0 1 1.955-.694l4.423 1.105c.834.209 1.42.959 1.42 1.82V19.5a3 3 0 0 1-3 3h-2.25C8.552 22.5 1.5 15.448 1.5 6.75V4.5Z" clipRule="evenodd" />
                                        </svg>
                                        <span className="truncate">+51 970811976</span>

                                    </Link>
                                </div>
                            </div> 
                        </div>
                        <div className="pt-8 lg:pt-0 lg:w-2/3">
                            <h2>{t.welcome}</h2>
                            <p>{t.presentation}</p>
                            <div>{parser(t.content)}</div>
                        </div>
                        
                    </div>
                </section>
                
            </div>
        </>
    );
}