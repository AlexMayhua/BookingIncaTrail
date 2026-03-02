
import { dbConnect } from "../../../../../utils/db";
import Coupon from '../../../../../models/couponsModel';
import NextCors from 'nextjs-cors';

dbConnect();

export default async function handler(req, res) {
  // Configurar CORS
  await NextCors(req, res, {
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
    origin: '*',
    optionsSuccessStatus: 200, // algunos navegadores antiguos (IE11, varios Smart TVs) se atascan con 204
  })

  if (req.method === 'POST') {
    try {
      const { codigo } = req.body;

      // Buscar el cupón en la base de datos
      const cupon = await Coupon.findOne({ code: codigo });

      if (!cupon) {
        return res.status(404).json({ mensaje: 'Cupón no encontrado' });
      }

      if (cupon.quantity <= 0) {
        return res.status(400).json({ mensaje: 'Cupón agotado' });
      }

      // Devolver la información del cupón válido
      res.status(200).json({
        mensaje: 'Cupón válido',
        descuento: cupon.discount,
        descripcion: cupon.description
      });
    } catch (error) {
      console.error('Error al validar el cupón:', error);
      res.status(500).json({ mensaje: 'Error interno del servidor' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Método ${req.method} no permitido`);
  }
}
