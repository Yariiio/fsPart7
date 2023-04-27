import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { loginUser } from '../reducers/loginReducer'

import Notification from './Notification'
import { Form, Button } from 'react-bootstrap'

const LoginForm = () => {
    const dispatch = useDispatch()
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    const login = (event) => {
        event.preventDefault()
        dispatch(loginUser({ username, password }))
        setUsername('')
        setPassword('')
    }

    return (
        <div>
            <h2>Login to application</h2>
            <Notification />
            <Form onSubmit={login}>
                <Form.Group>
                    <Form.Label>
                        <strong>username:</strong>
                    </Form.Label>
                    <Form.Control
                        type='text'
                        name='username'
                        value={username}
                        onChange={({ target }) => setUsername(target.value)}
                    />
                    <Form.Label>
                        <strong>password:</strong>
                    </Form.Label>
                    <Form.Control
                        type='password'
                        name='password'
                        value={password}
                        onChange={({ target }) => setPassword(target.value)}
                    />
                    <Button variant='primary' type='submit'>
                        Log In
                    </Button>
                </Form.Group>
            </Form>
        </div>
    )
}

export default LoginForm
