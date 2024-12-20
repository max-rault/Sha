import React, { useState, useEffect } from 'react';
import { FAB } from 'react-native-paper';
import { Row, Grid } from "react-native-easy-grid";
import { useDispatch, useSelector } from 'react-redux';
import { generateShifts, fetchShiftsByday } from '../store/actions/Shifts';
import CalendarStrip from 'react-native-calendar-strip';
import { Platform, StyleSheet, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import ShiftChart from '../components/chart/ShiftChart';
import Loader from '../components/Loader';
import moment from "moment";
import StaffList from '../components/StaffList';

export default function Shift(props){

  const locale ={
    name: 'fr',
    config:{
      months: 'Janvier_Février_Mars_Avril_Mai_Juin_Juillet_Août_Septembre_Octobre_Novembre_Décembre'.split(
        '_'
      ),
      monthsShort: 'Janv_Févr_Mars_Avr_Mai_Juin_Juil_Août_Sept_Oct_Nov_Déc'.split(
        '_'
      ),
      weekdays: 'Dimanche_Lundi_Mardi_Mercredi_Jeudi_Vendredi_Samedi'.split('_'),
      weekdaysShort: 'Dim_Lun_Mar_Mer_Jeu_Ven_Sam'.split('_'),
      weekdaysMin: 'Di_Lu_Ma_Me_Je_Ve_Sa'.split('_'),
      longDateFormat: {
        LT: 'HH:mm',
        LTS: 'HH:mm:ss',
        L: 'DD/MM/YYYY',
        LL: 'D MMMM YYYY',
        LLL: 'D MMMM YYYY LT',
        LLLL: 'dddd D MMMM YYYY LT'
      },
      calendar: {
        sameDay: "[Aujourd'hui à] LT",
        nextDay: '[Demain à] LT',
        nextWeek: 'dddd [à] LT',
        lastDay: '[Hier à] LT',
        lastWeek: 'dddd [dernier à] LT',
        sameElse: 'L'
      },
      relativeTime: {
        future: 'dans %s',
        past: 'il y a %s',
        s: 'quelques secondes',
        m: 'une minute',
        mm: '%d minutes',
        h: 'une heure',
        hh: '%d heures',
        d: 'un jour',
        dd: '%d jours',
        M: 'un mois',
        MM: '%d mois',
        y: 'une année',
        yy: '%d années'
      },
      ordinalParse: /\d{1,2}(er|ème)/,
      ordinal: function(number) {
        return number + (number === 1 ? 'er' : 'ème');
      },
      meridiemParse: /PD|MD/,
      isPM: function(input) {
        return input.charAt(0) === 'M';
      },
      // in case the meridiem units are not separated around 12, then implement
      // this function (look at locale/id.js for an example)
      // meridiemHour : function (hour, meridiem) {
      //     return /* 0-23 hour, given meridiem token and hour 1-12 */
      // },
      meridiem: function(hours, minutes, isLower) {
        return hours < 12 ? 'PD' : 'MD';
      },
      week: {
        dow: 1, // Monday is the first day of the week.
        doy: 4 // The week that contains Jan 4th is the first week of the year.
      }
    }
  }

  const { shifts, chartData, weekChartData } = useSelector(state => state.shifts);
  const { staffMembers, member } = useSelector(state => state.staff);
  const [ loading, setLoading ] = useState(false)
  const dispatch = useDispatch()

  const [date, setDate] = useState(moment().format())

  const customDatesStylesFunc = date => {
    if (date.isoWeekday() === 6 || date.isoWeekday() === 7) {
      return {
        dateNameStyle: {color: '#c90e02'},
        dateNumberStyle: {color: '#c90e02'},
        dateContainerStyle:  {color: 'yellow'},
      }
    }
  }
  const boxHeight = useSharedValue('0%');
  const fabOffset = useSharedValue('0%');

  const truncatedAnimation = useAnimatedStyle(() => {
    return {
      height: withTiming(boxHeight.value, {duration: 1000}),
    };
  }, []);

  const FabSlide = useAnimatedStyle(() => {
    return {
      bottom: withTiming(fabOffset.value, {duration: 1000}),
    };
  }, []);

  React.useEffect(()=>{
    const loadDayData = async () =>{
     await dispatch(fetchShiftsByday(dispatch, date, weekChartData))
    }
    loadDayData()
  },[dispatch, date])

  const dateChange = React.useCallback((date)=>{
    setDate(date)
    dispatch(fetchShiftsByday(dispatch, date, weekChartData))
  }, [dispatch])
  // const weekChange = React.useCallback((start, end) =>{
  //   const loadShifts = async () =>{
  //     await  dispatch(generateShifts(dispatch, moment(start).week()))
  //   }
  //   setDate(date)
  //   loadShifts()
  // },[dispatch])


  const closeStaffList = React.useCallback(()=>{
    boxHeight.value = '0%', fabOffset.value='0%'
  })
  const {theme} = props
  return (
    <Grid>
      <Row style={{height:Platform.OS === 'android' | Platform.OS === 'ios' ?75:null}} size={Platform.OS ==='web' ?15:null}>
        <CalendarStrip  
          calendarAnimation={{ type: 'sequence', duration: 30 }}
          innerStyle={{height:20}}
          showDayName={true}
          showMonth={true}
          showDate={true}
          showDayNumber={true}
          maxDayComponentSize={60}
          responsiveSizingOffset={10}
          daySelectionAnimation={{
            type: 'background',
            duration: 200,
            borderWidth: 1,
            borderHighlightColor: 'white',
          }}
          locale={locale}
          selectedDate={date}
          // onWeekChanged={weekChange}
          onDateSelected={dateChange}
          customDatesStyles={customDatesStylesFunc}
          style={{ width:'100%', height:75, flex:1}}
          calendarHeaderStyle={{ color: 'white' }}
          calendarColor={'#7743CE'}
          dateNumberStyle={{ color: 'white' }}
          dateNameStyle={{ color: 'white'}}
          weekendDateNumberStyle={{ color: '#f00'}}
          weekendDateNameStyle={{ color: '#f00'}}
          highlightDateNumberStyle={{ color: 'yellow' }}
          highlightDateNameStyle={{ color: 'yellow' }}
          disabledDateNameStyle={{ color: 'grey' }}
          disabledDateNumberStyle={{ color: 'grey' }}
          // iconContainer={{ flex: 0.1 }}
        />
      </Row>         
      <Row size={Platform.OS === 'web' ?85:null}>
        <ShiftChart shifts={chartData} theme={theme} date={date} loading={loading}/>
      </Row>
      <Animated.View style={[FabSlide, styles.AnimatedView]}>
        <FAB 
          icon='folder-account' 
          style={styles.fab} 
          onPress={()=>boxHeight.value === '0%' ? 
          (boxHeight.value = '50%', fabOffset.value='50%') : (boxHeight.value = '0%', fabOffset.value='0%')}
        />
      </Animated.View>
      <Animated.View style={[truncatedAnimation, {backgroundColor:theme.colors.background}, styles.AnimatedFlatList]}>
        <StaffList data={shifts} date={date} closeStaffList={closeStaffList} {...props}/>
      </Animated.View>
    </Grid>
  );
}

const styles = StyleSheet.create({
  fab:{
    maxWidth: 64,
    margin: 5,
    float:'left'
  },
  AnimatedFlatList: {
  //  flex:1,
   position:'absolute',
   bottom:0,
   width:'100%',
  //  zIndex:3,
   shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  AnimatedView: {
    //  flex:1,
     position:'absolute',
     bottom:0,
    //  width:'100%',
    //  zIndex:3,
  },
});