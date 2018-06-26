import * as React from 'react'
import { Dispatch } from 'redux'
import { connect } from 'react-redux'

import { AppState, history } from '../store'
import * as Dashboard from '../modules/dashboard'

import { MainPage, LinkPage } from './PresenterDashboard'
import { Loading } from './Common'

import * as utility from '../modules/utility'
import api, { apiSessionOut } from '../modules/api'

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
                        onShowPage={() => props.showPage(props.userData.address)}
                        onLogout={() => props.logout()}
                        onDeleteAccout={() => props.deleteAccount()}

                        addressForm={{
                            onChange: t => props.watchAddress({ ...props.addressForm, value: t }),
                            onEnter: t => props.registerAddress(props.addressForm),
                            value: props.addressForm.value,
                            helper: props.addressForm.warning,
                            isShort: true,
                        }}
                        settingForm={{
                            onEnter: () => props.registerSetting(props.settingForm),
                            description: {
                                onChange: t => props.watchSetting({ ...props.settingForm, description: t }),
                                value: props.settingForm.description,
                            },
                            title: {
                                onChange: t => props.watchSetting({ ...props.settingForm, title: t }),
                                value: props.settingForm.title,
                            },
                            body: {
                                onChange: t => props.watchSetting({ ...props.settingForm, body: t }),
                                value: props.settingForm.body,
                            },
                            rangeMin: {
                                onChange: t => props.watchSetting({ ...props.settingForm, rangeMin: t }),
                                value: props.settingForm.rangeMin,
                            },
                            rangeMax: {
                                onChange: t => props.watchSetting({ ...props.settingForm, rangeMax: t }),
                                value: props.settingForm.rangeMax,
                            },
                            warning: props.settingForm.warning,
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
                if (apiSessionOut(r)) {
                    window.location.href = '/login'
                } else {
                    dispatch(Dashboard.actions.init({
                        address: r.address,
                        valid: r.address_valid,
                        name: r.name,
                        email: r.email,
                        description: r.description,
                        title: r.title,
                        body: r.body,
                        rangeMin: r.range_min,
                        rangeMax: r.range_max,
                    }))    
                }
            })
            .catch(e => {
                dispatch(Dashboard.actions.init({
                    address: '',
                    valid: false,
                    name: '',
                    email: '',
                    description: '',
                    title: '',
                    body: '',
                    rangeMin: '',
                    rangeMax: '',
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
                        title: r.title,
                        body: r.body,
                        rangeMin: r.range_min,
                        rangeMax: r.range_max,
                    }))    
                }

                window.clearTimeout(form.timerId)
                dispatch(Dashboard.actions.updateAddress({
                    ...form,
                    warning: r.success ? '登録されました。' : '無効なリンクです。'
                }))
            })
        },
        watchSetting: (form: Dashboard.SettingForm) => {
            dispatch(Dashboard.actions.updateSetting(form))
        },
        registerSetting: (form: Dashboard.SettingForm) => {
             api('/api/account/', 'POST', { description: form.description })
            .then(r => {
                if (r.success) {
                    dispatch(Dashboard.actions.updateUserData({
                        address: r.address,
                        valid: r.address_valid,
                        name: r.name,
                        email: r.email,
                        description: r.description,
                        title: r.title,
                        body: r.body,
                        rangeMin: r.range_min,
                        rangeMax: r.range_max,
                    }))    
                }

                dispatch(Dashboard.actions.updateSetting({
                    ...form,
                    warning: r.success ? '登録されました。' : '無効な設定です。'
                }))
            })
        },
        showPage: (address: string) => {
            history.push('/' + address)
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
