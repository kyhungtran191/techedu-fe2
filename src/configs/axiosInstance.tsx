import axios from 'axios'
import { jwtDecode } from 'jwt-decode'
import { clearLS, getAccessTokenFromLS, getRefreshToken, saveAccessTokenToLS, saveRefreshTokenToLS } from '@/utils/auth'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import { useAppContext } from '@/hooks/useAppContext'
import { useQueryClient } from '@tanstack/react-query'
import { URL } from '@/apis/index'
import { AUTH_API } from '@/apis/auth.api'

const instanceAxios = axios.create({
  baseURL: URL
})

let isRefreshing = false
let refreshQueue: any[] = []

const AxiosInterceptor = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate()
  const { setProfile, setIsAuthenticated, setPermissions } = useAppContext()
  const queryClient = useQueryClient()

  instanceAxios.interceptors.request.use(async function (config) {
    const accessToken = getAccessTokenFromLS()
    console.log(accessToken)
    const { refreshToken, refreshTokenExpiryTime } = getRefreshToken()
    if (accessToken) {
      const decoded = jwtDecode(accessToken)
      if ((decoded.exp as number) > Date.now() / 1000) {
        config.headers.authorization = ` Bearer ${accessToken}`
        return config
      } else {
        if (refreshToken && refreshTokenExpiryTime > Date.now() / 1000) {
          if (!isRefreshing) {
            isRefreshing = true
            await axios
              .post(
                AUTH_API.REFRESH_TOKEN,
                { AccessToken: accessToken, RefreshToken: refreshToken },
                {
                  headers: {
                    Authorization: 'Bearer ' + accessToken
                  }
                }
              )
              .then((res) => {
                if (res && res?.data?.value) {
                  const responseData = res?.data?.value
                  if (responseData) {
                    const {
                      accessToken: newAccessToken,
                      refreshToken: newRefreshToken,
                      refreshTokenExpiryTime
                    } = responseData

                    console.log('new Access token', newAccessToken)
                    console.log('new Refresh token', newRefreshToken)

                    if (newRefreshToken && refreshTokenExpiryTime) {
                      const newRefreshTokenExpiryTime = Math.floor(
                        new Date(refreshTokenExpiryTime as string).getTime() / 1000
                      )
                      saveRefreshTokenToLS(newRefreshToken, newRefreshTokenExpiryTime)
                    }

                    if (newAccessToken) {
                      config.headers.authorization = `Bearer ${newAccessToken}`
                      saveAccessTokenToLS(newAccessToken)
                      refreshQueue.forEach((cb) => cb(newAccessToken))
                      refreshQueue = []
                      isRefreshing = false // Check false
                    } else {
                      toast.error('Dont have access token and refresh token')
                    }
                  }
                }
                return config
              })
              .catch((error) => {
                console.log('error when refresh token', error)
                console.log('accessToken when call new refresh token', accessToken)
                console.log('refreshToken when call new refresh token', refreshToken)
                toast.error('Refresh Token Timeout!')
                clearLS()
                setProfile(undefined)
                setIsAuthenticated(false)
                setPermissions(undefined)
                queryClient.clear()
                return navigate('/login')
              })
          } else {
            return new Promise<any>((resolve) => {
              refreshQueue.push((newAccessToken: string) => {
                if (config && config.headers) {
                  config.headers.authorization = `Bearer ${newAccessToken}`
                  return resolve(config)
                }
              })
            })
          }
        } else {
          console.log('Expiry Token Time out')
          clearLS()
          setProfile(undefined)
          setIsAuthenticated(false)
          setPermissions(undefined)
          queryClient.clear()
          return navigate('/login')
        }
      }
    }
    return config
  })
  instanceAxios.interceptors.response.use(
    (response) => {
      return response
    },
    (error) => {
      if (error.response.status === 403 || error.response.status === 401) {
        toast.error(error.response.status === 401 ? 'Unauthorize ! Please Login again' : 'Your account has been banned')
        clearLS()
        setProfile(undefined)
        setIsAuthenticated(false)
        setPermissions(undefined)
        queryClient.clear()
        return navigate('/login')
      } else if (error.response.status === 405) {
        // do something for all 500 errors
      } else {
        // do something for all other error codes
      }
    }
  )
  return <>{children}</>
}

// eslint-disable-next-line react-refresh/only-export-components
export default instanceAxios
export { AxiosInterceptor }
