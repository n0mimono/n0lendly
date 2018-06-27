import { actionCreatorFactory } from 'typescript-fsa'
import { reducerWithInitialState } from 'typescript-fsa-reducers'
import { Action } from 'typescript-fsa';

// constants

export interface UserData {
    address: string
    exist: boolean
    name: string
    description: string
    showName: string
    calSummary: string
    calDescription: string
    rangeMin: number
    rangeMax: number
    nextGuide: string
}

export function errToUserData(address: string): UserData {
    return {
        address: address,
        exist: false,
        name: '',
        description: '',
        showName: '',
        calSummary: '',
        calDescription: '',
        rangeMin: 0,
        rangeMax: 0,
        nextGuide: '',
    }
}

export function resToUserData(r: any): UserData {
    return {
        address: r.address,
        exist: r.exist,
        name: r.name,
        description: r.description,
        showName: r.show_name,
        calSummary: r.cal_summary,
        calDescription: r.cal_description,
        rangeMin: r.range_min == undefined ? 0 : r.range_min,
        rangeMax: r.range_max == undefined ? 0 : r.range_max,
        nextGuide: r.next_guide,
    }
}

export interface Page0 {
}

export interface Page1 {
    cp: CalenderPage
}

export interface Page2 {
    isReady: boolean
    time: string
}

export interface Page3 {
    name: string
}

export interface Pages {
    index: number
    page0: Page0
    page1: Page1
    page2: Page2
    page3: Page3
}

export interface Calender {
    isReady: boolean
    events: CalenderEvent[] | undefined
}

export interface CalenderEvent {
    summary: string
    start: string
    end: string
}

export interface CalenderPage {
    index: number
    offset: number
}

export function updateCalenderPage(cp: CalenderPage, v: number): CalenderPage {
    let next = cp.index + v
    return {
        index: next,
        offset: next * 7
    }
}

export interface CalenderRequest {
    address: string
    time: string
    senderName: string
    senderEmail: string
    summary: string
    description: string
}

export interface Confirm {
    isLoading: boolean
    message: string
}

// actions
const actionCreator = actionCreatorFactory()

export const actions = {
    init: actionCreator<UserData>('VISIT_INIT'),
    setPage0: actionCreator<Page0>('VISIT_SET_PAGE0'),
    setPage1: actionCreator<Page1>('VISIT_SET_PAGE1'),
    setPage2: actionCreator<Page2>('VISIT_SET_PAGE2'),
    setPage3: actionCreator<Page3>('VISIT_SET_PAGE3'),
    setCalenderPage: actionCreator<CalenderPage>('VISIT_SET_CALENDER_PAGE'),
    showCalender: actionCreator<Calender>('VISIT_SHOW_CALENDER'),
    sendClenderRequest: actionCreator<Confirm>('VISIT_SEND_CALENDER_REQUEST'),
    recvClenderRequest: actionCreator<Confirm>('VISIT_RECV_CALENDER_REQUEST'),
}

export interface Actions {
    init: () => Action<undefined>
    setPage0: (p: Page0) => Action<Page0>
    setPage1: (p: Page1) => Action<Page1>
    setPage2: (p: Page2) => Action<Page2>
    //setPage3: (p: Page3) => Action<Page3>
    sendCalenderRequest: (r: CalenderRequest) => Action<CalenderRequest>
}

// states
export interface State {
    isReady: boolean
    pages: Pages
    userData: UserData

    calender: Calender
    confirm: Confirm
}

const initState: State = {
    isReady: false,
    pages: {
        index: 0,
        page0: {
        },
        page1: {
            cp: { index: 0, offset: 0}
        },
        page2: {
            time: '',
            isReady: false,
        },    
        page3: {
            name: ''
        }
    },
    userData: {
        address: '',
        exist: false,
        name: '',
        description: '',
        showName: '',
        calSummary: '',
        calDescription: '',
        rangeMin: 0,
        rangeMax: 0,
        nextGuide: '',
    },
    calender: {
        isReady: false,
        events: undefined
    },
    confirm: {
        isLoading: false,
        message: ''
    }
}

// reducers
export const Reducer = reducerWithInitialState(initState)
    .case(actions.init, (state, userData) => {
        return {
            ...state,
            isReady: true,
            userData: {...userData},
        }
    })
    .case(actions.setPage0, (state, page) => {
        return {
            ...state,
            pages: {
                ...state.pages,
                index: 0,
                page0: {...page }
            },
        }
    })
    .case(actions.setPage1, (state, page) => {
        return {
            ...state,
            pages: {
                ...state.pages,
                index: 1,
                page1: {...page }
            },
        }
    })
    .case(actions.setPage2, (state, page) => {
        return {
            ...state,
            pages: {
                ...state.pages,
                index: 2,
                page2: {...page }
            },
        }
    })
    .case(actions.setPage3, (state, page) => {
        return {
            ...state,
            pages: {
                ...state.pages,
                index: 3,
                page3: {...page }
            },
        }
    })
    .case(actions.setCalenderPage, (state, page) => {
        return {
            ...state,
            calenderPage: page,
        }
    })
    .case(actions.showCalender, (state, calender) => {
        return {
            ...state,
            calender: { ...calender }
        }
    })
    .case(actions.sendClenderRequest, (state, confirm) => {
        return {
            ...state,
            confirm: {...confirm},
        }
    })
    .case(actions.recvClenderRequest, (state, confirm) => {
        return {
            ...state,
            confirm: { ...confirm }
        }
    })
