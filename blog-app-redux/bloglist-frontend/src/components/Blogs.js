import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { Table } from 'react-bootstrap'

const Blogs = () => {
    const blogs = useSelector((state) => state.blogs)

    return (
        <div>
            <Table striped>
                <tbody>
                    {blogs.map((blog, index) => (
                        <tr key={index}>
                            <td>
                                <Link to={`/blogs/${blog.id}`}>
                                    {blog.title}
                                </Link>
                            </td>
                            <td>{blog.author}</td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </div>
    )
}

export default Blogs
