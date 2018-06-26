import { actionCreatorFactory } from 'typescript-fsa'
import { reducerWithInitialState } from 'typescript-fsa-reducers'
import { Action } from 'typescript-fsa';

// constants

export interface UserData {
    address: string
    valid: boolean
    name: string
    email: string
    description: string
    title: string
    body: string
    rangeMin: string
    rangeMax: string
}

export interface Form {
    timerId: number
    value: string
    warning: string
}

export interface SettingForm {
    description: string
    title: string
    body: string
    rangeMin: string
    rangeMax: string
    warning: string
}

export interface FormInput {
    onChange: (t: string) => void
    onEnter?: (t: string) => void
    value: string
    helper?: string
    isShort?: boolean
}

export interface SettingFormInput {
    onEnter: () => void
    description: FormInput
    title: FormInput
    body: FormInput
    rangeMin: FormInput
    rangeMax: FormInput
    warning: string
}

// actions
const actionCreator = actionCreatorFactory()

export const actions = {
    init: actionCreator<UserData>('DASHBOARD_INIT'),
    updateUserData: actionCreator<UserData>('DASHBOARD_UPDATE_USER_DATA'),
    updateAddress: actionCreator<Form>('DASHBOARD_UPDATE_ADDRESS'),
    updateSetting: actionCreator<SettingForm>('DASHBOARD_UPDATE_SETTING'),
}

export interface Actions {
    init: () => void
    watchAddress: (form: Form) => void
    registerAddress: (form: Form) => void
    watchSetting: (form: SettingForm) => void
    registerSetting: (form: SettingForm) => void
    showPage: (address: string) => void
    logout: () => void
    deleteAccount: () => void
}

// states
export interface State {
    isReady: boolean
    userData: UserData
    addressForm: Form
    settingForm: SettingForm
}

const initState: State = {
    isReady: false,
    userData: {
        address: '',
        valid: false,
        name: '',
        email: '',
        description: '',
        title: '',
        body: '',
        rangeMin: '',
        rangeMax: '',
    },
    addressForm: {
        timerId: -1,
        value: '',
        warning: ''
    },
    settingForm: {
        description: '',
        title: '',
        body: '',
        rangeMin: '',
        rangeMax: '',
        warning: ''   
    }
}

// reducers
export const Reducer = reducerWithInitialState(initState)
    .case(actions.init, (state, data) => {
        return {
            ...state,
            isReady: true,
            userData: {...data},
            addressForm: {
                timerId: -1,
                value: data.valid ? data.address : '',
                warning: ''
            },
            settingForm: data.valid ? {
                description: data.description,
                title: data.title,
                body: data.body,
                rangeMin: data.rangeMin,
                rangeMax: data.rangeMax,
                warning: '',
            } : {
                description: '',
                title: '',
                body: '',
                rangeMin: '',
                rangeMax: '',
                warning: '',
            }
        }
    })
    .case(actions.updateUserData, (state, data) => {
        return {
            ...state,
            userData: {...data }
        }
    })
    .case(actions.updateAddress, (state, form) => {
        return {
            ...state,
            addressForm: {...form}
        }
    })
    .case(actions.updateSetting, (state, form) => {
        return {
            ...state,
            settingForm: {...form}
        }
    })
