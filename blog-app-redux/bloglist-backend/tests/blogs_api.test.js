const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')

let token = ""

beforeEach(async () => {
    await Blog.deleteMany({})

    const blogObjects = helper.initialBlogs.map(blog => new Blog(blog))
    const promiseArray = blogObjects.map(blog => blog.save())
    await Promise.all(promiseArray)

    const response = await api
        .post('/api/login')
        .send({username: 'user X', password: 'topsecret'})

        token = response.body.token
})

describe('get all blogs', () => {
    test('blogs are returned as json', async () => {
        await api
            .get('/api/blogs')
            .expect(200)
            .expect('Content-Type', /application\/json/)
    })
    
    test('right amount of blogs are returned', async () => {
        const response = await api.get('/api/blogs')
        expect(response.body).toHaveLength(helper.initialBlogs.length)
    })
    
    test('_id property is correctly "id"', async () => {
        const response = await api.get('/api/blogs')
        response.body.forEach(blog => expect(blog.id).toBeDefined())
    })
})

describe('posting new blogs', () => {
    test('succesully creates new blog and adds it to the database', async () => {
        const newBlog = {
            title: "First class tests",
            author: "Robert C. Martin",
            url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
            likes: 10,
        }
    
        await api
            .post('/api/blogs')
            .send(newBlog)
            .set({'Authorization': `Bearer ${token}`})
            .expect(201)
            .expect('Content-Type', /application\/json/)
    
        const blogsAtEnd = await helper.blogsInDb()
        expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)
    })

    test('returns 401 if is no token is provided', async () => {
        const newBlog = {
            title: "First class tests",
            author: "Robert C. Martin",
            url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
            likes: 10,
        }
    
        await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(401)
    
        const blogsAtEnd = await helper.blogsInDb()
        expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
    })
    
    test('if likes property is missing it is defaulted to 0 value', async () => {
        const newBlog = {
            title: "First class tests",
            author: "Robert C. Martin",
            url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll"
        }
    
        await api
            .post('/api/blogs')
            .send(newBlog)
            .set({'Authorization': `Bearer ${token}`})
            .expect(201)
            .expect('Content-Type', /application\/json/)
    
        const blogsAtEnd = await helper.blogsInDb()
        expect(blogsAtEnd[2].likes).toBe(0)
    })
    
    describe('if title or url is missing give 400 error', () => {
        test('title missing', async () => {
            const newBlog = {
                author: "Robert C. Martin",
                url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
                likes: 10,
            }
    
            await api
                .post('/api/blogs')
                .send(newBlog)
                .set({'Authorization': `Bearer ${token}`})
                expect(400)
          
            const blogsAtEnd = await helper.blogsInDb()
            expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)   
        })
    
        test('url missing', async () => {
            const newBlog = {
                title: "First class tests",
                author: "Robert C. Martin",
                likes: 10
            }
    
            await api
                .post('/api/blogs')
                .send(newBlog)
                .set({'Authorization': `Bearer ${token}`})
                .expect(400)
          
            const blogsAtEnd = await helper.blogsInDb()
                expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)   
        })
    })
})

describe('Deletion of a blog', () => {
    test('succeeds with status code 204 if id is valid', async () => {
        const blogsAtStart = await helper.blogsInDb()
        const blogToDelete = blogsAtStart[0]

        await api
            .delete(`/api/blogs/${blogToDelete.id}`)
            .set({'Authorization': `Bearer ${token}`})
            .expect(204)

        const blogsAtEnd = await helper.blogsInDb()

        expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length - 1)

        const blogIds = blogsAtEnd.map(blog => blog.id)
        expect(blogIds).not.toContain(blogToDelete.id)
    })
    test('returns 400 if invalid id', async () => {
        const invalidId = "5a3d5da59070081a82a3445"
        await api
            .delete(`/api/blogs/${invalidId}`)
            .expect(400)

        const blogsAtEnd = await helper.blogsInDb()
        expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)    
    })

    test('return 404 if blog does not exist', async () => {
        const validNonExistingId = await helper.nonExistingId()
        
        await api
            .delete(`/api/blogs/${validNonExistingId}`)
            .expect(404)

        const blogsAtEnd = await helper.blogsInDb()
        expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)    
    })
})

describe('Updating existing blog', () => {
    test('return 200 and updated version of a blog as json if blog is found', async () => {
        const blogsAtStart = await helper.blogsInDb()
        const blogToUpdate = blogsAtStart[0]
        const updatedBlog = {...blogToUpdate, likes: 500}

        await api
            .put(`/api/blogs/${blogToUpdate.id}`)
            .send(updatedBlog)
            .expect(200)
            .expect('Content-Type', /application\/json/)
            
        const blogsAtEnd = await helper.blogsInDb()
        expect(blogsAtEnd[0]).toEqual(updatedBlog)        
        expect(blogsAtEnd[0]).not.toEqual(blogToUpdate)        

    })
    test('returns 400 if invalid id', async () => {
        const invalidId = "5a3d5da59070081a82a3445"
        await api
            .delete(`/api/blogs/${invalidId}`)
            .expect(400)

        const blogsAtEnd = await helper.blogsInDb()
        expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)    
    })

    test('return 404 if blog does not exist', async () => {
        const validNonExistingId = await helper.nonExistingId()
        
        await api
            .delete(`/api/blogs/${validNonExistingId}`)
            .expect(404)

        const blogsAtEnd = await helper.blogsInDb()
        expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)    
    })
})

afterAll(() => {
    mongoose.connection.close()
})