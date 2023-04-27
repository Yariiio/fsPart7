const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)
const User = require('../models/user')
const bcrypt = require('bcrypt')

describe('when there is initially one user in database', () => {
    beforeEach(async () => {
        await User.deleteMany({})
    
        const passwordHash = await bcrypt.hash('salainen', 10)
    
        const user = new User({
            username: 'admin',
            name: 'Adam In',
            passwordHash
        })
    
        await user.save()
    })
    describe('post a new user', () => {
        test('creation of a new user is succesfull', async () => {
            const usersAtStart = await helper.usersInDb()

            const newUser = {
                username: 'testU',
                name: 'testUser',
                password: 'topsecret'
            }
    
            await api
                .post('/api/users')
                .send(newUser)
                .expect(201)
                .expect('Content-Type', /application\/json/)

            const usersAtEnd = await helper.usersInDb()
            expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)
            
            const usernames = usersAtEnd.map(user => user.username)
            expect(usernames).toContain(newUser.username)
        })

        test('if username already taken fails to create new user and responds with proper error message', async () => {
            const usersAtStart = await helper.usersInDb()

            const newUser = {
                username: usersAtStart[0].username,
                name: 'pablo',
                password: 'secretto'
            }
            const result = await api
                .post('/api/users')
                .send(newUser)
                .expect(409)
                .expect('Content-Type', /application\/json/)
                
            expect(result.body.error).toContain('username must be unique')  
            
            const usersAtEnd = await helper.usersInDb()
            expect(usersAtEnd).toEqual(usersAtStart)
        })    
        
        test('if username is less than 3 characters long respond with 400', async () => {
            const usersAtStart = await helper.usersInDb()

            const newUser = {
                username: 'Me',
                name: 'me',
                password: 'secretto'
            }

            await api
                .post('/api/users')
                .send(newUser)
                .expect(400)
                
            const usersAtEnd = await helper.usersInDb()
            expect(usersAtEnd).toEqual(usersAtStart)
        })    

        test('if password is less than 3 characters long respond with 400 and with a proper message', async () => {
            const usersAtStart = await helper.usersInDb()

            const newUser = {
                username: 'new_me',
                name: 'me',
                password: 'me'
            }

            const result = await api
                .post('/api/users')
                .send(newUser)
                .expect(400)
                .expect('Content-Type', /application\/json/)

            expect(result.body.error).toContain('password must be atleast 3 characters long')    
                
            const usersAtEnd = await helper.usersInDb()
            expect(usersAtEnd).toEqual(usersAtStart)
        })

        test('if password is not given respond with 400 and with a proper message', async () => {
            const usersAtStart = await helper.usersInDb()

            const newUser = {
                username: 'new_me',
                name: 'me',
            }

            const result = await api
                .post('/api/users')
                .send(newUser)
                .expect(400)
                .expect('Content-Type', /application\/json/)

            expect(result.body.error).toContain('password required')    
                
            const usersAtEnd = await helper.usersInDb()
            expect(usersAtEnd).toEqual(usersAtStart)
        })    
    })
})

afterAll(() => {
    mongoose.connection.close()
})