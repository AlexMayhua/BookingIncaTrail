import { dbConnect } from "../../../../utils/db";
import Reservation from '../../../../models/reservationModel'
import NextCors from 'nextjs-cors';

dbConnect();

export default async (req, res) => {

    // Run the cors middleware
    await NextCors(req, res, {
        // Options
        methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
        origin: '*',
        optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
    })

    switch (req.method) {
        case "GET":
            await getAllReservation(req, res)
            break;
        case "POST":
            await createReservation(req, res)
            break;
        case "DELETE":
            await deleteReservation(req, res);
            break;
        default:
            res.setHeader("Allow", ["GET", "POST", "DELETE"]);
            res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}

const getAllReservation = async (req, res) => {

    try {
        const reservation = await Reservation.find({isPay: true})
        return res.status(200).json(reservation)
    } catch (error) {
        return res.status(400).json({ msg: error.message })
    }

}

const createReservation = async (req, res) => {

    try {

        const {
            userData,
            tour,
            date,
            totalPay

        } = req.body

        const saveData = await Reservation.create({
            userData,
            tour,
            date,
            totalPay,
            balance: {
                balance: 0,
                payment: 0
            },
            isPay: false
        })

        res.json(saveData)

    } catch (err) {
        return res.status(500).json({ err: 'Sorry. Please Login Again or Contact Us!' })
    }
}
const deleteReservation = async (req, res) => {
    try {
        const { id } = req.query; 

        if (!id) {
            return res.status(400).json({ msg: 'Reservation ID is required' });
        }

        const reservation = await Reservation.findByIdAndDelete(id);

        if (!reservation) {
            return res.status(404).json({ msg: 'Reservation not found' });
        }

        return res.status(200).json({ msg: 'Reservation deleted successfully' });
    } catch (error) {
        return res.status(500).json({ msg: error.message });
    }
};