import React from 'react';
import { View, Text, Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import PropTypes from 'prop-types';
import { LinearGradient } from 'expo-linear-gradient';

const LineScreen = (props) => {
  const values = props.data;
  const dateList = Object.keys(
    Object.fromEntries(
      Object.entries(values).sort((a, b) => a[0].localeCompare(b[0]))
    )
  );
  const priceList = Object.values(
    Object.fromEntries(
      Object.entries(values).sort((a, b) => a[0].localeCompare(b[0]))
    )
  );
  const data = {
    labels: [
      '',
      ...dateList.map((item) =>
        new Date(item)
          .toLocaleString('default', { month: 'long' })
          .split(' ')
          .slice(0, 3)
          .reverse()
          .join(' ')
      ),
      ''
    ],
    datasets: [
      {
        data: [
          0,
          ...priceList,
          Math.min(...priceList) > 0 ? 0 : Math.min(...priceList)
        ]
      }
    ]
    //legend: ['Expenses'] optional
  };
  const screenWidth = Dimensions.get('screen').width - 30;
  const chartConfig = {
    backgroundGradientFrom: '#e1f8ff',
    backgroundGradientFromOpacity: 0,
    backgroundGradientTo: '#ffc290',
    backgroundGradientToOpacity: 0,
    color: () => `#000`, // optional
    strokeWidth: 2, // optional
    useShadowColorFromDataset: true, // optional
    propsForBackgroundLines: {
      strokeWidth: 2, // optional
      strokeDasharray: '' // solid background lines with no dashes
    }
  };
  return (
    <LinearGradient
      colors={['#e1f8ff', '#ffc290']}
      style={{ borderRadius: 20, height: 220 }}
    >
      <View>
        <LineChart
          style={{
            borderRadius: 10,
            position: 'absolute',
            top: 10,
            left: -35
          }}
          data={data}
          width={screenWidth}
          height={220}
          fromZero={true}
          withInnerLines={false}
          // withOuterLines={false}
          yLabelsOffset={10}
          withHorizontalLabels={false}
          hidePointsAtIndex={[0, data.labels.length - 1]}
          renderDotContent={({ x, y, indexData }) => {
            return (
              <Text
                key={indexData + x + y}
                style={{
                  position: 'absolute',
                  top: y - 20,
                  left: x - 5,
                  fontFamily: 'karla',
                  fontSize: 12,
                  color: '#000'
                }}
              >
                {indexData.toFixed(1)}
              </Text>
            );
          }}
          chartConfig={chartConfig}
        />
      </View>
    </LinearGradient>
  );
};

export default LineScreen;
LineScreen.propTypes = {
  props: PropTypes.object,
  data: PropTypes.object
};

// import React from 'react';
// import { View, Text } from 'react-native';

// const LineScreen = () => {
//   return (
//     <View>
//       <Text>Line Screen</Text>
//     </View>
//   );
// };

// export default LineScreen;
