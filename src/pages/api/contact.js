import { Resend } from 'resend';
import { BRAND } from '../../lib/brandConfig';

const resend = new Resend(process.env.RESEND_TOKEN);

function escapeHtml(value = '') {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
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

  if (!recaptchaToken) {
    return res.status(400).json({
      message: 'Captcha required',
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

    const response = await resend.emails.send({
      from: BRAND.contactEmail,
      to: BRAND.contactEmail,
      subject: `Nuevo mensaje de ${escapeHtml(name)}`,
      replyTo: email,
      html: `
        <div>
          <p><strong>Nombre:</strong> ${escapeHtml(name)}</p>
          <p><strong>Correo electrónico:</strong> ${escapeHtml(email)}</p>
          <p><strong>Número de viajeros:</strong> ${escapeHtml(travelers)}</p>
          <p><strong>País:</strong> ${escapeHtml(country)}</p>
          <p><strong>Tour seleccionado:</strong> ${escapeHtml(tour)}</p>
          <p><strong>Calidad del hotel:</strong> ${escapeHtml(hotelQuality)}</p>
          <p><strong>Preferencias alimenticias o restricciones:</strong> ${escapeHtml(foodPreferences)}</p>
          <p><strong>Mensaje:</strong></p>
          <p>${escapeHtml(message)}</p>
        </div>
      `,
    });

    if (response.error) {
      return res.status(500).json({
        message: 'Error sending email',
        error: response.error,
      });
    }

    return res.status(200).json({
      message: 'success',
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Server error',
    });
  }
}
