import { useLayoutEffect, useState } from 'react';
import { getHeaderHeight } from '@/utils/headerOffset';

export default function useHeaderOffset(extraOffset = 0) {
  const [headerOffset, setHeaderOffset] = useState(0);

  useLayoutEffect(() => {
    const updateOffset = () => {
      setHeaderOffset(getHeaderHeight() + extraOffset);
    };

    updateOffset();

    const header = document.getElementById('headerDesktop');
    const resizeObserver =
      typeof ResizeObserver !== 'undefined' && header
        ? new ResizeObserver(updateOffset)
        : null;

    resizeObserver?.observe(header);
    window.addEventListener('resize', updateOffset);
    window.addEventListener('orientationchange', updateOffset);

    let isActive = true;
    document.fonts?.ready?.then(() => {
      if (isActive) updateOffset();
    });

    return () => {
      isActive = false;
      resizeObserver?.disconnect();
      window.removeEventListener('resize', updateOffset);
      window.removeEventListener('orientationchange', updateOffset);
    };
  }, [extraOffset]);

  return headerOffset;
}
