import express from 'express'
import {
    getAllBlogCat,
    getBlogCatById,
    createBlogCat,
    deleteBlogCatById,
    updateBlogCat,
} from './blog-category.service.js'
import { z } from 'zod'
const router = express.Router()

router.get('/', async (req, res) => {
   
    try {
        let { page = 1, limit = 10, status, search, orderBy, createdAt } = req.query

        page = Math.max(parseInt(page) || 1, 1)
        limit = Math.max(parseInt(limit) || 10, 1)

        let orderByParams = []
        if (orderBy) {
            orderByParams = String(orderBy)
                .split(',')
                .map((order) => {
                    const [field, dir] = order.split(':')
                    return { [field]: dir === 'desc' ? 'desc' : 'asc' }
                })
        }

        const filters = { page, limit, status, search, orderBy: orderByParams, createdAt }
        const data = await getAllBlogCat(filters)

        res.status(200).json(data)
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
})

router.get('/:id', async (req, res) => {
    try {
        const id = req.params.id
        const { status } = req.query
        const filters = { status }
        const data = await getBlogCatById(id, filters)
        res.status(200).json(data)
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
})

router.post('/', async (req, res) => {
 
    try {
        const { name, status } = req.body
        if (!name || !status) {
            throw new Error('Data is required')
        }
        
        await createBlogCat(req.body)
        
        res.status(200).json({ message: 'Blog Category created successfully' })
    } catch (error) {
        if (error instanceof z.ZodError) {
            res.status(400).json({
                error: `${error.errors[0].message} - at column ${error.errors[0].path[0]}`,
            })
        } else {
            res.status(400).json({ error: error.message })
        }
    }
})

//Hapus data
router.delete('/:id', async (req, res) => {
    try {
        const id = req.params.id
        await deleteBlogCatById(id)
        res.status(200).json({ message: 'Deleted Blog Category successfully' })
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
})

//Ubah data - semua kolom harus terisi
router.put('/:id', async (req, res) => {
    try {
        const id = req.params.id
        const { name, status } = req.body
        if (!name || !status) {
            throw new Error('Data tidak lengkap')
        }
        await updateBlogCat(id, req.body)
        res.status(200).json({ message: 'Berhasil Mengubah Blog Category' })
    } catch (error) {
        if (error instanceof z.ZodError) {
            res.status(400).json({
                error: `${error.errors[0].message} - pada kolom ${error.errors[0].path[0]}`,
            })
        } else {
            res.status(400).json({ error: error.message })
        }
    }
})

//Ubah data - hanya kolom yang diisi
router.patch('/:id', async (req, res) => {
    try {
        const id = req.params.id
        if (!req.body || Object.keys(req.body).length === 0) {
            throw new Error('Nothing to update')
        }
        await updateBlogCat(id, req.body)
        res.status(200).json({ message: 'Blog Category Updated Successfully' })
    } catch (error) {
        if (error instanceof z.ZodError) {
            res.status(400).json({
                error: `${error.errors[0].message} - pada kolom ${error.errors[0].path[0]}`,
            })
        } else {
            res.status(400).json({ error: error.message })
        }
    }
})

export default router
