import { createSlice } from '@reduxjs/toolkit'

const notificationSlice = createSlice({
    name: 'notification',
    initialState: null,
    reducers: {
        addNotification(state, action) {
            return action.payload
        },
        removeNotification() {
            return null
        },
    },
})

export const { addNotification, removeNotification } = notificationSlice.actions

export const handleNotification = (message) => {
    return async (dispatch) => {
        dispatch(addNotification(message))
        setTimeout(() => dispatch(removeNotification()), 5000)
    }
}

export default notificationSlice.reducer
