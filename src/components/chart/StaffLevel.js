import React, { useRef, useEffect, useState } from 'react';
import { StyleSheet, View, Dimensions, Platform } from 'react-native';
import { SVGRenderer, SkiaChart, echarts } from '@wuba/react-native-echarts';
import moment from 'moment';
import NoData from '../NoData';

echarts.use([SVGRenderer]);
const E_HEIGHT = (Dimensions.get('window').width /100)*31;
const E_WIDTH = (Dimensions.get('window').width /100)*50;

export default function StaffLevel(props) {
  const { theme, levels } = props;
  const [chartWidth, setChartWidth] = useState(E_WIDTH);
  const [chartHeight, setChartHeight] = useState(E_HEIGHT);

  const skiaRef = useRef(null);
  const chartRef = useRef(null);
  // const handleLayout = (e) => {
  //   const { width, height } = e.nativeEvent.layout;
  //   setChartWidth(width);
  //   setChartHeight(height);
  // };

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
      xAxis: {
        min:0,
        max: 100,
        axisLabel:{
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
        axisLabel:{
          color:theme.colors.onSurface,
        },
      },
      series: [
        {
          type: 'bar',
          colorBy:'data',
          data: levels,
          encode: {
            // x: [1, 2],
            y: 0
          },
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
      chartRef.current = chart;
    }
    return () => chart?.dispose();
  }, [theme, levels]);

   // watching for size changes, redraw the chart.
   useEffect(() => {
    chartRef?.current.resize({
      width: chartWidth,
      height: chartHeight,
    });
  }, [chartWidth, chartHeight])
  
  return (
    <View style={styles.container}>
      <SkiaChart ref={skiaRef} useRNGH />    
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});