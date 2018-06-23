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
}

export interface Form {
    timerId: number
    value: string
    warning: string
}

export interface FormInput {
    onChange: (t: string) => void
    onEnter: (t: string) => void
    value: string
    helper: string
    isShort: boolean
}

// actions
const actionCreator = actionCreatorFactory()

export const actions = {
    init: actionCreator<UserData>('DASHBOARD_INIT'),
    updateUserData: actionCreator<UserData>('DASHBOARD_UPDATE_USER_DATA'),
    updateAddress: actionCreator<Form>('DASHBOARD_UPDATE_ADDRESS'),
    updateDescription: actionCreator<Form>('DASHBOARD_UPDATE_DESCRIPTION'),
}

export interface Actions {
    init: () => void
    watchAddress: (form: Form) => void
    registerAddress: (form: Form) => void
    watchDescription: (form: Form) => void
    registerDescription: (form: Form) => void
    showPage: (address: string) => void
    logout: () => void
    deleteAccount: () => void
}

// states
export interface State {
    isReady: boolean
    userData: UserData
    addressForm: Form
    descriptionForm: Form
}

const initState: State = {
    isReady: false,
    userData: {
        address: '',
        valid: false,
        name: '',
        email: '',
        description: '',
    },
    addressForm: {
        timerId: -1,
        value: '',
        warning: ''
    },
    descriptionForm: {
        timerId: -1,
        value: '',
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
            descriptionForm: {
                timerId: -1,
                value: data.valid ? data.description : '',
                warning: ''
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
    .case(actions.updateDescription, (state, form) => {
        return {
            ...state,
            descriptionForm: {...form}
        }
    })
