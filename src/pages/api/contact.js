import { Resend } from 'resend';
import { BRAND } from '../../lib/brandConfig';

const resend = new Resend(BRAND.resendApiToken);

function escapeHtml(value = '') {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function formatValue(value, fallback = 'No especificado') {
  const normalizedValue = String(value || '').trim();

  return normalizedValue || fallback;
}

function isValidEmail(value = '') {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const {
    name,
    email,
    message,
    tour,
    travelers,
    country,
    hotelQuality,
    foodPreferences,
    recaptchaToken,
  } = req.body;

  if (!BRAND.resendApiToken) {
    return res.status(500).json({
      message: 'Missing RESEND_API_KEY',
    });
  }

  if (!BRAND.recaptchaSecretKey) {
    return res.status(500).json({
      message: 'Missing RECAPTCHA_SECRET_KEY',
    });
  }

  if (!BRAND.contactEmail) {
    return res.status(500).json({
      message: 'Missing NEXT_PUBLIC_CONTACT_EMAIL',
    });
  }

  if (!recaptchaToken) {
    return res.status(400).json({
      message: 'Captcha required',
    });
  }

  if (!name || !email || !message || !isValidEmail(email)) {
    return res.status(400).json({
      message: 'Invalid contact form data',
    });
  }

  try {
    const captchaResponse = await fetch(
      'https://www.google.com/recaptcha/api/siteverify',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          secret: BRAND.recaptchaSecretKey,
          response: recaptchaToken,
        }),
      },
    );

    const captchaData = await captchaResponse.json();

    if (!captchaData.success) {
      return res.status(400).json({
        message: 'Invalid captcha',
        errors: captchaData['error-codes'],
      });
    }

    const recipient = BRAND.contactForwardTo || BRAND.contactEmail;
    const safeName = formatValue(name);
    const safeEmail = formatValue(email);
    const safeTravelers = formatValue(travelers);
    const safeCountry = formatValue(country);
    const safeTour = formatValue(tour);
    const safeHotelQuality = formatValue(hotelQuality);
    const safeFoodPreferences = formatValue(foodPreferences);
    const safeMessage = formatValue(message);

    const response = await resend.emails.send({
      from: `${BRAND.name} <${BRAND.contactEmail}>`,
      to: recipient,
      subject: `Nuevo mensaje desde formulario: ${safeName}`,
      replyTo: email,
      text: `
Nombre: ${safeName}
Correo electrónico: ${safeEmail}
Número de viajeros: ${safeTravelers}
País: ${safeCountry}
Tour seleccionado: ${safeTour}
Calidad del hotel: ${safeHotelQuality}
Preferencias alimenticias o restricciones: ${safeFoodPreferences}

Mensaje:
${safeMessage}
      `.trim(),
      html: `
        <div>
          <h2>Nuevo mensaje desde el formulario web</h2>
          <p><strong>Nombre:</strong> ${escapeHtml(safeName)}</p>
          <p><strong>Correo electrónico:</strong> ${escapeHtml(safeEmail)}</p>
          <p><strong>Número de viajeros:</strong> ${escapeHtml(safeTravelers)}</p>
          <p><strong>País:</strong> ${escapeHtml(safeCountry)}</p>
          <p><strong>Tour seleccionado:</strong> ${escapeHtml(safeTour)}</p>
          <p><strong>Calidad del hotel:</strong> ${escapeHtml(safeHotelQuality)}</p>
          <p><strong>Preferencias alimenticias o restricciones:</strong> ${escapeHtml(safeFoodPreferences)}</p>
          <p><strong>Mensaje:</strong></p>
          <p>${escapeHtml(safeMessage)}</p>
        </div>
      `,
    });

    if (response.error) {
      console.error('Error sending contact form email:', response.error);

      return res.status(500).json({
        message: 'Error sending email',
      });
    }

    return res.status(200).json({
      message: 'success',
    });
  } catch (error) {
    console.error('Contact form error:', error);

    return res.status(500).json({
      message: 'Server error',
    });
  }
}
