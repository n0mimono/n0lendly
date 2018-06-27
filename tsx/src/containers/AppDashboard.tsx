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
        let setting = props.settingForm
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
                            onEnter: () => props.registerSetting(setting),
                            showName: {
                                onChange: t => props.watchSetting({ ...setting, showName: t }),
                                value: setting.showName,
                            },
                            description: {
                                onChange: t => props.watchSetting({ ...setting, description: t }),
                                value: setting.description,
                            },
                            calSummary: {
                                onChange: t => props.watchSetting({ ...setting, calSummary: t }),
                                value: setting.calSummary,
                            },
                            calDescription: {
                                onChange: t => props.watchSetting({ ...setting, calDescription: t }),
                                value: setting.calDescription,
                            },
                            rangeMin: {
                                onChange: t => props.watchSetting({ ...setting,
                                    rangeMin: Dashboard.transTimeRange(t, setting.rangeMin) }),
                                value: setting.rangeMin,
                            },
                            rangeMax: {
                                onChange: t => props.watchSetting({ ...setting,
                                    rangeMax: Dashboard.transTimeRange(t, setting.rangeMax) }),
                                value: setting.rangeMax,
                            },
                            visibleWeek: {
                                onChange: t => props.watchSetting({ ...setting, visibleWeek: t }),
                                value: setting.visibleWeek,
                            },
                            nextGuide: {
                                onChange: t => props.watchSetting({ ...setting, nextGuide: t }),
                                value: setting.nextGuide,
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
                    dispatch(Dashboard.actions.init(Dashboard.resToUserData(r)))    
                }
            })
            .catch(e => {
                dispatch(Dashboard.actions.init(Dashboard.initUserData()))
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
                    dispatch(Dashboard.actions.init(Dashboard.resToUserData(r)))    
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
             api('/api/account/', 'POST', Dashboard.formToQuery(form))
            .then(r => {
                if (r.success) {
                    dispatch(Dashboard.actions.updateUserData(Dashboard.resToUserData(r)))    
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
