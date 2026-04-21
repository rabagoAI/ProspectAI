import axios from 'axios'
import toast from 'react-hot-toast'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  timeout: 10000,
})

api.interceptors.response.use(
  (res) => res,
  (err) => {
    const msg = err.response?.data?.detail || err.message || 'Error inesperado'
    toast.error(msg)
    return Promise.reject(err)
  }
)

export default api

// ── Prospects ────────────────────────────────────────────────────────────────
export const getProspects = (params) => api.get('/prospects', { params })
export const getProspect = (id) => api.get(`/prospects/${id}`)
export const createProspect = (data) => api.post('/prospects', data)
export const updateProspect = (id, data) => api.put(`/prospects/${id}`, data)
export const deleteProspect = (id) => api.delete(`/prospects/${id}`)

// ── Emails ───────────────────────────────────────────────────────────────────
export const sendEmail = (id, tipo) => api.post(`/prospects/${id}/email`, { tipo })
export const getEmailHistory = (id) => api.get(`/prospects/${id}/emails`)

// ── Stats ────────────────────────────────────────────────────────────────────
export const getStats = () => api.get('/stats')
