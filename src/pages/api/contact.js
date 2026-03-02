import { Resend } from 'resend';
const resend = new Resend(process.env.RESEND_TOKEN);
import { BRAND } from '../../lib/brandConfig'

export default async function (req, res) {
  
  const { name, email, message, tour, travelers, country, hotelQuality, foodPreferences } = req.body;

  
  const response = await resend.emails.send({
    from: BRAND.contactEmail,
    to: BRAND.contactEmail,
    subject: `Nuevo mensaje de ${name}`,
    html: `
      <div>
        <p><strong>Nombre:</strong> ${name}</p>
        <p><strong>Correo electrónico:</strong> ${email}</p>
        <p><strong>Número de viajeros:</strong> ${travelers}</p>
        <p><strong>País:</strong> ${country}</p>
        <p><strong>Tour seleccionado:</strong> ${tour}</p>
        <p><strong>Calidad del hotel:</strong> ${hotelQuality}</p>
        <p><strong>Preferencias alimenticias o restricciones:</strong> ${foodPreferences}</p>
        <p><strong>Mensaje:</strong></p>
        <p>${message}</p>
      </div>
    `,
  });
  res.send('success');
}


