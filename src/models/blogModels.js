import mongoose from 'mongoose'

const BlogSchema = new mongoose.Schema({
    title: { type: String },
    min_content: { type: String },
    image: { type: Array },
    content: { type: String },
    content_optional: { type: String, required: false },
    slug: { type: String },
    lang: {type: String},
    meta_title: {type: String},
    meta_description: {type: String},
}, {
    timestamps: true
})

let Dataset = mongoose.models.blog || mongoose.model('blog', BlogSchema)
export default Dataset