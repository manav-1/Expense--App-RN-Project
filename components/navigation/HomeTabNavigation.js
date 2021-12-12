import React from 'react';
import { Text, StyleSheet, TouchableOpacity, View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/HomeScreen';
import Profile from '../screens/Profile';
import Expenses from '../screens/Expenses';
import Analytics from '../screens/Analytics';
// import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import PropTypes from 'prop-types';
import AsyncStorage from '@react-native-async-storage/async-storage';
// import firebase from "../FirebaseConfig";
import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';

const Tab = createBottomTabNavigator();
const handleLogout = async (navigation) => {
  try {
    await AsyncStorage.removeItem('expense_user');
    navigation.push('Login');
    // eslint-disable-next-line no-empty
  } catch (e) {}
};

const HomeTabNavigation = ({ navigation }) => {
  const [visible, setVisible] = React.useState(false);
  const [expenses, setExpenses] = React.useState([]);
  const [user, setUser] = React.useState(null);
  const [userId, setUserId] = React.useState(null);
  const setListener = async () => {
    setUser(auth().currentUser);
    const userId = auth().currentUser.uid;
    setUserId(userId);
    database()
      .ref(userId)
      .child(`/expenses/`)
      .on('value', (data) => {
        if (data.val()) {
          let values = { ...data.val() };
          let expenses = [];
          for (let key in values) {
            values[key]['key'] = key;
            values[key]['index'] = expenses.length;
            expenses.push(values[key]);
          }
          setExpenses(expenses);
        } else {
          setExpenses([]);
        }
      });
  };

  React.useEffect(() => {
    setListener();
    return () => database.ref(`/${userId}/expenses/`).off('value');
    // setUser(firebase.auth().currentUser);
  }, []);

  const addExpense = (item) => {
    // firebase.
    database().ref(`/${user.uid}/expenses/`).push(item);
  };
  const deleteExpense = (index) => {
    database()
      .ref(`/${user.uid}/expenses/`)
      .child(expenses[index].key)
      .remove();
  };

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveBackgroundColor: '#fff',
        tabBarActiveTintColor: '#000',
        tabBarInactiveBackgroundColor: '#fff',
        tabBarInactiveTintColor: '#0008',
        tabBarStyle: {
          borderRadius: 50,
          position: 'absolute',
          overflow: 'hidden',
          left: 15,
          bottom: 15,
          right: 15,
          padding: 5,
          height: 60
        }
      }}
    >
      <Tab.Screen
        tabBarColor="#f00"
        name="Home"
        options={{
          header: ({ route }) => (
            <View
              // colors={['#153759AA', '#fff']}
              style={styles.tabStyles}
            >
              <Text style={styles.tabBarTitle}>{route.name}</Text>
              <TouchableOpacity
                onPress={() => handleLogout(navigation)}
                style={styles.logoutButton}
              >
                <Ionicons name="log-out-outline" size={30} color="#fff" />
              </TouchableOpacity>
            </View>
          ),
          tabBarIcon: ({ focused, color, size }) =>
            !focused ? (
              <Ionicons size={size} color={color} name="home-outline" />
            ) : (
              <Ionicons size={size} color={color} name="home" />
            )
        }}
      >
        {(props) => (
          <HomeScreen
            {...props}
            expenses={expenses.filter(
              (item) => new Date(item.date).getMonth() === new Date().getMonth()
            )}
          />
        )}
      </Tab.Screen>
      <Tab.Screen
        name="Expenses"
        options={{
          header: ({ route }) => (
            <View
              // colors={['#153759AA', '#fff']}
              style={styles.tabStyles}
            >
              <Text style={styles.tabBarTitle}>{route.name}</Text>
              <TouchableOpacity
                style={[styles.logoutButton, { paddingLeft: 0 }]}
                onPress={() => setVisible(!visible)}
              >
                {!visible ? (
                  <Ionicons name="add" color="#fff" size={30} />
                ) : (
                  <Ionicons name="close" color="#fff" size={30} />
                )}
              </TouchableOpacity>
            </View>
          ),
          tabBarIcon: ({ focused, color, size }) =>
            !focused ? (
              <Ionicons size={size} color={color} name="card-outline" />
            ) : (
              <Ionicons size={size} color={color} name="card" />
            )
        }}
      >
        {(props) => (
          <Expenses
            key={expenses}
            {...props}
            visible={visible}
            setVisible={setVisible}
            expenses={expenses}
            addExpenses={addExpense}
            deleteExpenses={deleteExpense}
          />
        )}
      </Tab.Screen>

      <Tab.Screen
        name="Analytics"
        component={Analytics}
        options={{
          header: ({ route }) => (
            <View
              // colors={['#153759AA', '#fff']}
              style={styles.tabStyles}
            >
              <Text style={styles.tabBarTitle}>{route.name}</Text>
            </View>
          ),
          tabBarIcon: ({ focused, color, size }) =>
            !focused ? (
              <Ionicons size={size} color={color} name="analytics-outline" />
            ) : (
              <Ionicons size={size} color={color} name="analytics" />
            )
        }}
      />
      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{
          header: ({ route }) => (
            <View
              //  colors={['#153759AA', '#fff']}
              style={styles.tabStyles}
            >
              <Text style={styles.tabBarTitle}>{route.name}</Text>
            </View>
          ),
          tabBarIcon: ({ focused, color, size }) =>
            !focused ? (
              <Ionicons size={size} color={color} name="person-outline" />
            ) : (
              <Ionicons size={size} color={color} name="person" />
            )
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBarTitle: {
    fontSize: 25,
    padding: 10,
    margin: 5,
    color: '#fff',
    fontFamily: 'karla'
  },
  tabStyles: {
    // borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#181824'
  },
  logoutButton: {
    marginRight: 10,
    paddingLeft: 5,
    width: 45,
    height: 45,
    borderRadius: 25,
    backgroundColor: '#494c59',
    justifyContent: 'center',
    alignItems: 'center'
  }
});

HomeTabNavigation.propTypes = {
  navigation: PropTypes.object
};
export default HomeTabNavigation;
