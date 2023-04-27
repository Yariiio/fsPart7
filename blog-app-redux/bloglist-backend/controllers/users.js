const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')
const Blog = require('../models/blog')

usersRouter.get('/', async (request, response) => {
    const users = await User.find({}).populate('blogs', {title: 1, author: 1, url: 1, id: 1})
    response.status(200).json(users)
})

usersRouter.post('/', async (request, response) => {
    const {username, name, password} = request.body
    const existingUser = await User.findOne({username})

    if(existingUser) response.status(409).json({error: 'username must be unique'})
    if(!password) response.status(400).json({error: 'password required'})
    else if(password.length < 3) response.status(400).json({error: 'password must be atleast 3 characters long'})

    else {
        const saltRounds = 10
        const passwordHash = await bcrypt.hash(password, saltRounds)

        const newUser = new User({
            username,
            name,
            passwordHash
        })
    
        const savedUser = await newUser.save()
        response.status(201).json(savedUser)
    }
})

module.exports = usersRouter