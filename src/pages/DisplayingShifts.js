import moment from 'moment';
import * as React from 'react';
import { Grid, Row, Col } from 'react-native-easy-grid';
import { fetchShiftsByWeek } from '../store/actions/Shifts';
import { Text, IconButton} from 'react-native-paper';
import { ScrollView } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import ShiftsTable from '../components/ShiftsTable';
import Loader from '../components/Loader';

export default function DisplayingShifts(){

  const { weekData, noData, shifts } = useSelector(state => state.shifts);
  const { staffMembers } = useSelector((state)=> state.staff)
  const dispatch = useDispatch()
  const [DateArray, setDateArray] = React.useState([
    moment().weekday(0), 
    moment().weekday(1), 
    moment().weekday(2), 
    moment().weekday(3),
    moment().weekday(4),
    moment().weekday(5),
    moment().weekday(6)
  ])

  const fetchPrevtWeek = React.useCallback(() =>{
    var prevWeek = DateArray[6].subtract(7,'days')
    const startDate = moment(moment(prevWeek).weekday(0)).format()
    const endDate = moment(moment(prevWeek).weekday(6)).format()
    setDateArray([
      moment(prevWeek).weekday(0),
      moment(prevWeek).weekday(1),
      moment(prevWeek).weekday(2),
      moment(prevWeek).weekday(3),
      moment(prevWeek).weekday(4),
      moment(prevWeek).weekday(5),
      moment(prevWeek).weekday(6),
    ])
    dispatch(fetchShiftsByWeek())
  }, [])

  const fetchNextWeek = React.useCallback(() =>{
    var nextWeek = DateArray[6].add(7,'days')
    const startDate = moment(moment(nextWeek).weekday(0)).format()
    const endDate = moment(moment(nextWeek).weekday(6)).format()
    setDateArray([
      moment(nextWeek).weekday(0),
      moment(nextWeek).weekday(1),
      moment(nextWeek).weekday(2),
      moment(nextWeek).weekday(3),
      moment(nextWeek).weekday(4),
      moment(nextWeek).weekday(5),
      moment(nextWeek).weekday(6),
    ])
    dispatch(fetchShiftsByWeek(staffMembers, shifts, startDate , endDate))
  }, [])

  React.useEffect(()=>{
    dispatch(fetchShiftsByWeek(staffMembers,  shifts,moment(DateArray[0]).format(), moment(DateArray[6]).format()))
  },[])
  if(weekData.length > 0){
    return (
      <Grid >
        <Row size={10} style={{alignItems:'center'}}>
          <Col size={10}>
            <IconButton 
              icon="arrow-left-bold-outline"
              onPress={fetchPrevtWeek}
            /> 
          </Col>
          <Col size={80} style={{alignItems:'center'}}>
            <Text variant=''>Semaine du {DateArray[0].format('DD/MM/YYYY')} au {DateArray[6].format('DD/MM/YYYY')}</Text>
          </Col>
          <Col size={10} style={{alignItems:'flex-end'}}>
            <IconButton 
              icon="arrow-right-bold-outline"
              onPress={fetchNextWeek}
            />
          </Col>
        </Row>
        <Row size={90}>
          <ShiftsTable DateArray={DateArray} weekData={weekData} noData={noData}/>
        </Row>
      </Grid>
    );
  } else return <Loader/>
}