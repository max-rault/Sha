import * as React from 'react';
import { ScrollView, View, StyleSheet, Platform, Linking } from 'react-native';
import { Appbar, Avatar, Button, Divider, Text } from 'react-native-paper';
import { TimePickerModal } from 'react-native-paper-dates';
import { Col, Grid, Row } from 'react-native-easy-grid';
import { Dropdown } from 'react-native-element-dropdown';
import { useDispatch, useSelector } from 'react-redux';
import { updateShift, fetchShifts } from '../store/actions/Shifts';
import { getStaffMembers } from '../store/actions/Staff';
import moment from 'moment';
import Loader from '../components/Loader';

export default function ShiftStaff(props){

  const {route, navigation, theme} = props
  const params = route.params
  const {id, date} = params
  console.log('id: ', id)
  let timePickerRef = React.useRef(null)
  // const { staffMembers, shifts } = useSelector(state => state.shifts);
  const { member } = useSelector(state => state.staff)
  const dispatch = useDispatch()
  const [visible, setVisible] = React.useState(false)
  const [shift, setShift] = React.useState({
    hours:0, 
    minutes:0, 
    type:undefined,
    id: id,
    date: date,
    index:0
  })
  const [ statusValue, setStatusValue ] = React.useState({})

  React.useEffect(()=>{
    const getMember = async () =>{
     await dispatch(getStaffMembers(id, date, dispatch))
    }
    getMember()

    if(member){
      setStatusValue({label: member.shifts[0].statusLabel, value:member.shifts[0].status})
    }
  },[dispatch])


  const onDismiss = React.useCallback(() => {
    setVisible(false)
  }, [setVisible])

  const onConfirm = React.useCallback(
    ({ hours, minutes }) => {
      const newShifts = moment(date).hours(hours).minutes(minutes).format()

      // updateShift(staffMembers, id, date, newShifts, newShifts, shift.index, shift.type, shifts)
      setVisible(false);
    },
    [setVisible, shift]
  );

  const statusCat = [
    {label: 'Actif', value: 'Active'},
    {label: 'Repos', value: 'Rest'},
    {label: 'Formation', value:'educational_training'},
    {label: 'Congés payés', value:'Paid_holidays'},
    {label: 'Absence Autorisée', value:'Absence_authorised'}
  ]
  if(member){
    return (
      <View style={{flex: 1}}>
       <Appbar.Header>
         <Appbar.BackAction onPress={()=>{
            dispatch(fetchShifts(staffMembers, date))
            navigation.goBack()
          }}/>
         <Appbar.Content title={`Planning de ${member.name} le ${moment(date).format('dddd DD MMMM YYYY')}`} />
       </Appbar.Header>
       <TimePickerModal
           ref={timePickerRef}
           visible={visible}
           locale='fr-FR'
           label="Sélectionner l'heure"
           cancelLabel='anuuler'
           confirmLabel='sauvegarder'
           onDismiss={onDismiss}
           onConfirm={onConfirm}
           hours={shift.hours}
           minutes={shift.minutes}
         />
        <Grid>
          <ScrollView>

            <Row  style={[styles.section, {alignSelf:'center'}]}>
              <Col>
                <Avatar.Image source={member.avatar} size={125} style={styles.avatar}/>
              </Col>
            </Row>

            <Row style={styles.section}>
              <Col>

                <Row size={1}>
                  <Col>
                    <Text style={styles.title}>Info sur {member.name}</Text>
                    <Divider style={styles.divider}/>
                  </Col>
                </Row>

                <Row size={3}>
                  <Col>
                    <Row style={styles.sectionItem}>
                      <Text variant='bodyMedium'>Age: </Text>
                      <Text variant='bodyMedium'>{member.age} ans</Text>
                    </Row>
                    <Row style={styles.sectionItem}>
                      <Text variant='bodyMedium'>Numero: </Text>
                      <Text variant='bodyMedium' onPress={()=> Linking.openURL('tel:0698951238')}>+33698951238</Text>
                    </Row>
                    <Row style={styles.sectionItem}>
                      <Text variant='bodyMedium'>Mail: </Text>
                      <Text variant='bodyMedium' onPress={()=> Linking.openURL('mailto:test@trucmuche.com')}>test@trucmuche.com</Text>
                    </Row>
                  </Col>
                  <Col>
                    <Row style={styles.sectionItem}>
                      <Text variant='bodyMedium'>Categorie: </Text>
                      <Text variant='bodyMedium'>{member.subCat}</Text>
                    </Row>
                    <Row style={styles.sectionItem}>
                      <Text variant='bodyMedium'>type de poste: </Text>
                      <Text variant='bodyMedium'>{member.categorie}</Text>
                    </Row>
                    <Row style={styles.sectionItem}>
                      <Text variant='bodyMedium'>Contrat: </Text>
                      <Text variant='bodyMedium'>{member.contractHours} h </Text>
                    </Row>
                    <Row style={styles.status}>
                      <Text style={styles.label} variant='bodyMedium' >Statut: </Text>
                      <Dropdown
                        style={styles.dropdown}
                        placeholderStyle={[styles.placeholderStyle,{color:theme.colors.onSurface}]}
                        selectedTextStyle={[styles.selectedTextStyle, {color:theme.colors.onSurface}]}
                        itemContainerStyle={{backgroundColor: theme.colors.background}}
                        activeColor="#611cd2bd"
                        containerStyle={{borderColor:theme.colors.background}}
                        itemTextStyle={{color:theme.colors.onSurface}}
                        data={statusCat}
                        maxHeight={200}
                        labelField="label"
                        valueField="value"
                        placeholder="Séléctionnez une catégorie"
                        value={statusValue}
                        onChange={item => {
                          setStatusValue(item)
                        }}
                      />
                    </Row>              
                  </Col>
                </Row>
                
              </Col>
            </Row>
              {
                statusValue.value === "Active" ?
                <Row style={styles.section}>
                  <Col>
                    <Text variant='bodyLarge' style={styles.title}>Shifts</Text>
                    <Divider style={styles.divider}/>
                    {member.shifts.map((shift, index) =>(
                      <Grid key={`shift-${index}-${member.name}`}>
                        <Row style={{alignItems:'center'}}>
                          <Text> shift {index+1} :</Text>
                          <Button 
                            style={{marginTop:0}}
                            onPress={() =>{
                              var ref
                              setShift({
                                hours: moment(shift.start).hour(), 
                                minutes: moment(shift.start).minute(), 
                                type:'start', 
                                id:id, 
                                date:date, 
                                index:index
                              })
                              timePickerRef.current = ref
                              setVisible(true)
                            }} 
                            icon='clock'
                          >
                            {moment(shift.start).format('HH:mm')}
                          </Button>
                          <Text>-</Text>
                          <Button 
                            style={{marginTop:0}}
                            onPress={() =>{
                              var ref
                              setShift({
                                hours: moment(shift.end).hour(), 
                                minutes: moment(shift.end).minute(), 
                                type:'end',
                                id:id, 
                                date:date , 
                                index:index
                              })
                              timePickerRef.current = ref
                              setVisible(true)
                            }} 
                            icon='clock'
                          >
                            {moment(shift.end).format('HH:mm')} 
                          </Button>
                        </Row>
                      </Grid>
                    ))}
                  </Col>
                </Row>
                :null
              }
          </ScrollView>
        </Grid>
      </View>
     );
  } else return <Loader/>
}

const styles = StyleSheet.create({
  // container:{
  //   marginHorizontal: 32,
  //   alignItems: 'center',
  //   justifyContent: 'center',
  // },
  // buttonHeader:{
  //   alignContent:'center', 
  //   alignItems:'center', 
  //   marginHorizontal:15
  // },
  dropdown: {
    flex:1,
    height: 25,
    borderBottomColor: 'gray',
    borderBottomWidth: 0.5,
  },
  divider:{
    alignSelf:'center',
    width: "75%",
    marginBottom:15
  },
  // icon: {
  //   marginRight: 5,
  // },
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 16,
  },
  // iconStyle: {
  //   width: 20,
  //   height: 20,
  // },
  section:{
    // alignSelf: 'center',
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
    // marginBottom: 20
  },
  avatar:{
    flex:1,
  },
  // input:{
  //   maxWidth:'15%', 
  //   height:15, 
  //   // flex:1, 
  //   justifyContent:'center',
  // },
  sectionItem:{
    paddingHorizontal: 50
  },
  // titleStyle:{
  // alignSelf:'center',
  // textAlign:'center'
  // }
});