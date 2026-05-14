import { Resend } from 'resend';
import { BRAND } from '../../lib/brandConfig';

const resend = new Resend(BRAND.resendApiToken);

export const config = {
  api: {
    bodyParser: false,
  },
};

async function readRawBody(req) {
  const chunks = [];

  for await (const chunk of req) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }

  return Buffer.concat(chunks).toString('utf8');
}

function escapeHtml(value = '') {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function buildFallbackHtml(email) {
  return `
    <div>
      <h2>Correo entrante recibido por Resend</h2>

      <p><strong>De:</strong> ${escapeHtml(email.from || '')}</p>
      <p><strong>Para:</strong> ${escapeHtml((email.to || []).join(', '))}</p>
      <p><strong>CC:</strong> ${escapeHtml((email.cc || []).join(', '))}</p>
      <p><strong>Asunto:</strong> ${escapeHtml(email.subject || 'Sin asunto')}</p>

      <hr />

      <pre style="white-space: pre-wrap; font-family: Arial, sans-serif;">
${escapeHtml(email.text || '')}
      </pre>
    </div>
  `;
}

function buildFallbackText(email) {
  return `
Correo entrante recibido por Resend

De: ${email.from || ''}
Para: ${(email.to || []).join(', ')}
CC: ${(email.cc || []).join(', ')}
Asunto: ${email.subject || 'Sin asunto'}

${email.text || ''}
  `.trim();
}

function getHeaderValue(value) {
  return Array.isArray(value) ? value[0] : value;
}

async function getForwardableAttachments(emailId) {
  const { data, error } = await resend.emails.receiving.attachments.list({
    emailId,
  });

  if (error) {
    console.warn('Error getting inbound attachments:', error);
    return [];
  }

  const attachmentItems = data?.data || [];

  return Promise.all(
    attachmentItems.map(async (attachment) => {
      const response = await fetch(attachment.download_url);

      if (!response.ok) {
        throw new Error(`Could not download attachment ${attachment.id}`);
      }

      const buffer = Buffer.from(await response.arrayBuffer());

      return {
        filename: attachment.filename || attachment.id,
        content: buffer.toString('base64'),
        contentType: attachment.content_type,
        contentId: attachment.content_id,
      };
    }),
  );
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      message: 'Method not allowed',
    });
  }

  try {
    if (!BRAND.resendApiToken) {
      return res.status(500).json({
        message: 'Missing RESEND_API_KEY',
      });
    }

    if (!BRAND.resendWebhookSecret) {
      return res.status(500).json({
        message: 'Missing RESEND_WEBHOOK_SECRET',
      });
    }

    if (!BRAND.contactForwardTo) {
      return res.status(500).json({
        message: 'Missing CONTACT_FORWARD_TO',
      });
    }

    if (!BRAND.contactEmail) {
      return res.status(500).json({
        message: 'Missing NEXT_PUBLIC_CONTACT_EMAIL',
      });
    }

    const payload = await readRawBody(req);

    const id = getHeaderValue(req.headers['svix-id']);
    const timestamp = getHeaderValue(req.headers['svix-timestamp']);
    const signature = getHeaderValue(req.headers['svix-signature']);

    if (!id || !timestamp || !signature) {
      return res.status(400).json({
        message: 'Missing webhook headers',
      });
    }

    let event;

    try {
      event = resend.webhooks.verify({
        payload,
        headers: {
          id,
          timestamp,
          signature,
        },
        webhookSecret: BRAND.resendWebhookSecret,
      });
    } catch (verificationError) {
      console.warn('Invalid inbound email webhook signature:', verificationError);

      return res.status(400).json({
        message: 'Invalid webhook signature',
      });
    }

    if (event.type !== 'email.received') {
      return res.status(200).json({
        message: `Event ${event.type} ignored`,
      });
    }

    const emailId = event.data?.email_id;

    if (!emailId) {
      return res.status(400).json({
        message: 'Missing email_id',
      });
    }

    const { data: email, error: emailError } =
      await resend.emails.receiving.get(emailId);

    if (emailError) {
      console.error('Error getting received email:', emailError);

      return res.status(500).json({
        message: 'Error getting received email',
      });
    }

    const attachments = await getForwardableAttachments(emailId);

    const subject = email.subject || event.data?.subject || 'Sin asunto';

    const { error: sendError } = await resend.emails.send({
      from: `${BRAND.name} <${BRAND.contactEmail}>`,
      to: BRAND.contactForwardTo,
      subject: `Correo entrante: ${subject}`,
      replyTo: email.from,
      html: email.html || buildFallbackHtml(email),
      text: email.text || buildFallbackText(email),
      attachments: attachments.length > 0 ? attachments : undefined,
    });

    if (sendError) {
      console.error('Error forwarding email:', sendError);

      return res.status(500).json({
        message: 'Error forwarding email',
      });
    }

    return res.status(200).json({
      message: 'Email received and forwarded',
    });
  } catch (error) {
    console.error('Inbound email webhook error:', error);

    return res.status(500).json({
      message: 'Server error',
    });
  }
}
