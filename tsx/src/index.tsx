import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider, connect } from 'react-redux'
import { Route, Switch } from 'react-router'
import { ConnectedRouter } from 'react-router-redux'
import store, { history } from './store'

import Top from './containers/AppTop'
import Dashboard from './containers/AppDashboard'
import Visit from './containers/AppVisit'

import { Theme } from './containers/Common'

ReactDOM.render(
    <Provider store={store}>
        <ConnectedRouter history={history}>
            <Theme>
                <Switch>
                    <Route exact path="/"><Top /></Route>
                    <Route exact path="/dashboard" ><Dashboard /></Route>
                    <Route exact path="/:userLink"><Visit /></Route>
                    <Route><h1>Not Found</h1></Route>
                </Switch>
            </Theme>
        </ConnectedRouter>
    </Provider>,
    document.querySelector('.app')
)
