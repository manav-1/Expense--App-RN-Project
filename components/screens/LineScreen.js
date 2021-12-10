/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useRef, useState } from 'react';
// import * as React from 'react'
import { PanResponder, Dimensions, View } from 'react-native';
import { AreaChart, XAxis } from 'react-native-svg-charts';
import {
  Circle,
  Defs,
  G,
  Line,
  LinearGradient,
  Path,
  Rect,
  Stop,
  Text as SvgText
} from 'react-native-svg';
import * as shape from 'd3-shape';

export default InteractiveChart;

function InteractiveChart({ data }) {
  const apx = (size = 0) => {
    let width = Dimensions.get('window').width;
    return (width / 750) * size;
  };
  const dateList = Object.keys(
    Object.fromEntries(
      Object.entries(data).sort((a, b) => a[0].localeCompare(b[0]))
    )
  );
  const priceList = Object.values(
    Object.fromEntries(
      Object.entries(data).sort((a, b) => a[0].localeCompare(b[0]))
    )
  );
  const size = useRef(dateList.length);

  const [positionX, setPositionX] = useState(-1); // The currently selected X coordinate position

  const panResponder = useRef(
    // (evt, gestureState) => true
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onStartShouldSetPanResponderCapture: () => true,
      onMoveShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponderCapture: () => true,
      onPanResponderTerminationRequest: () => true,

      onPanResponderGrant: (evt) => {
        updatePosition(evt.nativeEvent.locationX);
        return true;
      },
      onPanResponderMove: (evt) => {
        updatePosition(evt.nativeEvent.locationX);
        return true;
      },
      onPanResponderRelease: () => {
        setPositionX(-1);
      }
    })
  );

  const updatePosition = (x) => {
    const YAxisWidth = apx(130);
    const x0 = apx(0);
    const chartWidth = apx(750) - YAxisWidth - x0;
    const xN = x0 + chartWidth;
    const xDistance = chartWidth / size.current;
    if (x <= x0) {
      x = x0;
    }
    if (x >= xN) {
      x = xN;
    }
    let value = ((x - x0) / xDistance).toFixed(0);
    if (value >= size.current - 1) {
      value = size.current - 1;
    }

    setPositionX(Number(value));
  };

  // const CustomGrid = ({ x, y, ticks }) => (
  //   <G>
  //     {ticks.map((tick) => (
  //       <Line
  //         key={tick}
  //         x1="0%"
  //         x2="100%"
  //         y1={y(tick)}
  //         y2={y(tick)}
  //         stroke="#EEF3F6"
  //       />
  //     ))}
  //     {priceList.map((_, index) => (
  //       <Line
  //         key={index.toString()}
  //         y1="0%"
  //         y2="100%"
  //         x1={x(index)}
  //         x2={x(index)}
  //         stroke="#EEF3F6"
  //       />
  //     ))}
  //   </G>
  // );

  const CustomLine = ({ line }) => (
    <Path key="line" d={line} stroke="pink" strokeWidth={apx(2)} fill="none" />
  );

  const CustomGradient = () => (
    <Defs key="gradient">
      <LinearGradient id="gradient" x1="0" y="0%" x2="0%" y2="100%">
        <Stop offset="0%" stopColor="#ffc290" stopOpacity={0.7} />
        <Stop offset="70%" stopColor="#e1f8ff" stopOpacity={0.5} />
        <Stop offset="100%" stopColor="#e1f8ff" stopOpacity={0.5} />
      </LinearGradient>
    </Defs>
  );

  const Tooltip = ({ x, y, ticks }) => {
    if (positionX < 0) {
      return null;
    }

    const date = dateList[positionX];

    return (
      <G x={x(positionX)} key="tooltip">
        <G
          x={positionX > size.current / 2 ? -apx(300 + 10) : apx(10)}
          y={y(priceList[positionX]) - apx(10)}
        >
          <Rect
            y={-apx(24 + 24 + 20) / 2}
            rx={apx(12)}
            ry={apx(12)}
            width={apx(300)}
            height={apx(96)}
            stroke="rgba(255, 192, 203, 0.27)"
            fill="rgba(255, 255, 255, 0.8)"
          />

          <SvgText x={apx(20)} fill="#617485" opacity={0.65} fontSize={apx(24)}>
            {date}
          </SvgText>
          <SvgText
            x={apx(20)}
            y={apx(24 + 20)}
            fontSize={apx(24)}
            fontWeight="bold"
            fill="#a85967"
          >
            ₹{priceList[positionX]}
          </SvgText>
        </G>

        <G x={x}>
          <Line
            y1={ticks[0]}
            y2={ticks[Number(ticks.length)]}
            stroke="#bf7783"
            strokeWidth={apx(4)}
            strokeDasharray={[6, 3]}
          />

          <Circle
            cy={y(priceList[positionX])}
            r={apx(20 / 2)}
            stroke="#fff"
            strokeWidth={apx(2)}
            fill="#bf7783"
          />
        </G>
      </G>
    );
  };

  const verticalContentInset = { top: apx(40), bottom: apx(40) };

  return (
    <View
      style={{
        backgroundColor: '#fff',
        alignItems: 'stretch',
        borderRadius: 20
      }}
    >
      <View
        style={{
          flexDirection: 'row',
          width: apx(700),
          height: apx(300),
          alignSelf: 'stretch',
          margin: 'auto'
        }}
      >
        <View
          style={{ flex: 1, marginHorizontal: 10, width: apx(750) }}
          {...panResponder.current.panHandlers}
        >
          <AreaChart
            style={{ flex: 1 }}
            data={priceList}
            curve={shape.curveNatural}
            // curve={shape.curveMonotoneX}
            contentInset={{ ...verticalContentInset }}
            svg={{ fill: 'url(#gradient)' }}
          >
            <CustomLine />
            <CustomGradient />
            <Tooltip />
          </AreaChart>
        </View>
      </View>
      <XAxis
        style={{
          alignSelf: 'stretch',
          // marginTop: apx(57),
          width: apx(750),
          height: apx(60)
        }}
        numberOfTicks={7}
        data={priceList}
        formatLabel={(value, index) => value}
        contentInset={{
          left: apx(40),
          right: apx(90)
        }}
        svg={{
          fontSize: apx(20),
          fill: '#bf7783',
          y: apx(20),
          fontWeight: '700',
          fontFamily: 'monospace'
          // originY: 30,
        }}
      />
    </View>
  );
}
