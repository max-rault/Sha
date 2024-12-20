import * as React from 'react';
import { ScrollView, StyleSheet, Platform } from 'react-native';
import { Appbar, Avatar, List, Divider, Text, IconButton, MD3Colors, SegmentedButtons, Button } from 'react-native-paper';
// import { TimePickerModal } from 'react-native-paper-dates';
import { Col, Grid, Row } from 'react-native-easy-grid';
import { Dropdown } from 'react-native-element-dropdown';
import RangeSlider from '../components/RangeSlider/RangeSlider';
import { useDispatch, useSelector } from 'react-redux';
import { getStaffMembers } from '../store/actions/Staff';
import { addTask, deleteTask } from '../store/actions/Tasks';
import moment from 'moment';
import Loader from '../components/Loader';
import LevelTask from '../components/chart/LevelTask';
import StaffLevel from '../components/chart/StaffLevel';
import NoData from '../components/NoData';

export default function TasksStaff(props){

  const {route, navigation, theme} = props
  const params = route.params
  const {id, date} = params
  // const { staffMembers, member, memberLevel } = useSelector(state => state.shifts);
  const { member, memberLevel } = useSelector(state => state.staff)
  const dispatch = useDispatch()

  const [sliderData, setSliderData] = React.useState({
    low:0,
    high:0,
    min:0,
    max:0,
  })
  const [ tasks, setTasks ] = React.useState([])
  const [ shiftNumber, setShiftNumber ] = React.useState(0)

  React.useEffect(()=>{
    
    const getMember = async () =>{
      await dispatch(getStaffMembers(id, date, dispatch))
     }

     getMember()
  },[dispatch])

  React.useEffect(()=>{
    if(member){
      setTasks(member.Tasks)
      setLevelTask(member.Levels)
      setScheduleTask(member.Levels[0])
      setSliderData({
        low:parseInt(moment(member.Shifts[shiftNumber].start).format('x')),
        high:parseInt(moment(member.Shifts[shiftNumber].end).format('x')),
        min:parseInt(moment(member.Shifts[shiftNumber].start).format('x')),
        max:parseInt(moment(member.Shifts[shiftNumber].end).format('x')),
      })
    }
  }, [member])

  console.log(sliderData)
  const [ levelTask, setLevelTask ] = React.useState([])
  const [ scheduleTask, setScheduleTask ] = React.useState(levelTask[0])

  const handleValueChange = React.useCallback(
    (newLow, newHigh, fromUser) => {
      if(fromUser === true){
       setSliderData({
        ...sliderData,
        low: newLow,
        high: newHigh
       })
      }
    },
  );

  const handleAdd = React.useCallback(()=>{
    const task = {
      start: moment(date).hour(moment(sliderData.low).hour()).minute(moment(sliderData.low).minute()),
      end: moment(date).hour(moment(sliderData.high).hour()).minute(moment(sliderData.high).minute()),
      task: scheduleTask,
      date: date
    }
    // dispatch(addTask(member, task))
  })

  const handleShiftChange = React.useCallback(
    (value) => {
      setShiftNumber(value)
      setSliderData({
        low:parseInt(moment(member.Shifts[value].start).format('x')),
        high:parseInt(moment(member.Shifts[value].end).format('x')),
        min:parseInt(moment(member.Shifts[value].start).format('x')),
        max:parseInt(moment(member.Shifts[value].end).format('x')),
      })
    },[member],
  );
  if(member){
    return (
      <ScrollView style={{flex: 1}}>
       <Appbar.Header>
         <Appbar.BackAction onPress={()=> navigation.goBack()}/>
         <Appbar.Content title={`Tâches de ${member.name} le ${moment(date).format('dddd DD MMMM YYYY')}`} />
       </Appbar.Header>
        <Grid>
          <Row  style={[styles.section, {alignSelf:'center'}]} size={20}>
            <Col size={5}>
              <Avatar.Image source={member.avatar} size={125}/>
            </Col>
          </Row>

          <Row style={styles.section} size={40}>
            <Col size={5}>

              <Row size={15}>
                <Col>
                  <Text style={styles.title}>Tâches de {member.name}</Text>
                  <Divider style={styles.divider}/>
                </Col>
              </Row>

              <Row size={85}>
                <Col style={{marginHorizontal:25}}>
                  {
                    member.Tasks.length > 0 ?
                    member.Tasks.map((task, index)=>(
                      <List.Item
                        key={index}
                        title={`${task.label} de ${moment(task.start).format('HH:mm')} à ${moment(task.end).format('HH:mm')}`}
                        right={
                          props =>
                          <IconButton 
                            {...props}
                            icon='trash-can'
                            iconColor={MD3Colors.error50}
                            size={20}
                            onPress={()=>{
                              // dispatch(deleteTask(member, index))
                            }}
                          />}
                      />
                    ))
                    :<NoData/>
                  }
                </Col>
                <Col>
                  <StaffLevel levels={memberLevel} {...props}/>      
                </Col>
              </Row>
              
            </Col>
          </Row>
          <Row style={styles.section} size={40}>
            <Col size={5}>
              <Row size={15}>
                <Col>
                  <Text style={styles.title}>Nouvelle Tâche</Text>
                  <Divider style={styles.divider}/>
                </Col>
              </Row>
              <Row size={85}>
                <Col size={50} style={{marginHorizontal:25}}>
                  <SegmentedButtons
                    value={shiftNumber}
                    style={{maxWidth: 200, alignSelf:'center'}}
                    onValueChange={handleShiftChange}
                    buttons={[
                      {
                        value: 0,
                        label: 'shift 1',
                      },
                      {
                        value: 1,
                        label: 'Shift 2',
                      },
                    ]}
                  />
                  <Dropdown
                    style={styles.dropdown}
                    placeholderStyle={[styles.placeholderStyle,{color:theme.colors.onSurface}]}
                    selectedTextStyle={[styles.selectedTextStyle, {color:theme.colors.onSurface}]}
                    itemContainerStyle={{backgroundColor: theme.colors.background}}
                    activeColor="#611cd2bd"
                    containerStyle={{borderColor:theme.colors.background}}
                    itemTextStyle={{color:theme.colors.onSurface}}
                    data={member.Levels}
                    maxHeight={200}
                    labelField="label"
                    valueField='value'
                    placeholder="Séléctionnez une tâche"
                    value={scheduleTask}
                    onChange={item => {
                      setScheduleTask(item)
                    }}
                  />
                  <RangeSlider data={sliderData} handleValueChange={handleValueChange} theme={theme}/>
                  <Button 
                    style={{marginVertical: 20, maxWidth: 200, alignSelf:'center'}} 
                    mode="contained" 
                    onPress={handleAdd}
                  >
                    Ajouter
                  </Button>
                </Col>
                <Col size={50}>
                  <LevelTask task={scheduleTask} {...props}/>
                </Col>
              </Row>
            </Col>
          </Row>
        </Grid>
      </ScrollView>
     );
  } else return <Loader/>
}

const styles = StyleSheet.create({
  dropdown: {
    height: 25,
    borderBottomColor: 'gray',
    borderBottomWidth: 0.5,
    marginVertical: 20
  },
  divider:{
    alignSelf:'center',
    width: "75%",
    marginBottom:15
  },
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 16,
  },
  section:{
    marginVertical:30
  },
  title:{
    alignContent: 'center',
    textAlign: 'center'
  },
  label:{
    paddingTop: 5
  },
  status:{
    paddingHorizontal: 50,
    maxWidth: Platform.OS === 'web' ? '45%':null,
  },
  sectionItem:{
    paddingHorizontal: 50
  },
});