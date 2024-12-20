import * as React from 'react';
import {Row, Col, Grid } from "react-native-easy-grid";
import { View, StyleSheet } from 'react-native';
import { SVGRenderer, echarts } from '@wuba/react-native-echarts';
import { Dropdown } from 'react-native-element-dropdown';
import ScheduleChart from '../components/chart/ScheduleChart';
import Loader from '../components/Loader';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTasks } from '../store/actions/Tasks';
import moment from 'moment';
import StaffList from '../components/StaffList';

echarts.use([SVGRenderer]);
const periodArray =[
  {
    label:'ouverture', period:1
  },
  {
    label:'Rush Midi', period:2
  },
  {
    label:'Après-midi', period:3
  },
  {
    label:'Rush-soir', period:4
  },
  {
    label:'Fermeture', period:5
  },
]

export default function Schedule(props){
  const [loading, setLoading] = React.useState(true)
  const [ period, setPeriod ] = React.useState(periodArray[0])
  const { chartData, tasks } = useSelector(state => state.tasks);
  const dispatch = useDispatch()

  const loadStaff = async (periodID, date) =>{
    dispatch(fetchTasks(dispatch, periodID, date))
  }

  React.useEffect(()=>{
    let uri = 'http://localhost:8081/assets/Test_map_bk_adobe.svg'
    if(Platform.OS==='android' | Platform.OS ==='ios'){
      uri = 'http://192.168.0.34:8081/assets/Test_map_bk_adobe.svg'
    }
    fetch(uri)
    .then((response) => response.text())
        .then((svgText) => {
            echarts.registerMap('Test_map_bk_adobe', { svg: svgText });
            if(chartData.length >0){
              setLoading(false)
            }
       })
       .catch(e => console.error('fetch error', e));
  },[tasks, chartData])

  React.useEffect(()=>{
    loadStaff(1, moment().format('YYYY-MM-DD'))
  },[dispatch])

  const {theme} = props
  return (
    <View style={{flex: 1}}>
      <Grid>
        <Row>
          <Col>
            { loading ? 
              <Loader/>:
              <ScheduleChart theme={theme} echarts={echarts} tasks={chartData}/>
            }
          </Col>
          <Col>
            <Row size={10} style={{alignItems:'center', paddingHorizontal: 75}}>
            <Dropdown
              style={styles.dropdown}
              placeholderStyle={[styles.placeholderStyle,{color:theme.colors.onSurface}]}
              selectedTextStyle={[styles.selectedTextStyle, {color:theme.colors.onSurface}]}
              itemContainerStyle={{backgroundColor: theme.colors.background}}
              activeColor="#611cd2bd"
              containerStyle={{borderColor:theme.colors.background}}
              itemTextStyle={{color:theme.colors.onSurface}}
              data={periodArray}
              maxHeight={200}
              labelField="label"
              valueField="period"
              placeholder="Séléctionnez une periode"
              value={period}
              onChange={item => {
                setPeriod(item)
                loadStaff(item.period, moment().format('YYYY-MM-DD'))
                // dispatch(fetchStaff(dispatch, `/staff/${item.period}/${moment().format('YYYY-DD-MM')}`))
              }}
            />
            </Row>
            <Row size={90}>
              <StaffList data={tasks} date={moment().format()} tasks {...props}/>
            </Row>
          </Col>
        </Row>
      </Grid>
    </View>
  );
}

const styles = StyleSheet.create({
  dropdown: {
    flex:1,
    height: 25,
    borderBottomColor: 'gray',
    borderBottomWidth: 0.5,
  },
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 16,
  },
})