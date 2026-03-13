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
    const response = await axiosInstance.patch(`/admin/users/${id}/block`)
    return response.data
  },

  unblockUser: async (id) => {
    const response = await axiosInstance.patch(`/admin/users/${id}/unblock`)
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

  // ── College Management ──

  getColleges: async (params = {}) => {
    const response = await axiosInstance.get('/colleges', { params })
    return response.data
  },

  getCollegeById: async (id) => {
    const response = await axiosInstance.get(`/colleges/${id}`)
    return response.data
  },

  createCollege: async (data) => {
    const response = await axiosInstance.post('/colleges', data)
    return response.data
  },

  updateCollege: async (id, data) => {
    const response = await axiosInstance.put(`/colleges/${id}`, data)
    return response.data
  },

  deleteCollege: async (id) => {
    const response = await axiosInstance.delete(`/colleges/${id}`)
    return response.data
  },
}
