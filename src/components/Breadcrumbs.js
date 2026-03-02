// components/Breadcrumbs.js
import Link from "next/link";
import { useRouter } from "next/router";
import en from '../lang/en/slug';
import es from '../lang/es/slug';
import { getCategoryTitle } from '../utils/categoryHelpers';

export default function Breadcrumbs({ title, category }) {
  const router = useRouter();
  const { locale } = router;
  const t = locale === 'en' ? en : es;

  const pathParts = router.asPath.split("?")[0].split("/").filter(Boolean);

  const buildBreadcrumbs = () => {
    const crumbs = [];

    pathParts.forEach((part, idx) => {
      const href = "/" + pathParts.slice(0, idx + 1).join("/");
      const label = part.replace(/-/g, " ");
      const capitalizedLabel = label.charAt(0).toUpperCase() + label.slice(1);

      crumbs.push({ href, label: capitalizedLabel });
    });

    // Reemplazar la última etiqueta por el título pasado
    if (title && crumbs.length > 0) {
      crumbs[crumbs.length - 1].label = title;
    }

    // Reemplazar la penúltima etiqueta por el category traducido (solo si hay al menos 2 elementos)
    if (category && crumbs.length > 1) {
      const categoryTitle = getCategoryTitle(category, locale);
      crumbs[crumbs.length - 2].label = categoryTitle;
      crumbs[crumbs.length - 2].href = `/${category}`;
    }

    return crumbs;
  };

  const breadcrumbs = buildBreadcrumbs();

  return (
    <div aria-label="Breadcrumb" className="text-sm mb-4 text-gray-700">
      <ol className="flex items-center space-x-2">
        <li className="flex items-center">
          <Link
            href="/"
            className="hover:underline text-gray-600 hover:text-[#fbb800] capitalize font-semibold">

            {t.breadcrumbs_home}

          </Link>
          {breadcrumbs.length > 0 && <span className="mx-2 text-gray-400">/</span>}
        </li>
        {breadcrumbs.map((crumb, idx) => (
          <li key={idx} className="flex items-center">
            {idx < breadcrumbs.length - 1 ? (
              <Link
                href={crumb.href}
                className="hover:underline text-gray-600 hover:text-[#fbb800] font-semibold">

                {crumb.label}

              </Link>
            ) : (
              <span className="text-gray-600 font-semibold">{crumb.label}</span>
            )}
            {idx < breadcrumbs.length - 1 && (
              <span className="mx-2 text-gray-400">/</span>
            )}
          </li>
        ))}
      </ol>
    </div>
  );
}
