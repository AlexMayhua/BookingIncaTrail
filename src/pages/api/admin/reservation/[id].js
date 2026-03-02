import Reservation from '../../../../models/reservationModel'
import auth from '../../../../middleware/auth'
import { dbConnect } from "../../../../utils/db"
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
      
        const trip = await Reservation.findById(id)
        if(!trip) return res.status(400).json({err: 'This reservation does not exist.'})
        
        res.json(trip)

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
            isCancel
    
        } = req.body

        if(!title || !price || gallery.length === 0 )
        return res.status(400).json({err: 'Please add all the fields.'})
 
        await Reservation.findOneAndUpdate({_id: id}, {
            isCancel
        })

        res.json({msg: 'Success! Updated a product'})
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

        // Eliminando reserva por ID
        await Reservation.findByIdAndDelete({_id: id})
        res.json({msg: 'Successfully Deleted Product/Products.'})

    } catch (err) {
        return res.status(500).json({err: 'Sorry. Please Login Again or Contact Us!'})
    }
}