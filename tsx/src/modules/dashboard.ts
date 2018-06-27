import { actionCreatorFactory } from 'typescript-fsa'
import { reducerWithInitialState } from 'typescript-fsa-reducers'
import { Action } from 'typescript-fsa';

// constants

export interface UserData {
    address: string
    valid: boolean
    name: string
    email: string
    showName: string
    description: string
    calSummary: string
    calDescription: string
    rangeMin: number
    rangeMax: number
}

export interface Form {
    timerId: number
    value: string
    warning: string
}

export interface SettingForm {
    showName: string
    description: string
    calSummary: string
    calDescription: string
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
    showName: FormInput
    description: FormInput
    calSummary: FormInput
    calDescription: FormInput
    rangeMin: FormInput
    rangeMax: FormInput
    warning: string
}

// utility


export function initUserData(): UserData {
    return {
        address: '',
        valid: false,
        name: '',
        email: '',
        showName: '',
        description: '',
        calSummary: '',
        calDescription: '',
        rangeMin: 0,
        rangeMax: 0,
    }
}

export function resToUserData(r: any): UserData {
    return {
        address: r.address,
        valid: r.address_valid,
        name: r.name,
        email: r.email,
        showName: r.show_name,
        description: r.description,
        calSummary: r.cal_summary,
        calDescription: r.cal_description,
        rangeMin: r.range_min == undefined ? 0 : r.range_min,
        rangeMax: r.range_max == undefined ? 0 : r.range_max,
    }
}

export function transTimeRange(next: string, old: string): string {
    if (/^[0-9]{0,2}$/.test(next)) {
        return next
    } else {
        return old
    }
}

export function formToQuery(form: SettingForm): any {
    return {
        show_name: form.showName,
        description: form.description,
        cal_summary: form.calSummary,
        cal_description: form.calDescription,
        range_min: form.rangeMin,
        range_max: form.rangeMax,
    }
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
        showName: '',
        description: '',
        calSummary: '',
        calDescription: '',
        rangeMin: 0,
        rangeMax: 0,
    },
    addressForm: {
        timerId: -1,
        value: '',
        warning: ''
    },
    settingForm: {
        showName: '',
        description: '',
        calSummary: '',
        calDescription: '',
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
                showName: data.showName,
                description: data.description,
                calSummary: data.calSummary,
                calDescription: data.calDescription,
                rangeMin: data.rangeMin.toString(),
                rangeMax: data.rangeMax.toString(),
                warning: '',
            } : {
                showName: '',
                description: '',
                calSummary: '',
                calDescription: '',
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
