import Head from 'next/head'
import { useState, useContext, useEffect } from 'react'
import { DataContext } from '../../../../store/GlobalState'
import { imageUpload } from '../../../../utils/imageUpload'
import { postData, getData, putData } from '../../../../utils/fetchData'
import { useRouter } from 'next/router'
import dynamic from 'next/dynamic'
import 'react-quill-new/dist/quill.snow.css'

const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false })

const toolbarOptions = {
    toolbar: [
        [{ header: '1' }, { header: '2' }, { header: '3' }, { font: [] }],
        [{ size: [] }],
        [{ 'color': [] }],

        ['bold', 'italic', 'underline', 'strike', 'blockquote'],
        [{ list: 'bullet' }, { list: 'ordered' }, { indent: '-1' }, { indent: '+1' }],
        ['link', 'image', 'video'],
        ['clean'],
    ],
    clipboard: { matchVisual: false },
};

const textFormats = [
    'header', 'font', 'size', 'bold', 'italic', 'underline', 'strike',
    'blockquote', 'list', 'indent', 'link', 'color', 'image', 'video'
];

const ProductsManager = () => {
    const { state, dispatch } = useContext(DataContext);
    const { auth } = state;
    const router = useRouter();
    const { id } = router.query;

    const initialState = {
        title: '', sub_title: '', highlight: '', price: 0, duration: '', category: '',
        wetravel: '', lang: '', slug: '', discount: 0, offer: '', meta_title: '',
        meta_description: '', meta_keywords: '', url_brochure: '#', navbar_description: '', 
        linkedTripId: ''
    };

    const [product, setProduct] = useState(initialState);
    const [description, setDescription] = useState('');
    const [gallery, setGallery] = useState([]);
    const [information, setInformation] = useState([{ title: '', content: '' }]);
    const [quickstats, setQuickstats] = useState([
        { title: 'Tour Type', content: '' },
        { title: 'Duration', content: '' },
        { title: 'Group', content: '' },
        { title: 'Difficulty', content: '' },
        { title: 'Accommodation', content: '' },
        { title: 'Languages', content: '' }
    ]);
    const [isDeals, setIsDeals] = useState(false);
    const [enableDiscount, setEnableDiscounts] = useState(false);
    const [ardiscounts, setArdiscounts] = useState([{ persons: 0, pdiscount: 0 }]);
    const [disabled, setDisabled] = useState(true);
    const [onEdit, setOnEdit] = useState(false);
    const [availableCategories, setAvailableCategories] = useState([]);
    const [navbarDescription, setNavbarDescription] = useState('');
    const [availableTrips, setAvailableTrips] = useState([]);

    // Cargar categorías disponibles desde la API
    useEffect(() => {
        fetch('/api/trip/categories')
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    setAvailableCategories(data.categories);
                }
            })
            .catch(err => console.error('Error loading categories:', err));
    }, []);

    useEffect(() => {
        if (!auth.user?.role === 'admin') router.push("/signin");
        if (id) {
            setOnEdit(true);
            getData(`admin/trip/${id}`).then(res => {
                setProduct(res);
                setGallery(res.gallery);
                setInformation(res.information);
                setQuickstats(res.quickstats);
                setDescription(res.description);
                setNavbarDescription(res.navbar_description || '');
                setIsDeals(res.isDeals);
                setEnableDiscounts(res.enableDiscount);
                setArdiscounts(res.ardiscounts)
            });
        } else {
            setOnEdit(false);
            setProduct(initialState);
            setGallery([]);
            setNavbarDescription('');
        }
        
        // Cargar trips disponibles para vincular
        fetch('/api/trip?locale=all&fields=_id,title,lang,category')
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) {
                    setAvailableTrips(data);
                }
            })
            .catch(err => console.error('Error loading trips:', err));
    }, [id, auth.user?.role, router]);

    useEffect(() => {
        setDisabled(!Object.values(product).every(Boolean));
    }, [product]);

    const handleChangeInput = e => {
        setProduct({ ...product, [e.target.name]: e.target.value });
        dispatch({ type: 'NOTIFY', payload: {} });
    };

    const validateImageDimensions = (file) => {
        return new Promise((resolve) => {
            const img = new Image();
            const objectUrl = URL.createObjectURL(file);
            
            img.onload = () => {
                URL.revokeObjectURL(objectUrl);
                const valid = img.width >= 800 && img.height >= 600;
                resolve({ 
                    file, 
                    valid, 
                    width: img.width, 
                    height: img.height,
                    size: file.size
                });
            };
            
            img.onerror = () => {
                URL.revokeObjectURL(objectUrl);
                resolve({ file, valid: false, width: 0, height: 0, size: file.size });
            };
            
            img.src = objectUrl;
        });
    };

    const handleUploadInput = async (e) => {
        const files = Array.from(e.target.files);
        
        if (files.length + gallery.length > 6) {
            dispatch({ 
                type: 'NOTIFY', 
                payload: { error: `Maximum 6 images allowed. You can add ${6 - gallery.length} more.` } 
            });
            return;
        }
        
        // Validar dimensiones antes de subir
        const validatedFiles = await Promise.all(
            files.map(file => validateImageDimensions(file))
        );
        
        const invalidFiles = validatedFiles.filter(f => !f.valid);
        const validFiles = validatedFiles.filter(f => f.valid);
        
        if (invalidFiles.length > 0) {
            dispatch({ 
                type: 'NOTIFY', 
                payload: { 
                    error: `${invalidFiles.length} image(s) rejected. Minimum dimensions: 800×600px. Invalid: ${invalidFiles.map(f => `${f.width}×${f.height}px`).join(', ')}` 
                } 
            });
        }
        
        if (validFiles.length > 0) {
            dispatch({ type: 'NOTIFY', payload: { loading: true } });
            const newImages = await imageUpload(validFiles.map(f => f.file));
            setGallery((prevGallery) => [...prevGallery, ...newImages]);
            dispatch({ 
                type: 'NOTIFY', 
                payload: { success: `${validFiles.length} image(s) uploaded successfully!` } 
            });
        }
    };

    const handleAddItem = (setter, list) => setter([...list, { title: '', content: '' }]);
    const handleRemoveItem = (setter, list, index) => setter(list.filter((_, i) => i !== index));
    const handleUpdateItem = (setter, list, index, field, value) => {
        const updatedList = [...list];
        updatedList[index][field] = value;
        setter(updatedList);
    };


    const handleAddItemArdiscounts = (setter, list) => setter([...list, { persons: 1, pdiscount: 0 }]);
    const handleRemoveItemArdiscounts = (setter, list, index) => setter(list.filter((_, k) => k !== index));
    const handleUpdateItemArdiscounts = (setter, list, index, field, value) => {
        const updatedList = [...list];
        updatedList[index][field] = Number(value);
        setter(updatedList);
    };


    const deleteImage = index => setGallery(gallery.filter((_, i) => i !== index));

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!product.title || !product.price || !gallery.length)
            return dispatch({ type: 'NOTIFY', payload: { error: 'Please add all the fields.' } });

        dispatch({ type: 'NOTIFY', payload: { loading: true } });
        const newImages = gallery.filter(img => !img.url);
        const oldImages = gallery.filter(img => img.url);

        const media = newImages.length ? await imageUpload(newImages) : [];
        const updatedGallery = [...oldImages, ...media];

        await actualizarArchivo(product.lang);

        const data = { ...product, gallery: updatedGallery, information, quickstats, isDeals, description, ardiscounts, enableDiscount, navbar_description: navbarDescription };
        const res = onEdit ? await putData(`admin/trip/${id}`, data, auth.token) : await postData('admin/trip', data, auth.token);

        if (res.err) return dispatch({ type: 'NOTIFY', payload: { error: res.err } });
        dispatch({ type: 'NOTIFY', payload: { success: res.msg } });
    };

    const [previewImage, setPreviewImage] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const openPreview = (img) => {
        setPreviewImage(img);
        setIsModalOpen(true);
    };

    const moveItem = (arr, fromIndex, toIndex) => {
        if (toIndex < 0 || toIndex >= arr.length) return arr;
        const newArr = [...arr];
        const item = newArr.splice(fromIndex, 1)[0];
        newArr.splice(toIndex, 0, item);
        return newArr;
    };

    async function actualizarArchivo(lang) {
        try {
            const res = await fetch(`http://localhost:3000/api/trip/?locale=${lang}&fields=title,category,slug`);
            const newArray = await res.json();

            const response = await fetch(`http://localhost:3000/api/trip/update`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    array_tour: newArray,   // Enviamos el contenido
                    lang: lang,  // Indicamos idioma
                }),
            });

            const result = await response.json();
            // Archivo actualizado correctamente
        } catch (error) {
            console.error("Error actualizando archivo:", error);
        }
    }

    return (
        <div className="min-h-screen bg-cream">
            <Head><title>{onEdit ? "Edit Trip" : "Create Trip"}</title></Head>

            {/* Sticky Header */}
            <nav className="bg-gradient-to-r from-primary to-alternative sticky top-0 border-b border-secondary z-20 shadow-xl">
                <div className="container mx-auto flex justify-between items-center p-4">
                    <button
                        className="flex items-center gap-2 text-white hover:text-secondary px-4 py-2 rounded-lg transition-all hover:bg-white hover:bg-opacity-10"
                        onClick={() => router.back()}>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                            <path fillRule="evenodd" d="M7.72 12.53a.75.75 0 010-1.06l7.5-7.5a.75.75 0 111.06 1.06L9.31 12l6.97 6.97a.75.75 0 11-1.06 1.06l-7.5-7.5z" clipRule="evenodd" />
                        </svg>
                        Back
                    </button>
                    <h5 className="text-xl font-bold text-white">
                        {onEdit ? "✏️ Edit Tour" : "➕ Create New Tour"}
                    </h5>
                    <button
                        onClick={handleSubmit}
                        className="flex items-center gap-2 bg-secondary hover:bg-yellow text-primary font-bold px-6 py-2 rounded-lg shadow-lg transition-all hover:shadow-xl">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                            <path fillRule="evenodd" d="M19.916 4.626a.75.75 0 01.208 1.04l-9 13.5a.75.75 0 01-1.154.114l-6-6a.75.75 0 011.06-1.06l5.353 5.353 8.493-12.739a.75.75 0 011.04-.208z" clipRule="evenodd" />
                        </svg>
                        {onEdit ? "Update Tour" : "Create Tour"}
                    </button>
                </div>
            </nav>

            <div className="container mx-auto px-4 lg:px-20 py-8">
                <form className="bg-white shadow-2xl rounded-xl p-8 grid lg:grid-cols-2 gap-8 border border-gray-200" onSubmit={handleSubmit}>
                    {/* Left Column */}
                    <div className="space-y-6">
                        {/* Header Section */}
                        <div className="bg-gradient-to-r from-alternative to-blue p-4 rounded-lg">
                            <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                                    <path d="M21.731 2.269a2.625 2.625 0 00-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 000-3.712zM19.513 8.199l-3.712-3.712-12.15 12.15a5.25 5.25 0 00-1.32 2.214l-.8 2.685a.75.75 0 00.933.933l2.685-.8a5.25 5.25 0 002.214-1.32L19.513 8.2z" />
                                </svg>
                                Basic Information
                            </h3>
                        </div>

                        {["title", "sub_title", "highlight", "meta_title", "meta_description"]
                            .map((field, idx) => (
                                <div key={idx}>
                                    <label htmlFor={field} className="block text-sm font-bold text-primary mb-2 capitalize">
                                        {field.replace("_", " ")}
                                    </label>
                                    <input
                                        type="text"
                                        name={field}
                                        value={product[field] || ""}
                                        placeholder={`Enter ${field.replace("_", " ")}`}
                                        className="w-full border-2 border-gray-200 rounded-lg py-3 px-4 focus:outline-none focus:border-alternative focus:ring-2 focus:ring-alternative focus:ring-opacity-20 transition"
                                        onChange={handleChangeInput}
                                    />
                                </div>
                            ))}

                        <div>
                            <label className="block text-sm font-bold text-primary mb-2">Description</label>
                            <div className="border-2 border-gray-200 rounded-lg overflow-hidden focus-within:border-alternative focus-within:ring-2 focus-within:ring-alternative focus-within:ring-opacity-20">
                                <ReactQuill theme="snow" value={description} onChange={setDescription} modules={toolbarOptions} formats={textFormats} />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-primary mb-2 flex items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-alternative">
                                    <path d="M21.731 2.269a2.625 2.625 0 00-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 000-3.712zM19.513 8.199l-3.712-3.712-8.4 8.4a5.25 5.25 0 00-1.32 2.214l-.8 2.685a.75.75 0 00.933.933l2.685-.8a5.25 5.25 0 002.214-1.32l8.4-8.4z" />
                                    <path d="M5.25 5.25a3 3 0 00-3 3v10.5a3 3 0 003 3h10.5a3 3 0 003-3V13.5a.75.75 0 00-1.5 0v5.25a1.5 1.5 0 01-1.5 1.5H5.25a1.5 1.5 0 01-1.5-1.5V8.25a1.5 1.5 0 011.5-1.5h5.25a.75.75 0 000-1.5H5.25z" />
                                </svg>
                                Navbar Description (shown in category menu)
                            </label>
                            <p className="text-xs text-gray-600 mb-2">💡 This rich HTML description appears in the navbar mega-menu when users hover over the category</p>
                            <div className="border-2 border-gray-200 rounded-lg overflow-hidden focus-within:border-alternative focus-within:ring-2 focus-within:ring-alternative focus-within:ring-opacity-20">
                                <ReactQuill theme="snow" value={navbarDescription} onChange={setNavbarDescription} modules={toolbarOptions} formats={textFormats} />
                            </div>
                        </div>

                        {/* Information Section */}
                        <div className="mt-6">
                            <div className="bg-gradient-to-r from-brown to-dark-brown p-4 rounded-lg mb-4">
                                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                                        <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm8.706-1.442c1.146-.573 2.437.463 2.126 1.706l-.709 2.836.042-.02a.75.75 0 01.67 1.34l-.04.022c-1.147.573-2.438-.463-2.127-1.706l.71-2.836-.042.02a.75.75 0 11-.671-1.34l.041-.022zM12 9a.75.75 0 100-1.5.75.75 0 000 1.5z" clipRule="evenodd" />
                                    </svg>
                                    Tour Information Sections
                                </h3>
                            </div>

                            {information.map((item, index) => (
                                <div key={index} className="relative border-2 border-brown border-opacity-20 rounded-xl p-5 my-3 shadow-md bg-gradient-to-br from-cream to-white hover:shadow-lg transition-shadow">

                                    {/* Botones de mover */}
                                    <div className="absolute top-2 left-0 flex flex-col space-y-1">
                                        <button
                                            type="button"
                                            onClick={() => setInformation(moveItem(information, index, index - 1))}
                                            disabled={index === 0}
                                            title="Subir"
                                            className="text-gray-500 hover:text-secondary disabled:opacity-30"
                                        >
                                            ▲
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setInformation(moveItem(information, index, index + 1))}
                                            disabled={index === information.length - 1}
                                            title="Bajar"
                                            className="text-gray-500 hover:text-secondary disabled:opacity-30"
                                        >
                                            ▼
                                        </button>
                                    </div>

                                    {/* Botón eliminar */}
                                    <button
                                        type="button"
                                        className="absolute text-3xl top-4 right-0 text-gray-500 hover:text-red-600 transition"
                                        onClick={() => handleRemoveItem(setInformation, information, index)}
                                        title="Eliminar"
                                    >
                                        &times;
                                    </button>

                                    {/* Inputs */}
                                    <input
                                        type="text"
                                        placeholder="Title"
                                        className="w-full border border-gray-300 rounded-md py-2 px-3 mb-2 focus:outline-none focus:border-primary"
                                        value={item.title}
                                        onChange={(e) => handleUpdateItem(setInformation, information, index, 'title', e.target.value)}
                                    />
                                    <ReactQuill
                                        theme="snow"
                                        value={item.content}
                                        onChange={(content) => handleUpdateItem(setInformation, information, index, 'content', content)}
                                        modules={toolbarOptions}
                                        formats={textFormats}
                                        className="rounded-md"
                                    />
                                </div>
                            ))}

                            <button
                                type="button"
                                className="flex items-center gap-2 bg-brown hover:bg-dark-brown text-white font-bold px-5 py-2.5 rounded-lg shadow-md hover:shadow-lg transition-all mt-4"
                                onClick={() => handleAddItem(setInformation, information)}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                                    <path fillRule="evenodd" d="M12 3.75a.75.75 0 01.75.75v6.75h6.75a.75.75 0 010 1.5h-6.75v6.75a.75.75 0 01-1.5 0v-6.75H4.5a.75.75 0 010-1.5h6.75V4.5a.75.75 0 01.75-.75z" clipRule="evenodd" />
                                </svg>
                                Add Information Section
                            </button>

                            {/* Gallery Section */}
                            <div className="bg-gradient-to-r from-primary to-dark p-4 rounded-lg mb-4 mt-8">
                                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                                        <path fillRule="evenodd" d="M1.5 6a2.25 2.25 0 012.25-2.25h16.5A2.25 2.25 0 0122.5 6v12a2.25 2.25 0 01-2.25 2.25H3.75A2.25 2.25 0 011.5 18V6zM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0021 18v-1.94l-2.69-2.689a1.5 1.5 0 00-2.12 0l-.88.879.97.97a.75.75 0 11-1.06 1.06l-5.16-5.159a1.5 1.5 0 00-2.12 0L3 16.061zm10.125-7.81a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0z" clipRule="evenodd" />
                                    </svg>
                                    Gallery Images
                                </h3>
                            </div>
                            <div className="bg-blue-50 border-l-4 border-blue-500 p-3 mb-4 rounded">
                                <p className="text-sm text-blue-800">
                                    💡 <strong>First image</strong> is used as the cover photo for the navbar menu and category cards. Drag images to reorder.
                                </p>
                            </div>
                            <label className="block text-sm font-bold text-primary mb-2">
                                Upload Images (max 6)
                                <span className="ml-2 text-xs text-gray-600 font-normal">
                                    Min: 800×600px | Current: {gallery.length}/6
                                </span>
                            </label>
                            <input
                                type="file"
                                className="w-full border border-gray-300 rounded-md p-2 bg-white text-gray-600 cursor-pointer hover:border-primary"
                                onChange={handleUploadInput}
                                multiple
                                accept="image/*"
                            />
                            <div className="grid lg:grid-cols-2 sm:grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                                {gallery.map((img, index) => (
                                    <div key={index} className={`relative overflow-hidden border-2 rounded-lg bg-white shadow-lg hover:shadow-xl transition-all ${index === 0 ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-200'}`}>
                                        {/* Badge para la primera imagen (navbar cover) */}
                                        {index === 0 && (
                                            <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-blue-600 to-blue-500 text-white text-xs font-bold py-1 px-2 text-center z-10 flex items-center justify-center gap-1">
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                                                    <path fillRule="evenodd" d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401z" clipRule="evenodd" />
                                                </svg>
                                                NAVBAR COVER IMAGE
                                            </div>
                                        )}
                                        
                                        <div className="relative">
                                            {/* Botones para reordenar */}
                                            <div className="absolute left-2 top-12 flex flex-col gap-1 z-20">
                                                {index > 0 && (
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            const newGallery = [...gallery];
                                                            [newGallery[index], newGallery[index - 1]] = [newGallery[index - 1], newGallery[index]];
                                                            setGallery(newGallery);
                                                        }}
                                                        className="bg-blue-600 bg-opacity-90 text-white rounded p-1 hover:bg-blue-700 transition"
                                                        title="Move up"
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                                            <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
                                                        </svg>
                                                    </button>
                                                )}
                                                {index < gallery.length - 1 && (
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            const newGallery = [...gallery];
                                                            [newGallery[index], newGallery[index + 1]] = [newGallery[index + 1], newGallery[index]];
                                                            setGallery(newGallery);
                                                        }}
                                                        className="bg-blue-600 bg-opacity-90 text-white rounded p-1 hover:bg-blue-700 transition"
                                                        title="Move down"
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                                            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                                        </svg>
                                                    </button>
                                                )}
                                            </div>
                                            
                                            <img
                                                src={img.url}
                                                alt={img.alt}
                                                className="w-full h-40 object-cover cursor-pointer"
                                                onClick={() => openPreview(img)}
                                            />
                                            
                                            {/* Badge de dimensiones */}
                                            {img.width && img.height && (
                                                <span className="absolute top-2 left-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded font-mono">
                                                    {img.width} × {img.height}
                                                </span>
                                            )}
                                            
                                            {/* Botón eliminar */}
                                            <button
                                                onClick={() => deleteImage(index)}
                                                className="absolute top-2 right-2 bg-red-600 bg-opacity-90 text-white rounded-full p-1 hover:bg-red-700 transition"
                                                title="Delete image"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm2.828-10.828a1 1 0 10-1.414-1.414L10 8.586 8.586 7.172a1 1 0 00-1.414 1.414L8.586 10l-1.414 1.414a1 1 0 001.414 1.414L10 11.414l1.414 1.414a1 1 0 001.414-1.414L11.414 10l1.414-1.414z" clipRule="evenodd" />
                                                </svg>
                                            </button>
                                        </div>
                                        
                                        {/* Info de la imagen */}
                                        <div className="p-2 bg-gray-50 border-t">
                                            <p className="text-xs text-gray-700 truncate" title={img.alt}>
                                                📄 {img.alt}
                                            </p>
                                            <div className="flex justify-between items-center mt-1">
                                                {img.format && (
                                                    <span className="text-xs text-gray-500 uppercase font-semibold">
                                                        {img.format}
                                                    </span>
                                                )}
                                                {img.size && (
                                                    <span className="text-xs text-gray-500">
                                                        {(img.size / 1024).toFixed(1)} KB
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    {/* Right Column */}
                    <div className="space-y-6">
                        {/* Tour Details */}
                        <div className="bg-gradient-to-br from-cream to-white border-2 border-alternative border-opacity-20 rounded-xl p-6 shadow-lg">
                            <div className="bg-gradient-to-r from-alternative to-blue p-4 rounded-lg mb-6">
                                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                                        <path d="M11.644 1.59a.75.75 0 01.712 0l9.75 5.25a.75.75 0 010 1.32l-9.75 5.25a.75.75 0 01-.712 0l-9.75-5.25a.75.75 0 010-1.32l9.75-5.25z" />
                                        <path d="M3.265 10.602l7.668 4.129a2.25 2.25 0 002.134 0l7.668-4.13 1.37.739a.75.75 0 010 1.32l-9.75 5.25a.75.75 0 01-.71 0l-9.75-5.25a.75.75 0 010-1.32l1.37-.738z" />
                                        <path d="M10.933 19.231l-7.668-4.13-1.37.739a.75.75 0 000 1.32l9.75 5.25c.221.12.489.12.71 0l9.75-5.25a.75.75 0 000-1.32l-1.37-.738-7.668 4.13a2.25 2.25 0 01-2.134-.001z" />
                                    </svg>
                                    Tour Details
                                </h3>
                            </div>

                            {["wetravel", "duration", "price", "discount", "offer", "url_brochure", "slug"]
                                .map((field, idx) => (
                                    <div key={idx} className="mb-4">
                                        <label htmlFor={field} className="block text-sm font-bold text-primary mb-2 capitalize">
                                            {field.replace("_", " ")}
                                        </label>
                                        <input
                                            type={field === "price" || field === "discount" ? "number" : "text"}
                                            name={field}
                                            value={product[field] || ""}
                                            placeholder={`Enter ${field.replace("_", " ")}`}
                                            className="w-full border-2 border-gray-200 rounded-lg py-3 px-4 focus:outline-none focus:border-alternative focus:ring-2 focus:ring-alternative focus:ring-opacity-20 transition"
                                            onChange={handleChangeInput}
                                        />
                                    </div>
                                ))}
                            <label className="text-sm font-medium text-gray-600 mb-1">Quick Stats</label>
                            {quickstats.map((item, index) => (
                                <div key={index} className="flex items-center space-x-2 my-2">
                                    <input
                                        type="text"
                                        placeholder="Title"
                                        className="flex-1 border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-primary"
                                        value={item.title}
                                        onChange={(e) => handleUpdateItem(setQuickstats, quickstats, index, 'title', e.target.value)}
                                    />
                                    <input
                                        type="text"
                                        placeholder="Content"
                                        className="flex-1 border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-primary"
                                        value={item.content}
                                        onChange={(e) => handleUpdateItem(setQuickstats, quickstats, index, 'content', e.target.value)}
                                    />
                                    {/*<button
                                        type="button"
                                        className="text-red-500 hover:text-red-700"
                                        onClick={() => handleRemoveItem(setQuickstats, quickstats, index)}
                                    >
                                        X
                                    </button>*/}
                                </div>
                            ))}
                            {/*
                            <button
                                type="button"
                                className="text-primary mt-2"
                                onClick={() => handleAddItem(setQuickstats, quickstats)}
                            >
                                + Add Quick Stat
                            </button>
                            */}


                            {/* Sección para activar/desactivar los descuentos */}
                            <label className="flex items-center space-x-3 text-sm font-medium text-gray-700 mt-6">
                                <input
                                    type="checkbox"
                                    checked={enableDiscount}
                                    onChange={() => setEnableDiscounts(!enableDiscount)}
                                    className="text-primary focus:ring-primary-dark"
                                />
                                <span>Enable Discounts</span>
                            </label>
                            {/* Título para la lista de descuentos */}
                            <label className="text-lg font-medium text-gray-700 mb-3 mt-4">Discounts</label>

                            {/* Lista de descuentos aplicados */}
                            {ardiscounts.map((item, index) => (
                                <div key={index} className="flex items-center justify-between space-x-4 my-3 p-4 bg-white border border-gray-300 rounded shadow">

                                    <div className="flex items-center space-x-2">
                                        <label className="text-gray-700">For</label>
                                        <input
                                            type="number"
                                            min={1}
                                            placeholder="Persons"
                                            className="w-24 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            value={item.persons}
                                            onChange={(e) => handleUpdateItemArdiscounts(setArdiscounts, ardiscounts, index, 'persons', e.target.value)}
                                        />
                                        <label className="text-gray-700">people - Discount</label>
                                        <input
                                            type="number"
                                            min={0}
                                            placeholder="Discount"
                                            className="w-24 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            value={item.pdiscount}
                                            onChange={(e) => handleUpdateItemArdiscounts(setArdiscounts, ardiscounts, index, 'pdiscount', e.target.value)}
                                        />
                                        <span className="text-gray-600">%</span>
                                    </div>

                                    {/* Icono de eliminar descuento */}
                                    <button
                                        type="button"
                                        className="text-red-500 hover:text-red-700 focus:outline-none"
                                        onClick={() => handleRemoveItemArdiscounts(setArdiscounts, ardiscounts, index)}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-x-circle" viewBox="0 0 16 16">
                                            <path d="M11.742 4.758a1 1 0 1 0-1.484-1.32l-3.26 3.92-3.26-3.92a1 1 0 1 0-1.484 1.32l3.26 3.92-3.26 3.92a1 1 0 1 0 1.484 1.32l3.26-3.92 3.26 3.92a1 1 0 1 0 1.484-1.32l-3.26-3.92 3.26-3.92z" />
                                        </svg>
                                    </button>
                                </div>
                            ))}

                            {/* Botón para agregar un nuevo descuento */}
                            <button
                                type="button"
                                className="flex items-center justify-center text-white bg-primary hover:bg-primary-dark focus:ring-2 focus:ring-primary-dark rounded-lg py-2 px-6 mt-4 transition duration-200 ease-in-out"
                                onClick={() => handleAddItemArdiscounts(setArdiscounts, ardiscounts)}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-plus-circle mr-2" viewBox="0 0 16 16">
                                    <path d="M8 16a8 8 0 1 0 0-16 8 8 0 0 0 0 16zm1-8a1 1 0 0 1-1 1H7v2a1 1 0 0 1-2 0V9H4a1 1 0 0 1 0-2h1V5a1 1 0 0 1 2 0v2h2a1 1 0 0 1 1 1z" />
                                </svg>
                                Add Discount
                            </button>



                            <label className="flex items-center space-x-3 text-sm font-medium text-gray-600 mt-6">
                                <input type="checkbox" checked={isDeals} onChange={() => setIsDeals(!isDeals)} className="text-primary focus:ring-primary-dark" />
                                <span>Include in Deals</span>
                            </label>
                            <div className="mt-6">
                                <label className="block text-sm font-medium text-gray-600 mb-1">
                                    Category 
                                    {availableCategories.length > 0 && (
                                        <span className="ml-2 text-xs text-green-600">({availableCategories.length} available)</span>
                                    )}
                                </label>
                                <select 
                                    name="category" 
                                    value={product.category} 
                                    onChange={handleChangeInput} 
                                    className="w-full py-2 px-3 border border-gray-300 rounded-md focus:outline-none focus:border-primary transition"
                                >
                                    <option value="">Select Category</option>
                                    {availableCategories.map(cat => (
                                        <option key={cat} value={cat}>
                                            {cat.toUpperCase().replace(/-/g, ' ')}
                                        </option>
                                    ))}
                                </select>
                                <p className="text-xs text-gray-500 mt-1">
                                    💡 Categories are loaded from database. New categories will appear automatically.
                                </p>
                            </div>
                            <div className="mt-6">
                                <label className="block text-sm font-medium text-gray-600 mb-1">Language</label>
                                <select name="lang" value={product.lang} onChange={handleChangeInput} className="w-full py-2 px-3 border border-gray-300 rounded-md focus:outline-none focus:border-primary transition">
                                    <option value="all">All Languages</option>
                                    <option value='en'>INGLES</option>
                                    <option value='es'>ESPAÑOL</option>
                                </select>
                            </div>

                            <div className="mt-6">
                                <label className="block text-sm font-medium text-gray-600 mb-1 flex items-center gap-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-blue">
                                        <path fillRule="evenodd" d="M9 4.5a.75.75 0 01.721.544l.813 2.846a3.75 3.75 0 002.576 2.576l2.846.813a.75.75 0 010 1.442l-2.846.813a3.75 3.75 0 00-2.576 2.576l-.813 2.846a.75.75 0 01-1.442 0l-.813-2.846a3.75 3.75 0 00-2.576-2.576l-2.846-.813a.75.75 0 010-1.442l2.846-.813A3.75 3.75 0 007.466 7.89l.813-2.846A.75.75 0 019 4.5zM18 1.5a.75.75 0 01.728.568l.258 1.036c.236.94.97 1.674 1.91 1.91l1.036.258a.75.75 0 010 1.456l-1.036.258c-.94.236-1.674.97-1.91 1.91l-.258 1.036a.75.75 0 01-1.456 0l-.258-1.036a2.625 2.625 0 00-1.91-1.91l-1.036-.258a.75.75 0 010-1.456l1.036-.258a2.625 2.625 0 001.91-1.91l.258-1.036A.75.75 0 0118 1.5zM16.5 15a.75.75 0 01.712.513l.394 1.183c.15.447.5.799.948.948l1.183.395a.75.75 0 010 1.422l-1.183.395c-.447.15-.799.5-.948.948l-.395 1.183a.75.75 0 01-1.422 0l-.395-1.183a1.5 1.5 0 00-.948-.948l-1.183-.395a.75.75 0 010-1.422l1.183-.395c.447-.15.799-.5.948-.948l.395-1.183A.75.75 0 0116.5 15z" clipRule="evenodd" />
                                    </svg>
                                    Linked Trip (Other Language)
                                </label>
                                <select 
                                    name="linkedTripId" 
                                    value={product.linkedTripId || ''} 
                                    onChange={handleChangeInput} 
                                    className="w-full py-2 px-3 border border-gray-300 rounded-md focus:outline-none focus:border-primary transition"
                                >
                                    <option value="">No linked trip</option>
                                    {availableTrips
                                        .filter(trip => trip._id !== id && trip.lang !== product.lang)
                                        .map(trip => (
                                            <option key={trip._id} value={trip._id}>
                                                [{trip.lang?.toUpperCase()}] {trip.title} ({trip.category})
                                            </option>
                                        ))}
                                </select>
                                <p className="text-xs text-gray-500 mt-1">
                                    🔗 Link this tour with its version in another language (ES ↔ EN)
                                </p>
                            </div>

                            {/* Mostrar imagen principal */}
                            {gallery.length > 0 && (
                                <div className="mt-6 p-4 bg-gradient-to-br from-cream to-white rounded-lg border-2 border-alternative border-opacity-20">
                                    <label className="block text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-primary">
                                            <path fillRule="evenodd" d="M1.5 6a2.25 2.25 0 012.25-2.25h16.5A2.25 2.25 0 0122.5 6v12a2.25 2.25 0 01-2.25 2.25H3.75A2.25 2.25 0 011.5 18V6zM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0021 18v-1.94l-2.69-2.689a1.5 1.5 0 00-2.12 0l-.88.879.97.97a.75.75 0 11-1.06 1.06l-5.16-5.159a1.5 1.5 0 00-2.12 0L3 16.061zm10.125-7.81a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0z" clipRule="evenodd" />
                                        </svg>
                                        Main Image (First in Gallery)
                                    </label>
                                    <div className="relative rounded-lg overflow-hidden shadow-lg border-2 border-gray-200">
                                        <img 
                                            src={gallery[0].url} 
                                            alt={gallery[0].alt || 'Main tour image'} 
                                            className="w-full h-48 object-cover"
                                        />
                                        {gallery[0].width && gallery[0].height && (
                                            <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-70 text-white p-2 text-xs">
                                                <div className="flex justify-between items-center">
                                                    <span className="font-mono">{gallery[0].width} × {gallery[0].height}px</span>
                                                    {gallery[0].format && <span className="uppercase font-semibold">{gallery[0].format}</span>}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                    <p className="text-xs text-gray-500 mt-2">
                                        ⭐ This image is used as the main thumbnail for this tour
                                    </p>
                                </div>
                            )}

                        </div>

                        {/* Modal for Image Preview */}

                    </div>

                </form>
            </div>
        </div>
    );
};

export default ProductsManager;