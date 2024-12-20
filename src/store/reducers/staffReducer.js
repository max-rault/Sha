import { STAFF } from "../constants";

const initialState ={
    staffMembers: [],
    member: undefined,
    memberLevel: [],
    noData: true,
}

const staffReducer = (state = initialState, action) => {
    switch (action.type) {
      case STAFF.FETCH_STAFF:
        return{
            ...state,
            staffMembers: action.payload
        };
     
      case STAFF.GET_STAFF_MEMBERS:
        
        return {
          ...state,
          member: action.payload.member,
          memberLevel: action.payload.memberLevel
        }
      
      case STAFF.NEW_STAFF:
        return{
          ...state,
          staffMembers: [...state.staffMembers, action.payload]
        }
      
      case STAFF.DELETE_STAFF_MEMBER:
        return{
          ...state,
          staffMembers: [...state.staffMembers.slice(0,action.payload)]
        }
  
      default:
        return state
    }
}

export default staffReducer;