import { createSlice } from '@reduxjs/toolkit'

export const nodeSlice = createSlice({
    name: 'node',
    initialState: {
        selected: null,
        view: "list",
        label: "Post",
    },
    reducers: {
        select: (state,action) =>{
            state.selected = action.payload.node
            state.label = action.payload.label
            state.view = "details"
        },
        clear: (state,action) =>{
            state.selected = null
        },
        viewChange: (state,action) =>{
            state.view = action.payload
        },
        labelChange: (state,action) =>{
            state.label = action.payload
        }
    }
})

// Action creators are generated for each case reducer function
export const { select , clear, viewChange, labelChange} = nodeSlice.actions

export default nodeSlice.reducer