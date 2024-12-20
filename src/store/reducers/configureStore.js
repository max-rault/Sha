import { createStore, combineReducers, applyMiddleware } from "redux";

import thunk from 'redux-thunk';
import shiftsReducer from "./shiftsReducer";
import tasksReducer from "./tasksReducer";
import staffReducer from './staffReducer';

const rootReducers = combineReducers(
    {
      shifts: shiftsReducer,
      tasks: tasksReducer,
      staff: staffReducer
    }
);

const configureStore = () =>{
  return createStore(rootReducers, applyMiddleware(thunk));
}

export default configureStore;