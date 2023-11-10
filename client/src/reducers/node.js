import { createSlice } from '@reduxjs/toolkit'
import lbs, {category} from '../labels'

export const nodeSlice = createSlice({
    name: 'node',
    initialState: {
        selected: null,
        category:"Subject",
        view: "list",
        label: "SurfaceUser",
        panel:"data-list",
        runView: "ready"
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
            state.view = "list"
        },
        viewChange: (state,action) =>{
            state.view = action.payload
        },
        runViewChange: (state,action) =>{
            state.runView = action.payload
        },
        labelChange: (state,action) =>{
            state.label = action.payload
            state.view = "list"
        },
        panelChange: (state,action) =>{
            state.panel = action.payload
            state.view = "list"
        },
        categoryChange: (state,action) =>{
            state.category = action.payload
            state.label = category[action.payload][0]
            state.view = "list"
        }
    }
})

// Action creators are generated for each case reducer function
export const { select , clear, viewChange, labelChange, panelChange,categoryChange,runViewChange} = nodeSlice.actions

export default nodeSlice.reducer