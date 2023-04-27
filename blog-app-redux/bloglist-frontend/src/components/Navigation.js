import { Link } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { logoutUser } from '../reducers/loginReducer'
import { Navbar, Nav, Button } from 'react-bootstrap'

const Navigation = () => {
    const dispatch = useDispatch()
    const user = useSelector((state) => state.user.username)

    return (
        <Navbar collapseOnSelect expand='lg' bg='dark' variant='dark'>
            <Navbar.Toggle aria-controls='responsive-navbar-nav' />
            <Navbar.Collapse id='responsive-navbar-nav'>
                <Nav className='me-auto'>
                    <Nav.Link href='#' as='span'>
                        <Link to='/'>blogs</Link>
                    </Nav.Link>
                    <Nav.Link href='#' as='span'>
                        <Link to='/users'>users</Link>
                    </Nav.Link>
                    <Nav.Link href='#' as='span'>
                        {user ? (
                            <em>{user} logged in</em>
                        ) : (
                            <Link to='/login'>login</Link>
                        )}
                    </Nav.Link>
                </Nav>
            </Navbar.Collapse>
            <Button onClick={() => dispatch(logoutUser())}>logout</Button>
        </Navbar>
    )
}

export default Navigation
