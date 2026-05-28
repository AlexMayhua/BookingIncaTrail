export default function handler(req, res) {
  return res.status(200).json({
    message: 'Inbound email webhook disabled. Contact emails are sent through /api/contact only.',
  });
}
