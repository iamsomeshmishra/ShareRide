import React from 'react';
import { View, Text } from 'react-native';

const MapView = ({ children, style }) => (
  <View style={[{ backgroundColor: '#e0e0e0', justifyContent: 'center', alignItems: 'center' }, style]}>
    <Text>Map View Mock</Text>
    {children}
  </View>
);

const Marker = ({ children }) => <View>{children}</View>;
const Callout = ({ children }) => <View>{children}</View>;
const Polyline = () => null;
const Polygon = () => null;
const Circle = () => null;

MapView.Marker = Marker;
MapView.Callout = Callout;
MapView.Polyline = Polyline;
MapView.Polygon = Polygon;
MapView.Circle = Circle;

export { Marker, Callout, Polyline, Polygon, Circle };
export default MapView;
