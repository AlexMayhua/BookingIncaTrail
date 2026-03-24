export function normalizeValue(value) {
  return String(value || '')
    .trim()
    .toLowerCase()
    .replace(/[\s_]+/g, '-')
    .replace(/-+/g, '-');
}

export function matchesTerms(tour, terms) {
  const values = [tour?.category, tour?.slug, tour?.title]
    .map(normalizeValue)
    .filter(Boolean);

  return terms.some((term) => {
    const normalizedTerm = normalizeValue(term);
    return values.some((value) => value.includes(normalizedTerm));
  });
}

export function matchesStrictTerms(tour, terms) {
  const normalizedTerms = terms.map(normalizeValue).filter(Boolean);

  if (!normalizedTerms.length) {
    return true;
  }

  const normalizedCategory = normalizeValue(tour?.category);

  if (normalizedCategory && normalizedTerms.includes(normalizedCategory)) {
    return true;
  }

  const normalizedSlug = normalizeValue(tour?.slug);
  return normalizedSlug ? normalizedTerms.includes(normalizedSlug) : false;
}

export function getUniqueTours(tours = []) {
  const seen = new Set();

  return tours.filter((tour) => {
    const id = normalizeValue(tour?.slug || tour?._id);

    if (!id || seen.has(id)) {
      return false;
    }

    seen.add(id);
    return true;
  });
}
