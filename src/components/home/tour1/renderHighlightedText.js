import { Fragment } from 'react';

export function renderHighlightedText(text = '') {
  const parts = String(text).split(/(\*\*[^*]+\*\*)/g);

  return parts.map((part, index) => {
    const isHighlighted = part.startsWith('**') && part.endsWith('**');

    if (isHighlighted) {
      return (
        <span key={`${part}-${index}`} className='font-bold text-black/80'>
          {part.slice(2, -2)}
        </span>
      );
    }

    return (
      <span key={`${part}-${index}`} className='font-normal text-black/75'>
        {part}
      </span>
    );
  });
}
