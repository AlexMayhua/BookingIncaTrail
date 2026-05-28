import { Resend } from 'resend';
import { BRAND, absoluteUrl } from '../../lib/brandConfig';

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

function buildContactEmailHtml({
  name,
  email,
  travelers,
  country,
  tour,
  message,
}) {
  const logoUrl = absoluteUrl(BRAND.logo.src);
  const heroUrl = absoluteUrl('/img/hero/correo-image.webp');
  const safeMessageHtml = escapeHtml(message).replaceAll('\n', '<br />');

  const detailRow = (label, value) => `
    <tr>
      <td width="34%" valign="top" style="padding: 14px 16px; border-bottom: 1px solid #ece7d8; background: #fff9dc; color: #5f4b00; font-size: 13px; font-weight: 700; letter-spacing: .04em; text-transform: uppercase;">
        ${label}
      </td>
      <td valign="top" style="padding: 14px 16px; border-bottom: 1px solid #ece7d8; color: #111827; font-size: 15px; line-height: 1.55;">
        ${value}
      </td>
    </tr>
  `;

  return `
    <!doctype html>
    <html>
      <body style="margin: 0; padding: 0; background: #f4f1e8; font-family: Arial, Helvetica, sans-serif;">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background: #f4f1e8; padding: 28px 12px;">
          <tr>
            <td align="center">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width: 680px; overflow: hidden; border-radius: 22px; background: #ffffff; box-shadow: 0 18px 45px rgba(13, 17, 23, 0.14);">
                <tr>
                  <td style="background: #0d1117; padding: 26px 28px 22px;">
                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                      <tr>
                        <td>
                          <img src="${logoUrl}" width="155" alt="${escapeHtml(BRAND.logo.alt)}" style="display: block; max-width: 155px; height: auto;" />
                        </td>
                        <td align="right" style="font-size: 12px; font-weight: 700; letter-spacing: .08em; color: #e6c200; text-transform: uppercase;">
                          New inquiry
                        </td>
                      </tr>
                    </table>
                    <h1 style="margin: 24px 0 8px; color: #ffffff; font-size: 28px; line-height: 1.18; font-weight: 800;">
                      Nueva consulta para Booking Inca Trail
                    </h1>
                    <p style="margin: 0; color: #d7dce3; font-size: 15px; line-height: 1.55;">
                      Un viajero completó el formulario de contacto y espera una respuesta del equipo.
                    </p>
                  </td>
                </tr>

                <tr>
                  <td>
                    <img src="${heroUrl}" width="680" alt="Machu Picchu, Peru" style="display: block; width: 100%; max-width: 680px; height: auto;" />
                  </td>
                </tr>

                <tr>
                  <td>
                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border: 1px solid #eadf9c; background: #ffffff; border-collapse: separate; overflow: hidden;">
                      <tr>
                        <td colspan="2" align="left" style="padding: 14px 16px; background: #0d1117; color: #e6c200; font-size: 12px; letter-spacing: .08em; text-transform: uppercase;">
                          Datos del viajero
                        </td>
                      </tr>
                      ${detailRow('Nombre', escapeHtml(name))}
                      ${detailRow('Correo', escapeHtml(email))}
                      ${detailRow('Viajeros', escapeHtml(travelers))}
                      ${detailRow('Tour seleccionado', escapeHtml(tour))}
                      ${detailRow('País', escapeHtml(country))}
                      ${detailRow('Mensaje del viajero', safeMessageHtml)}
                    </table>

                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                      <tr>
                        <td style="background: #f4f1e8; padding: 16px 18px; color: #555f6f; font-size: 14px; line-height: 1.55;">
                          Responde directamente a este correo para escribirle al viajero. El campo Reply-To ya está configurado con: <strong style="color: #111827;">${escapeHtml(email)}</strong>.
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <tr>
                  <td style="background: #0d1117; padding: 18px 28px; color: #aeb6c2; font-size: 12px; line-height: 1.5;">
                    <strong style="color: #ffffff;">${escapeHtml(BRAND.name)}</strong><br />
                    Tours, trekking y experiencias en Perú.
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { name, email, message, tour, travelers, country, recaptchaToken } =
    req.body;

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

    const safeName = formatValue(name);
    const safeEmail = formatValue(email);
    const safeTravelers = formatValue(travelers);
    const safeCountry = formatValue(country);
    const safeTour = formatValue(tour);
    const safeMessage = formatValue(message);

    const response = await resend.emails.send({
      from: `${BRAND.name} <enquire@bookingincatrail.com>`,
      to: 'info@bookingincatrail.com',
      subject: `Nuevo mensaje de Booking Inca Trail: ${safeName}`,
      replyTo: email,
      text: `
        Nombre: ${safeName}
        Correo electrónico: ${safeEmail}
        Número de viajeros: ${safeTravelers}
        País: ${safeCountry}
        Tour seleccionado: ${safeTour}

        Mensaje:
        ${safeMessage}
      `.trim(),
      html: buildContactEmailHtml({
        name: safeName,
        email: safeEmail,
        travelers: safeTravelers,
        country: safeCountry,
        tour: safeTour,
        message: safeMessage,
      }),
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
