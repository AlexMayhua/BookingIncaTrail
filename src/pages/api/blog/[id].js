import Blog from '../../../models/blogModels'
import NextCors from 'nextjs-cors';
import { dbConnect } from "../../../utils/db";

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

        const blog = await Blog.findOne({ slug: url, lang: lang })
        if(!blog) return res.status(400).json({err: 'This blog does not exist.'})
        
        res.json(blog)

    } catch (err) {
        return res.status(500).json({err: 'Sorry. Please Login Again or Contact Us!'})
    }
}

