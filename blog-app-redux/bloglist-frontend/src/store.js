import { configureStore } from '@reduxjs/toolkit'
import notificationReducer from './reducers/notificationReducer'
import blogReducer from './reducers/blogReducer'
import loginReducer from './reducers/loginReducer'
import userReducer from './reducers/userReducer'

const store = configureStore({
    reducer: {
        notification: notificationReducer,
        blogs: blogReducer,
        user: loginReducer,
        users: userReducer,
    },
})

export default store
