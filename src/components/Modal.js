import { useContext } from 'react'
import { DataContext } from '../store/GlobalState'
import { deleteItem } from '../store/Actions'
import { deleteData } from '../utils/fetchData'
import { useRouter } from 'next/router'


const Modal = () => {
    const { state, dispatch } = useContext(DataContext)
    const { modal, auth } = state

    const router = useRouter()

    const deleteUser = (item) => {
        dispatch(deleteItem(item.data, item.id, item.type))

        deleteData(`user/${item.id}`, auth.token)
            .then(res => {
                if (res.err) return dispatch({ type: 'NOTIFY', payload: { error: res.err } })
                return dispatch({ type: 'NOTIFY', payload: { success: res.msg } })
            })
    }

    const deleteProduct = (item) => {
        dispatch({ type: 'NOTIFY', payload: { loading: true } })
        deleteData(`admin/trip/${item.id}`, auth.token)
            .then(res => {
                if (res.err) return dispatch({ type: 'NOTIFY', payload: { error: res.err } })
                dispatch({ type: 'NOTIFY', payload: { success: res.msg } })
                return router.push('/admin')
            })
    }

    const deleteBlog = (item) => {
        dispatch({ type: 'NOTIFY', payload: { loading: true } })
        deleteData(`admin/blog/${item.id}`, auth.token)
            .then(res => {
                if (res.err) return dispatch({ type: 'NOTIFY', payload: { error: res.err } })
                dispatch({ type: 'NOTIFY', payload: { success: res.msg } })
                return router.push('/admin/blog')
            })
    }

   

    const handleSubmit = () => {
        if (modal.length !== 0) {
            for (const item of modal) {
                if (item.type === 'ADD_CART') {
                    dispatch(deleteItem(item.data, item.id, item.type))
                }

                if (item.type === 'ADD_USERS') deleteUser(item)

                if (item.type === 'DELETE_TRIP') deleteProduct(item)

                if (item.type === 'DELETE_BLOG') deleteBlog(item)

                dispatch({ type: 'ADD_MODAL', payload: [] })
            }
        }
    }

    return (
        <>
            {
                modal.length >= 1 && (
                    <div className='absolute top-4 shadow-lg bg-white z-[110] border rounded-lg'>
                        <div className='p-4'>
                            <h5 className="font-semibold uppercase mb-3">
                                {modal[0].title}
                            </h5>
                            <p className="mb-4">
                                Quieres eliminar este Item ?
                            </p>
                            <div className="flex gap-4">
                                <button type="button" className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600" onClick={handleSubmit}>Yes</button>
                                <button type="button" className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600" onClick={() => dispatch({ type: 'ADD_MODAL', payload: [] })}>Cancel</button>
                            </div>
                        </div>
                    </div>
                )
            }

        </>
    )
}

export default Modal