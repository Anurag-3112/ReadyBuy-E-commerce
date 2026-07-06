import api from './api'

export const getProducts = async () => {
    const res = await api.get('/products')
    return res.data.data
}

export const getProduct = async (slug) => {
    const res = await api.get(`/products/${slug}`)
    return res.data.data
}