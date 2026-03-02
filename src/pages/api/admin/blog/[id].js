import Blog from '../../../../models/blogModels'
import auth from '../../../../middleware/auth'
import { dbConnect } from "../../../../utils/db"
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
    
    switch(req.method){
        case "GET":
            await getProduct(req, res)
            break;
        case "PUT":
            await updateProduct(req, res)
            break;
        case "DELETE":
            await deleteProduct(req, res)
            break;
    }
}

const getProduct = async (req, res) => {
    try {
        const { id } = req.query;

        const blog = await Blog.findById(id)
        if(!blog) return res.status(400).json({err: 'This blog does not exist.'})
        
        res.json(blog)

    } catch (err) {
        return res.status(500).json({err: 'Sorry. Please Login Again or Contact Us!'})
    }
} 

const updateProduct = async (req, res) => {
    try {
        const result = await auth(req, res)
        if(result.role !== 'admin') 
        return res.status(400).json({err: 'Authentication is not valid.'})

        const {id} = req.query
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

        if(!title )
        return res.status(400).json({err: 'Please add all the fields.'})
 
        await Blog.findOneAndUpdate({_id: id}, {
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

        res.json({msg: 'Success! Updated a blog'})
    } catch (err) {
        return res.status(500).json({err: 'Sorry. Please Login Again or Contact Us!'})
    }
}

const deleteProduct = async(req, res) => {

    
    try {
        const result = await auth(req, res)
        if(result.role !== 'admin') 
        return res.status(400).json({err: 'Authentication is not valid.'})

        const {id} = req.query

        await Blog.findByIdAndDelete({_id: id})
        res.json({msg: 'Successfully Deleted Blog.'})

    } catch (err) {
        return res.status(500).json({err: 'Sorry. Please Login Again or Contact Us!'})
    }
}