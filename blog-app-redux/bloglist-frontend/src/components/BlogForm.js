import { useState, useRef } from 'react'
import { useDispatch } from 'react-redux'
import { createBlog } from '../reducers/blogReducer'
import Togglable from './Toggle'
import { handleNotification } from '../reducers/notificationReducer'
import { Form, Button } from 'react-bootstrap'

const BlogForm = () => {
    const dispatch = useDispatch()
    const [title, setTitle] = useState('')
    const [author, setAuthor] = useState('')
    const [url, setUrl] = useState('')

    const blogFormRef = useRef()

    const addBlog = (event) => {
        event.preventDefault()
        dispatch(createBlog({ title, author, url }))
            .then(() => {
                blogFormRef.current.toggleVisibility()
                dispatch(handleNotification(`${title} by ${author} added`))
                setTitle('')
                setAuthor('')
                setUrl('')
            })
            .catch((error) => {
                dispatch(handleNotification(error.response.data.error))
            })
    }

    return (
        <Togglable ref={blogFormRef}>
            <Form onSubmit={addBlog}>
                <Form.Group>
                    <Form.Label>title</Form.Label>
                    <Form.Control
                        type='text'
                        name='title'
                        value={title}
                        onChange={({ target }) => setTitle(target.value)}
                    />
                    <Form.Label>author</Form.Label>
                    <Form.Control
                        type='text'
                        name='author'
                        value={author}
                        onChange={({ target }) => setAuthor(target.value)}
                    />
                    <Form.Label>url</Form.Label>
                    <Form.Control
                        type='text'
                        name='url'
                        value={url}
                        onChange={({ target }) => setUrl(target.value)}
                    />
                </Form.Group>
                <Button variant='primary' type='submit'>
                    create
                </Button>
            </Form>
        </Togglable>
    )
}

export default BlogForm
