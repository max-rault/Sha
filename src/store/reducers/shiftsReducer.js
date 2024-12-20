import { SHIFTS } from "../constants";

const initialState ={
    staffMembers: [],
    weekData: [],
    periodData:[],
    shifts: [],
    weekChartData:[],
    chartData:[],
    member: undefined,
    noData: true,
}

const shiftsReducer = (state = initialState, action) => {
    switch (action.type) {
      case SHIFTS.GENERATE_SHIFTS:
        // const {shifts, chartData} = action.payload
        return{
            ...state,
            shifts: action.payload?.shiftsData,
            weekChartData: action.payload?.chartData
        }

      case SHIFTS.FETCH_SHIFTS_BY_DAY:
        return{
          ...state,
          chartData: action.payload
        }
      
      case SHIFTS.FETCH_SHIFTS_BY_WEEK:
        const payload = action.payload
        return{
          ...state,
          weekData: payload.weekData,
          noData: payload.noData
        }

      // case SHIFTS.ADD_SHIFTS:
      //   return{
      //     ...state,
      //     staffMembers: action.payload,
      //   }
      case SHIFTS.UPDATE_SHIFT:
        const { membersUpdate, staffList, shiftsData } = action.payload
        return{
          ...state,
          staffMembers: staffList,
          member: membersUpdate,
          shifts: shiftsData
        }
  
      default:
        return state
    }
}

export default shiftsReducer;