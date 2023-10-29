import { configureStore } from '@reduxjs/toolkit'
import nodeReducer from './node'

export default configureStore({
    reducer: {
        node:nodeReducer
    }
})