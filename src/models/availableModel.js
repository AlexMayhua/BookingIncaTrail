import mongoose from 'mongoose'

const AvailableSchema = new mongoose.Schema({
    ruta: { type: String },
    mes: { type: String },
    dia: { type: String },
    disponibilidad: { type: String }
}, {
    timestamps: false
})

let Dataset = mongoose.models.available || mongoose.model('available', AvailableSchema)
export default Dataset