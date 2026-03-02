import { dbConnect } from "../../../utils/db";
import Trips from '../../../models/tripModel'
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

    const { locale } = req.query
    const lang = locale
    try {
        const packages = await Trips.find({ lang: `${lang}`, isDeals: true })
        return res.status(200).json(packages)
    } catch (error) {
        return res.status(400).json({ msg: error.message })
    }
}

