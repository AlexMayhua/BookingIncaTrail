import { useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import DOMPurify from "isomorphic-dompurify"

export default function CategoryFAQs({ category }) {
  const router = useRouter();
  const { locale } = router;
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFaq = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  // FAQs específicas por categoría
  const categoryFAQs = {
    'inca-trail': [
      {
        title: locale === 'en' ? 'How long is the Inca Trail?' : '¿Cuánto tiempo dura el Camino Inca?',
        content: locale === 'en'
          ? 'The classic Inca Trail lasts 4 days and 3 nights. We also offer 2-day versions for those with less time available.'
          : 'El Camino Inca clásico dura 4 días y 3 noches. También ofrecemos versiones de 2 días para quienes tienen menos tiempo disponible.'
      },
      {
        title: locale === 'en' ? 'Do I need special permits for the Inca Trail?' : '¿Necesito permisos especiales para el Camino Inca?',
        content: locale === 'en'
          ? 'Yes, the Inca Trail requires special permits that must be booked in advance. We handle all the necessary paperwork.'
          : 'Sí, el Camino Inca requiere permisos especiales que deben reservarse con anticipación. Nosotros nos encargamos de todos los trámites necesarios.'
      },
      {
        title: locale === 'en' ? 'When is the best time to do the Inca Trail?' : '¿Cuál es la mejor época para hacer el Camino Inca?',
        content: locale === 'en'
          ? 'The best time is during the dry season, from May to September. The trail is closed in February for maintenance.'
          : 'La mejor época es durante la temporada seca, de mayo a septiembre. El sendero está cerrado en febrero por mantenimiento.'
      },
      {
        title: locale === 'en' ? 'What difficulty level is the Inca Trail?' : '¿Qué nivel de dificultad tiene el Camino Inca?',
        content: locale === 'en'
          ? 'The Inca Trail has a moderate to challenging difficulty level. It requires good physical condition and prior preparation.'
          : 'El Camino Inca tiene un nivel de dificultad moderado a desafiante. Requiere buena condición física y preparación previa.'
      },
      {
        title: locale === 'en' ? 'What is included in the tour?' : '¿Qué está incluido en el tour?',
        content: locale === 'en'
          ? 'Our tours include professional guide, camping equipment, meals, permits, and transportation. We provide a detailed packing list.'
          : 'Nuestros tours incluyen guía profesional, equipo de camping, comidas, permisos y transporte. Proporcionamos una lista detallada de lo que debes llevar.'
      },
      {
        title: locale === 'en' ? 'Can I do the Inca Trail alone?' : '¿Puedo hacer el Camino Inca solo?',
        content: locale === 'en'
          ? 'No, independent trekking is not allowed on the Inca Trail. You must go with an authorized tour operator like us.'
          : 'No, el trekking independiente no está permitido en el Camino Inca. Debes ir con un operador turístico autorizado como nosotros.'
      }
    ],
    'salkantay': [
      {
        title: locale === 'en' ? 'What makes the Salkantay Trek special?' : '¿Qué hace especial al trek de Salkantay?',
        content: locale === 'en'
          ? 'Salkantay is a spectacular alternative to the Inca Trail, offering diverse landscapes from glaciers to tropical jungle.'
          : 'El Salkantay es una alternativa espectacular al Camino Inca, ofreciendo paisajes diversos desde glaciares hasta selva tropical.'
      },
      {
        title: locale === 'en' ? 'How many days is the Salkantay Trek?' : '¿Cuántos días dura el trek de Salkantay?',
        content: locale === 'en'
          ? 'Our Salkantay Trek lasts 5 days and 4 nights, including the visit to Machu Picchu.'
          : 'Nuestro trek de Salkantay dura 5 días y 4 noches, incluyendo la visita a Machu Picchu.'
      },
      {
        title: locale === 'en' ? 'Is it harder than the Inca Trail?' : '¿Es más difícil que el Camino Inca?',
        content: locale === 'en'
          ? 'Salkantay has a similar difficulty level to the Inca Trail, but with the advantage of not requiring special permits.'
          : 'El Salkantay tiene un nivel de dificultad similar al Camino Inca, pero con la ventaja de no requerir permisos especiales.'
      },
      {
        title: locale === 'en' ? 'What equipment do I need for Salkantay?' : '¿Qué equipamiento necesito para Salkantay?',
        content: locale === 'en'
          ? 'You will need clothing for cold and warm weather, trekking boots, sleeping bag and rain gear. We provide a detailed list.'
          : 'Necesitarás ropa para clima frío y cálido, botas de trekking, sleeping bag y equipo de lluvia. Proporcionamos una lista detallada.'
      },
      {
        title: locale === 'en' ? 'What is the maximum altitude on the Salkantay Trek?' : '¿Cuál es la altitud máxima en el trek de Salkantay?',
        content: locale === 'en'
          ? 'The highest point is the Salkantay Pass at 4,630 meters above sea level. Prior acclimatization is essential.'
          : 'El punto más alto es el Paso Salkantay a 4,630 metros sobre el nivel del mar. La aclimatación previa es esencial.'
      },
      {
        title: locale === 'en' ? 'Are there hot springs on this trek?' : '¿Hay aguas termales en este trek?',
        content: locale === 'en'
          ? 'Yes! One of the highlights of the Salkantay Trek is the natural hot springs at Cocalmayo where you can relax after the hike.'
          : '¡Sí! Uno de los puntos destacados del trek de Salkantay son las aguas termales naturales de Cocalmayo donde puedes relajarte después de la caminata.'
      }
    ],
    'machupicchu': [
      {
        title: locale === 'en' ? 'What is the best way to get to Machu Picchu?' : '¿Cuál es la mejor forma de llegar a Machu Picchu?',
        content: locale === 'en'
          ? 'There are several options: train from Cusco, trekking via the Inca Trail, or day tours. Each one offers a unique experience.'
          : 'Hay varias opciones: tren desde Cusco, caminata por el Camino Inca, o tours de un día. Cada una ofrece una experiencia única.'
      },
      {
        title: locale === 'en' ? 'Do I need to book in advance?' : '¿Necesito reservar con anticipación?',
        content: locale === 'en'
          ? 'Yes, especially during high season (May-September). Entry tickets and trains sell out quickly.'
          : 'Sí, especialmente en temporada alta (mayo-septiembre). Los boletos de entrada y trenes se agotan rápidamente.'
      },
      {
        title: locale === 'en' ? 'How much time do I need at Machu Picchu?' : '¿Cuánto tiempo necesito en Machu Picchu?',
        content: locale === 'en'
          ? 'We recommend at least 3-4 hours to explore the citadel. Guided tours last approximately 2.5 hours.'
          : 'Recomendamos al menos 3-4 horas para explorar la ciudadela. Los tours guiados duran aproximadamente 2.5 horas.'
      },
      {
        title: locale === 'en' ? 'Can I climb Huayna Picchu?' : '¿Puedo subir a Huayna Picchu?',
        content: locale === 'en'
          ? 'Yes, but it requires an additional ticket and advance booking. The hike takes 1.5-2 hours and offers spectacular views.'
          : 'Sí, pero requiere boleto adicional y reserva previa. La caminata dura 1.5-2 horas y ofrece vistas espectaculares.'
      },
      {
        title: locale === 'en' ? 'What should I bring to Machu Picchu?' : '¿Qué debo llevar a Machu Picchu?',
        content: locale === 'en'
          ? 'Bring comfortable walking shoes, sunscreen, hat, rain jacket, water, and your passport (required for entry).'
          : 'Lleva zapatos cómodos para caminar, protector solar, sombrero, chaqueta impermeable, agua y tu pasaporte (requerido para entrar).'
      },
      {
        title: locale === 'en' ? 'Is there a luggage storage area?' : '¿Hay un área de guardado de equipaje?',
        content: locale === 'en'
          ? 'Yes, there is a luggage storage area at the entrance. You can leave backpacks larger than 25 liters there.'
          : 'Sí, hay un área de guardado de equipaje en la entrada. Puedes dejar mochilas de más de 25 litros allí.'
      }
    ],
    'ausangate': [
      {
        title: locale === 'en' ? 'How difficult is the Ausangate Trek?' : '¿Qué tan difícil es el trek de Ausangate?',
        content: locale === 'en'
          ? 'It is one of the most challenging treks in Peru, requiring excellent physical condition and high mountain experience.'
          : 'Es uno de los treks más desafiantes del Perú, requiere excelente condición física y experiencia en alta montaña.'
      },
      {
        title: locale === 'en' ? 'When is the best time for Ausangate?' : '¿Cuándo es la mejor época para Ausangate?',
        content: locale === 'en'
          ? 'The best time is from May to September, during the dry season. Avoid the rainy months (December-March).'
          : 'La mejor época es de mayo a septiembre, durante la temporada seca. Evita los meses de lluvia (diciembre-marzo).'
      },
      {
        title: locale === 'en' ? 'What altitude does the Ausangate Trek reach?' : '¿Qué altitud alcanza el trek de Ausangate?',
        content: locale === 'en'
          ? 'The highest point is the Palomani Pass at 5,200 meters above sea level. Prior acclimatization is essential.'
          : 'El punto más alto es el paso Palomani a 5,200 metros sobre el nivel del mar. La aclimatación previa es esencial.'
      },
      {
        title: locale === 'en' ? 'Will I see the famous colored lagoons?' : '¿Veré las famosas lagunas de colores?',
        content: locale === 'en'
          ? 'Yes, the trek includes several spectacular colored lagoons and natural hot springs.'
          : 'Sí, el trek incluye varias lagunas de colores espectaculares y aguas termales naturales.'
      },
      {
        title: locale === 'en' ? 'Can I see Rainbow Mountain on this trek?' : '¿Puedo ver la Montaña de Colores en este trek?',
        content: locale === 'en'
          ? 'Yes! Some of our Ausangate trek routes include a visit to the famous Rainbow Mountain (Vinicunca).'
          : '¡Sí! Algunas de nuestras rutas del trek de Ausangate incluyen una visita a la famosa Montaña de Colores (Vinicunca).'
      },
      {
        title: locale === 'en' ? 'What wildlife will I see?' : '¿Qué fauna podré ver?',
        content: locale === 'en'
          ? 'You may see alpacas, llamas, vicuñas, Andean condors, and various high-altitude bird species.'
          : 'Podrás ver alpacas, llamas, vicuñas, cóndores andinos y varias especies de aves de alta montaña.'
      }
    ],
    'day-tours': [
      {
        title: locale === 'en' ? 'What day tours do you offer?' : '¿Qué tours de un día ofrecen?',
        content: locale === 'en'
          ? 'We offer tours to Rainbow Mountain, Sacred Valley, Cusco City Tour, Humantay Lake, and more.'
          : 'Ofrecemos tours a la Montaña de Colores, Valle Sagrado, City Tour Cusco, Laguna Humantay y más.'
      },
      {
        title: locale === 'en' ? 'What is included in day tours?' : '¿Qué incluyen los tours de un día?',
        content: locale === 'en'
          ? 'Our day tours include roundtrip transportation, professional guide, entrance fees, and some include breakfast and/or lunch.'
          : 'Nuestros tours de un día incluyen transporte de ida y vuelta, guía profesional, entradas, y algunos incluyen desayuno y/o almuerzo.'
      },
      {
        title: locale === 'en' ? 'What time do day tours start?' : '¿A qué hora empiezan los tours de un día?',
        content: locale === 'en'
          ? 'Most day tours pick up from your hotel between 4:00-5:00 AM for distant destinations or 8:00-9:00 AM for closer ones.'
          : 'La mayoría de los tours de un día recogen de tu hotel entre 4:00-5:00 AM para destinos lejanos o 8:00-9:00 AM para los más cercanos.'
      },
      {
        title: locale === 'en' ? 'Can I book a private day tour?' : '¿Puedo reservar un tour privado de un día?',
        content: locale === 'en'
          ? 'Yes! All our day tours can be customized as private experiences for individuals, couples, or groups.'
          : '¡Sí! Todos nuestros tours de un día pueden personalizarse como experiencias privadas para individuos, parejas o grupos.'
      },
      {
        title: locale === 'en' ? 'Are day tours suitable for all ages?' : '¿Los tours de un día son aptos para todas las edades?',
        content: locale === 'en'
          ? 'Most tours are suitable for all ages, though some high-altitude treks may not be recommended for young children or people with health issues.'
          : 'La mayoría de los tours son aptos para todas las edades, aunque algunos treks de alta altitud pueden no ser recomendados para niños pequeños o personas con problemas de salud.'
      },
      {
        title: locale === 'en' ? 'Do I need special physical preparation?' : '¿Necesito preparación física especial?',
        content: locale === 'en'
          ? 'It depends on the tour. City tours require minimal effort, while mountain treks require good physical condition and acclimatization.'
          : 'Depende del tour. Los city tours requieren mínimo esfuerzo, mientras que los treks de montaña requieren buena condición física y aclimatación.'
      }
    ],
    'peru-packages': [
      {
        title: locale === 'en' ? 'What do the Peru packages include?' : '¿Qué incluyen los paquetes de Perú?',
        content: locale === 'en'
          ? 'Our packages include accommodation, transportation, guided tours, some meals, and all entrance fees.'
          : 'Nuestros paquetes incluyen alojamiento, transporte, tours guiados, algunas comidas y todas las entradas.'
      },
      {
        title: locale === 'en' ? 'Can I customize my package?' : '¿Puedo personalizar mi paquete?',
        content: locale === 'en'
          ? 'Absolutely! We can adjust any package to fit your interests, schedule, and budget.'
          : '¡Por supuesto! Podemos ajustar cualquier paquete para adaptarlo a tus intereses, horario y presupuesto.'
      },
      {
        title: locale === 'en' ? 'How many days do I need for a Peru trip?' : '¿Cuántos días necesito para un viaje a Perú?',
        content: locale === 'en'
          ? 'We recommend at least 7-10 days to experience the highlights. Shorter trips of 4-5 days are also available.'
          : 'Recomendamos al menos 7-10 días para experimentar lo mejor. También hay viajes más cortos de 4-5 días disponibles.'
      },
      {
        title: locale === 'en' ? 'What destinations are included?' : '¿Qué destinos están incluidos?',
        content: locale === 'en'
          ? 'Popular destinations include Cusco, Machu Picchu, Sacred Valley, Lake Titicaca, and the Amazon jungle.'
          : 'Los destinos populares incluyen Cusco, Machu Picchu, Valle Sagrado, Lago Titicaca y la selva amazónica.'
      },
      {
        title: locale === 'en' ? 'Do you offer family-friendly packages?' : '¿Ofrecen paquetes para familias?',
        content: locale === 'en'
          ? 'Yes! We have specially designed packages for families with children, including age-appropriate activities and accommodations.'
          : '¡Sí! Tenemos paquetes especialmente diseñados para familias con niños, incluyendo actividades y alojamientos apropiados para cada edad.'
      },
      {
        title: locale === 'en' ? 'What is the best time to visit Peru?' : '¿Cuál es la mejor época para visitar Perú?',
        content: locale === 'en'
          ? 'The dry season (May-October) is ideal for trekking and outdoor activities. The rainy season (November-April) offers fewer crowds and lower prices.'
          : 'La temporada seca (mayo-octubre) es ideal para trekking y actividades al aire libre. La temporada de lluvias (noviembre-abril) ofrece menos multitudes y precios más bajos.'
      }
    ],
    'rainbow-mountain': [
      {
        title: locale === 'en' ? 'How difficult is the Rainbow Mountain hike?' : '¿Qué tan difícil es la caminata a la Montaña de Colores?',
        content: locale === 'en'
          ? 'The hike is challenging due to the high altitude (5,200m). The trail itself is moderate difficulty, about 3-4 hours round trip.'
          : 'La caminata es desafiante debido a la alta altitud (5,200m). El sendero en sí es de dificultad moderada, unas 3-4 horas de ida y vuelta.'
      },
      {
        title: locale === 'en' ? 'When is the best time to visit Rainbow Mountain?' : '¿Cuándo es la mejor época para visitar la Montaña de Colores?',
        content: locale === 'en'
          ? 'The best time is during the dry season (May-October). The colors are more vibrant when there is no snow.'
          : 'La mejor época es durante la temporada seca (mayo-octubre). Los colores son más vibrantes cuando no hay nieve.'
      },
      {
        title: locale === 'en' ? 'Is there an easier way to reach the summit?' : '¿Hay una forma más fácil de llegar a la cima?',
        content: locale === 'en'
          ? 'Yes, you can rent a horse for a portion of the trail. This costs extra and can be arranged at the trailhead.'
          : 'Sí, puedes alquilar un caballo para parte del sendero. Esto tiene un costo adicional y se puede arreglar en el inicio del sendero.'
      },
      {
        title: locale === 'en' ? 'What should I bring?' : '¿Qué debo llevar?',
        content: locale === 'en'
          ? 'Bring warm layers, sunscreen, sunglasses, water, snacks, and cash for the horse rental or bathroom facilities.'
          : 'Lleva capas de ropa abrigada, protector solar, gafas de sol, agua, snacks y efectivo para el alquiler de caballo o baños.'
      },
      {
        title: locale === 'en' ? 'Why are the mountains colorful?' : '¿Por qué las montañas son de colores?',
        content: locale === 'en'
          ? 'The colors come from various mineral deposits in the soil, including iron, sulfur, and copper, combined with erosion over millions of years.'
          : 'Los colores provienen de varios depósitos minerales en el suelo, incluyendo hierro, azufre y cobre, combinados con erosión durante millones de años.'
      },
      {
        title: locale === 'en' ? 'How early do we need to start?' : '¿Qué tan temprano necesitamos empezar?',
        content: locale === 'en'
          ? 'We pick you up at around 3:00-4:00 AM from your hotel to arrive at the trailhead early and avoid crowds.'
          : 'Te recogemos alrededor de las 3:00-4:00 AM de tu hotel para llegar temprano al inicio del sendero y evitar multitudes.'
      }
    ],
    'alternative-tours': [
      {
        title: locale === 'en' ? 'What are alternative tours?' : '¿Qué son los tours alternativos?',
        content: locale === 'en'
          ? 'Alternative tours are unique experiences off the beaten path, including lesser-known treks, cultural immersions, and adventure activities.'
          : 'Los tours alternativos son experiencias únicas fuera de los caminos tradicionales, incluyendo treks menos conocidos, inmersiones culturales y actividades de aventura.'
      },
      {
        title: locale === 'en' ? 'Why choose an alternative tour?' : '¿Por qué elegir un tour alternativo?',
        content: locale === 'en'
          ? 'Alternative tours offer fewer crowds, more authentic experiences, and often more challenging adventures for experienced travelers.'
          : 'Los tours alternativos ofrecen menos multitudes, experiencias más auténticas y a menudo aventuras más desafiantes para viajeros experimentados.'
      },
      {
        title: locale === 'en' ? 'Are these tours suitable for beginners?' : '¿Estos tours son adecuados para principiantes?',
        content: locale === 'en'
          ? 'Some alternative tours are suitable for all levels, while others require previous trekking experience. We can recommend the best option for you.'
          : 'Algunos tours alternativos son adecuados para todos los niveles, mientras que otros requieren experiencia previa en trekking. Podemos recomendarte la mejor opción.'
      },
      {
        title: locale === 'en' ? 'Do I need special permits?' : '¿Necesito permisos especiales?',
        content: locale === 'en'
          ? 'Most alternative tours do not require the special permits needed for the Inca Trail, making them easier to book on shorter notice.'
          : 'La mayoría de los tours alternativos no requieren los permisos especiales del Camino Inca, lo que facilita reservarlos con menos anticipación.'
      },
      {
        title: locale === 'en' ? 'What unique experiences do you offer?' : '¿Qué experiencias únicas ofrecen?',
        content: locale === 'en'
          ? 'We offer Choquequirao Trek, Lares Trek, Huchuy Qosqo, Inca Quarry Trail, and community-based tourism experiences.'
          : 'Ofrecemos el Trek de Choquequirao, Trek de Lares, Huchuy Qosqo, Inca Quarry Trail y experiencias de turismo comunitario.'
      },
      {
        title: locale === 'en' ? 'Can I combine alternative tours with Machu Picchu?' : '¿Puedo combinar tours alternativos con Machu Picchu?',
        content: locale === 'en'
          ? 'Yes! Many of our alternative treks end at Machu Picchu or can be combined with a visit to the citadel.'
          : '¡Sí! Muchos de nuestros treks alternativos terminan en Machu Picchu o pueden combinarse con una visita a la ciudadela.'
      }
    ],
    'inca-jungle': [
      {
        title: locale === 'en' ? 'What is the Inca Jungle Trek?' : '¿Qué es el Inca Jungle Trek?',
        content: locale === 'en'
          ? 'The Inca Jungle is an adventure-packed multi-sport trek to Machu Picchu including biking, rafting, zip-lining, and hiking.'
          : 'El Inca Jungle es un trek multi-deporte lleno de aventura hacia Machu Picchu que incluye ciclismo, rafting, tirolesa y caminata.'
      },
      {
        title: locale === 'en' ? 'How many days is the Inca Jungle Trek?' : '¿Cuántos días dura el Inca Jungle Trek?',
        content: locale === 'en'
          ? 'The Inca Jungle Trek typically lasts 4 days and 3 nights, ending at Machu Picchu.'
          : 'El Inca Jungle Trek dura típicamente 4 días y 3 noches, terminando en Machu Picchu.'
      },
      {
        title: locale === 'en' ? 'What activities are included?' : '¿Qué actividades están incluidas?',
        content: locale === 'en'
          ? 'The trek includes downhill mountain biking, optional rafting, zip-lining, and hiking through cloud forests.'
          : 'El trek incluye ciclismo de montaña cuesta abajo, rafting opcional, tirolesa y caminata a través de bosques nubosos.'
      },
      {
        title: locale === 'en' ? 'Is biking experience required?' : '¿Se requiere experiencia en ciclismo?',
        content: locale === 'en'
          ? 'No prior biking experience is needed. The route is mostly downhill and we provide all safety equipment and instructions.'
          : 'No se necesita experiencia previa en ciclismo. La ruta es mayormente cuesta abajo y proporcionamos todo el equipo de seguridad e instrucciones.'
      },
      {
        title: locale === 'en' ? 'What is the accommodation like?' : '¿Cómo es el alojamiento?',
        content: locale === 'en'
          ? 'You will stay in comfortable lodges and hostels along the way, with private or shared rooms and hot showers.'
          : 'Te hospedarás en lodges y hostales cómodos a lo largo del camino, con habitaciones privadas o compartidas y duchas calientes.'
      },
      {
        title: locale === 'en' ? 'Is this trek suitable for families?' : '¿Este trek es adecuado para familias?',
        content: locale === 'en'
          ? 'The Inca Jungle is great for adventurous families with children over 12 years old. Activities can be adjusted based on skill level.'
          : 'El Inca Jungle es ideal para familias aventureras con niños mayores de 12 años. Las actividades pueden ajustarse según el nivel de habilidad.'
      }
    ]
  };

  // FAQs generales para categorías sin FAQs específicas
  const generalFAQs = [
    {
      title: locale === 'en' ? 'What do our tours include?' : '¿Qué incluyen nuestros tours?',
      content: locale === 'en'
        ? 'Our tours include professional guide, transportation, entrance fees, and on multi-day tours: accommodation and meals.'
        : 'Nuestros tours incluyen guía profesional, transporte, entradas, y en tours de varios días: alojamiento y alimentación.'
    },
    {
      title: locale === 'en' ? 'Can I cancel my booking?' : '¿Puedo cancelar mi reserva?',
      content: locale === 'en'
        ? 'Yes, we offer flexible cancellation policies. Check the specific terms according to the type of tour.'
        : 'Sí, ofrecemos políticas de cancelación flexibles. Consulta los términos específicos según el tipo de tour.'
    },
    {
      title: locale === 'en' ? 'What happens if it rains during the tour?' : '¿Qué pasa si llueve durante el tour?',
      content: locale === 'en'
        ? 'Our tours operate in all weather conditions. We provide rain gear when necessary.'
        : 'Nuestros tours operan en todas las condiciones climáticas. Proporcionamos equipo de lluvia cuando es necesario.'
    },
    {
      title: locale === 'en' ? 'Do you offer private tours?' : '¿Ofrecen tours privados?',
      content: locale === 'en'
        ? 'Yes, all our tours can be customized as private experiences for small groups.'
        : 'Sí, todos nuestros tours pueden ser personalizados como experiencias privadas para grupos pequeños.'
    },
    {
      title: locale === 'en' ? 'How do I book a tour?' : '¿Cómo reservo un tour?',
      content: locale === 'en'
        ? 'You can book through our website, WhatsApp, email, or contact form. We respond within 24 hours.'
        : 'Puedes reservar a través de nuestra web, WhatsApp, email o formulario de contacto. Respondemos en 24 horas.'
    },
    {
      title: locale === 'en' ? 'What payment methods do you accept?' : '¿Qué métodos de pago aceptan?',
      content: locale === 'en'
        ? 'We accept credit cards, PayPal, bank transfers, and cash payments in our office in Cusco.'
        : 'Aceptamos tarjetas de crédito, PayPal, transferencias bancarias y pagos en efectivo en nuestra oficina en Cusco.'
    }
  ];

  const faqs = categoryFAQs[category] || generalFAQs;
  // Mostrar solo 6 FAQs en una distribución de 2 columnas (igual que Section7)
  const displayFaqs = faqs.slice(0, 6);

  const categoryTitles = {
    'inca-trail': locale === 'en' ? 'Inca Trail' : 'Camino Inca',
    'salkantay': 'Salkantay Trek',
    'machupicchu': 'Machu Picchu',
    'cusco': 'Cusco',
    'ausangate': 'Ausangate Trek',
    'day-tours': locale === 'en' ? 'Day Tours' : 'Tours de un Día',
    'peru-packages': locale === 'en' ? 'Peru Packages' : 'Paquetes Turísticos',
    'rainbow-mountain': locale === 'en' ? 'Rainbow Mountain' : 'Montaña de Colores',
    'alternative-tours': locale === 'en' ? 'Alternative Tours' : 'Tours Alternativos',
    'inca-jungle': 'Inca Jungle Trek'
  };

  const categoryTitle = categoryTitles[category] || category.charAt(0).toUpperCase() + category.slice(1);

  return (
    <>
      <Head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              mainEntity: displayFaqs.map((faq) => ({
                "@type": "Question",
                name: DOMPurify.sanitize(faq.title, { ALLOWED_TAGS: [] }),
                acceptedAnswer: {
                  "@type": "Answer",
                  text: DOMPurify.sanitize(faq.content, { ALLOWED_TAGS: [] })
                }
              }))
            })
          }}
        />
      </Head>

      {/* Usando las mismas clases CSS de faq.css que Section7 */}
      <section className="faq-section">
        <div className="faq-container">
          {/* Encabezado */}
          <div className="faq-header">
            <span className="faq-label">
              {locale === 'en' ? `${categoryTitle} FAQs` : `Preguntas sobre ${categoryTitle}`}
            </span>
            <h2 className="faq-title">
              {locale === 'en' ? 'Frequently Asked Questions' : 'Preguntas Frecuentes'}
            </h2>
            <p className="faq-subtitle">
              {locale === 'en'
                ? `Find answers to common questions about our ${categoryTitle.toLowerCase()} tours`
                : `Encuentra respuestas a las preguntas más comunes sobre nuestros tours de ${categoryTitle.toLowerCase()}`
              }
            </p>
          </div>

          {/* Grid de FAQs - 2 columnas */}
          <div className="faq-grid">
            {displayFaqs.map((faq, index) => (
              <div
                key={index}
                className={`faq-item ${openIndex === index ? 'open' : ''}`}
              >
                <button
                  className="faq-question"
                  onClick={() => toggleFaq(index)}
                  aria-expanded={openIndex === index}
                >
                  <span className="faq-number">{String(index + 1).padStart(2, '0')}</span>
                  <span className="faq-question-text">{faq.title}</span>
                  <span className="faq-icon">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M12 5v14M5 12h14" />
                    </svg>
                  </span>
                </button>
                <div className="faq-answer">
                  <p>{faq.content}</p>
                </div>
              </div>
            ))}
          </div>

          {/* CTA para ver más */}
          {faqs.length > 6 && (
            <div className="faq-cta">
              <p className="faq-cta-text">
                {locale === 'en'
                  ? `+${faqs.length - 6} more questions answered`
                  : `+${faqs.length - 6} preguntas más respondidas`
                }
              </p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}