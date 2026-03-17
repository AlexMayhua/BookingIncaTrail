import Image from 'next/image';
import { getImageUrl } from '../../utils/cacheHelpers';

/**
 * CachedImage Component
 *
 * Componente de imagen que agrega automáticamente cache busting
 * para evitar problemas cuando se reemplazan archivos con el mismo nombre.
 *
 * @param {Object} props - Propiedades del componente
 * @param {string} props.src - URL de la imagen
 * @param {string} props.alt - Texto alternativo
 * @param {boolean} props.useTimestamp - Usar timestamp para cache busting (default: false)
 * @param {string} props.className - Clases CSS
 * @param {Function} props.onError - Callback de error
 * @param {Function} props.onLoad - Callback cuando carga
 * @param {Object} props.rest - Otras propiedades HTML
 */
export default function CachedImage({
  src,
  alt,
  useTimestamp = false,
  className = '',
  onError,
  onLoad,
  width = 200,
  height = 56,
  ...rest
}) {
  // Agregar cache busting a la URL
  const cachedSrc = src ? getImageUrl(src, useTimestamp) : '';

  const handleError = (e) => {
    console.warn(`Error cargando imagen: ${src}`);
    if (onError) onError(e);
  };

  const { style: customStyle, ...otherProps } = rest;

  return (
    <Image
      src={cachedSrc}
      alt={alt || ''}
      className={className}
      onError={handleError}
      onLoad={onLoad}
      width={width}
      height={height}
      style={{ width: 'auto', height: 'auto', ...customStyle }}
      {...otherProps}
    />
  );
}
