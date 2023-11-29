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
        runCategory: "completed",
        result: null,
        runView: "list",
        behavior : "view",
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
        },
        changeBehavior:(state,action) =>{
            state.behavior = action.payload
        },
        changeResultView: (state,action) =>{
            state.result=action.payload.result
            state.runCategory=action.payload.status
        },
        changeRunView: (state,action)=>{
            state.runView = action.payload
        }
    }
})

// Action creators are generated for each case reducer function
export const { select , clear, viewChange, labelChange, panelChange,categoryChange,runViewChange,changeBehavior,changeResultView,changeRunView} = nodeSlice.actions

export default nodeSlice.reducer