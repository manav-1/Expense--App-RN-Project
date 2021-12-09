import * as React from 'react';
import {
  Text,
  StyleSheet,
  View,
  TouchableOpacity,
  ScrollView
} from 'react-native';
import PropTypes from 'prop-types';
import CustomExpense from '../customComponents/CustomExpense';
import LineChartScreen from './LineScreen';
import {
  GradientContainer,
  PaddedContainer,
  Title
} from '../customComponents/styledComponents';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { groupBy } from 'lodash';

const HomeScreen = ({ expenses, navigation }) => {
  React.useEffect(() => {
    (() => {
      navigation.addListener('beforeRemove', (e) => e.preventDefault());
    })();
  }, []);
  const groupByDates = () => {
    const groupedByDate = groupBy(expenses, 'date');
    let obj = {};
    Object.keys(groupedByDate).forEach((key) => {
      obj[key] = Number(
        groupedByDate[key]
          .reduce((prev, cur) => {
            if (cur.type === 'Credit') return Number(prev) + Number(cur.value);
            else if (cur.type === 'Debit')
              return Number(prev) - Number(cur.value);
          }, 0)
          .toFixed(2)
      );
    });
    if (Object.keys(obj).length > 7) {
      const sevenDay = {};
      Object.keys(obj).forEach((key) => {
        if (new Date().getDate() - new Date(key).getDate() <= 7) {
          sevenDay[key] = obj[key];
        }
      });
      return sevenDay;
    }
    return obj;
  };
  groupByDates();

  return (
    <GradientContainer>
      <PaddedContainer>
        <LinearGradient
          style={{ borderRadius: 20, padding: 10, marginHorizontal: 50 }}
          colors={['#ffc290', '#e1f8ff']}
          start={{ x: 0, y: 0.2 }}
          end={{ x: 1, y: 1 }}
        >
          <Text style={styles.light}>This Month&apos;s Money</Text>
          <View style={{ marginVertical: 10 }}>
            <View style={styles.oval}></View>
            <Title style={styles.money}>
              ₹
              {expenses
                .reduce((prev, cur) => {
                  if (cur.type === 'Credit')
                    return Number(prev) + Number(cur.value);
                  else if (cur.type === 'Debit')
                    return Number(prev) - Number(cur.value);
                }, 0)
                .toFixed(2)
                .replace(/\d(?=(\d{3})+\.)/g, '$&,')}
            </Title>
          </View>
        </LinearGradient>
        <View>
          <Text style={styles.heading}>
            <Ionicons name="wallet-outline" size={20} /> 7 Day Expense
          </Text>
          <LineChartScreen data={groupByDates()} />
        </View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            paddingHorizontal: 10,
            paddingVertical: 5
          }}
        >
          <Text
            style={[
              styles.heading,
              {
                textAlign: 'left',
                fontWeight: '600',
                fontFamily: 'karla',
                fontSize: 18,
                color: '#fff'
              }
            ]}
          >
            Recent Expenses
          </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Expenses')}>
            <Text
              style={[
                styles.heading,
                {
                  textAlign: 'left',
                  fontWeight: '600',
                  fontFamily: 'inter',
                  fontSize: 16
                }
              ]}
            >
              See All
              <Ionicons name="ios-arrow-forward" size={16} />
            </Text>
          </TouchableOpacity>
        </View>
        <ScrollView horizontal>
          {expenses.length > 5
            ? expenses
                .slice(0, 5)
                .map((expense, index) => (
                  <CustomExpense key={index} expense={expense} />
                ))
            : expenses.map((expense, index) => (
                <CustomExpense key={index} expense={expense} />
              ))}
        </ScrollView>
      </PaddedContainer>
    </GradientContainer>
  );
};
HomeScreen.propTypes = {
  navigation: PropTypes.object,
  expenses: PropTypes.array
};
export default HomeScreen;

const styles = StyleSheet.create({
  header: {
    color: '#000',
    fontSize: 30,
    fontFamily: 'readex',
    textAlign: 'left'
  },
  light: {
    textAlign: 'center',
    fontFamily: 'karla',
    fontSize: 16,
    color: '#000'
  },
  money: {
    color: '#000',
    fontSize: 45,
    fontFamily: 'readex',
    marginVertical: 5,
    letterSpacing: 0.1
  },
  oval: {
    width: 80,
    height: 80,
    borderWidth: 1.5,
    borderRadius: 120,
    transform: [{ scaleX: 3 }, { rotate: '30deg' }],
    position: 'absolute',
    left: 100,
    top: 5,
    borderColor: '#8f106033'
  },
  heading: {
    fontFamily: 'karla',
    fontSize: 22,
    textAlign: 'center',
    marginVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    color: '#fff'
  }
});
