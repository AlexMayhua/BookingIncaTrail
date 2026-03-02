import auth from '../../../../middleware/auth'
import { dbConnect } from "../../../../utils/db";
import Blog from '../../../../models/blogModels'
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
    switch (req.method) {
        case "GET":
            await getTrip(req, res)
            break;
        case "POST":
            await createTrip(req, res)
            break;
    }
}

const getTrip = async (req, res) => {
    try {
        const blogs = await Blog.find();
        return res.status(200).json(blogs);
    } catch (error) {
        return res.status(400).json({ msg: error.message });
    }

}

const createTrip = async (req, res) => {

    try {
        const result = await auth(req, res)

        if (result.role !== 'admin') return res.status(400).json({ err: 'Authentication is not valid.' })

        const {
            slug,
            title,
            min_content,
            image,
            content,
            content_optional,
            lang,
            meta_title,
            meta_description

        } = req.body
        //if (!title || !price || gallery.length === 0) return res.status(400).json({ err: 'Please add all the fields.' })


        const saveData = await Blog.create({
            slug,
            title,
            min_content,
            image,
            content,
            content_optional,
            lang,
            meta_title,
            meta_description
        })

        res.json({ msg: 'Success! Created a new Blog' })

    } catch (err) {
        return res.status(500).json({ err: 'Sorry. Please Login Again or Contact Us!' })
    }
}