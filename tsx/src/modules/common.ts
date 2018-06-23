import { actionCreatorFactory } from 'typescript-fsa'
import { reducerWithInitialState } from 'typescript-fsa-reducers'
import { Action } from 'typescript-fsa';
import { LOCATION_CHANGE } from 'react-router-redux';

// constants

// actions
const actionCreator = actionCreatorFactory()

export const actions = {
    locationChange: actionCreator<any>(LOCATION_CHANGE)
}

export interface Actions {
}

// states
export interface State {
}

const initState: State = {
}

// reducers
export const Reducer = reducerWithInitialState(initState)
