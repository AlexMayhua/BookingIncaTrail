# Installation

## Requisitos

- Node.js compatible con Next.js 15.
- npm, porque existe `package-lock.json` y los scripts están definidos para npm.
- Acceso a una base MongoDB válida para ejecutar páginas/APIs que consultan trips o usuarios.

## Instalacion Local

```bash
npm install
```

## Variables De Entorno

Crear un archivo local basado en `.env.example`. No copiar valores sensibles reales a documentación ni repositorios.

```bash
cp .env.example .env.local
```

Editar `.env.local` con valores reales o de desarrollo. Como mínimo, `MONGODB_URI` es necesario porque `src/lib/mongodb.js` lanza error si no existe.

## Desarrollo

```bash
npm run dev
```

El script inicia Next.js en el puerto `3000`:

```bash
next dev -p 3000
```

## Build

```bash
npm run build
```

El build ejecuta primero:

```bash
npm run navbar:generate
```

Ese script intenta generar `src/data/navbarSnapshot.json` desde MongoDB. Si falta `MONGODB_URI` o falla la conexión, conserva un snapshot existente o escribe un fallback vacío si no existe.

## Produccion Local

```bash
npm run start
```

Equivale a:

```bash
next start -H 0.0.0.0 -p 3000
```

## Scripts Disponibles

- `dev`: inicia servidor de desarrollo en puerto 3000.
- `build`: genera snapshot de navbar y ejecuta `next build`.
- `start`: inicia servidor Next de producción.
- `postbuild`: imprime `Runtime sitemap routes enabled`.
- `navbar:generate`: genera `src/data/navbarSnapshot.json` desde MongoDB.
- `backup` y `db:backup`: ejecutan `scripts/backup-mongodb.js`, pero ese archivo no fue encontrado en el árbol revisado. Pendiente de confirmar.
- `check-favicons`: ejecuta `scripts/generate-favicons.js`, pero ese archivo no fue encontrado en el árbol revisado. Pendiente de confirmar.
- `trip:migrate-gallery:dry`: ejecuta migración de imágenes en modo dry-run.
- `trip:migrate-gallery`: ejecuta migración de imágenes con `--apply`.

## Alias De Imports

`jsconfig.json` define:

```json
{
  "@/*": ["src/*"]
}
```

Esto permite imports como `@/modules/trips/service/trip.service`.
