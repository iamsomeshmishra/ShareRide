import React from 'react';
import { View, Text } from 'react-native';

const LottieView = ({ style }) => (
  <View style={[{ backgroundColor: '#f0f0f0', justifyContent: 'center', alignItems: 'center' }, style]}>
    <Text>Lottie Animation Mock</Text>
  </View>
);

export default LottieView;
