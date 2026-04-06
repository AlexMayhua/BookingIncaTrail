export function getHeaderHeight() {
  if (typeof window === 'undefined') return 0;

  const header = document.getElementById('headerDesktop');

  return Math.ceil(
    header?.getBoundingClientRect().height || header?.offsetHeight || 0,
  );
}
