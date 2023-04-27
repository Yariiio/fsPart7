import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import { initializeUsers } from '../reducers/userReducer'
import { Table } from 'react-bootstrap'

const Users = () => {
    const dispatch = useDispatch()
    const users = useSelector((state) => state.users)

    useEffect(() => {
        dispatch(initializeUsers())
    }, [dispatch])

    return (
        <div>
            <h2>Users</h2>
            <Table striped>
                <tbody>
                    <tr>
                        <th>&nbsp;</th>
                        <th>blogs created</th>
                    </tr>
                    {users.map((user, index) => (
                        <tr key={index}>
                            <td>
                                <Link to={`/users/${user.id}`}>
                                    {user.username}
                                </Link>
                            </td>
                            <td>{user.blogs.length}</td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </div>
    )
}

export default Users
