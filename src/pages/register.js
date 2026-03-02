import Head from 'next/head'
import Link from 'next/link'
import { useState, useContext, useEffect } from 'react'
import valid from '../utils/valid'
import { DataContext } from '../store/GlobalState'
import { postData } from '../utils/fetchData'
import { useRouter } from 'next/router'


const Register = () => {
  const initialState = { name: '', email: '', password: '', cf_password: '' }
  const [userData, setUserData] = useState(initialState)
  const { name, email, password, cf_password } = userData

  const { state, dispatch } = useContext(DataContext)
  const { auth } = state

  const router = useRouter()

  const handleChangeInput = e => {
    const { name, value } = e.target
    setUserData({ ...userData, [name]: value })
    dispatch({ type: 'NOTIFY', payload: {} })
  }

  const handleSubmit = async e => {
    e.preventDefault()
    const errMsg = valid(name, email, password, cf_password)
    if (errMsg) return dispatch({ type: 'NOTIFY', payload: { error: errMsg } })

    dispatch({ type: 'NOTIFY', payload: { loading: true } })

    const res = await postData('auth/register', userData)

    if (res.err) return dispatch({ type: 'NOTIFY', payload: { error: res.err } })

    return dispatch({ type: 'NOTIFY', payload: { success: res.msg } })
  }

  useEffect(() => {
    if (Object.keys(auth).length !== 0) router.push("/")
  }, [auth])

  return (
    <div>
      <Head>
        <title>Register Page</title>
      </Head>
      <form className="mx-auto my-4" style={{ maxWidth: '500px' }} onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Nombre</label>
          <input
            type="text"
            className="block appearance-none w-full border border-gray-300 py-3 px-4 pr-8 text-sm leading-tight focus:outline-none focus:bg-white focus:border-primary"
            id="name"
            name="name"
            value={name}
            onChange={handleChangeInput} />
        </div>

        <div className="form-group">
          <label htmlFor="exampleInputEmail1">Correo Electronico</label>
          <input
            type="email"
            className="block appearance-none w-full border border-gray-300 py-3 px-4 pr-8 text-sm leading-tight focus:outline-none focus:bg-white focus:border-primary"
            id="exampleInputEmail1"
            aria-describedby="emailHelp"
            name="email"
            value={email}
            onChange={handleChangeInput} />
        </div>

        <div className="form-group">
          <label htmlFor="exampleInputPassword1">Contraseña</label>
          <input
            type="password"
            className="block appearance-none w-full border border-gray-300 py-3 px-4 pr-8 text-sm leading-tight focus:outline-none focus:bg-white focus:border-primary"
            id="exampleInputPassword1"
            name="password"
            value={password}
            onChange={handleChangeInput} />
        </div>

        <div className="form-group">
          <label htmlFor="exampleInputPassword2">Confirmar Contraseña</label>
          <input
            type="password"
            className="block appearance-none w-full border border-gray-300 py-3 px-4 pr-8 text-sm leading-tight focus:outline-none focus:bg-white focus:border-primary"
            id="exampleInputPassword2"
            name="cf_password"
            value={cf_password}
            onChange={handleChangeInput} />
        </div>

        <button data-hover="Register" type="submit" className="bg-primary py-2 px-6 mt-4 text-white" >CREAR CUENTA</button>

        <p className="my-2">
          ¿Ya tienes una cuenta? <Link href="/signin" className='text-primary font-bold'>Iniciar sesion</Link>
        </p>
      </form>
    </div>
  );
}

export default Register