import { dbConnect } from "../../../utils/db";
import Blog from '../../../models/blogModels'
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
        const blogs = await Blog.find({ lang: `${lang}` }).sort({createdAt: -1})

        return res.status(200).json(blogs)
    } catch (error) {
        return res.status(400).json({ msg: error.message })
    }
}
