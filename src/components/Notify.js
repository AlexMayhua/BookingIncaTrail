import {useContext} from 'react'
import {DataContext} from '../store/GlobalState'
import Toast from './Toast'

const Notify = () => {
    const {state, dispatch} = useContext(DataContext)
    const { notify } = state

    return(
        <> 
            {notify.loading && <div></div>}
            {notify.error && 
                <Toast
                    msg={{ msg: notify.error, title: "Sorry, please fix this first!" }}
                    handleShow={() => dispatch({ type: 'NOTIFY', payload: {} })}
                    bgColor="bg-warning"
                    txtColor="text-dark"
                />
            }

            {notify.success && 
                <Toast
                msg={{ msg: notify.success, title: "Bien hecho" }}
                handleShow={() => dispatch({ type: 'NOTIFY', payload: {} })}
                bgColor="bg-sky-500"
                txtColor="text-white"
                
                />
            }
        </>
    )
}


export default Notify
