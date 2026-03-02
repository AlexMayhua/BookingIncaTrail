import { NextSeo } from "next-seo";
import Accordion from "../components/general/Accordion";
import { BRAND, absoluteUrl } from '../lib/brandConfig';


export default function Faqs() {
  const faqs = [
    {
      title: 'What essential documents should I bring?',
      content: 'It is very important to have your passport or student card, travel insurance, these documents will be useful to travel to Peru and to book any of our treks. Once you are in Peruvian territory your passport will be useful to buy tickets to museums or archaeological sites such as the Inca Trail or Machu Picchu.'
    },
    {
      title: 'I need travel insurance?',
      content: 'Travel insurance is mandatory for all our treks, it is required at least to cover medical expenses and emergency repatriation. We recommend everyone if you have a policy that also covers COVID-19, cancellation, personal liability, reduction and loss of luggage or personal effects.'
    },
    {
      title: 'The currency in Peru',
      content: 'In all the Peruvian territory the currency is the SOLES (PEN) very important to take into account the local currency, most of the small stores only allow payments in SOLES. There are also exchange centers for USD to PEN.'
    }
  ]
  return (
    <>
      <NextSeo
        title={`FAQs | ${BRAND.name}`}
        description=""
        canonical={absoluteUrl('/faqs')}
        openGraph={{
          url: absoluteUrl('/faqs'),
          title: `FAQs | ${BRAND.name}`,
          description: "",
          site_name: BRAND.name,
        }}
      />
     
        
          <div className="lg:mx-16 mx-2">
          <p className="my-8 lg:mr-80 ">Before trekking in Peru we always have questions, doubts and concerns so we are here to answer your questions What documents are needed? What to pack for Peru? And other questions.</p>

          <div className="grid lg:grid-cols-2 grid-cols-1 gap-8 ">
            <div className="">
              <h2 className="text-xl font-black">FAQs Peru Trip</h2>
              {
                faqs.map((item, i) => (
                  <Accordion key={i} title={item.title} content={item.content} />
                ))
              }

            </div>

          </div>

        </div>
    </>
  )
}
