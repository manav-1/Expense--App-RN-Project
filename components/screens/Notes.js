import React from 'react';
import { Text } from 'react-native';
import {
  GradientContainer,
  PaddedContainer
} from '../customComponents/styledComponents';

const Notes = () => {
  return (
    <GradientContainer>
      <PaddedContainer>
        <Text>Notes Screen</Text>
      </PaddedContainer>
    </GradientContainer>
  );
};

export default Notes;
