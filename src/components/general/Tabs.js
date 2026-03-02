import { useState, useRef, useEffect } from "react";
import parser from "html-react-parser";
import AccordionFromHtml from './AccordionFromHtml';
import { useRouter } from "next/router"

export default function Tabs({ tabsQuery }) {
  const [openTab, setOpenTab] = useState(0);
  const [navHeight, setNavHeight] = useState(0);
  const tabRefs = useRef([]);
  const [hasInteracted, setHasInteracted] = useState(false);

  // Calcula la altura del navbar según dispositivo
  const getNavbarHeight = () => {
    const isMobile = window.matchMedia("(max-width: 1024px)").matches;
    const nav = isMobile
      ? document.getElementById("navbarMobile")
      : document.getElementById("navbarDesktop");
    return nav?.offsetHeight || 0;
  };

  // Actualiza altura del navbar al cambiar tamaño de ventana
  useEffect(() => {
    const updateHeight = () => setNavHeight(getNavbarHeight());
    updateHeight();
    window.addEventListener("resize", updateHeight);
    return () => window.removeEventListener("resize", updateHeight);
  }, []);

  // Manejo de scroll y centrado de tab al cambiar pestaña
  useEffect(() => {
    if (!hasInteracted) return;

    // Centra la pestaña seleccionada horizontalmente
    tabRefs.current[openTab]?.scrollIntoView({
      behavior: "smooth",
      inline: "center",
      block: "nearest",
    });

    // Desplaza el contenido teniendo en cuenta el navbar sticky
    const content = document.getElementById(`tabpanel${openTab}`);
    if (content) {
      const y = content.getBoundingClientRect().top + window.scrollY - navHeight - 80;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  }, [openTab, hasInteracted, navHeight]);

  const handleTabChange = (i) => {
    setOpenTab(i);
    setHasInteracted(true);
  };

  const router = useRouter();

  useEffect(() => {
    setOpenTab(0);
    setHasInteracted(false); // reinicia el scroll automático si lo deseas
  }, [router.asPath]);

  let holis = false;

  return (
    <div className="flex flex-wrap">
      <div className="w-full">
        {/* Barra de tabs sticky y scroll horizontal */}
        <ul
          className="flex mb-0 list-none flex-nowrap overflow-x-auto pt-3 pb-1 sticky border-b z-20 bg-white scrollbar-hide"
          style={{ top: `${navHeight}px` }}
          role="tablist"
        >
          {tabsQuery.map((item, i) => (
            <li key={i} role="presentation" className="flex-shrink-0 ml-0 mr-2 last:mr-0 text-stone-700 text-center">
              <a
                ref={(el) => (tabRefs.current[i] = el)}
                id={`tab${i}`}
                role="tab"
                aria-selected={openTab === i}
                aria-controls={`tabpanel${i}`}
                className={`text-sm font-bold px-5 py-4 block leading-normal whitespace-nowrap transition-colors duration-200 ease-in-out hover:bg-secondary text-primary ${
                  openTab === i ? "bg-secondary rounded-t-md" : "rounded-t-md bg-stone-200"
                }`}
                onClick={(e) => {
                  e.preventDefault();
                  handleTabChange(i);
                }}
                href={`#tabpanel${i}`}
              >                
                {item.title}
              </a>
            </li>
          ))}
        </ul>

        {/* Contenido de las tabs con transición suave */}
        <div className="relative flex flex-col min-w-0 break-words bg-white w-full my-4">
          {tabsQuery.map((item, i) => (            
            <div
              key={i}
              id={`tabpanel${i}`}
              role="tabpanel"
              aria-labelledby={`tab${i}`}
              className={`transition-opacity duration-500 ease-in-out custom-tailwind ${
                openTab === i ? "opacity-100 block" : "opacity-0 hidden"
              }`}
            >
              {item.title.toUpperCase() == "ITINERARY" || item.title.toUpperCase() == "ITINERARIO" ? <AccordionFromHtml key={item.slug} htmlContent={item.content} /> : parser(item.content) }
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}