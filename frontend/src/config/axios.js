import axios from 'axios'

const axiosInstance = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json'
  }
})

axiosInstance.interceptors.request.use(
  (config) => {
    // Determine if request is admin-related (you may adjust this logic as needed)
    const isAdminRoute = config.url.startsWith('/admin')
    const adminToken = localStorage.getItem('adminToken')
    const studentToken = localStorage.getItem('studentToken')

    // Choose token contextually. Admin token takes precedence for admin routes
    if (isAdminRoute && adminToken) {
      config.headers.Authorization = `Bearer ${adminToken}`
    } else if (studentToken) {
      config.headers.Authorization = `Bearer ${studentToken}`
    } else if (adminToken) {
      config.headers.Authorization = `Bearer ${adminToken}`
    }

    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Determine context and redirect properly
      if (window.location.pathname.startsWith('/admin')) {
        localStorage.removeItem('adminToken')
        window.location.href = '/login'
      } else {
        localStorage.removeItem('studentToken')
        window.location.href = '/student/login'
      }
    }
    return Promise.reject(error)
  }
)

export default axiosInstance

