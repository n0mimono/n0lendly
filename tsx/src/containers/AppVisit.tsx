import * as React from 'react'
import { Dispatch } from 'redux'
import { connect } from 'react-redux'

import { AppState } from '../store'
import * as Visit from '../modules/visit'

import { Presenter } from './PresenterVisit'
import { Loading } from './Common'

import * as utility from '../modules/utility'
import api, { apiWithCache, clearApiCache } from '../modules/api'

// container component

interface OwnProps {
}

type Props = OwnProps & Visit.State & Visit.Actions

export class Component extends React.Component<Props> {
    componentDidMount() {
        this.props.init()
    }

    render() {
        let props = this.props
        return (
            <Loading isReady={props.isReady}>
                <Presenter
                    isReady={props.isReady}
                    pages={props.pages}
                    user={props.userData}
                    calender={props.calender}
                    onPage0={props.setPage0}
                    onPage1={props.setPage1}
                    onPage2={props.setPage2}
                    onRequest={props.sendCalenderRequest}
                    confirm={props.confirm}
                />
            </Loading>
        )
    }
}

// connect

function mapStateToProps(appState: AppState) {
    return { ...appState.visit }
}

function mapDispatchToProps(dispatch: Dispatch<void>) {
    return {
        init: () => {
            let path = window.location.pathname
            let address = path.split("/")[1]

            api('/api/visit/', 'GET', { address: address })
            .then(r => {
                dispatch(Visit.actions.init({
                    address: r.address,
                    exist: r.exist,
                    name: r.name,
                    description: r.description
                }))
            })
            .catch(e => {
                dispatch(Visit.actions.init({
                    address: address,
                    exist: false,
                    name: '',
                    description: 'Unknown Error.'
                }))
            })

            dispatch(Visit.actions.setPage0({}))

            clearApiCache()
        },
        setPage0: (p: Visit.Page0) => {
            dispatch(Visit.actions.setPage0(p))
        },
        setPage1: (p: Visit.Page1) => {
            let path = window.location.pathname
            let address = path.split("/")[1]

            apiWithCache('/api/visit/calender/', 'GET', { address: address, offset: p.cp.offset })
            .then(r => {
                let events = r.calender.events.map((v: any) => {
                    let ev: Visit.CalenderEvent = {
                        summary: v.summary,
                        start: v.start,
                        end: v.end
                    }
                    return ev
                })
                let calender: Visit.Calender = {
                    isReady: true,
                    events: events
                }

                dispatch(Visit.actions.showCalender(calender))    
            })

            dispatch(Visit.actions.showCalender({
                isReady: false, events: undefined
            }))

            dispatch(Visit.actions.setPage1(p))
        },
        setPage2: (p: Visit.Page2) => {
            dispatch(Visit.actions.setPage2(p))
        },
        sendCalenderRequest: (req: Visit.CalenderRequest) => {
            if (!utility.isValidName(req.senderName)) {
                dispatch(Visit.actions.recvClenderRequest({ isLoading: false, message: "無効な名前です。"}))
            } else if (!utility.isValidEmail(req.senderEmail)) {
                dispatch(Visit.actions.recvClenderRequest({ isLoading: false, message: "無効なアドレスです。"}))
            } else {
                api('/api/visit/calender/reserve/', 'POST', { ...req })
                .then(r => {
                    if (r.success) {
                        dispatch(Visit.actions.setPage3({ name: req.senderName }))
                    } else {
                        dispatch(Visit.actions.recvClenderRequest({ isLoading: false, message: "サーバエラーです。"}))
                    }                    
                })

                dispatch(Visit.actions.sendClenderRequest({ isLoading: true, message: "" }))
            }
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Component)
