import { actionCreatorFactory } from 'typescript-fsa'
import { reducerWithInitialState } from 'typescript-fsa-reducers'
import { Action } from 'typescript-fsa';

// constants


// actions
const actionCreator = actionCreatorFactory()

export const actions = {
    start: actionCreator('_START') // dummy
}

export interface Actions {
    start: () => Action<undefined>
}

// states
export interface State {
}

const initState: State = {
}

// reducers
export const Reducer = reducerWithInitialState(initState)
    .case(actions.start, (state) => {
        return {
            ...state,
        }
    })
