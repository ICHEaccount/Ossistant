import { createSlice } from '@reduxjs/toolkit'
import lbs, {category} from '../labels'

export const nodeSlice = createSlice({
    name: 'node',
    initialState: {
        selected: null,
        category:"Subject",
        view: "list",
        label: "Post",
        panel:"data-list"
    },
    reducers: {
        select: (state,action) =>{
            state.selected = action.payload.node
            state.label = action.payload.label
            state.panel = "data-list"
            state.view = "details"
            state.category = lbs[action.payload.label].category
        },
        clear: (state,action) =>{
            state.selected = null
        },
        viewChange: (state,action) =>{
            state.view = action.payload
        },
        labelChange: (state,action) =>{
            state.label = action.payload
        },
        panelChange: (state,action) =>{
            state.panel = action.payload
        },
        categoryChange: (state,action) =>{
            state.category = action.payload
            state.label = category[action.payload][0]
        }
    }
})

// Action creators are generated for each case reducer function
export const { select , clear, viewChange, labelChange, panelChange,categoryChange} = nodeSlice.actions

export default nodeSlice.reducer