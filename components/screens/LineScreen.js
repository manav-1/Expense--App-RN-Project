import React from 'react';
import { View, Text, Dimensions, StyleSheet } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import PropTypes from 'prop-types';
import { LinearGradient } from 'expo-linear-gradient';
import { Text as TextSVG } from 'react-native-svg';

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
          .slice(1, 3)
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
  const screenWidth = Dimensions.get('screen').width - 20;
  const chartConfig = {
    backgroundGradientFrom: '#e1f8ff',
    backgroundGradientFromOpacity: 0,
    backgroundGradientTo: '#ffc290',
    backgroundGradientToOpacity: 0,
    color: () => `#000`, // optional
    strokeWidth: 1.5, // optional
    useShadowColorFromDataset: true, // optional
    propsForBackgroundLines: {
      strokeWidth: 1.5, // optional
      strokeDasharray: '' // solid background lines with no dashes
    }
  };
  return (
    <LinearGradient
      colors={['#e1f8ff', '#ffc290']}
      style={{ borderRadius: 20, height: 220 }}
    >
      <View
        style={{
          height: 220,
          width: '100%'
        }}
      >
        <Text style={styles.expenseText}>Expense Value</Text>
        <Text style={styles.dateText}>Dates</Text>
        <LineChart
          style={{
            borderRadius: 10,
            position: 'absolute',
            top: 10,
            left: -30
          }}
          data={data}
          width={screenWidth}
          height={200}
          fromZero={true}
          withInnerLines={false}
          bezier
          xLabelsOffset={-4}
          withHorizontalLabels={false}
          hidePointsAtIndex={[0, data.labels.length - 1]}
          renderDotContent={({ x, y, indexData, index }) => {
            return (
              <TextSVG
                key={index}
                x={x + 10}
                y={y}
                fill="black"
                fontSize={12}
                fontWeight="normal"
              >
                {indexData}₹
              </TextSVG>
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

const styles = StyleSheet.create({
  expenseText: {
    position: 'absolute',
    transform: [{ rotate: '-90deg' }],
    top: '45%',
    left: '-7%',
    fontSize: 12,
    fontFamily: 'poppinsBold'
  },
  dateText: {
    position: 'absolute',
    top: '92%',
    left: '48%',
    fontFamily: 'poppinsBold',
    fontSize: 12
  }
});
