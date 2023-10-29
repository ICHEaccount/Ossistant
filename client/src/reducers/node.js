import { createSlice } from '@reduxjs/toolkit'

export const nodeSlice = createSlice({
    name: 'node',
    initialState: {
        selected: null
    },
    reducers: {
        select: (state,action) =>{
            state.selected = action.payload
        },
        clear: (state,action) =>{
            state.selected = null
        }
    }
})

// Action creators are generated for each case reducer function
export const { select } = nodeSlice.actions

export default nodeSlice.reducer