import moment from 'moment';
import * as React from 'react';
import { Grid, Row } from 'react-native-easy-grid';
import { DataTable , Text} from 'react-native-paper';
import NoData from './NoData';
import { ScrollView } from 'react-native';

function sortByIsoDay(shifts, cellDate){
  const filtered = shifts.filter((shift)=>(moment(shift.date).format('DD/MM/YYYY') === cellDate))
  return filtered
}

function Cell(props){
  const { shift } = props
  if(shift.length > 0){
    if(shift[0].status === "Active"){
      return(
        <DataTable.Cell style={{backgroundColor: shift[0].background}}>
          <Grid>
            <Row>
              <Text>{moment(shift[0].start).format('HH:mm')}-{moment(shift[0].end).format('HH:mm')}</Text>
            </Row>
            <Row>
              <Text>{moment(shift[1].start).format('HH:mm')}-{moment(shift[1].end).format('HH:mm')}</Text>
            </Row>
          </Grid>
        </DataTable.Cell>
      )
    } else {
      return(
        <DataTable.Cell style={{backgroundColor: shift[0].background}}>
          <Text>
            {shift[0].statusLabel}
          </Text>
        </DataTable.Cell>
      )
    }
  } else {
    return(
      <DataTable.Cell>
          <Text>n/c</Text>
      </DataTable.Cell>
    )
  }
}

export default function ShiftsTable(props){

  const { DateArray, weekData, noData } = props
   if(weekData.length > 0 | noData === true){
    
    return (
      <DataTable style={{alignContent:'center'}}>
        <DataTable.Header>
          <DataTable.Title>Nom</DataTable.Title>
          {DateArray.map((date, index)=>(
            <DataTable.Title numberOfLines={2} key={index}>
              <Text>{date.format('dddd')}{`\n`}</Text>
              <Text>{date.format('DD/MM/YYYY')}</Text>
            </DataTable.Title>
          ))}
        </DataTable.Header>
  
        <ScrollView>
          {weekData.map((staff) => (
            <DataTable.Row key={staff.id}>
              <DataTable.Cell>
               <Text>{staff.name}</Text>
              </DataTable.Cell>
              <Cell shift={sortByIsoDay(staff.shifts,DateArray[0].format('DD/MM/YYYY'))}/>
              <Cell shift={sortByIsoDay(staff.shifts,DateArray[1].format('DD/MM/YYYY'))}/>
              <Cell shift={sortByIsoDay(staff.shifts,DateArray[2].format('DD/MM/YYYY'))}/>
              <Cell shift={sortByIsoDay(staff.shifts,DateArray[3].format('DD/MM/YYYY'))}/>
              <Cell shift={sortByIsoDay(staff.shifts,DateArray[4].format('DD/MM/YYYY'))}/>
              <Cell shift={sortByIsoDay(staff.shifts,DateArray[5].format('DD/MM/YYYY'))}/>
              <Cell shift={sortByIsoDay(staff.shifts,DateArray[6].format('DD/MM/YYYY'))}/>
            </DataTable.Row>
          ))}
        </ScrollView>
      </DataTable>
    );
   } else {
    return <NoData/>
   }
}