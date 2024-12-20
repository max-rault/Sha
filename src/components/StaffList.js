import moment from 'moment';
import * as React from 'react';
import { FlatList, StyleSheet } from 'react-native';
import { List, Avatar } from 'react-native-paper';

export default function StaffList(props){
  const { data, navigation, date, closeStaffList, tasks } = props
  const renderItem = React.useCallback((item, date)=>{
    var title = item.memberName

    // if(tasks){
    //   title = `${item.name} ${item.tasks[0].task.label} de ${moment(item.tasks[0].start).format('HH:mm')} à ${moment(item.tasks[0].end).format('HH:mm')}`
    // } else {
    //   title = `${item.name} (${item.shifts[0].statusLabel})`
    // }
    return(
      <List.Item
        key={item.StaffId}
        description={title}
        left={props => <Avatar.Image {...props} size={40} source={{uri:item.memberAvatar}}/>}
        onPress={()=> {
          if (!tasks) {

            closeStaffList()
            navigation.navigate('ShiftStaff',{id: item.StaffId, date: date})

          } else navigation.navigate('tasksStaff',{id: item.StaffId, date: date})
        }}
      />
    )
  }, [])

  const keyExtractor = React.useCallback((item) => item.StaffId.toString(), [])

  return (
    <FlatList
      data={data}
      maxToRenderPerBatch={5}
      renderItem={({item})=>renderItem(item, date)}
      keyExtractor={keyExtractor}
    />
  );
}
const styles = StyleSheet.create({
  closeButton:{
    alignSelf:'flex-end',
    // width: 64,
    // margin: 5,
  }
});