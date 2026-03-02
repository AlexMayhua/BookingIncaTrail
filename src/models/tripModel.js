import mongoose from 'mongoose'

const TripSchema = new mongoose.Schema({
    title: { type: String },
    sub_title: { type: String },
    highlight: { type: String },
    price: { type: Number },
    duration: { type: String },
    category: { type: String },
    wetravel: { type: String },
    lang: { type: String },
    description: {type: String},
    information: {type: Array},
    gallery: {type: Array},
    quickstats: {type: Array},
    slug: {type: String},
    offer:{type: String},
    isDeals: {type: Boolean},
    discount: {type: Number},
    meta_title: {type: String},
    meta_description: {type: String},
    navbar_description: {type: String}, // Descripción rica en HTML para mostrar en navbar
    linkedTripId: {type: String}, // ID del mismo tour en otro idioma (ES ↔ EN)
    url_brochure: {type: String},
    enableDiscount: {type: Boolean},
    ardiscounts: {type: Array}
}, {
    timestamps: true
})

let Dataset = mongoose.models.trip || mongoose.model('trip', TripSchema)
export default Dataset