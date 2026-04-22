import axios from 'axios'

const studentApi = axios.create({
  baseURL: 'http://localhost:5000/api',
  timeout: 12000,
})

studentApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('studentToken')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

studentApi.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('studentToken')
      localStorage.removeItem('studentData')
      window.location.href = '/signin'
    }
    return Promise.reject(err)
  }
)

export default studentApi
