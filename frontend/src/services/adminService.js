import axiosInstance from '../config/axios'

export const adminService = {
  login: async (email, password) => {
    const response = await axiosInstance.post('/admin/login', { email, password })
    return response.data
  }
}
