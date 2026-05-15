import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { useTheme } from '../constants/theme';
import { Card } from './Card';
import { MaterialIcons } from '@expo/vector-icons';

interface RideCardProps {
  riderName: string;
  riderRating: number;
  pickupTime: string;
  seatsLeft: number;
  totalSeats: number;
  pricePerSeat: number;
  onPress: () => void;
}

export const RideCard: React.FC<RideCardProps> = ({
  riderName,
  riderRating,
  pickupTime,
  seatsLeft,
  totalSeats,
  pricePerSeat,
  onPress,
}) => {
  const { colors, sizes, spacing } = useTheme();

  return (
    <Card onPress={onPress} style={styles.card}>
      <View style={styles.header}>
        <View style={[styles.avatar, { backgroundColor: colors.chipGray, borderRadius: 20 }]} />
        <View style={styles.riderInfo}>
          <Text style={[styles.name, { color: colors.black }]}>{riderName}</Text>
          <View style={styles.ratingRow}>
            <MaterialIcons name="star" size={14} color={colors.primary} />
            <Text style={[styles.rating, { color: colors.bodyGray }]}>{riderRating}</Text>
          </View>
        </View>
        <Text style={[styles.price, { color: colors.black }]}>₹{pricePerSeat}</Text>
      </View>

      <View style={styles.details}>
        <View style={styles.detailItem}>
          <MaterialIcons name="schedule" size={16} color={colors.bodyGray} />
          <Text style={[styles.detailText, { color: colors.bodyGray }]}>{pickupTime}</Text>
        </View>
        <View style={styles.detailItem}>
          <MaterialIcons name="event-seat" size={16} color={colors.bodyGray} />
          <Text style={[styles.detailText, { color: colors.bodyGray }]}>
            {seatsLeft}/{totalSeats} seats left
          </Text>
        </View>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatar: {
    width: 40,
    height: 40,
  },
  riderInfo: {
    flex: 1,
    marginLeft: 12,
  },
  name: {
    fontWeight: '600',
    fontSize: 16,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  rating: {
    fontSize: 12,
    marginLeft: 4,
  },
  price: {
    fontSize: 18,
    fontWeight: '700',
  },
  details: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    paddingTop: 12,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailText: {
    marginLeft: 8,
    fontSize: 14,
  },
});
