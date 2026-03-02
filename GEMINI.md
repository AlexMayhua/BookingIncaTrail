# BookingIncatrail

## Project Overview

Plataforma de reservas de viajes Next.js 15 especializada en tours de aventura en Perú (Camino Inca, Machu Picchu, Salkantay, etc.). Soporte bilingüe (ES/EN), autenticación JWT, reservas con PayPal, y dashboard admin.

**Tech Stack:** Next.js 15.1.3, React 19.0.0, MongoDB + Mongoose 8.9.5, Tailwind CSS 3.4.17, PayPal, Resend, Cloudinary

## Development Commands

```bash
npm run dev        # Desarrollo (puerto 3000)
npm run build      # Build producción
npm start          # Servidor producción
npm run backup     # Backup de BD
```

## Environment Variables

```env
MONGODB_URI=...
ACCESS_TOKEN_SECRET=...     # ⚠️ NO usar NEXT_PUBLIC_
REFRESH_TOKEN_SECRET=...    # ⚠️ NO usar NEXT_PUBLIC_
NEXT_PUBLIC_PAYPAL_CLIENT_ID=...
RESEND_TOKEN=...
NEXT_PUBLIC_BRAND_NAME=BookingIncatrail
NEXT_PUBLIC_SITE_URL=https://...
```

## Directory Structure

- `pages/` - Next.js Pages Router
  - `[category].js` - Páginas de categorías de tours
  - `book/` - Flujo de reserva (index → payment → confirmation)
  - `admin/` - Dashboard administrativo
  - `api/` - API Routes
- `src/components/` - Componentes (general/, navbar/, footer/, home/)
- `src/models/` - Esquemas Mongoose (User, Trip, Reservation, Blog, Coupon)
- `src/store/` - Estado global con Context API
- `src/utils/` - Utilidades (db.js, fetchData.js, valid.js)
- `src/lang/` - Traducciones (es/, en/)

## Key Conventions

### Next.js 15 Changes
- `<Link>` NO necesita `<a>` hijo
- `<Image>` usa `fill` en lugar de `layout="fill"`
- `next.config.js` usa `remotePatterns` para imágenes

### API Routes
- Ruta: `pages/api/`
- Rutas protegidas usan middleware `auth(req, res)`
- Formato respuesta: `{ msg: '...', data: ... }` o `{ err: '...' }`

### Database
- Siempre usar `await connectDB()` antes de operaciones Mongoose
- Modelos en `src/models/`

### Styling
- Tailwind utility classes
- Estilos globales en `src/styles/globals.css`

## Important Notes for Agents

1. **Bilingüe:** Cambios de texto en ambos `src/lang/es` y `src/lang/en`
2. **Backup:** Usar `npm run backup` antes de modificar BD
3. **Imágenes:** Usar prop `sizes` con componente Image de Next.js
4. **JWT:** Nunca exponer secrets con `NEXT_PUBLIC_`
