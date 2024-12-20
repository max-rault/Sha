import React, {useEffect} from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';
import ShiftStaff from './pages/ShiftStaff';
import TasksStaff from './pages/TasksStaff';
import DrawerContent from './components/menu/DrawerContent';
import Header from './components/menu/Header';
import Shift from './pages/Shift';
import DisplayingShifts from './pages/DisplayingShifts';
import Schedule from './pages/Schedule';
import Settings from './pages/Settings';
import { fetchStaff } from './store/actions/Staff';
import { generateShifts } from './store/actions/Shifts';
import { generateTasks } from './store/actions/Tasks';
import { useDispatch, useSelector } from 'react-redux';
import Loader from './components/Loader';
import moment from 'moment';

var frLocale = require('moment/locale/fr'); 
moment.locale('fr', frLocale);
// moment.locale('fr');

const Drawer = createDrawerNavigator();
const RootStack = createStackNavigator();

function DrawerNav(props){
  const {setUsedTheme, theme} = props

  const { weekChartData } = useSelector(state => state.shifts);
  const { tasks } = useSelector(state => state.tasks);
  const { staffMembers } = useSelector(state => state.staff);
  const dispatch = useDispatch()

  useEffect(()=>{
    const loadStaff = async () =>{
      await dispatch(fetchStaff(dispatch, '/staff/'))
    }
    loadStaff()
    if(weekChartData.length === 0 && tasks.length === 0){
      const loadShift = async () =>{
       await dispatch(generateShifts(dispatch, moment().week()))
      }
      const loadTasks = async () =>{

        await dispatch(generateTasks(dispatch, moment().format()))
      }
      loadShift()
      loadTasks()
    } else return;
  },[dispatch])
  return(
  <Drawer.Navigator
    initialRouteName='Planning'
    screenOptions={{
      header: (props) => (
        <Header {...props} setUsedTheme={setUsedTheme} theme={theme}/>
      ),
    }}  
    drawerContent={(props) =><DrawerContent theme={theme} {...props}/>}
  >
    <Drawer.Screen 
      name="shifts"  
      options={{ drawerLabel: 'Planning' }}
    >
      {(props) =>(
        <Shift theme={theme} {...props}/>
      )} 
    </Drawer.Screen>
    <Drawer.Screen 
      name="Displaying_shifts"  
      options={{ drawerLabel: 'Affichage des plannings' }}
    >
      {(props) => <DisplayingShifts theme={theme} {...props}/>} 
    </Drawer.Screen>
    <Drawer.Screen 
      name="schedule"  
      options={{ drawerLabel: 'Tâches journalière' }}
    >
      {(props) => staffMembers.length>0 ? <Schedule theme={theme} {...props}/>:<Loader/>} 
    </Drawer.Screen>
    <Drawer.Screen 
      name="settings" 
      options={{ drawerLabel: 'Paramètres' }}
    >
      {(props) => <Settings theme={theme} {...props}/>}
    </Drawer.Screen>
  </Drawer.Navigator>
  )
}

export default function Main(props){
  const {setUsedTheme, theme} = props
  return (
   <RootStack.Navigator>
    <RootStack.Group>
      <RootStack.Screen
        name='root'
        options={{ headerShown: false }} 
      >
        {(props) => <DrawerNav theme={theme} setUsedTheme={setUsedTheme} {...props}/>}
      </RootStack.Screen>
    </RootStack.Group>
    <RootStack.Group screenOptions={{ presentation: 'modal' }}>
      <RootStack.Screen
         name="ShiftStaff" 
         options={{ drawerLabel: 'Planning', headerShown: false }}
      >
        {(props) => <ShiftStaff theme={theme} {...props} />}
      </RootStack.Screen>
      <RootStack.Screen
         name="tasksStaff" 
         options={{ drawerLabel: 'Tâches', headerShown: false }}
      >
        {(props) => <TasksStaff theme={theme} {...props} />}
      </RootStack.Screen>
    </RootStack.Group>
   </RootStack.Navigator>
  );
}