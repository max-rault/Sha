import { SHIFTS } from "../constants";
import { PARAMS } from "../../utils/params";
import api from "../../utils/api";
import moment from "moment";

/**
 * 
 * @param {arrray} staffList 
 * @param {date} date
 * @param { array } shifts
 * @returns {object} payload
 */
export async function generateShifts(dispatch, weekNumber){

  try {
    const response = await api.post('/shifts/',{weekNumber: weekNumber})
    dispatch({
      type: SHIFTS.GENERATE_SHIFTS,
      payload: response.data
    });
  } catch (error) {
    toast.show(`status: ${error.message}\nmessage: ${error.response?.data.message}`, {type:'danger', duration:null})
    console.log('error: ', error)
  }
}

export function fetchShiftsByday(dispatch, date, weekChartData){
  console.log('test in fetchShiftByDay')
  try {
    const dayData = []
    weekChartData.forEach(shift  => {
      const shiftDate = moment(shift[1]).format('YYYY-MM-DD')
      console.log('date: ', date)
      console.log('shiftDate: ', moment(shiftDate).isSame(moment(date).format('YYYY-MM-DD')))
      if(moment(shiftDate).isSame(moment(date).format('YYYY-MM-DD'))){
        console.log('shift', shift)
        dayData.push(shift)
      }
    });
    // console.log(dayData)
    dispatch({
      type: SHIFTS.FETCH_SHIFTS_BY_DAY,
      payload: dayData
    });
  } catch (error) {
    toast.show(`status: ${error.message}\nmessage: ${error.response?.data.message}`, {type:'danger', duration:null})
    console.log('error: ', error)
  }
}


/**
 * 
 * @param {array} staffList 
 * @param {date} date 
 * @returns {object} payload
 */
// export function addShifts(staffList, date){
//   const statusArray = [
//     {label: 'Actif', value: 'Active', color:undefined},
//     {label: 'Actif', value: 'Active', color:undefined},
//     {label: 'Actif', value: 'Active', color:undefined},
//     {label: 'Actif', value: 'Active', color:undefined},
//     {label: 'Actif', value: 'Active', color:undefined},

//     {label: 'Repos', value: 'Rest', color: '#00f'},
//     {label: 'Repos', value: 'Rest', color: '#00f'},
//     {label: 'Repos', value: 'Rest', color: '#00f'},

//     {label: 'Formation', value:'educational_training', color:'#0f0'},
//     {label: 'Congés payés', value:'Paid_holidays', color: '#0af'},
//     {label: 'Absence Autorisée', value:'Absence_authorised', color:'#f0a'}
//   ]
//   const shiftFiltered = staffList.filter((staff)=>(moment(moment(staff.shifts.date).format('MM-DD-YYYY')).isSame(moment(date).format('MM-DD-YYYY'))))

//   if(shiftFiltered.length === 0){
    
//     staffList.forEach((staff) =>{
    
//       const baseTime = (Math.round(Math.random()*(16-7)))+7
//       const secBaseTime = baseTime + 5
//       const minutes = [0,15,30,45]
//       const status = statusArray[Math.round(Math.random()*(statusArray.length-1))]
  
//       if(status.value === 'Active'){
//         staff.shifts.push(
//           {
//             start: moment(date).hour(baseTime).minute(minutes[Math.round(Math.random()*(minutes.length-1))]), 
//             end: moment(date).hour(baseTime+3).minute(minutes[Math.round(Math.random()*(minutes.length-1))]),
//             status: status.value,
//             statusLabel: status.label,
//             background: status.color,
//             date: date,
//           },
//           {
//             start: moment(date).hour(secBaseTime).minute(minutes[Math.round(Math.random()*(minutes.length-1))]), 
//             end: moment(date).hour(secBaseTime+3).minute(minutes[Math.round(Math.random()*(minutes.length-1))]),
//             status: status.value,
//             statusLabel: status.label,
//             background: status.color,
//             statusLabel: status.label,
//             date: date
//           }
//         )
//       } else {
//         staff.shifts.push(
//           {
//             start: undefined, 
//             end: undefined,
//             status: status.value,
//             background: status.color,
//             statusLabel: status.label,
//             date: date,
//           },
//           {
//             start: undefined,
//             end: undefined,
//             background: status.color,
//             status: status.value,
//             statusLabel: status.label,
//             date: date
//           }
//         )
//       }
//     })
//   }
//   return{
//     type: SHIFTS.ADD_SHIFTS,
//     payload: staffList
//   }
// }

/**
 * 
 * @param {array} staffList 
 * @param {any} id 
 * @param {date} date 
 * @param {date} start 
 * @param {date} end 
 * @param {integer} index 
 * @param {string} type 
 * @param {array} shifts 
 * @returns {object} payload
 */
export function updateShift(staffList, id, date, start, end, index,type, shifts){
  let member = staffList.find((staff)=>(staff.id === id))

  if(member){
    const shiftIndex = member.shifts.findIndex(shift => moment(moment(shift.date).format('MM-DD-YYYY')).isSame(moment(date).format('MM-DD-YYYY'))) +index
    const shiftsDatIndex = shifts.findIndex(shift => shift[0] === member.name) + index
    if(type === 'start'){
      member.shifts[shiftIndex].start = start
      shifts[shiftsDatIndex].start = start
    }

    if(type === 'end'){
      member.shifts[shiftIndex].end = end
      shifts[shiftsDatIndex].end = end
    }

    staffList[id-1] = member
  }
  return({
    type: SHIFTS.UPDATE_SHIFT,
    payload:{
      membersUpdate:member,
      staffList: staffList,
      shiftsData: shifts
    }
  })
}