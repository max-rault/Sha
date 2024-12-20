import { TASKS } from "../constants";

const initialState ={
    tasks:[],
    // tasksData:[],
    chartData: [],
    member: undefined,
}

const tasksReducer = (state = initialState, action) => {
    switch (action.type) {
      
      case TASKS.FETCH_TASKS:
        return{
            ...state,
            chartData:  action.payload.chartData,
            tasks:  action.payload.tasksData
        }
      
      case TASKS.GENERATE_TASKS:
        return{
          ...state,
          chartData:  action.payload.chartData,
          tasks:  action.payload.tasksData
        };
  
      case TASKS.ADD_TASK:
        return{
            ...state,
            member:action.payload
        }
      case TASKS.DELETE_TASK:
        return{
            ...state,
            member:action.payload
        }
      default:
        return state
    }
}

export default tasksReducer;