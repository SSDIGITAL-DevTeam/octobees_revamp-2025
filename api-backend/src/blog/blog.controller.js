import express from 'express'
import {
    createBlog,
    deleteBlogById,
    getAllBlogs,
    getBlogById,
    updateQueue,
} from './blog.service.js'
import { parseBlogQuery } from '../../utils/parseBlogQuery.js'

const router = express.Router()

router.get('/', async (req, res) => {
    try {
        const filters = parseBlogQuery(req.query)
        const data = await getAllBlogs(filters)
        res.status(200).json(data)
    } catch (error) {
        console.error('GET / error:', error)
        res.status(400).json({ error: error.message })
    }
})

router.get('/:id', async (req, res) => {
    try {
        const id = req.params.id
        const data = await getBlogById(id)
        res.status(200).json(data)
    } catch (error) {
        console.error('GET /:id error:', error)
        res.status(400).json({ error: error.message })
    }
})

router.post('/', async (req, res) => {
 
    try {
        const { title, content, status, favorite, categoryId, userId } =
            req.body
           
        if (!req.file || !req.file.filename) {
            return res.status(400).json({ error: 'Image is required' })
        }
       
        
        if (
            !title?.trim() ||
            !content?.trim() ||
            !status?.trim() ||
            categoryId === undefined ||
            userId === undefined ||
            favorite === undefined
        ) {
            return res.status(400).json({ error: 'All fields are required' })
        }
        // return res.status(201).json({ message: userId })

        const blogData = {
            title: title.trim(),
            content: content.trim(),
            status: status.trim(),
            favorite: favorite === 'true',
            categoryId,
            userId,
            image: req.file.filename,
        }

        await createBlog(blogData)

        res.status(201).json({ message: 'Blog created successfully' })
    } catch (error) {
        console.error('POST / error:', error)
        res.status(400).json({ error: error.message })
    }
})

router.delete('/:id', async (req, res) => {
    try {
        const id = req.params.id
        await deleteBlogById(id)

        res.status(200).json({ message: 'Delete Blog Successfully' })
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
})

//Ubah data - semua kolom harus terisi
router.put('/:id', async (req, res) => {
    try {
        const id = req.params.id
        const { title, content, status, favorite, categoryId } = req.body

        // Validasi manual basic
        if (
            !title ||
            !content ||
            !status ||
            favorite === undefined ||
            !categoryId
        ) {
            throw new Error('Semua field wajib diisi')
        }

        const isFavorite = favorite === 'true'
        await updateQueue(id, { ...payload, favorite: isFavorite })
        res.status(200).json({ message: 'Berhasil Mengubah Blog' })
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
})

//Ubah data - hanya kolom yang diisi
router.patch('/:id', async (req, res) => {
    try {
        const id = req.params.id

        if (!req.body || Object.keys(req.body).length === 0) {
            throw new Error('Nothing to update')
        }

        // console.log(req.body)
        const payload = { ...req.body }

        if (req.file) {
            payload.image = req.file.filename
        } else {
            delete payload.image
        }
        await updateQueue(id, payload)

        res.status(200).json({ message: 'Blog edited successfully' })
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
})

export default router
