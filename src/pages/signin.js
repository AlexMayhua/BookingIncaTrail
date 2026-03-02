import { useState, useContext, useEffect } from 'react'
import { DataContext } from '../store/GlobalState'
import { postData } from '../utils/fetchData'
import Cookie from 'js-cookie'
import { useRouter } from 'next/router'

const Signin = () => {
  const initialState = { email: '', password: '' }
  const [userData, setUserData] = useState(initialState)
  const { email, password } = userData
  const [showPassword, setShowPassword] = useState(false);

  const { state, dispatch } = useContext(DataContext)
  const { auth } = state

  const router = useRouter()

  const handleChangeInput = e => {
    const { name, value } = e.target
    setUserData({ ...userData, [name]: value })
    dispatch({ type: 'NOTIFY', payload: {} })
  }
  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async e => {
    e.preventDefault()
    dispatch({ type: 'NOTIFY', payload: { loading: true } })
    const res = await postData('auth/login', userData, '')

    if (res.err) return dispatch({ type: 'NOTIFY', payload: { error: res.err } })
    dispatch({ type: 'NOTIFY', payload: { success: res.msg } })

    dispatch({
      type: 'AUTH', payload: {
        token: res.access_token,
        user: res.user
      }
    })

    Cookie.set('refreshtoken', res.refresh_token, {
      path: 'api/auth/accessToken',
      expires: 7
    })

    localStorage.setItem('firstLogin', true)
  }

  useEffect(() => {
    if (Object.keys(auth).length !== 0) router.push("/admin")
  }, [auth])

  return (
    <div className="py-16">
      <div className="max-w-lg mx-auto shadow px-6 py-7 rounded overflow-hidden bg-white">
        <h2 className="text-2xl uppercase font-medium mb-1 text-center">Booking Inca Trail</h2>
        <p className="text-gray-600 mb-6 text-sm text-center">Welcome! So good to have you back!</p>
        <form className="space-y-6" autoComplete="off" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label htmlFor="email" className="text-gray-600 mb-2 block">Email address</label>
            <input
              type="email"
              name="email"
              id="email"
              className="block w-full border border-gray-300 px-4 py-3 text-gray-600 text-sm rounded focus:ring-0 focus:border-primary placeholder-gray-400"
              placeholder="youremail.@domain.com"
              value={email}
              onChange={handleChangeInput}
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="password" className="text-gray-600 mb-2 block">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                id="password"
                className="block w-full border border-gray-300 px-4 py-3 text-gray-600 text-sm rounded focus:ring-0 focus:border-primary placeholder-gray-400"
                placeholder="***********"
                value={password}
                onChange={handleChangeInput}
              />
              <div
                className="cursor-pointer absolute inset-y-0 right-0 flex items-center px-8 text-gray-600 border-l border-gray-300"
                onClick={toggleShowPassword}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  {showPassword ? (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  ) : (
                    <>
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </>
                  )}
                </svg>
              </div>
            </div>
          </div>
          <button
            type="submit"
            className="block w-full py-2 text-center text-white bg-primary rounded hover:bg-secondary transition uppercase">
            Login
          </button>
          {
            /*          
              <p className="mt-12">
                ¿No tienes una cuenta? <Link href="/register"><a className='text-primary font-bold'>Registrarse</a></Link>
              </p>
            */
          }
        </form>

        <div className="flex gap-2 pt-5">
          <p className="text-gray-600 text-sm">Don't have an account?</p>
          <a className="text-gray-600 text-sm underline" href="#">Register here</a>
        </div>
      </div>
      <div className="max-w-lg mx-auto">
        <a href="/">
          <button className="transition duration-200 mx-5 px-5 py-4 cursor-pointer font-normal text-sm rounded-lg text-gray-500 hover:text-primary focus:outline-none  focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50 ring-inset">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-4 h-4 inline-block align-text-top">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span className="inline-block ml-1">Back to {process.env.NEXT_PUBLIC_SITE_URL ? new URL(process.env.NEXT_PUBLIC_SITE_URL).hostname : 'home'}</span>
          </button>
        </a>
      </div>
    </div>
  )
}

export default Signin