import React, { useCallback, useState } from "react";
import RangeSliderRN from "rn-range-slider";
import { View } from "react-native";
import { Text } from "react-native-paper";

import Rail from "./Rail";
import RailSelected from "./RailSelected";
import Thumb from "./Thumb";
import moment from "moment";
import { useEffect } from "react";

const RangeSlider = (props) => {
  const {data, theme, handleValueChange} = props

  const renderThumb = useCallback(() => <Thumb theme={theme} />, [theme]);
  const renderRail = useCallback(() => <Rail />, []);
  const renderRailSelected = useCallback(() => <RailSelected theme={theme} />, [theme]);

  return (
    <>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginVertical: 10
        }}
      >
        <View>
          <Text
            style={[
              { fontStyle: "italic" },
              { textAlign: "left"}
            ]}
          >
            Début
          </Text>
          <Text
            style={[{ fontWeight: "bold" }]}
          >
            {moment(data.low).format('HH:mm')}
          </Text>
        </View>
        <View>
          <Text
            style={[
              { fontStyle: "italic" },
              { textAlign: "right"}
            ]}
          >
            Fin
          </Text>
          <Text
            style={[{ fontWeight: "bold" }]}
          >
            {moment(data.high).format('HH:mm')}
          </Text>
        </View>
      </View>
      <RangeSliderRN
        min={data.min}
        max={data.max}
        low={data.low}
        high={data.high}
        valueType='time'
        textFormat='HH:mm'
        step={(60*1000)*15}
        renderThumb={renderThumb}
        renderRail={renderRail}
        renderRailSelected={renderRailSelected}
    
        onValueChanged={handleValueChange}
      />
    </>
  );
};

export default RangeSlider;
