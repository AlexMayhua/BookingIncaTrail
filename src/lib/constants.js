

import { BRAND } from './brandConfig'

export const API_URLlive = BRAND.siteUrl

// API_URL:
// - En el servidor (SSR/SSG): usar localhost para evitar problemas con certificado SSL autofirmado
// - En el cliente (browser): usar la URL pública con HTTPS
export const API_URL = typeof window !== 'undefined'
  ? (process.env.NEXT_PUBLIC_API_URL || `http://localhost:${process.env.PORT || 3000}`)
  : (process.env.NEXT_PUBLIC_INTERNAL_API_URL || `http://localhost:${process.env.PORT || 3000}`)

export const PAYPAL_CLIENT_ID = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID
