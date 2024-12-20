import React, { useRef, useEffect, useState } from 'react';
import { StyleSheet, View, Dimensions, Platform } from 'react-native';
import { SVGRenderer, SkiaChart, echarts } from '@wuba/react-native-echarts';
import moment from 'moment';
import NoData from '../NoData';
import Loader from '../Loader';

//ratio 2.14
echarts.use([SVGRenderer]);
const E_HEIGHT = Dimensions.get('window').height*0.9;
const E_WIDTH = Dimensions.get('window').width;

function renderItem(params, api) {
  var categoryIndex = api.value(0);
  var start = api.coord([api.value(1), categoryIndex]);
  var end = api.coord([api.value(2), categoryIndex]);
  var height = api.size([0, 1])[1] * 0.3;
  var rectShape = echarts.graphic.clipRectByRect(
    {
      x: start[0],
      y: start[1] - height / 2,
      width: end[0] - start[0],
      height: height,
    },
    {
      x: params.coordSys.x,
      y: params.coordSys.y,
      width: params.coordSys.width,
      height: params.coordSys.height,
    }
  );
  return (
    rectShape && {
      type: 'rect',
      transition: ['shape'],
      shape: {
        ...rectShape,
        r:25
      },
      style: api.style()
    }
  );
}

export default function ShiftChart(props) {
  const { theme, shifts, date } = props;
  const [chartWidth, setChartWidth] = useState(400);
  const [chartHeight, setChartHeight] = useState(300);
  const minDate = moment(date).hours(7).format()
  const maxDate = moment(date).hours(24).format()
  console.log('unix min: ', minDate)
  console.log('unix max: ', maxDate)

  const skiaRef = useRef(null);
  const chartRef = useRef(null);
  const handleLayout = (e) => {
    const { width, height } = e.nativeEvent.layout;
    setChartWidth(width);
    setChartHeight(height);
  };

  // Screen orientation change event
  const handleDimensionsChange = (e) => {
    const { width, height } = e.screen;
    setChartWidth(width);
    setChartHeight(height);
  };

  useEffect(() => {
    if(Platform.OS === 'android' | Platform.OS==='ios'){
      Dimensions.addEventListener("change", handleDimensionsChange);
    }
  }, []);

  useEffect(() => {
    
    const option = {
      grid: { 
        containLabel: true,
        left:Platform.OS === 'android'| 'ios' ?0:'5%',
        top:10,
        bottom:10
        // right:0
      },
      tooltip: {
        formatter: function (params) {
          return params.marker +  params.name + ': ' + moment(params.value[1]).format('HH:mm')  +'-'+moment(params.value[2]).format('HH:mm');
        }
      },
      xAxis: {
        position:'top',
        type:'time',
        min: moment(minDate).format(),
        max: moment(maxDate).format(),
        minInterval: (3600*1000)*1,
        maxInterval: (3600*1000)*1,
        // scale:false,
        axisLabel: {
          color:theme.colors.onSurface, 
        },
        axisLine:{
          show: true
        },
        axisTick:{
          show: true
        },
      },
      yAxis: {
        type: 'category',
        boundaryGap: [0, '100%'],
        splitLine: {
          show: false
        },
        axisLabel:{
          color:theme.colors.onSurface,
          // fontSize: Platform.OS === 'ios' | Platform.OS === 'android' ?10:14,
          // padding:[0,0,0,20],
        },
      },
      dataZoom: [
        // {
        //   type: 'slider',
        //   show: false,
        //   xAxisIndex: [0],
        //   rangeMode:['value', 'value'],
        //   startValue: period.start,
        //   endValue: period.end,
        //   brushSelect:false,
        //   labelFormatter: (value) =>{
        //     return moment(value).format('HH:mm')
        //   }
        // },
        {
          type: 'slider',
          yAxisIndex: [0],
          zoomLock: true,
          brushSelect:false,
          width: 10,
          right: 10,
          top: 70,
          bottom: 20,
          start: 0,
          end: 50,
          // handleSize: 0,
          showDetail: false
        },
        // {
        //   type: 'inside',
        //   xAxisIndex: 0,
        //   filterMode: 'weakFilter',
        //   start: 0,
        //   end: 26
        // },
        {
          type: 'inside',
          yAxisIndex: [0],
          filterMode: 'weakFilter',
          zoomOnMouseWheel: false,
          moveOnMouseMove: true,
          moveOnMouseWheel: true,
          start: 0,
          end: 100
        }
      ],
      series: [
        {
          type: 'custom',
          colorBy:'data',
          renderItem: renderItem,
          itemStyle: {
            opacity: 0.8,
            borderCap: "round",
            width:5
          },
          encode: {
            x: [1, 2],
            y: 0
          },
          data: shifts,
        }
      ]
    };
    let chart
    if (skiaRef.current) {
      chart = echarts.init(skiaRef.current, 'light', {
        renderer: 'svg',
        width: chartWidth,
        height: chartHeight,
      });
      chart.setOption(option);
      // chart.showLoading()
      chartRef.current = chart;
    }
    return () => chart?.dispose();
  }, [theme, shifts]);

   // watching for size changes, redraw the chart.
   useEffect(() => {
    if(shifts.length>0){

      chartRef?.current.resize({
        width: chartWidth,
        height: chartHeight,
      });
      
    }
  }, [chartWidth, chartHeight])
  
  if(shifts.length>0){
    return (
      <View  onLayout={handleLayout} style={styles.container}>
        <SkiaChart ref={skiaRef} useRNGH />    
      </View>
    );
  } else return <NoData/>
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});