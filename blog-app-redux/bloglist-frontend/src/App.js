import { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import Navigation from './components/Navigation'
import Blog from './components/Blog'
import Notification from './components/Notification'
import LoginForm from './components/LoginForm'
import Users from './components/Users'
import User from './components/User'
import Home from './components/Home'
import { initializeBlogs } from './reducers/blogReducer'
import { checkLoggedUser } from './reducers/loginReducer'

const App = () => {
    const dispatch = useDispatch()
    const user = useSelector((state) => state.user)

    useEffect(() => {
        dispatch(initializeBlogs())
    }, [dispatch])

    useEffect(() => {
        dispatch(checkLoggedUser())
    }, [dispatch])

    if (!user) {
        return <LoginForm />
    }

    return (
        <div className='container'>
            <Router>
                <div>
                    <Navigation />
                    <Notification />
                </div>

                <Routes>
                    <Route path='/' element={<Home />} />
                    <Route path='/users' element={<Users />} />
                    <Route path='/users/:id' element={<User />} />
                    <Route path='/blogs/:id' element={<Blog />} />
                </Routes>
            </Router>
        </div>
    )
}

export default App
