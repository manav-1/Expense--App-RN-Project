import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import CustomExpense from './CustomExpense';
import PropTypes from 'prop-types';

const ExpenseAccordion = ({ title, expenses, deleteExpenses }) => {
  const [expanded, setExpanded] = React.useState(false);
  return (
    <View style={styles.accordionContainer}>
      <TouchableOpacity
        activeOpacity={1}
        onPress={() => setExpanded(!expanded)}
        style={styles.accordionButton}
      >
        <Text style={styles.accordionTitle}>{title}</Text>

        <Ionicons
          color="#fff"
          size={24}
          name={expanded ? 'chevron-up' : 'chevron-down'}
        />
      </TouchableOpacity>
      {expanded ? (
        <View
          style={[
            styles.accordionExpenseContainer,
            {
              justifyContent:
                expenses.length > 1 ? 'space-around' : 'flex-start'
            }
          ]}
        >
          {expenses.map((expense, index) => (
            <CustomExpense
              key={index}
              expense={expense}
              deleteItem={() => deleteExpenses(expense.index)}
            />
          ))}
        </View>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
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
  }
});

ExpenseAccordion.propTypes = {
  title: PropTypes.string,
  expenses: PropTypes.array,
  deleteExpenses: PropTypes.func
};

export default ExpenseAccordion;
