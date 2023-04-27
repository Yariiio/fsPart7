const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

blogsRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({}).populate('user', {
        username: 1,
        name: 1,
        id: 1,
    })
    response.status(200).json(blogs)
})

blogsRouter.post('/', async (request, response) => {
    const body = request.body
    const decodedToken = jwt.verify(request.token, process.env.SECRET)

    if (!decodedToken.id) {
        response.status(401).json({ error: 'token missing or invalid' })
    }

    const user = await User.findById(decodedToken.id)

    const newBlog = new Blog({
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes,
        user: user._id,
        comments: [],
    })

    const savedBlog = await newBlog.save()
    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()

    response.status(201).json(savedBlog)
})

blogsRouter.get('/:id', async (request, response) => {
    const blog = await Blog.findById(request.params.id).populate('user', {
        username: 1,
        name: 1,
        id: 1,
    })
    response.status(200).json(blog)
})

blogsRouter.delete('/:id', async (request, response) => {
    const decodedToken = jwt.verify(request.token, process.env.SECRET)
    const blogToDelete = await Blog.findById(request.params.id)

    if (blogToDelete) {
        if (
            decodedToken &&
            decodedToken.id.toString() === blogToDelete.user._id.toString()
        ) {
            await Blog.findByIdAndRemove(blogToDelete.id)
            response.status(204).end()
        } else response.status(401).json({ error: 'invalid token' })
    } else {
        response.status(404).end()
    }
})

blogsRouter.put('/:id', async (request, response) => {
    const body = request.body

    const blogToUpdate = await Blog.findById(request.params.id)

    if (blogToUpdate) {
        const updatedBlog = {
            user: blogToUpdate.user._id.toString(),
            title: body.title,
            author: body.author,
            url: body.url,
            likes: body.likes,
            comments: body.comments,
        }

        await Blog.findByIdAndUpdate(request.params.id, updatedBlog, {
            new: true,
        })
        response.status(200).json(updatedBlog)
    } else {
        response.status(404).end()
    }
})

module.exports = blogsRouter
