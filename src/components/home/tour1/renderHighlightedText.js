export function renderHighlightedText(
  text = '',
  {
    highlightClassName = 'font-bold text-black/80',
    textClassName = 'font-normal text-black/75',
  } = {},
) {
  const parts = String(text).split(/(\*\*[^*]+\*\*)/g);

  return parts.map((part, index) => {
    const isHighlighted = part.startsWith('**') && part.endsWith('**');

    if (isHighlighted) {
      return (
        <span key={`${part}-${index}`} className={highlightClassName}>
          {part.slice(2, -2)}
        </span>
      );
    }

    return (
      <span key={`${part}-${index}`} className={textClassName}>
        {part}
      </span>
    );
  });
}
