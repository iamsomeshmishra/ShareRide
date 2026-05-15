import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../constants/theme';

export default function NotificationsScreen() {
  const { colors, sizes } = useTheme();
  return (
    <View style={[styles.container, { backgroundColor: colors.white }]}>
      <Text style={[styles.title, { color: colors.black, fontSize: sizes.font_h3 }]}>Notifications</Text>
      <Text style={{ color: colors.bodyGray }}>No new notifications.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, justifyContent: 'center', alignItems: 'center' },
  title: { fontWeight: '700', marginBottom: 8 },
});
