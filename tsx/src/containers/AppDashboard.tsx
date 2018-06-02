import * as React from 'react'
import { Dispatch } from 'redux'
import { connect } from 'react-redux'

import { AppState } from '../store'
import * as Dashboard from '../modules/dashboard'

import { MainPage, LinkPage } from './PresenterDashboard'
import { Loading } from './Common'

import * as utility from '../modules/utility'
import api from '../modules/api'

// container component

interface OwnProps {
}

type Props = OwnProps & Dashboard.State & Dashboard.Actions

export class Component extends React.Component<Props> {
    componentDidMount() {
        this.props.init()
    }

    render() {
        let props = this.props
        if (props.userData.valid) {
            return (
                <Loading isReady={props.isReady}>
                    <MainPage
                        name={props.userData.name}
                        email={props.userData.email}
                        address={props.userData.address}
                        onLogout={() => props.logout()}
                        onDeleteAccout={() => props.deleteAccount()}

                        addressForm={{
                            onChange: t => props.watchAddress({ ...props.addressForm, value: t }),
                            onEnter: t => props.registerAddress(props.addressForm),
                            value: props.addressForm.value,
                            helper: props.addressForm.warning,
                            isShort: true,
                        }}
                        descriotionForm={{
                            onChange: t => props.watchDescription({ ...props.descriptionForm, value: t }),
                            onEnter: t => props.registerDescription(props.descriptionForm),
                            value: props.descriptionForm.value,
                            helper: props.descriptionForm.warning,
                            isShort: false,
                        }}
                   />
                </Loading>
            )
        } else {
            return (
                <Loading isReady={props.isReady}>
                    <LinkPage
                        addressForm={{
                            onChange: t => props.watchAddress({ ...props.addressForm, value: t }),
                            onEnter: t => props.registerAddress(props.addressForm),
                            value: props.addressForm.value,
                            helper: props.addressForm.warning,
                            isShort: true,
                        }}
                    />
                </Loading>
            )
        }
    }
}

// connect

function mapStateToProps(appState: AppState) {
    return { ...appState.dashboard }
}

function mapDispatchToProps(dispatch: Dispatch<void>) {
    return {
        init: () => {
            api('/api/account/', 'GET')
            .then(r => {
                dispatch(Dashboard.actions.init({
                    address: r.address,
                    valid: r.address_valid,
                    name: r.name,
                    email: r.email,
                    description: r.description,
                }))
            })
            .catch(e => {
                dispatch(Dashboard.actions.init({
                    address: '',
                    valid: false,
                    name: '',
                    email: '',
                    description: '',
                }))
            })
        },
        watchAddress: (form: Dashboard.Form) => {
            window.clearTimeout(form.timerId)

            let timerId = window.setTimeout(() => {
                api('/api/available/', 'GET', { address: form.value })
                .then(r => {
                    dispatch(Dashboard.actions.updateAddress({
                        ...form,
                        warning: r.ok ? '使用できます。' : '使用できません。'
                    }))
                })
            }, 2000);

            dispatch(Dashboard.actions.updateAddress({ ...form, timerId: timerId }))
        },
        registerAddress: (form: Dashboard.Form) => {
            api('/api/account/', 'POST', { address: form.value })
            .then(r => {
                if (r.success) {
                    dispatch(Dashboard.actions.updateUserData({
                        address: r.address,
                        valid: r.address_valid,
                        name: r.name,
                        email: r.email,
                        description: r.description,
                    }))    
                }

                window.clearTimeout(form.timerId)
                dispatch(Dashboard.actions.updateAddress({
                    ...form,
                    warning: r.success ? '登録されました。' : '無効なリンクです。'
                }))
            })
        },
        watchDescription: (form: Dashboard.Form) => {
            dispatch(Dashboard.actions.updateDescription(form))
        },
        registerDescription: (form: Dashboard.Form) => {
            api('/api/account/', 'POST', { description: form.value })
            .then(r => {
                if (r.success) {
                    dispatch(Dashboard.actions.updateUserData({
                        address: r.address,
                        valid: r.address_valid,
                        name: r.name,
                        email: r.email,
                        description: r.description,
                    }))    
                }

                dispatch(Dashboard.actions.updateDescription({
                    ...form,
                    warning: r.success ? '登録されました。' : '無効な説明文です。'
                }))
            })
        },
        logout: () => {
            window.location.href = '/logout/'
        },
        deleteAccount: () => {
            api('/api/account/', 'DELETE')
            .then(r => {
                alert('削除しました。')
                window.location.href = '/'
            })
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Component)
