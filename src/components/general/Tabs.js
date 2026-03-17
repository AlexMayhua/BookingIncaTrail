import { useState, useRef, useEffect } from "react";
import parser from "html-react-parser";
import AccordionFromHtml from './AccordionFromHtml';
import { useRouter } from "next/router"

export default function Tabs({ tabsQuery }) {
  const [openTab, setOpenTab] = useState(0);
  const [navHeight, setNavHeight] = useState(0);
  const tabRefs = useRef([]);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [isStuck, setIsStuck] = useState(false);
  const sentinelRef = useRef(null);

  const getNavbarHeight = () => {
    const isMobile = window.matchMedia("(max-width: 1024px)").matches;
    if (isMobile) {
      const nav = document.getElementById("navbarMobile");
      return nav?.offsetHeight || 0;
    }

    const desktopNav = document.getElementById("navbarDesktop");
    const fullNav = desktopNav?.closest("nav");
    return (fullNav?.offsetHeight || desktopNav?.offsetHeight || 0) + 12  ;
  };

  useEffect(() => {
    const updateHeight = () => setNavHeight(getNavbarHeight());
    updateHeight();
    window.addEventListener("resize", updateHeight);
    return () => window.removeEventListener("resize", updateHeight);
  }, []);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;
    const observer = new IntersectionObserver(
      ([entry]) => setIsStuck(!entry.isIntersecting),
      { threshold: 0, rootMargin: `-${navHeight + 1}px 0px 0px 0px` }
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [navHeight]);

  useEffect(() => {
    if (!hasInteracted) return;

    tabRefs.current[openTab]?.scrollIntoView({
      behavior: "smooth",
      inline: "center",
      block: "nearest",
    });

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
    setHasInteracted(false);
  }, [router.asPath]);

  return (
    <div>
      <div ref={sentinelRef} className="h-0 w-full" aria-hidden="true" />

      <div
        className={`sticky z-20 bg-white border-b transition-shadow duration-200 ${isStuck ? 'shadow-md' : ''}`}
        style={{ top: `${navHeight}px` }}
      >
        <ul
          className="flex mb-0 list-none flex-nowrap overflow-x-auto pt-3 pb-1 scrollbar-hide"
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
                className={`text-sm font-bold px-4 py-3 md:px-5 md:py-4 block leading-normal whitespace-nowrap transition-colors duration-200 ease-in-out hover:bg-secondary text-primary ${
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
      </div>

      {/* Contenido de las tabs — se desliza debajo del tab bar sticky */}
      <div className="relative min-w-0 break-words bg-white w-full my-4">
        {tabsQuery.map((item, i) => (            
          <div
            key={i}
            id={`tabpanel${i}`}
            role="tabpanel"
            aria-labelledby={`tab${i}`}
            className={`custom-tailwind ${
              openTab === i ? "block" : "hidden"
            }`}
          >
            {item.title.toUpperCase() == "ITINERARY" || item.title.toUpperCase() == "ITINERARIO" ? <AccordionFromHtml key={item.slug} htmlContent={item.content} /> : parser(item.content) }
          </div>
        ))}
      </div>
    </div>
  );
}