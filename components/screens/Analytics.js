import React from 'react';
import { View, Text } from 'react-native';
import { GradientContainer } from '../customComponents/styledComponents';

const Analytics = () => {
  return (
    <GradientContainer>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ fontFamily: 'karla', fontSize: 22, color: '#fff' }}>
          Feature Coming Soon
        </Text>
      </View>
    </GradientContainer>
  );
};

export default Analytics;
