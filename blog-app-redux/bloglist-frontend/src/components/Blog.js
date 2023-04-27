import { useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { handleDeleteBlog } from '../reducers/blogReducer'
import { updateLikes } from '../reducers/blogReducer'
import { updateComments } from '../reducers/blogReducer'
import { useState } from 'react'
import { Button, ListGroup, Form } from 'react-bootstrap'
import { handleNotification } from '../reducers/notificationReducer'

const Blog = () => {
    const dispatch = useDispatch()
    const blogId = useParams().id
    const blog = useSelector((state) =>
        state.blogs.find((blog) => blog.id === blogId)
    )
    const user = useSelector((state) => state.user)
    const [comment, setComment] = useState('')

    if (!blog) return null

    const handleComment = async (event) => {
        event.preventDefault()
        if (!comment) {
            return dispatch(handleNotification('comment can not be empty'))
        }
        try {
            dispatch(updateComments(blog, comment))
            setComment('')
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div>
            <h2>
                {blog.title} {blog.author}
            </h2>
            <a href={blog.url}>{blog.url}</a>
            <p>
                {blog.likes}{' '}
                <Button onClick={() => dispatch(updateLikes(blog))}>
                    like
                </Button>
            </p>
            <h5>added by {blog.user.username}</h5>
            {user.username === blog.user.username && (
                <Button
                    variant='danger'
                    onClick={() => dispatch(handleDeleteBlog(blog))}
                >
                    remove
                </Button>
            )}
            <div className='comments'>
                <h2>comments</h2>
                <Form onSubmit={handleComment}>
                    <Form.Group>
                        <Form.Control
                            type='text'
                            placeholder='comment...'
                            name='comment'
                            value={comment}
                            onChange={({ target }) => setComment(target.value)}
                        />
                        <Button variant='primary' type='submit'>
                            add comment
                        </Button>
                    </Form.Group>
                </Form>
                <ListGroup>
                    {blog.comments.map((comment, index) => (
                        <ListGroup.Item key={index}>{comment}</ListGroup.Item>
                    ))}
                </ListGroup>
            </div>
        </div>
    )
}

export default Blog
