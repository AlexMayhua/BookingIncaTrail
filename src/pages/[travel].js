import { useRouter } from 'next/router';
import { getCategoriesWithTours } from '@/modules/trips/service/trip.service';
import {
  getCategoryTitle,
  getCategoryDescription,
  getCategoryImagePath,
} from '@/utils/categoryHelpers';
import travelEN from '@/lang/en/travel';
import travelES from '@/lang/es/travel';
import TravelHero from '@/components/travel/TravelHero';
import TravelSeo from '@/components/travel/TravelSeo';
import TravelSectionTitle from '@/components/travel/TravelSectionTitle';
import TravelToursList from '@/components/travel/TravelToursList';

export default function TravelPage({
  category,
  categoryTitle,
  categoryDescription,
  categoryImagePath,
  tours,
}) {
  const { locale } = useRouter();
  const t = locale === 'en' ? travelEN : travelES;

  return (
    <>
      <TravelSeo
        categoryTitle={categoryTitle}
        categoryDescription={categoryDescription}
        categoryImage={categoryImagePath}
        category={category}
        locale={locale}
        trips={tours}
      />

      <TravelHero
        t={t}
        categoryTitle={categoryTitle}
        categoryDescription={categoryDescription}
        categoryImagePath={categoryImagePath}
        tripsCount={tours.length}
      />

      <section id='tours' className='max-w-[1400px] mx-auto px-4 md:px-6'>
        <TravelSectionTitle title={categoryTitle} />
        <TravelToursList t={t} trips={tours} />
      </section>
    </>
  );
}

export async function getStaticPaths() {
  const data = await getCategoriesWithTours('all');
  const paths = [];
  for (const { category } of data) {
    paths.push({ params: { travel: category }, locale: 'en' });
    paths.push({ params: { travel: category }, locale: 'es' });
  }
  return { paths, fallback: 'blocking' };
}

export async function getStaticProps({ params, locale }) {
  const lang = locale || 'es';
  const allCategories = await getCategoriesWithTours(lang);

  const current = allCategories.find((c) => c.category === params.travel);
  if (!current) {
    return { notFound: true };
  }

  const category = current.category;

  return {
    props: {
      category,
      categoryTitle: getCategoryTitle(category, lang),
      categoryDescription: getCategoryDescription(category, lang),
      categoryImagePath: getCategoryImagePath(category),
      tours: JSON.parse(JSON.stringify(current.tours)),
    },
    revalidate: 3600,
  };
}
