import axiosInstance from '../config/axios'

export const courseService = {
  // Create new course
  createCourse: async (courseData) => {
    const response = await axiosInstance.post('/courses', courseData)
    return response.data
  },

  // Get all courses
  getAllCourses: async () => {
    const response = await axiosInstance.get('/courses')
    return response.data
  },

  // Get single course by ID
  getCourseById: async (id) => {
    const response = await axiosInstance.get(`/courses/${id}`)
    return response.data
  },

  // Update course
  updateCourse: async (id, courseData) => {
    const response = await axiosInstance.put(`/courses/${id}`, courseData)
    return response.data
  },

  // Delete course
  deleteCourse: async (id) => {
    const response = await axiosInstance.delete(`/courses/${id}`)
    return response.data
  }
}
