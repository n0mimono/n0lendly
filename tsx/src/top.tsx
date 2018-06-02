import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux'
import store from './store'

import App from './containers/AppTop'
import { Theme } from './containers/Common'

ReactDOM.render(
    <Provider store={store}>
        <Theme>
            <App />
        </Theme>
    </Provider>,
    document.querySelector('.app')
)
