import React, { useRef, useEffect, useState } from 'react';
import { StyleSheet, View, Dimensions, Platform } from 'react-native';
import { SvgChart } from '@wuba/react-native-echarts';
import { GestureHandlerRootView } from 'react-native-gesture-handler';


const E_HEIGHT = Dimensions.get('window').height*0.5;
const E_WIDTH = Dimensions.get('window').width;

export default function ScheduleChart(props) {
  const { echarts, tasks } = props
  const skiaRef = useRef(null);
  const chartRef = useRef(null);

  const [chartWidth, setChartWidth] = useState(E_WIDTH);
  const [chartHeight, setChartHeight] = useState(E_HEIGHT);

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
  useEffect(()=>{
    const option = {
      tooltip: {},

      geo: {
        zoom:1.25,
        map: 'Test_map_bk_adobe',
        tooltip: {
          show: true
        },
      },
      series:[{
        type:'scatter',
        progressive:5000,
        coordinateSystem: 'geo',
        symbolSize:40,
        geoIndex: 0,
        data:tasks,
        animation:false,
        encode: {
          tooltip: 2
        },
      }]
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
  },[tasks])

    // watching for size changes, redraw the chart.
    useEffect(() => {
      chartRef?.current.resize({
        width: chartWidth,
        height: chartHeight,
      });
    }, [chartWidth, chartHeight])
  // console.log('task: ', tasks)
  return (
    <View onLayout={handleLayout} style={styles.container}>
      <SvgChart ref={skiaRef}/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});