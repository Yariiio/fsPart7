import { useSelector } from 'react-redux'
import { Alert } from 'react-bootstrap'

const Notification = () => {
    const notification = useSelector((state) => state.notification)

    if (notification === null) {
        return null
    }
    return (
        <div className='container'>
            <Alert variant='primary'>{notification}</Alert>
        </div>
    )
}

export default Notification
