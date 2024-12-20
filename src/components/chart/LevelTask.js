import React, { useRef, useEffect, useState } from 'react';
import { StyleSheet, View, Dimensions, Platform } from 'react-native';
import { SVGRenderer, SkiaChart, echarts } from '@wuba/react-native-echarts';

echarts.use([SVGRenderer]);
// const E_WIDTH = Dimensions.get('window').width * 0.8;
const E_HEIGHT = (Dimensions.get('window').width /100)*15.5;
const E_WIDTH = (Dimensions.get('window').width /100)*50;

export default function LevelTask(props) {
  const {theme, task} = props;
  const [chartWidth, setChartWidth] = useState(E_WIDTH);
  const [chartHeight, setChartHeight] = useState(E_HEIGHT);
  const skiaRef = useRef(null);
  const chartRef = useRef(null);

  // const handleLayout = (e) => {
  //   const { width, height } = e.nativeEvent.layout;
    
  //   setChartWidth(width);
  //   if(height === 0){
  //     setChartHeight(400)
  //   } else  setChartHeight(height);
   
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
      series: [
        {
          type: 'gauge',
          startAngle: 180,
          endAngle: 0,
          center: ['50%', '75%'],
          radius: '90%',
          min: 0,
          max: 1,
          splitNumber: 8,
          axisLine: {
            lineStyle: {
              width: 6,
              color: [
                [0.25, '#FF6E76'],
                [0.5, '#FDDD60'],
                [0.75, '#58D9F9'],
                [1, '#7CFFB2']
              ]
            }
          },
          pointer: {
            icon: 'path://M12.8,0.7l12,40.1H0.7L12.8,0.7z',
            length: '12%',
            width: 5,
            offsetCenter: [0, '-60%'],
            itemStyle: {
              color: 'auto'
            }
          },
          axisTick: {
            length: 12,
            lineStyle: {
              color: 'auto',
              width: 2
            }
          },
          splitLine: {
            length: 20,
            lineStyle: {
              color: 'auto',
              width: 5
            }
          },
          axisLabel: {
            color: theme.colors.onSurface,
            distance: -60,
            rotate: 'tangential',
            formatter: function (value) {
              if (value === 0.875) {
                return 'Maitrise';
              } else if (value === 0.625) {
                return 'Expert';
              } else if (value === 0.375) {
                return 'Moyen';
              } else if (value === 0.125) {
                return 'Débutant';
              }
              return '';
            }
          },
          title: {
            offsetCenter: [0, '-10%'],
            color:theme.colors.onSurface
          },
          detail: {
            offsetCenter: [0, '-35%'],
            valueAnimation: true,
            formatter: function (value) {
              return Math.round(value * 100) + ' %';
            },
            color: 'inherit'
          },
          data: [
            {
              value: task?.value,
              name: task?.label
            }
          ]
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
  }, [theme, task]);

   // watching for size changes, redraw the chart.
   useEffect(() => {
    chartRef?.current.resize({
      width: chartWidth,
      height: chartHeight,
    });
  }, [chartWidth, chartHeight])
  return (
    <View style={styles.container}>
      <SkiaChart ref={skiaRef} useRNGH/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // alignItems: 'center',
    // justifyContent: 'center',
  },
});