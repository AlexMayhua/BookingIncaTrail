import mongoose from 'mongoose'

const CouponsSchema = new mongoose.Schema({
    code: { type: String, required: true, unique: true },
    quantity: { type: Number, required: true },
    discount: { type: Number, required: true },
    description: { type: String, required: true },
    
}, {
    timestamps: true
})

let Dataset = mongoose.models.coupons || mongoose.model('coupons', CouponsSchema)
export default Dataset