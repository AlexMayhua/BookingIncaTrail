import Trips from '../../../models/tripModel'
import { dbConnect } from "../../../utils/db"
import NextCors from 'nextjs-cors'

dbConnect();

export default async (req, res) => {
    // Run the cors middleware
    await NextCors(req, res, {
        // Options
        methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
        origin: '*',
        optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
    })

    try {
        const { id, locale } = req.query;
        const url = id
        const lang = locale

        const trip = await Trips.findOne({ slug: url, lang: lang })
        if (!trip) return res.status(400).json({ err: 'This Tour does not exist.' })

        res.json(trip)

    } catch (err) {
        return res.status(500).json({ err: 'Sorry. Please Login Again or Contact Us!' })
    }
}
