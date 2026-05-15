import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, Alert, Image, ActivityIndicator, Modal, SafeAreaView, Dimensions } from 'react-native';
import { useTheme } from '../../constants/theme';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Button } from '../../components/Button';
import { useStripe } from '@stripe/stripe-react-native';
import { rideService } from '../../services/rideService';
import { useAuthStore } from '../../store/useAuthStore';
import { Ride } from '../../types/ride';

const { width } = Dimensions.get('window');

export default function RideDetailsScreen({ route, navigation }: any) {
  const { rideId, initialRide } = route.params || {};
  const [ride, setRide] = useState<Ride | null>(initialRide || null);
  const { colors, sizes, shadows, spacing } = useTheme();
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(!initialRide);
  const [showRating, setShowRating] = useState(false);
  const [rating, setRating] = useState(0);

  useEffect(() => {
    if (!rideId) return;
    const fetchRide = async () => {
      try {
        const details = await rideService.getRideDetails(rideId);
        setRide(details);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchRide();
  }, [rideId]);

  const isRider = user?.id === ride?.riderId;

  const handleStartRide = async () => {
    if (!ride) return;
    try {
      setLoading(true);
      await rideService.updateRide(ride.id, { status: 'ongoing' });
      Alert.alert('Success', 'Ride started!');
      navigation.navigate('LiveTracking', { rideId: ride.id, initialRide: { ...ride, status: 'ongoing' } });
    } catch (err) {
      Alert.alert('Error', 'Failed to start ride');
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteRide = async () => {
    if (!ride) return;
    try {
      setLoading(true);
      await rideService.updateRide(ride.id, { status: 'completed' });
      setShowRating(true);
    } catch (err) {
      Alert.alert('Error', 'Failed to complete ride');
    } finally {
      setLoading(false);
    }
  };

  const submitRating = () => {
    Alert.alert('Success', 'Thank you for your feedback!');
    setShowRating(false);
    navigation.navigate('Home');
  };

  const initializePaymentSheet = async () => {
    if (!ride) return;
    setLoading(true);
    // Simulate payment sheet initialization
    setTimeout(async () => {
      const { error } = await initPaymentSheet({
        merchantDisplayName: 'ShareRide',
        paymentIntentClientSecret: 'pi_test_secret',
        allowsDelayedPaymentMethods: true,
      });
      if (!error) {
        openPaymentSheet();
      } else {
        // Fallback for simulation
        openPaymentSheet();
      }
      setLoading(false);
    }, 1000);
  };

  const openPaymentSheet = async () => {
    if (!ride) return;
    
    try {
      setLoading(true);
      await rideService.bookRide({
        rideId: ride.id,
        passengerId: user?.id || 'unknown',
        passengerName: user?.name || 'Guest',
        seatsBooked: 1,
        totalPrice: ride.pricePerSeat,
        status: 'pending',
      } as any);
      Alert.alert('Success', 'Ride booked successfully!');
      navigation.navigate('Home');
    } catch (err) {
      Alert.alert('Error', 'Failed to book ride');
    } finally {
      setLoading(false);
    }
  };

  if (loading && !ride) {
    return (
      <View style={[styles.centered, { backgroundColor: colors.white }]}>
        <ActivityIndicator size="large" color={colors.black} />
      </View>
    );
  }

  if (!ride) return null;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.white }]}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
            <Icon name="arrow-left" size={24} color={colors.black} />
          </Pressable>
          <Text style={[styles.title, { color: colors.black, fontSize: sizes.font_h4 }]}>Ride Details</Text>
          <View style={[styles.statusBadge, { backgroundColor: colors.gray100, borderRadius: sizes.radius_pill }]}>
            <Text style={[styles.statusText, { color: colors.black, fontSize: sizes.font_micro }]}>
              {ride.status.toUpperCase()}
            </Text>
          </View>
        </View>

        <View style={[styles.card, { backgroundColor: colors.white, borderRadius: sizes.radius_lg, ...shadows.light }]}>
          <View style={styles.routeSection}>
            <View style={styles.routePoint}>
              <View style={[styles.dot, { backgroundColor: colors.black }]} />
              <View style={[styles.line, { backgroundColor: colors.gray200 }]} />
              <View style={[styles.square, { borderColor: colors.black, backgroundColor: colors.white, borderWidth: 2 }]} />
            </View>
            <View style={styles.routeText}>
              <View>
                <Text style={[styles.label, { color: colors.gray500 }]}>Pickup</Text>
                <Text style={[styles.address, { color: colors.black }]} numberOfLines={2}>{ride.pickup.address}</Text>
              </View>
              <View style={{ height: 40 }} />
              <View>
                <Text style={[styles.label, { color: colors.gray500 }]}>Destination</Text>
                <Text style={[styles.address, { color: colors.black }]} numberOfLines={2}>{ride.destination.address}</Text>
              </View>
            </View>
          </View>

          <View style={[styles.divider, { backgroundColor: colors.gray100 }]} />

          <View style={styles.detailsGrid}>
            <View style={styles.detailItem}>
              <Icon name="calendar-range" size={20} color={colors.black} />
              <View style={styles.detailText}>
                <Text style={[styles.label, { color: colors.gray500 }]}>Date</Text>
                <Text style={[styles.value, { color: colors.black }]}>{ride.date}</Text>
              </View>
            </View>
            <View style={styles.detailItem}>
              <Icon name="clock-outline" size={20} color={colors.black} />
              <View style={styles.detailText}>
                <Text style={[styles.label, { color: colors.gray500 }]}>Time</Text>
                <Text style={[styles.value, { color: colors.black }]}>{ride.time}</Text>
              </View>
            </View>
            <View style={styles.detailItem}>
              <Icon name="account-group-outline" size={20} color={colors.black} />
              <View style={styles.detailText}>
                <Text style={[styles.label, { color: colors.gray500 }]}>Seats</Text>
                <Text style={[styles.value, { color: colors.black }]}>{ride.availableSeats} / {ride.totalSeats}</Text>
              </View>
            </View>
            <View style={styles.detailItem}>
              <Icon name="tag-outline" size={20} color={colors.black} />
              <View style={styles.detailText}>
                <Text style={[styles.label, { color: colors.gray500 }]}>Price</Text>
                <Text style={[styles.value, { color: colors.black }]}>₹{ride.pricePerSeat}</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.riderSection}>
          <Text style={[styles.sectionTitle, { color: colors.black, fontSize: sizes.font_h5 }]}>Your Rider</Text>
          <View style={[styles.riderCard, { backgroundColor: colors.white, borderRadius: sizes.radius_md, borderWidth: 1, borderColor: colors.gray100 }]}>
            <Image 
              source={{ uri: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=100' }} 
              style={[styles.avatar, { borderRadius: 24 }]} 
            />
            <View style={styles.riderInfo}>
              <Text style={[styles.riderName, { color: colors.black }]}>{ride.riderName}</Text>
              <View style={styles.ratingRow}>
                <Icon name="star" size={14} color={colors.black} />
                <Text style={[styles.ratingText, { color: colors.black }]}>4.8 • 124 rides</Text>
              </View>
            </View>
            <Pressable style={[styles.contactButton, { backgroundColor: colors.gray50 }]}>
              <Icon name="message-outline" size={20} color={colors.black} />
            </Pressable>
          </View>
        </View>

        <View style={styles.safetySection}>
          <View style={[styles.safetyCard, { backgroundColor: colors.gray50, borderRadius: sizes.radius_md }]}>
            <Icon name="shield-check" size={24} color={colors.black} />
            <View style={styles.safetyInfo}>
              <Text style={[styles.safetyTitle, { color: colors.black }]}>ShareRide Safety</Text>
              <Text style={[styles.safetyDesc, { color: colors.gray600 }]}>Verified riders and 24/7 support for a secure journey.</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      <View style={[styles.footer, { backgroundColor: colors.white, borderTopColor: colors.gray100 }]}>
        <View style={styles.priceContainer}>
          <Text style={[styles.totalLabel, { color: colors.gray500 }]}>Total Fare</Text>
          <Text style={[styles.totalValue, { color: colors.black }]}>₹{ride.pricePerSeat}</Text>
        </View>
        {isRider ? (
          <View style={styles.actionButtons}>
            {ride.status === 'active' && (
              <Button title="Start Ride" onPress={handleStartRide} variant="primary" loading={loading} style={styles.mainButton} />
            )}
            {ride.status === 'ongoing' && (
              <Button title="Complete Ride" onPress={handleCompleteRide} variant="primary" loading={loading} style={styles.mainButton} />
            )}
            <Button 
              title="Cancel" 
              onPress={() => Alert.alert('Cancel', 'Are you sure?')} 
              variant="outline" 
              style={styles.mainButton}
            />
          </View>
        ) : (
          <Button 
            title={ride.availableSeats > 0 ? "Book Now" : "Fully Booked"} 
            onPress={initializePaymentSheet} 
            variant="primary" 
            disabled={ride.availableSeats === 0}
            loading={loading}
            style={styles.mainButton}
          />
        )}
      </View>

      <Modal visible={showRating} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.white }]}>
            <View style={[styles.modalHandle, { backgroundColor: colors.gray200 }]} />
            <Text style={[styles.modalTitle, { color: colors.black }]}>Rate your trip</Text>
            <Text style={[styles.modalSub, { color: colors.gray500 }]}>How was your ride with {ride.riderName}?</Text>
            <View style={styles.starsRow}>
              {[1, 2, 3, 4, 5].map((s) => (
                <Pressable key={s} onPress={() => setRating(s)} style={styles.starPressable}>
                  <Icon 
                    name={s <= rating ? "star" : "star-outline"} 
                    size={42} 
                    color={colors.black} 
                  />
                </Pressable>
              ))}
            </View>
            <Button title="Submit Feedback" onPress={submitRating} variant="primary" style={{ width: '100%', marginTop: 32 }} />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  scrollContent: { padding: 20, paddingBottom: 140 },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 24, justifyContent: 'space-between' },
  backButton: { padding: 4 },
  title: { fontWeight: '800', flex: 1, marginLeft: 12 },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4 },
  statusText: { fontWeight: '700' },
  card: { padding: 20, marginBottom: 24 },
  routeSection: { flexDirection: 'row' },
  routePoint: { alignItems: 'center', width: 20, marginRight: 16 },
  dot: { width: 8, height: 8, borderRadius: 4, marginTop: 6 },
  line: { width: 2, flex: 1, marginVertical: 4 },
  square: { width: 10, height: 10, marginBottom: 6 },
  routeText: { flex: 1 },
  label: { fontSize: 12, fontWeight: '600', marginBottom: 4, textTransform: 'uppercase', letterSpacing: 0.5 },
  address: { fontSize: 16, fontWeight: '600', lineHeight: 22 },
  divider: { height: 1, marginVertical: 20 },
  detailsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 20 },
  detailItem: { width: (width - 100) / 2, flexDirection: 'row', alignItems: 'center' },
  detailText: { marginLeft: 12 },
  value: { fontSize: 15, fontWeight: '700' },
  riderSection: { marginBottom: 24 },
  sectionTitle: { fontWeight: '800', marginBottom: 16 },
  riderCard: { flexDirection: 'row', alignItems: 'center', padding: 16 },
  avatar: { width: 48, height: 48 },
  riderInfo: { flex: 1, marginLeft: 16 },
  riderName: { fontSize: 16, fontWeight: '700' },
  ratingRow: { flexDirection: 'row', alignItems: 'center', marginTop: 2 },
  ratingText: { fontSize: 13, marginLeft: 4 },
  contactButton: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
  safetySection: { marginBottom: 24 },
  safetyCard: { flexDirection: 'row', alignItems: 'center', padding: 16 },
  safetyInfo: { flex: 1, marginLeft: 16 },
  safetyTitle: { fontSize: 15, fontWeight: '700' },
  safetyDesc: { fontSize: 13, marginTop: 2, lineHeight: 18 },
  footer: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: 20, borderTopWidth: 1, flexDirection: 'row', alignItems: 'center' },
  priceContainer: { marginRight: 24 },
  totalLabel: { fontSize: 12, fontWeight: '600', textTransform: 'uppercase' },
  totalValue: { fontSize: 24, fontWeight: '800' },
  actionButtons: { flex: 1, flexDirection: 'row', gap: 12 },
  mainButton: { flex: 1 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-end' },
  modalContent: { padding: 32, borderTopLeftRadius: 32, borderTopRightRadius: 32, alignItems: 'center' },
  modalHandle: { width: 40, height: 4, borderRadius: 2, marginBottom: 24 },
  modalTitle: { fontSize: 24, fontWeight: '800' },
  modalSub: { fontSize: 16, textAlign: 'center', marginTop: 8 },
  starsRow: { flexDirection: 'row', marginTop: 32, gap: 12 },
  starPressable: { padding: 4 },
});
