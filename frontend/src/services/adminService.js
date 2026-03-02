import axiosInstance from '../config/axios'

export const adminService = {
  login: async (email, password) => {
    const response = await axiosInstance.post('/admin/login', { email, password })
    return response.data
  },

  getDashboardStats: async () => {
    const response = await axiosInstance.get('/admin/dashboard')
    return response.data
  },

  getUsers: async (params = {}) => {
    const response = await axiosInstance.get('/admin/users', { params })
    return response.data
  },

  blockUser: async (id) => {
    const response = await axiosInstance.put(`/admin/users/${id}/block`)
    return response.data
  },

  unblockUser: async (id) => {
    const response = await axiosInstance.put(`/admin/users/${id}/unblock`)
    return response.data
  },

  resetPassword: async (id) => {
    const response = await axiosInstance.put(`/admin/users/${id}/reset-password`)
    return response.data
  },

  deleteUser: async (id) => {
    const response = await axiosInstance.delete(`/admin/users/${id}`)
    return response.data
  },
}
