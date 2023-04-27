import { useState, forwardRef, useImperativeHandle } from 'react'
import { Button } from 'react-bootstrap'

// eslint-disable-next-line react/display-name
const Togglable = forwardRef((props, refs) => {
    const [visible, setVisible] = useState(false)

    const showWhenVisible = { display: visible ? 'none' : '' }
    const hideWhenVisible = { display: visible ? '' : 'none' }

    const toggleVisibility = () => {
        setVisible(!visible)
    }

    useImperativeHandle(refs, () => {
        return {
            toggleVisibility,
        }
    })

    return (
        <>
            <div style={showWhenVisible}>
                <Button variant='primary' onClick={toggleVisibility}>
                    create
                </Button>
            </div>
            <div style={hideWhenVisible}>
                {props.children}
                <Button variant='danger' onClick={toggleVisibility}>
                    cancel
                </Button>
            </div>
        </>
    )
})

export default Togglable
