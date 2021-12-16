import React from 'react';
import { Text, TouchableOpacity, View, StyleSheet } from 'react-native';
import {
  GradientContainer,
  PaddedContainer,
  ExpenseInput,
  CenteredKarlaText
} from '../customComponents/styledComponents';
// import DatePicker from 'react-native-datepicker';
import DatePicker from 'react-native-date-picker';
import { Snackbar } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import * as Yup from 'yup';
import PropTypes from 'prop-types';
import database from '@react-native-firebase/database';
import auth from '@react-native-firebase/auth';

const Notes = ({ notesVisible, setNotesVisible }) => {
  const [date, setDate] = React.useState(new Date());
  const [open, setOpen] = React.useState(false);
  const [note, setNote] = React.useState('');
  const [snackbarVisible, setSnackbarVisible] = React.useState(false);
  const [snackbarText, setSnackbarText] = React.useState('');
  const [user, setUser] = React.useState(null);
  const [notes, setNotes] = React.useState([]);

  const fetchData = () => {
    const userId = auth().currentUser.uid;
    database()
      .ref(userId)
      .child('/notes/')
      .once('value')
      .then((data) => {
        if (data.val()) {
          let values = { ...data.val() };
          let notes = [];
          for (let key in values) {
            values[key]['key'] = key;
            values[key]['index'] = notes.length;
            notes.push(values[key]);
          }
          setNotes(notes);
        } else {
          setNotes([]);
        }
      })
      .catch((err) => {
        setSnackbarVisible(true);
        setSnackbarText(err.message);
      });
  };

  React.useEffect(() => {
    setUser(auth().currentUser);
    fetchData();
  }, []);

  const addNote = (item) => {
    database().ref(`/${user.uid}/notes/`).push(item);
    fetchData();
  };
  const deleteNote = (index) => {
    database().ref(`/${user.uid}/notes/`).child(notes[index].key).remove();
  };

  return (
    <>
      <GradientContainer>
        <View
          // colors={['#153759AA', '#fff']}
          style={styles.tabStyles}
        >
          <Text style={styles.tabBarTitle}>Notes</Text>
          <TouchableOpacity
            style={[styles.logoutButton, { paddingLeft: 0 }]}
            onPress={() => setNotesVisible(!notesVisible)}
          >
            {!notesVisible ? (
              <Ionicons name="add" color="#fff" size={25} />
            ) : (
              <Ionicons name="close" color="#fff" size={25} />
            )}
          </TouchableOpacity>
        </View>
        <PaddedContainer>
          {notesVisible ? (
            <View
              style={{
                flexDirection: 'row',
                flexWrap: 'nowrap',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <ExpenseInput
                placeholder="Enter note Text"
                placeholderTextColor="#fff5"
                style={{ width: 230, borderBottomWidth: 1, color: '#f2f2f2' }}
                value={note}
                onChangeText={setNote}
              />
              <TouchableOpacity onPress={() => setOpen(true)}>
                <Text style={{ color: '#f2f2f2' }}>
                  {date.toLocaleDateString()}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={{
                  backgroundColor: '#ffc290',
                  padding: 10,
                  borderRadius: 10
                }}
                onPress={() => {
                  const values = { date: date.toLocaleDateString(), note };
                  const validationSchema = Yup.object({
                    date: Yup.date().required('Date is required'),
                    note: Yup.string().required('Note is required')
                  });
                  validationSchema
                    .validate(values)
                    .then(() => {
                      addNote(values);
                      setSnackbarVisible(true);
                      setSnackbarText('Added Successfully');
                      setNote('');
                      setDate(new Date());
                      setNotesVisible(false);
                    })
                    .catch((error) => {
                      setSnackbarVisible(true);
                      setSnackbarText(error.message);
                    });
                  setNotesVisible(false);
                }}
              >
                <CenteredKarlaText>
                  Save <Ionicons name="save-outline" size={14} />
                </CenteredKarlaText>
              </TouchableOpacity>
              <DatePicker
                modal
                open={open}
                date={date}
                mode="date"
                androidVariant="nativeAndroid"
                title="Select Completion Date"
                minimumDate={new Date()}
                onConfirm={(date) => {
                  setOpen(false);
                  setDate(date);
                }}
                onCancel={() => {
                  setOpen(false);
                }}
              />
            </View>
          ) : null}
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
    </>
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
    width: 40,
    height: 40,
    borderRadius: 25,
    backgroundColor: '#494c59',
    justifyContent: 'center',
    alignItems: 'center'
  }
});

Notes.propTypes = {
  notesVisible: PropTypes.bool,
  setNotesVisible: PropTypes.func
};

export default Notes;
