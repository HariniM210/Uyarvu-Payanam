import axiosInstance from '../config/axios'

export const examService = {
  // Create new exam
  createExam: async (examData) => {
    const response = await axiosInstance.post('/exams', examData)
    return response.data
  },

  // Get all exams
  getAllExams: async () => {
    const response = await axiosInstance.get('/exams')
    return response.data
  },

  // Get single exam by ID
  getExamById: async (id) => {
    const response = await axiosInstance.get(`/exams/${id}`)
    return response.data
  },

  // Update exam
  updateExam: async (id, examData) => {
    const response = await axiosInstance.put(`/exams/${id}`, examData)
    return response.data
  },

  // Delete exam
  deleteExam: async (id) => {
    const response = await axiosInstance.delete(`/exams/${id}`)
    return response.data
  }
}
