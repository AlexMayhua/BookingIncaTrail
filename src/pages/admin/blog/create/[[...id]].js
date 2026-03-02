import Head from 'next/head'
import { useState, useContext, useEffect } from 'react'
import { DataContext } from '../../../../store/GlobalState'
import { sigleImage } from '../../../../utils/imageUpload'
import { postData, getData, putData } from '../../../../utils/fetchData'
import { useRouter } from 'next/router'
import dynamic from 'next/dynamic'
import 'react-quill-new/dist/quill.snow.css'

const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false })

const modules = {
    toolbar: [
        [{ header: '1' }, { header: '2' }, { header: '3' }, { font: [] }],
        [{ size: [] }],
        ['bold', 'italic', 'underline', 'strike', 'blockquote'],
        [

            { list: 'bullet' },
            { list: 'ordered' },
            { indent: '-1' },
            { indent: '+1' },
        ],
        ['link', 'image', 'video'],
        ['clean'],
    ],
    clipboard: {
        // toggle to add extra line breaks when pasting HTML:
        matchVisual: false,
    },
}
const formats = [
    'header',
    'font',
    'size',
    'bold',
    'italic',
    'underline',
    'strike',
    'blockquote',
    'list',
    'indent',
    'link',
    'image',
    'video',
]


const ProductsManager = () => {
    const { state, dispatch } = useContext(DataContext)
    const { auth } = state


    const router = useRouter()
    const { id } = router.query
    const [onEdit, setOnEdit] = useState(false)

    useEffect(() => {
        if (auth.user?.role !== 'admin') {
            router.push("/signin")
        }
    })

    const initialState = {
        slug: '',
        title: '',
        min_content: '',
        lang: '',
        meta_title: '',
        meta_description: ''
    }

    const [product, setProduct] = useState(initialState)
    const [disabled, setDisabled] = useState(true);
    const { slug, lang, title, min_content, meta_title, meta_description } = product

    const [content, setContent] = useState('')
    const [content_optional, setContentOptional] = useState('')


    const [image, setImages] = useState([])




    // Whenever the product state changes, run the useEffect function
    useEffect(() => {
        // The Object.values() method returns an array of values of the object passed in
        // The every() method takes a callback and loops through the values array
        // For every element in every() method, call the Boolean method on it
        // The Boolean method will return true or false if the element is empty or not
        const isProduct = Object.values(product).every((el) => Boolean(el));
        isProduct ? setDisabled(false) : setDisabled(true);

    }, [product]);

    useEffect(() => {
        if (id) {
            setOnEdit(true)
            getData(`admin/blog/${id}`).then(res => {
                setProduct(res)
                setImages(res.image)
                setContent(res.content)
                setContentOptional(res.content_optional)
            })
        } else {
            setOnEdit(false)
            setProduct(initialState)
            setImages([])
        }
    }, [id])


    const handleChangeInput = e => {
        const { name, value } = e.target
        setProduct({ ...product, [name]: value })
        dispatch({ type: 'NOTIFY', payload: {} })
    }

    const handleUploadInput = e => {
        dispatch({ type: 'NOTIFY', payload: {} })
        let newImages = []
        let num = 0
        let err = ''
        const files = [...e.target.files]

        if (files.length === 0)
            return dispatch({ type: 'NOTIFY', payload: { error: 'Files does not exist.' } })

        files.forEach(file => {
            if (file.size > 10240 * 10240)
                return err = 'The largest image size is 10mb'

            if (file.type !== 'image/jpeg' && file.type !== 'image/png')
                return err = 'Image format is incorrect.'

            num += 1;
            if (num <= 1) newImages.push(file)
            return newImages;
        })

        if (err) dispatch({ type: 'NOTIFY', payload: { error: err } })

        const imgCount = image.length
        if (imgCount + newImages.length > 1)
            return dispatch({ type: 'NOTIFY', payload: { error: 'Select up to 1 images only!' } })
        setImages([...image, ...newImages])
    }

    const deleteImage = index => {
        const newArr = [...image]
        newArr.splice(index, 1)
        setImages(newArr)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (auth.user.role !== 'admin')
            return dispatch({ type: 'NOTIFY', payload: { error: 'Authentication is not valid.' } })

        if (!title || image.length === 0)
            return dispatch({ type: 'NOTIFY', payload: { error: 'Please add all the fields.' } })


        dispatch({ type: 'NOTIFY', payload: { loading: true } })
        let media = []
        const imgNewURL = image.filter(img => !img.url)
        const imgOldURL = image.filter(img => img.url)

        if (imgNewURL.length > 0) media = await sigleImage(imgNewURL)

        let res;
        if (onEdit) {
            res = await putData(`admin/blog/${id}`, { ...product, image: [...imgOldURL, ...media], content, content_optional }, auth.token)
            if (res.err) return dispatch({ type: 'NOTIFY', payload: { error: res.err } })
        } else {
            res = await postData('admin/blog', { ...product, image: [...imgOldURL, ...media], content, content_optional }, auth.token)

            if (res.err) return dispatch({ type: 'NOTIFY', payload: { error: res.err } })
        }

        return dispatch({ type: 'NOTIFY', payload: { success: res.msg } })

    }

    return (
        <div>
            <Head>
                <title>Create trip</title>
            </Head>

            <nav className='bg-gray-100 sticky top-0 border-b z-20 '>
                <div className='flex justify-between lg:mx-24'>
                    <button className=" text-sm bg-gray-200 px-2 py-2" onClick={() => router.back()}>Regresar</button>
                    <h5 className='text-center py-4 font-bold'>Crear Blog</h5>
                    {
                        onEdit ?

                            <button onClick={handleSubmit} className="text-white my-2 px-4 bg-primary px-3 py-1">
                                Actualizar
                            </button> :
                            <button onClick={handleSubmit} className="text-white my-2 px-4 bg-primary px-3 py-1" disabled={disabled}>
                                Crear
                            </button>
                    }
                </div>
            </nav>

            <div className='mx-6'>
                <h5 className='text-center my-8'>Agregue todos los campos y cargue imágenes del blog de la siguiente manera:</h5>
                <form className="grid lg:grid-cols-2 grid-cols-1 gap-4" onSubmit={handleSubmit}>

                    <div className='grid grid-cols-1 gap-2'>
                        <label htmlFor="title" className='font-bold'>Titulo</label>
                        <input
                            type="text"
                            name="title"
                            value={title}
                            placeholder="Title"
                            className="block appearance-none w-full border border-gray-300 py-3 px-4 pr-8 text-sm leading-tight focus:outline-none focus:bg-white focus:border-primary"
                            onChange={handleChangeInput} />

                        <label htmlFor="min_content" className='font-bold' >Sub Titulo</label>
                        <input
                            type="text"
                            name="min_content"
                            value={min_content}
                            placeholder=""
                            className="block appearance-none w-full border border-gray-300 py-3 px-4 pr-8 text-sm leading-tight focus:outline-none focus:bg-white focus:border-primary"
                            onChange={handleChangeInput} />

                        <label htmlFor="description" className='font-bold'>Content</label>
                        <div>
                            <ReactQuill
                                modules={modules}
                                formats={formats}
                                theme="snow"
                                value={content}
                                onChange={(content) => {
                                    setContent(content)
                                }}
                            />
                            <ReactQuill
                                modules={modules}
                                formats={formats}
                                theme="snow"
                                value={content_optional}
                                onChange={(content_optional) => {
                                    setContentOptional(content_optional)
                                }}
                            />
                        </div>


                        <label htmlFor="slug" className='font-bold'>SLUG del Blog: Separar con &quot;-&quot; o &quot;_&quot; los espacios entre palabras</label>
                        <input
                            type="text"
                            name="slug"
                            value={slug}
                            placeholder="slug"
                            className="block appearance-none w-full border border-gray-300 py-3 px-4 pr-8 text-sm leading-tight focus:outline-none focus:bg-white focus:border-primary"
                            onChange={handleChangeInput} />

                        <div className="input-group-prepend px-0 my-2">
                            <label htmlFor='lang' className='font-bold'>Selecionar Idioma</label><br />
                            <select name="lang" id="lang" value={lang}
                                onChange={handleChangeInput} className="custom-select text-capitalize">
                                <option value="all">Todos las idiomas</option>
                                <option value='en'>INGLES</option>
                                <option value='es'>ESPAÑOL</option>

                            </select>
                        </div>
                        <div>
                            <label htmlFor="meta_title" className='font-bold'>Meta Title</label>
                            <input
                                type="text"
                                name="meta_title"
                                value={meta_title}
                                className="block appearance-none w-full border border-gray-300 py-3 px-4 pr-8 text-sm leading-tight focus:outline-none focus:bg-white focus:border-primary"
                                onChange={handleChangeInput} />

                            <label htmlFor="meta_description" className='font-bold'>Meta Description</label>
                            <input
                                type="text"
                                name="meta_description"
                                value={meta_description}
                                className="block appearance-none w-full border border-gray-300 py-3 px-4 pr-8 text-sm leading-tight focus:outline-none focus:bg-white focus:border-primary"
                                onChange={handleChangeInput} />

                        </div>

                    </div>

                    <div>
                        <div>
                            <div className="custom-file border-0 p-2 rounded rounded-pill bg-dark text-white">

                                <input type="file" className="rounded rounded-pill bg-dark form-control-file "
                                    onChange={handleUploadInput} multiple accept="image/*" />
                            </div>

                        </div>

                        <p>Selecciona una imagen</p>
                        <div className="grid grid-cols-1 gap-4">
                            {
                                image.map((img, index) => (
                                    <div key={index} className=" my-1 relative">
                                        <img src={img.url ? img.url : URL.createObjectURL(img)}
                                            alt="" className="img-thumbnail rounded" />

                                        <span onClick={() => deleteImage(index)} className='absolute top-2 left-2 text-sm text-white bg-red-500 rounded-full px-2'>X</span>
                                    </div>
                                ))
                            }
                        </div>
                    </div>

                </form>

            </div>
        </div>
    )
}

export default ProductsManager