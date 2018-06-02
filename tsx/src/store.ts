import { createStore, combineReducers } from 'redux'
import * as Top from './modules/top'
import * as Visit from './modules/visit'
import * as Dashboard from './modules/dashboard'

export type AppState = {
    top: Top.State,
    visit: Visit.State,
    dashboard: Dashboard.State
}

const store = createStore(
    combineReducers<AppState>({
        top: Top.Reducer,
        visit: Visit.Reducer,
        dashboard: Dashboard.Reducer
    })
)

export default store
