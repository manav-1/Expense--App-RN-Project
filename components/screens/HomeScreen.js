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
import Analytics from '../customComponents/Analytics';
import {
  GradientContainer,
  PaddedContainer,
  Title,
  CenteredKarlaText
} from '../customComponents/styledComponents';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

import database from '@react-native-firebase/database';
import auth from '@react-native-firebase/auth';
import { groupBy } from 'lodash';

const HomeScreen = ({ navigation }) => {
  const [expenses, setExpenses] = React.useState([]);
  const [user, setUser] = React.useState(null);

  const setListener = async () => {
    setUser(auth().currentUser);
    const userId = auth().currentUser.uid;
    database()
      .ref(userId)
      .child('/expenses/')
      .on('value', (data) => {
        if (data.val()) {
          let values = { ...data.val() };
          let expenses = [];
          for (let key in values) {
            values[key]['key'] = key;
            values[key]['index'] = expenses.length;
            expenses.push(values[key]);
          }
          setExpenses(
            expenses.filter(
              (item) => new Date(item.date).getMonth() === new Date().getMonth()
            )
          );
        } else {
          setExpenses([]);
        }
      });
  };

  React.useEffect(() => {
    setListener();
  }, []);
  React.useEffect(() => {
    (() => {
      navigation.addListener('beforeRemove', (e) => e.preventDefault());
    })();
  }, []);
  const groupByDates = () => {
    const groupedByDate = groupBy(
      expenses.filter((expense) => expense.type === 'Debit'),
      'date'
    );
    let obj = {};
    Object.keys(groupedByDate).forEach((key) => {
      obj[key] = Number(
        groupedByDate[key]
          .reduce((prev, cur) => Number(prev) + Number(cur.value), 0)
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
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginHorizontal: 20
            }}
          >
            <View>
              <CenteredKarlaText style={{ fontFamily: 'karlaMedium' }}>
                Credit
              </CenteredKarlaText>
              <CenteredKarlaText>
                {expenses
                  .filter((expense) => expense.type === 'Credit')
                  .reduce((prev, cur) => Number(prev) + Number(cur.value), 0)
                  .toFixed(2)
                  .replace(/\d(?=(\d{3})+\.)/g, '$&,')}
              </CenteredKarlaText>
            </View>
            <View>
              <CenteredKarlaText style={{ fontFamily: 'karlaMedium' }}>
                Debit
              </CenteredKarlaText>
              <CenteredKarlaText>
                {expenses
                  .filter((expense) => expense.type === 'Debit')
                  .reduce((prev, cur) => Number(prev) + Number(cur.value), 0)
                  .toFixed(2)
                  .replace(/\d(?=(\d{3})+\.)/g, '$&,')}
              </CenteredKarlaText>
            </View>
          </View>
        </LinearGradient>
        <View>
          <Text style={styles.heading}>
            <Ionicons name="wallet-outline" size={20} /> 7 Day Expense
          </Text>
          <LineChartScreen data={groupByDates()} />
        </View>
        <Analytics expenses={expenses} />

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
