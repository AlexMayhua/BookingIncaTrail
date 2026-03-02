import mongoose from 'mongoose';
import { dbConnect } from "../../../utils/db";
import Reservation from '../../../models/reservationModel'
import Coupon from '../../../models/couponsModel';
import { applyCors } from '../../../utils/cors';

dbConnect();

export default async (req, res) => {
    // Aplicar CORS seguro
    await applyCors(req, res);

    switch (req.method) {
        case "GET":
            await getReservation(req, res)
            break;
        case "POST":
            await updateReservation(req, res)
            break;
        default:
            res.status(405).json({ err: 'Method not allowed' });
    }
}

const getReservation = async (req, res) => {
    const { id } = req.query;

    try {
        // Validar ID
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ err: 'Invalid reservation ID' });
        }

        const reservation = await Reservation.findById(id);

        if (!reservation) {
            return res.status(404).json({ err: 'Reservation not found' });
        }

        return res.status(200).json(reservation);
    } catch (error) {
        console.error('Get reservation error:', error);
        return res.status(500).json({ err: 'Failed to fetch reservation' });
    }
}

/**
 * Actualiza una reserva con información de pago
 * Usa transacciones de MongoDB para garantizar consistencia
 */
const updateReservation = async (req, res) => {
    const session = await mongoose.startSession();

    try {
        session.startTransaction();

        const { id } = req.query;
        const { balance, coupons } = req.body;

        // Validar ID
        if (!mongoose.Types.ObjectId.isValid(id)) {
            await session.abortTransaction();
            return res.status(400).json({ err: 'Invalid reservation ID' });
        }

        // Validar datos de entrada
        if (!balance || typeof balance !== 'object') {
            await session.abortTransaction();
            return res.status(400).json({ err: 'Invalid balance data' });
        }

        // Buscar la reserva
        const reservation = await Reservation.findById(id).session(session);

        if (!reservation) {
            await session.abortTransaction();
            return res.status(404).json({ err: 'Reservation not found' });
        }

        // Si hay cupón, validar y actualizar cantidad
        if (coupons && coupons.code) {
            const coupon = await Coupon.findOne({ code: coupons.code }).session(session);

            if (!coupon) {
                await session.abortTransaction();
                return res.status(404).json({ err: 'Coupon not found' });
            }

            if (coupon.quantity <= 0) {
                await session.abortTransaction();
                return res.status(400).json({ err: 'Coupon has been exhausted' });
            }

            // Decrementar cantidad de cupón
            coupon.quantity -= 1;
            await coupon.save({ session });
        }

        // Actualizar la reserva
        const updatedReservation = await Reservation.findByIdAndUpdate(
            id,
            {
                balance: {
                    total: balance.total || balance.balance + balance.payment,
                    paid: balance.payment || 0,
                    balance: balance.balance || 0
                },
                coupons: coupons || null,
                isPay: true,
                status: 'confirmed'
            },
            {
                new: true,
                session,
                runValidators: true
            }
        );

        // Commit de la transacción
        await session.commitTransaction();

        res.status(200).json({
            msg: 'Payment processed successfully',
            reservation: updatedReservation
        });

    } catch (err) {
        // Rollback en caso de error
        await session.abortTransaction();
        console.error('Update reservation error:', err);

        if (err.name === 'ValidationError') {
            return res.status(400).json({
                err: 'Validation failed',
                details: err.message
            });
        }

        return res.status(500).json({
            err: 'Failed to process payment. Please try again.'
        });
    } finally {
        session.endSession();
    }
}
