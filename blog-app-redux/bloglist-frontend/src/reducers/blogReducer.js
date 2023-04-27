import { createSlice } from '@reduxjs/toolkit'
import blogService from '../services/blogs'

const blogSlice = createSlice({
    name: 'blogs',
    initialState: [],
    reducers: {
        setBlogs(state, action) {
            return action.payload
        },
        addBlog(state, action) {
            state.push(action.payload)
        },
        removeBlog(state, action) {
            return state.filter((blog) => blog.id !== action.payload.id)
        },
        addLike(state, action) {
            return state.map((blog) =>
                blog.title === action.payload.title
                    ? { ...blog, likes: action.payload.likes }
                    : blog
            )
        },

        addComment(state, action) {
            return state.map((blog) =>
                blog.title === action.payload.title
                    ? { ...blog, comments: action.payload.comments }
                    : blog
            )
        },
    },
})

export const { setBlogs, addBlog, removeBlog, addLike, addComment } =
    blogSlice.actions

export const initializeBlogs = () => {
    return async (dispatch) => {
        const blogs = await blogService.getAll()
        dispatch(setBlogs(blogs.sort((a, b) => b.likes - a.likes)))
    }
}

export const createBlog = (blogObj) => {
    return async (dispatch) => {
        const newBlog = await blogService.create(blogObj)
        dispatch(addBlog(newBlog))
    }
}

export const handleDeleteBlog = (blog) => {
    return async (dispatch) => {
        try {
            if (window.confirm(`remove blog ${blog.title} by ${blog.author}`)) {
                blogService.remove(blog)
                dispatch(removeBlog(blog))
            }
        } catch (error) {
            console.log(error.response.data.error)
        }
    }
}

export const updateLikes = (blog) => {
    return async (dispatch) => {
        const updatedBlog = await blogService.update({
            ...blog,
            likes: blog.likes + 1,
        })
        dispatch(addLike(updatedBlog))
    }
}

export const updateComments = (blog, comment) => {
    return async (dispatch) => {
        const updatedComments = blog.comments.concat(comment)
        const updatedBlog = await blogService.update({
            ...blog,
            comments: updatedComments,
        })

        dispatch(addComment(updatedBlog))
    }
}

export default blogSlice.reducer
