
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { getLoginStatus } from '../services/authService'
import { SET_LOGIN } from '../redux/features/auth/authSlice'
import { toast } from 'react-toastify'


const useRedirectLoggedOutUser = (path) => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    useEffect(() => {

        const redirectLoggedOutUser = async () => {
            const isLoggedIn = await getLoginStatus()
            dispatch(SET_LOGIN(isLoggedIn))

            if (!isLoggedIn) {
                toast.info("Session Expired, Please login to continue.")
                navigate(path)
                return
            }


        }
        redirectLoggedOutUser()

    }, [navigate, path, dispatch])

}

export default useRedirectLoggedOutUser