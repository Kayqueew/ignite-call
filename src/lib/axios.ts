import axios from 'axios'

export const api = axios.create({
  baseURL: '/api', // tem só api pq como é um API router ele ja vai reconhecer a url, entao só api já basta
})
