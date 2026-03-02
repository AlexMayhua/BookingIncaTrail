# BookingIncatrail

> **Plataforma de Reservas de Tours de Aventura en Perú**  
> Sistema completo de gestión de tours especializados en Camino Inca, Machu Picchu, Salkantay y destinos turísticos de Perú. Incluye motor de reservas, sistema de pagos, panel administrativo y optimización SEO.

---

## 📖 Tabla de Contenidos

- [Stack Tecnológico](#-stack-tecnológico)
- [Características Principales](#-características-principales)
- [Inicio Rápido](#-inicio-rápido)
- [Configuración](#-configuración)
- [Arquitectura del Proyecto](#-arquitectura-del-proyecto)
- [Base de Datos](#-base-de-datos)
- [Seguridad y Autenticación](#-seguridad-y-autenticación)
- [Sistema de Reservas](#-sistema-de-reservas)
- [Guía de Desarrollo](#-guía-de-desarrollo)
- [Mantenimiento](#-mantenimiento)

---

## 🛠 Stack Tecnológico

### Frontend
- **Framework:** Next.js 15.1.3 (App Router + Pages Router híbrido)
- **UI Library:** React 19.0.0
- **Estilos:** Tailwind CSS 3.4.17
- **Estado Global:** Context API
- **Optimización de Imágenes:** Next/Image + Cloudinary

### Backend
- **Runtime:** Node.js
- **Base de Datos:** MongoDB 8.x
- **ODM:** Mongoose 8.9.5
- **API:** Next.js API Routes

### Servicios Externos
- **Procesamiento de Pagos:** PayPal SDK
- **Servicio de Email:** Resend API
- **Almacenamiento de Imágenes:** Cloudinary
- **SEO:** next-sitemap para generación automática de sitemaps

### Características Técnicas
- ✅ **SSG/SSR:** Static Site Generation + Server-Side Rendering
- ✅ **ISR:** Incremental Static Regeneration para tours
- ✅ **i18n:** Sistema bilingüe (Español/Inglés) sin librerías externas
- ✅ **PWA Ready:** Manifest configurado para Progressive Web App

---

## 🎯 Características Principales

### Sistema de Gestión de Tours
- **Catálogo Multilingüe:** Tours con descripciones, itinerarios y detalles en ES/EN
- **13 Categorías Activas:** inca-trail, salkantay, machupicchu, choquequirao, day-tours, family-tours, inca-jungle, luxury-glamping, peru-packages, rainbow-mountain, sacred-lakes, sustainable-tours, ausangate
- **Gestión de Imágenes:** Sistema de caché busting para imágenes del navbar dinámico
- **SEO Optimizado:** Meta tags, Open Graph, Twitter Cards, structured data

### Motor de Reservas
- **Flujo Multi-Paso:** Selección de tour → Fecha → Pasajeros → Pago → Confirmación
- **Precios Dinámicos:** Descuentos automáticos por tamaño de grupo
- **Sistema de Cupones:** Códigos de descuento con validación de expiración
- **Calendario de Disponibilidad:** Control de cupos por fecha

### Panel Administrativo
- **Gestión de Tours:** CRUD completo con editor WYSIWYG (ReactQuill)
- **Gestión de Reservas:** Visualización, filtrado y actualización de estado
- **Blog Management:** Sistema de contenido con Markdown
- **Sistema de Cupones:** Creación y gestión de descuentos
- **Dashboard Analytics:** Estadísticas en tiempo real desde MongoDB

### Integración de Pagos
- **PayPal Integration:** Pago de depósito (30%) o pago total (100%)
- **Procesamiento Seguro:** Verificación de transacciones en servidor
- **Confirmación Automática:** Emails transaccionales vía Resend

### SEO y Performance
- **Sitemap Dinámico:** Generación automática con next-sitemap
- **Meta Tags Dinámicos:** next-seo para cada página
- **Robots.txt:** Configuración optimizada para crawlers
- **Optimización de Imágenes:** Lazy loading, formatos modernos (WebP)
- **Cache Strategy:** Implementación de cache busting para assets críticos

---

## 🚀 Inicio Rápido

### Prerrequisitos
- Node.js 18.x o superior
- MongoDB 6.x o superior
- npm o yarn

### Instalación

```bash
# 1. Clonar el repositorio
git clone https://github.com/milith0kun/BookingIncaTRail.git
cd BookingIncaTRail

# 2. Instalar dependencias
npm install

---

## ⚙️ Configuración

### Variables de Entorno

Crear archivo `.env` en la raíz del proyecto:

```env
# ==========================================
# BASE DE DATOS
# ==========================================
MONGODB_URI=mongodb://localhost:27017/bookingincatrail
# Para MongoDB Atlas:
# MONGODB_URI=mongodb+srv://usuario:password@cluster.mongodb.net/bookingincatrail

# ==========================================
# AUTENTICACIÓN JWT
# ⚠️ CRÍTICO: NO usar prefijo NEXT_PUBLIC_
# ==========================================
ACCESS_TOKEN_SECRET=tu_secret_access_token_muy_seguro_min_32_caracteres
REFRESH_TOKEN_SECRET=tu_secret_refresh_token_muy_seguro_min_32_caracteres
# Generar secrets seguros:
# node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# ==========================================
# SERVICIOS EXTERNOS
---

## 📁 Arquitectura del Proyecto

### Estructura de Directorios

```
BookingIncatrail/
│
├── public/                          # Assets estáticos
│   ├── assets/                      # Iconos, logos, imágenes generales
│   ├── fonts/                       # Fuentes web (Trustpilot)
│   ├── img/                         # Imágenes organizadas por sección
│   │   ├── navbar/                  # Imágenes del navbar dinámico (por categoría)
│   │   ├── footer/                  # Logos de certificaciones
│   │   ├── hero/                    # Imágenes de héroes
│   │   └── other/                   # Otras imágenes
│   ├── sitemap.xml                  # Sitemap principal (generado)
│   ├── sitemap-0.xml                # URLs del sitemap (generado)
│   ├── robots.txt                   # Configuración para crawlers (generado)
│   └── site.webmanifest             # PWA manifest
│
├── scripts/                         # Scripts de utilidad y mantenimiento
│   ├── manage-users.js              # CLI para gestión de usuarios
│   ├── verify-sync.js               # Verificación de sincronización ES/EN
│   ├── audit-seo-fields.js          # Auditoría de campos SEO
│   ├── migrate-categories-2026.js   # Script de migración de categorías
│   └── extract_trips_from_db.js     # Exportación de datos
│
├── src/
│   ├── components/                  # Componentes React
│   │   ├── general/                 # Componentes reutilizables
│   │   │   ├── CategoryCard.js      # Tarjeta de categoría de tour
│   │   │   ├── TourCard.js          # Tarjeta de tour individual
│   │   │   ├── TourItem.js          # Item de tour en listados
│   │   │   └── ...                  # Otros componentes generales
│   │   ├── navbar/                  # Sistema de navegación
│   │   │   ├── Navbar.js            # Navbar principal con menú dinámico
│   │   │   ├── LanguageSelector.js  # Selector de idioma
│   │   │   └── MobileMenu.js        # Menú móvil
│   │   ├── footer/                  # Footer del sitio
│   │   ├── home/                    # Secciones específicas del home
│   │   ├── category/                # Componentes para páginas de categorías
│   │   ├── seo/                     # Componentes de SEO
│   │   └── [otros componentes]
│   │
│   ├── models/                      # Esquemas de Mongoose (MongoDB)
│   │   ├── tripModel.js             # Modelo de tours
│   │   ├── reservationModel.js      # Modelo de reservas
│   │   ├── userModel.js             # Modelo de usuarios
---

## 🗄️ Base de Datos

### Esquema de Modelos (MongoDB + Mongoose)

#### 1. **User** - Sistema de Autenticación
```javascript
{
  name: String,
  email: String (unique, lowercase),
---

## 🔐 Seguridad y Autenticación

### Sistema de Autenticación JWT

El sistema implementa **autenticación basada en tokens JWT** con dos tipos de tokens:

#### 1. Access Token (Token de Acceso)
- **Duración:** 30 minutos
- **Almacenamiento:** Variable de estado (Context API)
- **Propósito:** Autorización de peticiones API
- **Renovación:** Automática vía Refresh Token

#### 2. Refresh Token (Token de Actualización)
- **Duración:** 7 días
- **Almacenamiento:** Cookie HttpOnly (segura, no accesible desde JavaScript)
- **Propósito:** Renovar Access Token sin re-autenticación
- **Seguridad:** No puede ser leído por código malicioso

### Flujo de Autenticación

```mermaid
Usuario → Login Form → POST /api/auth/login
                            ↓
                    Verificar credenciales
                            ↓
                    Generar Access Token (30min)
                    Generar Refresh Token (7 días)
                            ↓
                    Access Token → Response body
                    Refresh Token → HttpOnly Cookie
                            ↓
                    Usuario autenticado ✓
```

### Endpoints de Autenticación

#### Login
```javascript
POST /api/auth/login
Body: { email, password }
Response: { 
  access_token: "jwt_token",
  user: { name, email, role, avatar }
}
Set-Cookie: refreshtoken=xxx; HttpOnly; Secure; SameSite=Strict
```

#### Logout
```javascript
POST /api/auth/logout
Response: { msg: "Logged out successfully" }
Set-Cookie: refreshtoken=; Max-Age=0
```

#### Refresh Token
```javascript
POST /api/auth/accessToken
Cookie: refreshtoken=xxx
Response: { access_token: "new_jwt_token" }
```
---

## 💳 Sistema de Reservas

### Flujo Completo de Reserva

```mermaid
1. Selección de Tour
---

## 💻 Guía de Desarrollo

### Convenciones de Código

#### 1. API Responses (Estándar del Proyecto)
```javascript
// ✅ Respuesta exitosa
res.status(200).json({ 
  msg: "Operation successful",
  data: { ... }  // Opcional
})

// ❌ Respuesta de error
res.status(400).json({ 
  err: "Error message"
})

// ℹ️ Códigos de estado comunes
200 - OK (GET, PUT exitoso)
201 - Created (POST exitoso)
400 - Bad Request (validación fallida)
401 - Unauthorized (no autenticado)
403 - Forbidden (no autorizado)
404 - Not Found
405 - Method Not Allowed
500 - Internal Server Error
```

#### 2. Next.js 15 - Mejores Prácticas

```jsx
// ✅ Link sin <a> anidado (Next.js 13+)
<Link href="/tours/inca-trail" className="btn-primary">
  Ver Tour
</Link>

// ❌ INCORRECTO (Next.js < 13)
<Link href="/path">
  <a className="btn">Click</a>
</Link>

// ✅ Image con prop sizes (requerido con fill)
<Image 
  src="/img/hero.jpg"
  fill
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
  alt="Machu Picchu"
  priority
/>

// ✅ Image con dimensiones fijas
<Image 
  src="/logo.png"
  width={200}
  height={50}
  alt="BookingIncatrail Logo"
/>

// ✅ Script con estrategia next/script
<Script 
  src="https://analytics.example.com/script.js"
  strategy="lazyOnload"
/>
```

#### 3. Conexión a Base de Datos

```javascript
// ✅ SIEMPRE conectar antes de operaciones
import connectDB from '@/utils/db'

export default async function handler(req, res) {
  await connectDB()  // Conexión singleton, segura para múltiples llamadas
  
  // Operaciones con Mongoose
  const trips = await Trip.find({ active: true })
  
  return res.status(200).json({ data: trips })
}

// ℹ️ La conexión se cachea automáticamente
// No es necesario verificar si ya está conectado
```

#### 4. Traducciones (Sistema Bilingüe)

```javascript
// Estructura de archivos
src/lang/
  ├── es/
  │   ├── navbar.js
  │   ├── home.js
  │   └── footer.js
  └── en/
      ├── navbar.js
      ├── home.js
      └── footer.js

// ✅ Uso en componentes
import esLang from '@/lang/es/navbar'
import enLang from '@/lang/en/navbar'

const lang = locale === 'es' ? esLang : enLang

// Renderizado
<h1>{lang.title}</h1>
<p>{lang.description}</p>

// ⚠️ IMPORTANTE: Mantener claves sincronizadas entre ES/EN
```

#### 5. Manejo de Estado Global

```javascript
// Uso del Context API
import { DataContext } from '@/store/GlobalState'

function MyComponent() {
  const { state, dispatch } = useContext(DataContext)
  const { auth, cart } = state
  
  // Dispatch de acciones
  dispatch({ type: 'ADD_TO_CART', payload: item })
  
  return <div>{auth.user?.name}</div>
}

// Acciones disponibles (store/Actions.js)
ACTIONS = {
  NOTIFY: 'NOTIFY',
  AUTH: 'AUTH',
  ADD_TO_CART: 'ADD_TO_CART',
  // ... más acciones
}
```

#### 6. Validaciones de Formularios

```javascript
import { valid } from '@/utils/valid'

// Validación de email y password
const { errMsg } = valid(name, email, password, cf_password)

if (errMsg) {
  return dispatch({ 
    type: 'NOTIFY', 
    payload: { error: errMsg } 
  })
}

// Validaciones disponibles:
// - Email válido
// - Password min 6 caracteres
// - Confirmación de password
// - Nombre no vacío
```

#### 7. Upload de Imágenes a Cloudinary

```javascript
import { uploadImage } from '@/utils/imageUpload'

async function handleImageUpload(file) {
  try {
    const url = await uploadImage(file)
---

## 🔧 Mantenimiento

### Backup de Base de Datos

```bash
# Crear backup
npm run backup

# Restaurar backup
mongorestore --uri="mongodb://localhost:27017" dump/bookingincatrail/
```

### Gestión de Usuarios

```bash
# Crear usuario administrador
node scripts/manage-users.js

# Opciones disponibles:
# 1. Listar usuarios
# 2. Crear admin
# 3. Cambiar rol
# 4. Eliminar usuario
```

### Regeneración de Sitemaps

```bash
# Manual
npm run postbuild

# Automático después de cada build
npm run build  # Ejecuta postbuild automáticamente
```

### Verificación de Integridad

```bash
# Verificar sincronización ES/EN
node scripts/verify-sync.js

# Auditar campos SEO
node scripts/audit-seo-fields.js

# Verificar categorías en sitemap
grep -c "inca-trail" public/sitemap-0.xml
```

### Optimización de Imágenes

```bash
# Comprimir imágenes nuevas antes de subir
# Herramientas recomendadas:
# - TinyPNG (online)
# - ImageOptim (macOS)
# - Squoosh (PWA de Google)
```

### Limpieza de Código

El proyecto ha sido sometido a un proceso exhaustivo de limpieza de código (Enero 2026):

✅ **Completado**:
- Eliminación de código hardcodeado (40+ descripciones de tours migradas a traducciones)
- Reducción de archivos de idioma en 78% (319 → 69 líneas en navbar.js)
- Eliminación de 11 archivos obsoletos
- Remoción de ~1,200+ líneas de código innecesario
- Liberación de ~7.15MB de espacio
- Sistema de 77 verificaciones automatizadas (100% passing)
- Sitemaps limpios sin categorías obsoletas (alternative-tours, cusco eliminadas)
- Configuración next-sitemap.config.js actualizada con exclusiones

### Monitoreo de Errores

```javascript
// En producción, implementar sistema de logging
// Opciones recomendadas:
// - Sentry (tracking de errores)
// - LogRocket (sesión de usuario)
// - Datadog (infraestructura)
```

### Actualización de Dependencias

```bash
# Verificar dependencias desactualizadas
npm outdated

# Actualizar dependencias patch/minor
npm update

# Actualizar dependencia específica
npm install package@latest

# ⚠️ Probar exhaustivamente después de actualizar Next.js o React
```

---

## ⚠️ Notas Importantes

### Seguridad

1. **JWT Secrets**: NUNCA usar prefijo `NEXT_PUBLIC_` para secrets
   ```env
   # ❌ INCORRECTO
   NEXT_PUBLIC_ACCESS_TOKEN_SECRET=secret123
   
   # ✅ CORRECTO
   ACCESS_TOKEN_SECRET=secret123
   ```

2. **Variables de Entorno**: Solo las que empiezan con `NEXT_PUBLIC_` son accesibles en el cliente

3. **API Keys**: Mantener Cloudinary, PayPal y Resend tokens en `.env` (no versionado)

### Bilingüe

4. **Traducciones**: TODO cambio de texto debe reflejarse en `src/lang/es/` Y `src/lang/en/`

5. **Verificación**: Ejecutar `node scripts/verify-sync.js` para detectar inconsistencias

### Performance

6. **Imágenes**: SIEMPRE usar prop `sizes` con `<Image fill />`

7. **SEO**: Regenerar sitemap después de cambios en categorías: `npm run postbuild`

8. **Cache**: El sistema de cache busting se actualiza automáticamente

### Base de Datos

9. **Backup**: Ejecutar `npm run backup` ANTES de:
   - Migraciones de datos
   - Cambios en esquemas
   - Actualizaciones masivas

10. **Conexión**: Usar `await connectDB()` en TODAS las API routes que usen Mongoose

### Desarrollo

11. **Categorías Válidas**: Solo estas 13 categorías están activas:
    - inca-trail, salkantay, machupicchu, choquequirao
    - day-tours, family-tours, inca-jungle, luxury-glamping
    - peru-packages, rainbow-mountain, sacred-lakes
    - sustainable-tours, ausangate

12. **Scripts de Verificación**: Ejecutar antes de deploy:
    ```bash
    node scripts/verify-sync.js
    node scripts/audit-seo-fields.js
    ```

---

## 📞 Soporte

Para problemas técnicos o preguntas sobre el código:
- **Email**: desarrollo@bookingincatrail.com
- **Documentación**: Este README
- **Scripts de ayuda**: `scripts/` directory

---

## 📄 Licencia

**Proyecto Privado** - Todos los derechos reservados © 2026 BookingIncatrail

Este código es propiedad privada de BookingIncatrail y no puede ser:
- Copiado
- Modificado
- Distribuido
- Usado comercialmente

Sin autorización explícita por escrito del propietario.

---

## 📊 Estadísticas del Proyecto

| Métrica | Valor |
|---------|-------|
| **Tours Activos** | 66 |
| **Categorías** | 13 |
| **Idiomas** | 2 (ES/EN) |
| **Modelos DB** | 6 |
| **API Endpoints** | 30+ |
| **Componentes React** | 40+ |
| **Scripts Utilidad** | 10+ |
| **Verificaciones Automatizadas** | 77 |
| **Uptime Target** | 99.9% |
| **Código Limpiado** | ~1,200 líneas eliminadas |
| **Espacio Liberado** | ~7.15MB |

---

**Última Actualización**: 24 de Enero de 2026  
**Versión**: 2.0.0  
**Next.js**: 15.1.3  
**React**: 19.0.0

#### 8. Cache Busting para Imágenes

```javascript
import { getImageUrl } from '@/utils/cacheHelpers'

// Agregar parámetro v=timestamp a URLs
const imageUrl = getImageUrl('/img/navbar/inca-trail.jpg')
// Result: /img/navbar/inca-trail.jpg?v=1706140800000

// Útil para forzar recarga de imágenes actualizadas
```

#### 9. Helpers de Categorías

```javascript
import { 
  getValidCategories,
  getCategoryMetadata,
  isCategoryValid 
} from '@/utils/categoryHelpers'

// Lista de categorías válidas
const categories = getValidCategories()
// ['inca-trail', 'salkantay', ...]

// Metadata de categoría
const metadata = getCategoryMetadata('inca-trail')
// { name: 'Inca Trail', slug: 'inca-trail', icon: '🏔️' }

// Validación
if (!isCategoryValid(category)) {
  return { notFound: true }
}
```

### Estructura de Componentes

```jsx
// Componente funcional estándar
import React from 'react'
import Link from 'next/link'
import Image from 'next/image'

export default function TourCard({ tour, locale = 'es' }) {
  const title = locale === 'es' ? tour.title : tour.title_en
  
  return (
    <div className="tour-card">
      <div className="relative h-48">
        <Image 
          src={tour.thumbnail}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          alt={title}
          className="object-cover"
        />
      </div>
      
      <h3 className="text-xl font-bold">{title}</h3>
      
      <Link href={`/${tour.category}/${tour.slug}`}>
        Ver Detalles
      </Link>
    </div>
  )
}
```

### Testing Manual

```bash
# Verificar sincronización de traducciones
node scripts/verify-sync.js

# Auditar campos SEO
node scripts/audit-seo-fields.js

# Verificar que todas las categorías están en el sitemap
grep -E "(inca-trail|salkantay|machupicchu)" public/sitemap-0.xml
```

### Debugging

```javascript
// ✅ Usar console.error para errores (no eliminado en producción)
console.error('Database connection failed:', error)

// ⚠️ console.log se elimina en builds de producción
// Solo usar para debugging temporal

// ✅ Mejor para debugging persistente
if (process.env.NODE_ENV === 'development') {
  console.log('Debug info:', data)
}
```javascript
// Datos necesarios
{
  trip: Trip (datos del tour),
  selectedDate: Date,
  numberOfPeople: Number (1-20),
  language: String ('es' | 'en')
}
```

### 2. Cálculo de Precios Dinámico

#### Precio Base
```javascript
const basePrice = trip.price * numberOfPeople
```

#### Descuentos por Tamaño de Grupo
```javascript
const groupDiscounts = [
  { minSize: 1, maxSize: 1, discountPercentage: 0 },
  { minSize: 2, maxSize: 3, discountPercentage: 5 },
  { minSize: 4, maxSize: 6, discountPercentage: 10 },
  { minSize: 7, maxSize: 10, discountPercentage: 15 },
  { minSize: 11, maxSize: 20, discountPercentage: 20 }
]

function getGroupDiscount(numberOfPeople) {
  const discount = groupDiscounts.find(
    d => numberOfPeople >= d.minSize && numberOfPeople <= d.maxSize
  )
  return discount?.discountPercentage || 0
}
```

#### Cupones de Descuento
```javascript
// Validación de cupón
POST /api/coupons/validate
Body: { code, tripId, totalAmount }

Response: {
  valid: Boolean,
  discountAmount: Number,
  finalAmount: Number
}
```

#### Precio Final
```javascript
const basePrice = trip.price * numberOfPeople
const groupDiscountAmount = basePrice * (groupDiscountPercent / 100)
const subtotal = basePrice - groupDiscountAmount
const couponDiscountAmount = coupon ? calculateCouponDiscount(subtotal, coupon) : 0
const finalPrice = subtotal - couponDiscountAmount
```

### 3. Integración con PayPal

#### Inicialización del SDK
```javascript
// En _app.js
<PayPalScriptProvider options={{
  "client-id": process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID,
  currency: "USD",
  intent: "capture"
}}>
```

#### Creación de Orden
```javascript
// Cliente
const createOrder = (data, actions) => {
  return actions.order.create({
    purchase_units: [{
      amount: {
        value: finalPrice.toFixed(2),
        currency_code: 'USD'
      },
      description: `${trip.title} - ${numberOfPeople} personas`
    }]
  })
}
```

#### Captura de Pago
```javascript
const onApprove = async (data, actions) => {
  const order = await actions.order.capture()
  
  // Enviar al servidor para verificación
  const response = await fetch('/api/reservations/create', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      orderID: data.orderID,
      tripId: trip._id,
      tourDate: selectedDate,
      numberOfPeople,
      contactInfo,
      passengers,
      payment: {
        paypalOrderId: data.orderID,
        paypalTransactionId: order.purchase_units[0].payments.captures[0].id,
        totalAmount: finalPrice,
        paidAmount: finalPrice,
        status: 'completed'
      }
    })
  })
  
  // Redirigir a confirmación
  router.push(`/book/confirmation?id=${response.reservationId}`)
}
```

### 4. Verificación en Servidor

```javascript
// api/reservations/create.js
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ err: 'Method not allowed' })
  
  const { orderID, tripId, payment, ...reservationData } = req.body
  
  // 1. Verificar pago con PayPal API
  const paypalOrder = await verifyPayPalOrder(orderID)
  
  if (paypalOrder.status !== 'COMPLETED') {
    return res.status(400).json({ err: 'Payment not completed' })
  }
  
  // 2. Verificar disponibilidad
  const available = await Available.findOne({ tripId, date: tourDate })
  if (available.availableSpots < numberOfPeople) {
    return res.status(400).json({ err: 'Not enough spots available' })
  }
  
  // 3. Crear reserva
  const reservation = await Reservation.create({
    reservationId: generateReservationId(),
    tripId,
    payment,
    ...reservationData,
    status: 'confirmed'
  })
  
  // 4. Actualizar disponibilidad
  await Available.findByIdAndUpdate(available._id, {
    $inc: { availableSpots: -numberOfPeople }
  })
  
  // 5. Enviar email de confirmación
  await sendConfirmationEmail(reservation)
  
  return res.status(200).json({ 
    msg: 'Reservation created',
    reservationId: reservation.reservationId
  })
}
```

### 5. Email de Confirmación

```javascript
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_TOKEN)

async function sendConfirmationEmail(reservation) {
  await resend.emails.send({
    from: process.env.NEXT_PUBLIC_CONTACT_EMAIL,
    to: reservation.contactInfo.email,
    subject: `Booking Confirmation - ${reservation.reservationId}`,
    html: generateConfirmationHTML(reservation)
  })
}
```

### 6. Página de Confirmación

**Ruta**: `/book/confirmation?id=RES-20260124-0001`

Muestra:
- ✅ Número de reserva
- ✅ Detalles del tour
- ✅ Información de pasajeros
- ✅ Resumen de pago
- ✅ Instrucciones adicionales
- ✅ Información de contacto

### Opciones de Pago

| Opción | Monto | Cuándo |
|--------|-------|--------|
| **Depósito** | 30% | Al momento de reservar |
| **Pago Total** | 100% | Al momento de reservar |

**Nota**: El saldo restante (70%) se paga antes del tour si se eligió depósito.

### Estados de Reserva

| Estado | Descripción |
|--------|-------------|
| `pending` | Reserva creada, pago pendiente |
| `confirmed` | Pago recibido, reserva confirmada |
| `cancelled` | Reserva cancelada por usuario/admin |
| `completed` | Tour completado exitosamente |

### Middleware de Protección

```javascript
// src/middleware/auth.js
import jwt from 'jsonwebtoken'

export const auth = async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1]
  
  if (!token) {
    return res.status(401).json({ err: 'No token provided' })
  }
  
  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
    return decoded // { id, role }
  } catch (error) {
    return res.status(401).json({ err: 'Invalid or expired token' })
  }
}
```

### Rutas Protegidas

```javascript
// Ejemplo de ruta protegida
export default async function handler(req, res) {
  const result = await auth(req, res)
  if (result.status) return res.status(result.status).json(result.json)
  
  // result contiene { id, role }
  if (result.role !== 'admin') {
    return res.status(403).json({ err: 'Access denied' })
  }
  
  // Lógica de la ruta protegida
}
```

### Protección en Cliente (React)

```javascript
// Verificación en componentes
const { state } = useContext(DataContext)
const { auth } = state

useEffect(() => {
  if (!auth.token) {
    router.push('/signin')
  }
}, [auth.token])
```

### Seguridad de Secrets

⚠️ **CRÍTICO**: Los secrets de JWT **NUNCA** deben tener el prefijo `NEXT_PUBLIC_`

```env
# ❌ INCORRECTO - Expuesto al cliente
NEXT_PUBLIC_ACCESS_TOKEN_SECRET=secret123

# ✅ CORRECTO - Solo en servidor
ACCESS_TOKEN_SECRET=secret123
```

### Generación de Secrets Seguros

```bash
# Generar secret de 32 bytes (64 caracteres hex)
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Generar secret de 64 bytes (128 caracteres hex)
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### Hash de Passwords

```javascript
import bcrypt from 'bcrypt'

// Al crear/actualizar usuario
const hashedPassword = await bcrypt.hash(password, 12)

// Al verificar login
const isMatch = await bcrypt.compare(password, user.password)
```

### Roles y Permisos

| Rol | Permisos |
|-----|----------|
| `user` | Ver tours, crear reservas, ver su perfil |
| `admin` | CRUD completo de tours, reservas, blog, cupones, usuarios |

### CORS y Headers de Seguridad

```javascript
// utils/cors.js
export const corsMiddleware = (req, res) => {
  res.setHeader('Access-Control-Allow-Credentials', true)
  res.setHeader('Access-Control-Allow-Origin', process.env.NEXT_PUBLIC_SITE_URL)
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE')
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Authorization')
}
```
}
```
**Propósito**: Gestión de usuarios y administradores del sistema.

#### 2. **Trip** - Catálogo de Tours (Multilingüe)
```javascript
{
  // Identificadores
  trip_id: String (unique),
  slug: String (unique, SEO-friendly),
  category: String (inca-trail, salkantay, etc.),
  
  // Contenido Español
  title: String,
  subtitle: String,
  description: String (HTML),
  itinerary: String (HTML),
  includes: [String],
  not_includes: [String],
  recommendations: [String],
  navbar_description: String (para menú dinámico),
  
  // Contenido Inglés
  title_en: String,
  subtitle_en: String,
  description_en: String (HTML),
  itinerary_en: String (HTML),
  includes_en: [String],
  not_includes_en: [String],
  recommendations_en: [String],
  navbar_description_en: String,
  
  // Precios y Configuración
  price: Number,
  discount_percentage: Number,
  groupDiscounts: [{
    minSize: Number,
    maxSize: Number,
    discountPercentage: Number
  }],
  
  // Imágenes
  images: [String] (URLs de Cloudinary),
  thumbnail: String (URL principal),
  navbar_image: String (imagen para menú dinámico),
  
  // SEO
  seo_title: String,
  seo_description: String,
  seo_keywords: [String],
  seo_title_en: String,
  seo_description_en: String,
  seo_keywords_en: [String],
  
  // Metadatos
  duration: String,
  difficulty: String,
  maxGroupSize: Number,
  minimumAge: Number,
  featured: Boolean,
  active: Boolean,
  views: Number,
  rating: Number,
  reviews: Number,
  
  createdAt: Date,
  updatedAt: Date
}
```
**Propósito**: Gestión completa de tours con soporte bilingüe y SEO optimizado.

#### 3. **Reservation** - Sistema de Reservas
```javascript
{
  // Identificadores
  reservationId: String (unique, formato: RES-YYYYMMDD-XXXX),
  userId: ObjectId (ref: 'User', opcional),
  tripId: ObjectId (ref: 'Trip'),
  
  // Información del Tour
  tripDetails: {
    title: String,
    category: String,
    duration: String,
    price: Number
  },
  
  // Datos de la Reserva
  bookingDate: Date,
  tourDate: Date,
  numberOfPeople: Number,
  
  // Información del Contacto
  contactInfo: {
    firstName: String,
    lastName: String,
    email: String,
    phone: String,
    country: String,
    specialRequirements: String
  },
  
  // Pasajeros
  passengers: [{
    firstName: String,
    lastName: String,
    passportNumber: String,
    nationality: String,
    dateOfBirth: Date,
    dietaryRestrictions: String
  }],
  
  // Pago
  payment: {
    method: String (enum: ['paypal', 'bank_transfer']),
    status: String (enum: ['pending', 'partial', 'completed']),
    totalAmount: Number,
    paidAmount: Number,
    currency: String (default: 'USD'),
    paypalOrderId: String,
    paypalTransactionId: String,
    transactionDate: Date
  },
  
  // Cupón (opcional)
  coupon: {
    code: String,
    discountAmount: Number,
    discountType: String (enum: ['percentage', 'fixed'])
  },
  
  // Estado
  status: String (enum: ['pending', 'confirmed', 'cancelled', 'completed']),
  
  // Equipos de Alquiler (opcional)
  rentals: [{
    item: String,
    quantity: Number,
    price: Number
  }],
  
  // Notas Administrativas
  adminNotes: String,
  
  createdAt: Date,
  updatedAt: Date
}
```
**Propósito**: Gestión completa del proceso de reservas con información de pasajeros y pagos.

#### 4. **Blog** - Sistema de Contenido
```javascript
{
  title: String,
  slug: String (unique, SEO-friendly),
  content: String (Markdown/HTML),
  excerpt: String,
  author: ObjectId (ref: 'User'),
  category: String,
  tags: [String],
  featuredImage: String (URL de Cloudinary),
  published: Boolean,
  publishDate: Date,
  seo: {
    title: String,
    description: String,
    keywords: [String]
  },
  views: Number,
  createdAt: Date,
  updatedAt: Date
}
```
**Propósito**: Sistema de blog para contenido SEO y marketing.

#### 5. **Coupon** - Sistema de Descuentos
```javascript
{
  code: String (unique, uppercase),
  description: String,
  discountType: String (enum: ['percentage', 'fixed']),
  discountValue: Number,
  minPurchaseAmount: Number,
  maxDiscountAmount: Number,
  usageLimit: Number,
  usedCount: Number (default: 0),
  validFrom: Date,
  validUntil: Date,
  applicableCategories: [String],
  applicableTrips: [ObjectId],
  active: Boolean,
  createdBy: ObjectId (ref: 'User'),
  createdAt: Date,
  updatedAt: Date
}
```
**Propósito**: Gestión de cupones de descuento con validaciones y límites.

#### 6. **Available** - Calendario de Disponibilidad
```javascript
{
  tripId: ObjectId (ref: 'Trip'),
  date: Date (índice único compuesto con tripId),
  availableSpots: Number,
  totalSpots: Number,
  price: Number (override de precio base),
  status: String (enum: ['available', 'limited', 'sold_out']),
  createdAt: Date,
  updatedAt: Date
}
```
**Propósito**: Control de disponibilidad y cupos por fecha para cada tour.

### Índices de Base de Datos

```javascript
// Trip
trip_id: unique
slug: unique
category: index
featured: index
active: index

// Reservation
reservationId: unique
userId: index
tripId: index
tourDate: index
status: index
payment.status: index

// User
email: unique

// Blog
slug: unique
published: index
category: index

// Coupon
code: unique
active: index
validFrom, validUntil: compound index

// Available
tripId + date: compound unique index
```

### Relaciones entre Modelos

```
User ──┬─> Reservation (userId)
       └─> Blog (author)
       └─> Coupon (createdBy)

Trip ──┬─> Reservation (tripId)
       └─> Available (tripId)
```des y helpers
│   │   ├── db.js                    # Conexión a MongoDB
│   │   ├── fetchData.js             # Cliente HTTP (GET, POST, PUT, DELETE)
│   │   ├── valid.js                 # Validaciones de formularios
│   │   ├── imageUpload.js           # Upload a Cloudinary
│   │   ├── generateToken.js         # Generación de JWT
│   │   ├── cors.js                  # Configuración CORS
│   │   ├── cacheHelpers.js          # Sistema de cache busting
│   │   ├── categoryHelpers.js       # Helpers de categorías
│   │   └── imageUtils.js            # Utilidades de imágenes
│   │
│   ├── middleware/
│   │   └── auth.js                  # Middleware de autenticación JWT
│   │
│   ├── lang/                        # Sistema de traducciones
│   │   ├── es/                      # Traducciones en español
│   │   │   ├── navbar.js            # Traducciones del navbar
│   │   │   ├── home.js              # Traducciones del home
│   │   │   ├── footer.js            # Traducciones del footer
│   │   │   └── ...
│   │   └── en/                      # Traducciones en inglés
│   │       └── [misma estructura]
│   │
│   ├── lib/                         # Configuración y librerías
│   │   ├── brandConfig.js           # Configuración de marca
│   │   ├── constants.js             # Constantes globales
│   │   ├── gtm.js                   # Google Tag Manager
│   │   ├── facebookPixel.js         # Facebook Pixel
│   │   └── tiktokPixel.js           # TikTok Pixel
│   │
│   ├── layout/                      # Layouts del sitio
│   │   ├── Layout.js                # Layout principal
│   │   └── AdminLayout.js           # Layout del panel admin
│   │
│   ├── hooks/                       # Custom React Hooks
│   │   └── useNavbarData.js         # Hook para datos del navbar
│   │
│   ├── pages/                       # Páginas de Next.js (Pages Router)
│   │   ├── _app.js                  # App principal de Next.js
│   │   ├── _document.js             # Document personalizado
│   │   ├── index.js                 # Homepage
│   │   ├── [category].js            # Páginas dinámicas de categorías
│   │   │
│   │   ├── [category]/              # Páginas de tours por categoría
│   │   │   └── [trip].js            # Página individual de tour
│   │   │
│   │   ├── admin/                   # Panel administrativo
│   │   │   ├── index.js             # Dashboard
│   │   │   ├── trip.js              # Gestión de tours
│   │   │   ├── reservation.js       # Gestión de reservas
│   │   │   ├── blog.js              # Gestión de blog
│   │   │   └── coupons.js           # Gestión de cupones
│   │   │
│   │   ├── api/                     # API Routes de Next.js
│   │   │   ├── auth/                # Endpoints de autenticación
│   │   │   ├── trips/               # CRUD de tours
│   │   │   ├── reservations/        # CRUD de reservas
│   │   │   ├── blog/                # CRUD de blog
│   │   │   ├── coupons/             # CRUD de cupones
│   │   │   └── stats/               # Estadísticas del dashboard
│   │   │
│   │   ├── book/                    # Flujo de reserva
│   │   │   ├── index.js             # Paso 1: Selección de tour
│   │   │   ├── payment.js           # Paso 2: Pago
│   │   │   ├── confirmation.js      # Paso 3: Confirmación
│   │   │   └── rent.js              # Alquiler de equipos
│   │   │
│   │   ├── blog/                    # Blog
│   │   │   ├── index.js             # Listado de posts
│   │   │   └── [slug].js            # Post individual
│   │   │
│   │   ├── categories/              # Página de categorías
│   │   ├── about-us.js              # Sobre nosotros
│   │   ├── contact.js               # Contacto
│   │   ├── faqs.js                  # Preguntas frecuentes
│   │   ├── recommendations.js       # Recomendaciones
│   │   ├── signin.js                # Login de admin
│   │   ├── register.js              # Registro de usuarios
│   │   └── 404.js                   # Página de error 404
│   │
│   └── styles/                      # Estilos CSS
│       ├── globals.css              # Estilos globales
│       ├── custom-tailwind.css      # Utilidades personalizadas de Tailwind
│       └── [otros archivos css]
│
├── next.config.js                   # Configuración de Next.js
├── next-sitemap.config.js           # Configuración del sitemap
├── next-seo.config.js               # Configuración de SEO
├── tailwind.config.js               # Configuración de Tailwind CSS
├── postcss.config.js                # Configuración de PostCSS
├── ecosystem.config.js              # Configuración de PM2
├── package.json                     # Dependencias del proyecto
└── .env                             # Variables de entorno (no versionado)
```

### Principios de Arquitectura

1. **Separación de Responsabilidades**: Cada carpeta tiene un propósito específico
2. **Components**: Organizados por función (general, navbar, footer, home, etc.)
3. **Pages Router**: Aprovecha el sistema de rutas de Next.js
4. **API Routes**: Backend serverless integrado en Next.js
5. **Modelos**: Esquemas Mongoose centralizados
6. **Utils**: Funciones reutilizables sin dependencias de React
7. **Lang**: Sistema de traducciones sin dependencias externasT_PUBLIC_SITE_URL=https://bookingincatrail.com
NEXT_PUBLIC_CONTACT_EMAIL=info@bookingincatrail.com
NEXT_PUBLIC_CONTACT_PHONE=+51987654321
NEXT_PUBLIC_WHATSAPP_NUMBER=51987654321
```

### Configuración de MongoDB

**Opción 1: MongoDB Local**
```bash
# Instalar MongoDB Community Edition
# macOS con Homebrew:
brew install mongodb-community

# Ubuntu/Debian:
sudo apt-get install mongodb

# Iniciar servicio
mongod --dbpath /path/to/data
```

**Opción 2: MongoDB Atlas (Cloud)**
1. Crear cuenta en [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Crear cluster gratuito
3. Whitelist IP address (0.0.0.0/0 para desarrollo)
4. Crear usuario de base de datos
5. Obtener connection string

### Configuración de Cloudinary

1. Crear cuenta en [Cloudinary](https://cloudinary.com)
2. Obtener credenciales del dashboard
3. Configurar presets de upload (opcional):
   - Preset name: `bookingincatrail-tours`
   - Signing Mode: `unsignedde scripts/audit-seo-fields.js  # Audita campos SEO de todos los tours
```

## 🔧 Configuración

### Variables de Entorno

Crear `.env` con las siguientes variables:

```env
# Base de Datos
MONGODB_URI=mongodb://...

# JWT (⚠️ NO usar NEXT_PUBLIC_)
ACCESS_TOKEN_SECRET=tu_secret_access
REFRESH_TOKEN_SECRET=tu_secret_refresh

# PayPal
NEXT_PUBLIC_PAYPAL_CLIENT_ID=tu_paypal_id

# Email
RESEND_TOKEN=tu_resend_token

# Marca
NEXT_PUBLIC_BRAND_NAME=BookingIncatrail
NEXT_PUBLIC_SITE_URL=https://tudominio.com
NEXT_PUBLIC_CONTACT_EMAIL=info@tudominio.com
NEXT_PUBLIC_CONTACT_PHONE=+51999999999
```

## 📁 Estructura del Proyecto

```
├── pages/
│   ├── [category].js      # Páginas de categorías de tours
│   ├── book/              # Flujo de reserva
│   ├── admin/             # Dashboard administrativo
│   └── api/               # API Routes
├── src/
│   ├── components/
│   │   ├── general/       # Componentes reutilizables
│   │   ├── navbar/        # Navegación
│   │   ├── footer/        # Pie de página
│   │   └── home/          # Secciones del home
│   ├── models/            # Esquemas Mongoose
│   ├── store/             # Estado global (Context API)
│   ├── utils/             # Utilidades
│   ├── lang/              # Traducciones (es/, en/)
│   └── lib/               # Configuración de marca
└── public/                # Assets estáticos
```

## 🗄️ Modelos de Base de Datos

| Modelo | Descripción |
|--------|-------------|
| `User` | Autenticación y roles |
| `Trip` | Tours (multilingüe, precios, SEO) |
| `Reservation` | Reservas con datos de pasajeros |
| `Blog` | Contenido del blog |
| `Coupon` | Códigos de descuento |
| `Available` | Calendario de disponibilidad |

## 🔐 Flujo de Autenticación

1. **Login:** `POST /api/auth/login` → Access Token (30 min) + Refresh Token cookie (7 días)
2. **Autorización:** Middleware `auth()` verifica JWT
3. **Rutas protegidas:** Verifican estado de auth y redirigen si es necesario

## 💳 Flujo de Reserva

1. Selección de tour → Fecha → Pasajeros
2. Cálculo de precio con descuentos de grupo
3. Validación de cupón (opcional)
4. Pago con PayPal (30% depósito o 100%)
5. Email de confirmación vía Resend

## 📝 Convenciones de Código

### API Responses
```javascript
// Éxito
res.status(200).json({ msg: "Mensaje", data: {...} })

// Error
res.status(400).json({ err: "Mensaje de error" })
```

### Next.js 15
```jsx
// ✅ Link sin <a>
<Link href="/path" className="btn">Click</Link>

// ✅ Image con fill y sizes
<Image src={src} fill sizes="(max-width: 768px) 100vw, 50vw" alt="..." />
```

### Base de Datos
```javascript
import connectDB from '@/utils/db'
await connectDB() // Siempre antes de operaciones Mongoose
```

## ⚠️ Notas Importantes

1. **JWT Secrets:** Nunca usar `NEXT_PUBLIC_` para tokens secretos
2. **Bilingüe:** Cambios de texto deben reflejarse en `src/lang/es` y `src/lang/en`
3. **Imágenes:** Usar prop `sizes` con componente Image de Next.js
4. **Backup:** Ejecutar `npm run backup` antes de cambios en la BD

## 📄 Licencia

Proyecto privado - Todos los derechos reservados
