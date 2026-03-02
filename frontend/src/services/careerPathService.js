import axiosInstance from '../config/axios'

export const careerPathService = {
  // Create new career path
  createCareerPath: async (careerPathData) => {
    const response = await axiosInstance.post('/career-paths', careerPathData)
    return response.data
  },

  // Get all career paths
  getAllCareerPaths: async () => {
    const response = await axiosInstance.get('/career-paths')
    return response.data
  },

  // Get single career path by ID
  getCareerPathById: async (id) => {
    const response = await axiosInstance.get(`/career-paths/${id}`)
    return response.data
  },

  // Update career path
  updateCareerPath: async (id, careerPathData) => {
    const response = await axiosInstance.put(`/career-paths/${id}`, careerPathData)
    return response.data
  },

  // Delete career path
  deleteCareerPath: async (id) => {
    const response = await axiosInstance.delete(`/career-paths/${id}`)
    return response.data
  }
}
