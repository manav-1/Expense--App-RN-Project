import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  FlatList
} from 'react-native';
import SelectDropdown from 'react-native-select-dropdown';
import {
  GradientContainer,
  PaddedContainer,
  ExpenseInput
} from '../customComponents/styledComponents';
import PropTypes from 'prop-types';
import { Snackbar, ActivityIndicator, ProgressBar } from 'react-native-paper';
import * as Yup from 'yup';
import CustomExpense from '../customComponents/CustomExpense';
import ExpenseAccordion from '../customComponents/ExpenseAccordion';
import { Chip } from 'react-native-paper';
import { sample } from 'lodash';
import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';
// import DatePicker from 'react-native-date-picker';
import DatePicker from 'react-native-neat-date-picker';

// eslint-disable-next-line no-unused-vars
const Expenses = ({ navigation }) => {
  const sampleValues = {
    value: ['200', '400', '600', '800', '1000'],
    description: ['Food', 'Clothes', 'Transport', 'Entertainment', 'Others'],
    type: ['Credit', 'Debit'],
    way: ['Cash', 'Card', 'Bank Transfer', 'UPI', 'Cheque', 'Net Banking']
  };
  const [expenses, setExpenses] = React.useState([]);
  const [user, setUser] = React.useState(null);
  const [editKey, setEditKey] = React.useState(null);
  const [editable, setEditable] = React.useState(false);

  const [expense, setExpense] = React.useState({
    value: sample(sampleValues.value),
    description: sample(sampleValues.description),
    type: sample(sampleValues.type),
    way: sample(sampleValues.way),
    date: new Date()
  });
  const [showMore, setShowMore] = React.useState(false);
  const [snackbarVisible, setSnackbarVisible] = React.useState(false);
  const [snackbarText, setSnackbarText] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const [expensesToShow, setExpensesToShow] = React.useState(
    expenses.sort((a, b) => new Date(a.date) - new Date(b.date)).reverse()
  );
  //sorted by date
  const [open, setOpen] = React.useState(false);
  const [values, setValues] = React.useState('array');
  const [visible, setVisible] = React.useState(false);

  const fetchData = async () => {
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
          setExpenses(expenses);
          setValues('array');
          setExpensesToShow(expenses);
        } else {
          setExpenses([]);
          setValues('array');
        }
      });
    // .then()
    // .catch((err) => {
    //   setSnackbarVisible(true);
    //   setSnackbarText(err.message);
    // });
  };

  React.useEffect(() => {
    setUser(auth().currentUser);
    fetchData();
  }, []);

  const addExpenses = (item) => {
    // firebase.
    if (!editable) {
      database().ref(`/${user.uid}/expenses/`).push(item);
      setSnackbarText('Added Successfully');
      setVisible(false);
    } else {
      database().ref(`/${user.uid}/expenses/${editKey}`).set(item);
      setSnackbarText('Saved Successfully');
      setVisible(false);
    }
  };
  const deleteExpenses = (index) => {
    database()
      .ref(`/${user.uid}/expenses/`)
      .child(expenses[index].key)
      .remove();
  };
  const handleNewExpense = async () => {
    setIsLoading(true);
    const validationSchema = Yup.object({
      value: Yup.number().required('Please enter a value'),
      type: Yup.string().required('Please select an expense type'),
      way: Yup.string().required('Please select an expense way'),
      description: Yup.string().required('Please enter a description'),
      date: Yup.date().required('Please enter a date')
    });
    validationSchema
      .validate(expense)
      .then(() => {
        if (!editable)
          addExpenses({ ...expense, date: expense.date.toDateString() });
        else addExpenses({ ...expense });
        setExpense({
          value: sample(sampleValues.value),
          description: sample(sampleValues.description),
          type: sample(sampleValues.type),
          way: sample(sampleValues.way),
          date: new Date()
        });
        setEditable(false);
        setEditKey(null);
        setSnackbarVisible(true);
      })
      .catch((err) => {
        setSnackbarVisible(true);
        setSnackbarText(err.message);
      });
    setIsLoading(false);
  };
  const editExpense = async (expense) => {
    setVisible(true);
    setExpense({
      value: expense.value,
      description: expense.description,
      type: expense.type,
      way: expense.way,
      date: expense.date
    });
    setEditable(true);
    setEditKey(expense.key);
  };

  return (
    <>
      <GradientContainer>
        <View
          // colors={['#153759AA', '#fff']}
          style={styles.tabStyles}
        >
          <Text style={styles.tabBarTitle}>Expenses</Text>
          <TouchableOpacity
            style={[styles.logoutButton, { paddingLeft: 0 }]}
            onPress={() => setVisible(!visible)}
          >
            {!visible ? (
              <Ionicons name="add" color="#fff" size={25} />
            ) : (
              <Ionicons name="close" color="#fff" size={25} />
            )}
          </TouchableOpacity>
        </View>
        <PaddedContainer>
          <ScrollView horizontal>
            <Chip
              style={styles.chip}
              onPress={() => {
                setValues('array');
                setExpensesToShow(expenses);
              }}
              icon={() => <Ionicons name="wallet-outline" size={15} />}
            >
              All
            </Chip>
            <Chip
              style={styles.chip}
              onPress={() => {
                setValues('array');
                setExpensesToShow(expenses.filter((e) => e.type === 'Debit'));
              }}
              icon={() => <Ionicons name="trending-down-outline" size={15} />}
            >
              Debit
            </Chip>
            <Chip
              style={styles.chip}
              onPress={() => {
                setValues('array');
                setExpensesToShow(expenses.filter((e) => e.type === 'Credit'));
              }}
              icon={() => <Ionicons name="trending-up-outline" size={15} />}
            >
              Credit
            </Chip>
            <Chip
              style={styles.chip}
              onPress={() => {
                const initialValue = {};
                expenses.forEach((expense) => {
                  if (!initialValue[expense.way])
                    initialValue[expense.way] = [];
                  initialValue[expense.way].push(expense);
                });
                setValues('object');
                setExpensesToShow(initialValue);
              }}
              icon={() => <Ionicons name="enter-outline" size={15} />}
            >
              Expense Way
            </Chip>
            <Chip
              style={styles.chip}
              onPress={() => {
                const initialValue = {};
                expenses.forEach((expense) => {
                  if (!initialValue[expense.date])
                    initialValue[expense.date] = [];
                  initialValue[expense.date].push(expense);
                });
                setValues('object');
                setExpensesToShow(initialValue);
              }}
              icon={() => <Ionicons name="calendar-outline" size={15} />}
            >
              Date
            </Chip>
          </ScrollView>
          {visible ? (
            <View>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-around',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  marginTop: 20
                }}
              >
                <View>
                  <Text style={{ color: '#fff', fontFamily: 'karla' }}>
                    Expense Value
                  </Text>
                  <ExpenseInput
                    keyboardType="numeric"
                    value={expense.value}
                    onChangeText={(value) => setExpense({ ...expense, value })}
                    style={styles.expenseInput}
                    placeholder="Enter Expense Value"
                    placeholderTextColor="#fff5"
                  />
                </View>
                <View>
                  <Text style={{ color: '#fff', fontFamily: 'karla' }}>
                    Expense Description
                  </Text>

                  <ExpenseInput
                    value={expense.description}
                    onChangeText={(value) =>
                      setExpense({ ...expense, description: value })
                    }
                    style={styles.descriptionInput}
                    placeholder="Enter Description"
                    placeholderTextColor="#fff5"
                  />
                </View>
                <View style={{ padding: 10 }}>
                  <Text style={{ color: '#fff', fontFamily: 'karla' }}>
                    Expense Type
                  </Text>
                  <SelectDropdown
                    renderDropdownIcon={() => (
                      <Ionicons name="chevron-down" size={20} />
                    )}
                    dropdownOverlayColor="#161622AA"
                    defaultButtonText={`Expense Type`}
                    data={['Credit', 'Debit']}
                    dropdownStyle={styles.dropdownStyle}
                    buttonStyle={styles.button}
                    buttonTextStyle={styles.buttonText}
                    defaultValue={expense.type}
                    onSelect={(selectedItem) =>
                      setExpense({ ...expense, type: selectedItem })
                    }
                  />
                </View>

                <View style={{ padding: 10 }}>
                  <Text style={{ color: '#fff', fontFamily: 'karla' }}>
                    Expense Way
                  </Text>
                  <SelectDropdown
                    renderDropdownIcon={() => (
                      <Ionicons name="chevron-down" size={20} />
                    )}
                    dropdownOverlayColor="#506D8433"
                    defaultButtonText={`Expense Way`}
                    data={[
                      'Cash',
                      'Card',
                      'Bank Transfer',
                      'UPI',
                      'Cheque',
                      'Net Banking'
                    ]}
                    dropdownStyle={styles.dropdownStyle}
                    buttonStyle={styles.button}
                    defaultValue={expense.way}
                    buttonTextStyle={styles.buttonText}
                    onSelect={(selectedItem) =>
                      setExpense({ ...expense, way: selectedItem })
                    }
                  />
                </View>
                <View style={{ padding: 10 }}>
                  <Text style={{ color: '#fff', fontFamily: 'karla' }}>
                    Date
                  </Text>
                  <TouchableOpacity
                    style={[
                      styles.button,
                      { justifyContent: 'center', alignItems: 'center' }
                    ]}
                    onPress={() => setOpen(true)}
                  >
                    <Text style={{ color: 'black', fontFamily: 'karla' }}>
                      {expense.date.toDateString()}
                    </Text>
                  </TouchableOpacity>
                </View>

                {/* <DatePicker
                  modal
                  open={open}
                  date={expense.date}
                  mode="date"
                  androidVariant="iosClone"
                  title="Select Completion Date"
                  onConfirm={(date) => {
                    setOpen(false);
                    setExpense({ ...expense, date: date });
                  }}
                  onCancel={() => {
                    setOpen(false);
                  }}
                /> */}
                <DatePicker
                  isVisible={open}
                  mode={'single'}
                  onConfirm={(date) => {
                    setOpen(false);
                    setExpense({ ...expense, date: date });
                  }}
                  onCancel={() => {
                    setOpen(false);
                  }}
                />
              </View>
              <View style={{ position: 'absolute', right: 5, top: 5 }}>
                <TouchableOpacity
                  style={styles.addButton}
                  onPress={handleNewExpense}
                >
                  <Ionicons name="add" color="#000" size={25}></Ionicons>
                </TouchableOpacity>
              </View>
            </View>
          ) : null}
          {values == 'array' && expensesToShow.length > 0 ? (
            <FlatList
              data={!showMore ? expensesToShow.slice(0, 6) : expensesToShow}
              numColumns={2}
              renderItem={({ item }) => (
                <CustomExpense
                  expense={item}
                  editItem={() => editExpense(item)}
                  deleteItem={() => deleteExpenses(item.index)}
                />
              )}
            />
          ) : (
            Object.keys(expensesToShow).map((key, index) => {
              return (
                <ExpenseAccordion
                  title={key}
                  expenses={expensesToShow[key]}
                  deleteItem={deleteExpenses}
                  editItem={editExpense}
                  key={index}
                />
              );
            })
          )}
          <TouchableOpacity
            style={{
              alignSelf: 'flex-end',
              marginBottom: 15
            }}
            onPress={() => setShowMore(!showMore)}
          >
            {expensesToShow.length > 6 && values === 'array' ? (
              !showMore ? (
                <Text style={{ fontSize: 18, color: '#fff' }}>
                  Show More &nbsp;
                  <Ionicons name="chevron-down" size={20} />
                </Text>
              ) : (
                <Text style={{ fontSize: 18, color: '#fff' }}>
                  Show Less &nbsp;
                  <Ionicons name="chevron-up" size={20} />
                </Text>
              )
            ) : null}
          </TouchableOpacity>
          {isLoading ? <ActivityIndicator size={30} color="#f1c0cb" /> : null}
        </PaddedContainer>
      </GradientContainer>

      <Snackbar
        visible={snackbarVisible}
        duration={3000}
        style={{ backgroundColor: '#f1c0cb', marginBottom: 80 }}
        onDismiss={() => setSnackbarVisible(false)}
      >
        <Text style={{ color: '#000' }}>{snackbarText}</Text>
      </Snackbar>
      <ProgressBar visible={isLoading} indeterminate color="#ccf0fa" />
    </>
  );
};

