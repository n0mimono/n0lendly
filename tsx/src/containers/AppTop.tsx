import * as React from 'react'
import { Dispatch } from 'redux'
import { connect } from 'react-redux'

import { AppState, history } from '../store'
import * as Top from '../modules/top'

import { Presenter } from './PresenterTop'
import { Loading } from './Common'

// container component

interface OwnProps {
}

type Props = OwnProps & Top.State & Top.Actions

export class Component extends React.Component<Props> {
    render() {
        let props = this.props
        return (
            <Presenter onStart={() => props.start()}/>
        )    
    }
}

// connect

function mapStateToProps(appState: AppState) {
    return { ...appState.top }
}

function mapDispatchToProps(dispatch: Dispatch<void>) {
    return {
        start: () => {
            history.push('/dashboard/')
            dispatch(Top.actions.start())
        },
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Component)
