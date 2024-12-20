import { TASKS } from "../constants";
import api from "../../utils/api";
import moment from "moment";


export async function generateTasks(dispatch, date){
  try {
    const response = await api.post('/tasks/',{date: date})
    dispatch({
      type: TASKS.GENERATE_TASKS,
      payload: {
        tasksData: response.data?.tasksData,
        chartData:  response.data?.chartData
      }
    });
  } catch (error) {
    toast.show(`status: ${error.message}\nmessage: ${error.response?.data.message}`, {type:'danger', duration:null})
    console.log('error: ', error)
  }
}

export async function fetchTasks(dispatch, periodId, date){
  try {
    const response = await api.get(`/tasks/${periodId}/${date}`)
    dispatch({
      type: TASKS.FETCH_TASKS,
      payload: {
        tasksData: response.data?.tasksData,
        chartData:  response.data?.chartData
      }
    });
  } catch (error) {
    toast.show(`status: ${error.message}\nmessage: ${error.response?.data.message}`, {type:'danger', duration:null})
    console.log('error: ', error)
  }
}

/**
 * 
 * @param {object} member 
 * @param {object} task 
 * @returns {object} payload
 */
export function addTask(member, task){
  if(member && task){
    member.tasks.push({
      start: task.start, 
      end: task.end,
      task: task.task,
      date: task.date,
    })
  }
  return{
    type: TASKS.ADD_TASK,
    payload: member
  }
}

/**
 * 
 * @param {object} member 
 * @param {integer} taskId 
 * @returns {object} payload
 */
export function deleteTask(member, taskId){
  if(member){
    member.tasks.splice(taskId, 1)
  }
  return{
    type: TASKS.DELETE_TASK,
    payload: member
  }
}

// export function fetchTasksByPeriod(staffList, period){
//   const tasksArray = []
//   const staffPeriod = []
//   staffList.forEach((staff) =>{
//     const tasksFiltered = staff.tasks.filter((task)=>(
//       moment(moment(task.start).format()).isBetween(period.start, period.end, 'hour')
//       |
//       moment(moment(task.end).format()).isBetween(period.start, period.end, "hour")
//       ))
//     if(staff.tasks.length>0 && tasksFiltered.length > 0){
//       staffPeriod.push({
//         ...staff,
//         tasks:tasksFiltered
//       })
//     }
//   })
//   return{
//     type: TASKS.FETCH_TASKS_BY_PERIOD,
//     payload:{
//       tasks: tasksArray,
//       periodData: staffPeriod
//     }
//   }
// }