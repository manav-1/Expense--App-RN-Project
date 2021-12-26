import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import { capitalize } from 'lodash';
import { IconButton } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';

const CustomNote = ({ note, deleteNote }) => {
  const { note: noteText, date } = note;
  return (
    <View style={styles.note}>
      <View>
        <ExpandableText note={capitalize(noteText)} />
        <Text style={styles.dateText}>{date}</Text>
      </View>
      <IconButton
        icon={() => (
          <Ionicons name="close-circle-outline" size={22} color="#F05454" />
        )}
        onPress={deleteNote}
      />
    </View>
  );
};

const ExpandableText = ({ note }) => {
  const [nLines, setNLines] = React.useState(false);
  return (
    <Text
      style={styles.noteText}
      numberOfLines={nLines ? 0 : 1}
      onPress={() => setNLines(!nLines)}
    >
      {note.toString()}
    </Text>
  );
};

export default CustomNote;

const styles = StyleSheet.create({
  note: {
    backgroundColor: '#1e1e2d',
    borderColor: '#f2f2f2',
    borderWidth: 1.5,
    borderRadius: 5,
    padding: 10,
    marginVertical: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  noteText: {
    fontFamily: 'notoSans',
    fontSize: 18,
    color: '#fff',
    marginBottom: 5,
    width: 300
  },
  dateText: {
    fontFamily: 'notoSans',
    fontSize: 13,
    color: '#fff'
  }
});

CustomNote.propTypes = {
  note: PropTypes.object.isRequired,
  deleteNote: PropTypes.func
};
ExpandableText.propTypes = {
  note: PropTypes.string
};
