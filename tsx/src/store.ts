import { createStore, combineReducers, applyMiddleware } from 'redux'
import { routerReducer, routerMiddleware } from 'react-router-redux'
import { createBrowserHistory } from 'history'

import * as Top from './modules/top'
import * as Visit from './modules/visit'
import * as Dashboard from './modules/dashboard'
import * as Common from './modules/common'

export type AppState = {
    top: Top.State,
    visit: Visit.State,
    dashboard: Dashboard.State,

    common: Common.State,
    routing: any,
}

export const history = createBrowserHistory()
const middleware = routerMiddleware(history)

const store = createStore(
    combineReducers<AppState>({
        top: Top.Reducer,
        visit: Visit.Reducer,
        dashboard: Dashboard.Reducer,

        common: Common.Reducer,
        routing: routerReducer,
    }),
    applyMiddleware(middleware)
)

export default store
