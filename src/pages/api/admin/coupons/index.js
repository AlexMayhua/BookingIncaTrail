
import { dbConnect } from '../../../../utils/db';
import Coupon from '../../../../models/couponsModel';

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === 'POST') {
    try {
      const { code, quantity, discount, description } = req.body;
      const newCoupon = new Coupon({ code, quantity, discount, description });
      await newCoupon.save();
      res.status(201).json({ message: 'Cupón creado exitosamente', coupon: newCoupon });
    } catch (error) {
      res.status(400).json({ message: 'Error al crear el cupón', error: error.message });
    }
  } else if (req.method === 'GET') {
    try {
      const cupones = await Coupon.find({});
      res.status(200).json(cupones);
    } catch (error) {
      res.status(500).json({ message: 'Error al obtener los cupones', error: error.message });
    }
  } else if (req.method === 'PUT') {
    try {
      const { id, code, quantity, discount, description } = req.body;
      const updatedCoupon = await Coupon.findByIdAndUpdate(
        id,
        { code, quantity, discount, description },
        { new: true }
      );
      if (!updatedCoupon) {
        return res.status(404).json({ message: 'Cupón no encontrado' });
      }
      res.status(200).json({ message: 'Cupón actualizado exitosamente', coupon: updatedCoupon });
    } catch (error) {
      res.status(400).json({ message: 'Error al actualizar el cupón', error: error.message });
    }
  } else if (req.method === 'DELETE') {
    try {
      const { id } = req.query;
      const deletedCoupon = await Coupon.findByIdAndDelete(id);
      if (!deletedCoupon) {
        return res.status(404).json({ message: 'Cupón no encontrado' });
      }
      res.status(200).json({ message: 'Cupón eliminado exitosamente' });
    } catch (error) {
      res.status(400).json({ message: 'Error al eliminar el cupón', error: error.message });
    }
  } else {
    res.status(405).json({ message: 'Método no permitido' });
  }
}
