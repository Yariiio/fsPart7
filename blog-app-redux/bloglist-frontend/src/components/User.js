import { useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { ListGroup } from 'react-bootstrap'

const User = () => {
    const id = useParams().id
    const user = useSelector((state) =>
        state.users.find((user) => user.id === id)
    )

    if (!user) return null

    return (
        <div>
            <h2>{user.username}</h2>
            <br />
            <h4>added blogs</h4>
            <ListGroup numbered>
                {user.blogs.map((blog, index) => (
                    <ListGroup.Item key={index}>{blog.title}</ListGroup.Item>
                ))}
            </ListGroup>
        </div>
    )
}

export default User