const styles = StyleSheet.create({
  button: {
    padding: 0,
    height: 40,
    backgroundColor: '#ccf0fa',
    borderRadius: 10,
    marginVertical: 5,
    width: 160
  },
  buttonText: {
    color: '#000',
    fontSize: 16,
    fontFamily: 'karla',
    width: 100
  },
  expenseInput: {
    margin: null,
    width: 180,
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    color: '#ccf0fa',
    borderRadius: 1
  },
  addButtonText: {
    fontSize: 18,
    color: '#000',
    fontFamily: 'karla'
  },
  addButton: {
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ccf0fa',
    borderRadius: 15,
    paddingLeft: 1
  },
  dropdownStyle: {
    borderRadius: 5,
    backgroundColor: '#ccf0fa',
    elevation: 0,
    width: 135
    // padding: 2
  },
  descriptionInput: {
    width: 180,
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    borderRadius: 1,
    color: '#ccf0fa',
    marginHorizontal: 10
  },
  accordionButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  accordionTitle: {
    color: '#fff',
    fontFamily: 'karla',
    fontSize: 20,
    marginBottom: 10
  },
  accordionExpenseContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap'
  },
  accordionContainer: {
    marginVertical: 20
  },
  chip: {
    marginHorizontal: 8,
    marginBottom: 10
  },
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
    width: 40,
    height: 40,
    borderRadius: 25,
    backgroundColor: '#494c59',
    justifyContent: 'center',
    alignItems: 'center'
  }
});

Expenses.propTypes = {
  visible: PropTypes.bool,
  navigation: PropTypes.object,
  setVisible: PropTypes.func,
  expenses: PropTypes.array,
  deleteExpenses: PropTypes.func,
  addExpenses: PropTypes.func
};

export default Expenses;

{
  /* <View
              style={{
                flexDirection: 'row',
                flexWrap: 'wrap',
                justifyContent:
                  expensesToShow.length > 1 ? 'space-around' : 'flex-start'
              }}
            >
              {!showMore
                ? expensesToShow
                    .slice(0, 6)
                    .map((expense, index) => (
                      <CustomExpense
                        key={index}
                        expense={expense}
                        deleteItem={() => deleteExpenses(expense.index)}
                        editItem={() => editExpense(expense)}
                      />
                    ))
                : expensesToShow.map((expense, index) => (
                    <CustomExpense
                      key={index}
                      expense={expense}
                      deleteItem={() => deleteExpenses(expense.index)}
                      editItem={() => editExpense(expense)}
                    />
                  ))}
            </View> */
}
