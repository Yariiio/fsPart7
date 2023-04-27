import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'
import Blog from './Blog'
import BlogForm from './blogForm'
import userEvent from '@testing-library/user-event'


test('<Blog/> renders the "title" and "author" fields from blog component and not "url" and "likes" fields', () => {

    const testBlog = {
        title: 'test title',
        author: 'test author',
        url: 'test url',
        likes: 5
    }

    const { container } = render(<Blog blog={testBlog}/>)

    screen.debug()

    const titleAndAuthor = container.querySelector('.title-author')
    const fullDetails = container.querySelector('.full-details')
    expect(titleAndAuthor).toHaveTextContent('test title')
    expect(titleAndAuthor).toHaveTextContent('test author')
    expect(fullDetails).not.toHaveTextContent('test url')
    expect(fullDetails).not.toHaveTextContent(`likes ${5}`)
})

test('clicking the "view" button renders "url" and "likes" fields ', async () => {
    const testBlog = {
        title: 'test title',
        author: 'test author',
        url: 'test url',
        likes: 5,
        user:{ username: 'user A', name :'user a' }
    }

    const testUser = { username: testBlog.user.username }

    const mockHandler = jest.fn()

    const { container } = render(<Blog blog={testBlog} user={testUser} toggleDetails={mockHandler}/>)

    const user = userEvent.setup()
    const button = screen.getByText('view')
    await user.click(button)

    screen.debug()

    const fullDetails = container.querySelector('.full-details')


    expect(fullDetails).toHaveTextContent('test url')
    expect(fullDetails).toHaveTextContent(`likes ${5}`)
})

test('clicking the like button twice calls the event "addLike" two times', async () => {
    const testBlog = {
        title: 'test title',
        author: 'test author',
        url: 'test url',
        likes: 5,
        user:{ username: 'user A', name :'user a' }
    }

    const testUser = { username: testBlog.user.username }

    const mockHandler = jest.fn()

    render(<Blog blog={testBlog} user={testUser} toggleDetails={mockHandler} addLike={mockHandler}/>)

    const user = userEvent.setup()
    const viewButton = screen.getByText('view')
    await user.click(viewButton)

    const likeButton = screen.getByText('like')
    await user.click(likeButton)
    await user.click(likeButton)

    screen.debug()

    expect(mockHandler.mock.calls).toHaveLength(2)
})

test('blogform calls addNote event once with correct details', async () => {

    const createBlog = jest.fn()
    const user = userEvent.setup()

    render(<BlogForm createBlog={createBlog} />)

    const title = screen.getByPlaceholderText('title')
    const author = screen.getByPlaceholderText('author')
    const url = screen.getByPlaceholderText('url')

    const submitButton = screen.getByText('create')
    screen.debug(submitButton)

    await user.type(title, 'testing title...')
    await user.type(author, 'testing author...')
    await user.type(url, 'testing url...')
    await user.click(submitButton)

    console.log(createBlog.mock.calls[0][0])

    expect(createBlog.mock.calls).toHaveLength(1)
    expect(createBlog.mock.calls[0][0]).toStrictEqual({ title: 'testing title...', author: 'testing author...', url: 'testing url...' })

})
