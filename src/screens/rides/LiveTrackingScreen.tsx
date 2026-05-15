import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { useTheme, COLORS } from '../../constants/theme';
import MapView, { PROVIDER_GOOGLE, Marker, Polyline } from 'react-native-maps';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { rideService } from '../../services/rideService';
import { useAuthStore } from '../../store/useAuthStore';
import { Ride } from '../../types/ride';

export default function LiveTrackingScreen({ route, navigation }: any) {
  const { rideId, initialRide } = route.params || {};
  const [ride, setRide] = useState<Ride | null>(initialRide || null);
  const [loading, setLoading] = useState(!initialRide);
  const { colors, sizes, shadows } = useTheme();
  const { user } = useAuthStore();

  useEffect(() => {
    if (!rideId) return;

    // Subscribe to ride updates
    const unsubscribe = rideService.subscribeToRide(rideId, (updatedRide) => {
      setRide(updatedRide);
      setLoading(false);
    });

    // Simulate location updates if user is the rider
    let interval: NodeJS.Timeout;
    if (user?.id === ride?.riderId && ride?.status === 'ongoing') {
      interval = setInterval(async () => {
        const currentLoc = ride.riderLocation || { latitude: ride.pickup.latitude, longitude: ride.pickup.longitude };
        
        // Check if reached destination (approx 100m)
        const distance = Math.sqrt(
          Math.pow(ride.destination.latitude - currentLoc.latitude, 2) + 
          Math.pow(ride.destination.longitude - currentLoc.longitude, 2)
        );

        if (distance < 0.001) {
          clearInterval(interval);
          await rideService.updateRide(rideId, { status: 'completed' });
          return;
        }

        // Small random movement towards destination
        const newLat = currentLoc.latitude + (ride.destination.latitude - currentLoc.latitude) * 0.1;
        const newLng = currentLoc.longitude + (ride.destination.longitude - currentLoc.longitude) * 0.1;
        
        await rideService.updateRide(rideId, {
          riderLocation: { latitude: newLat, longitude: newLng }
        });
      }, 5000);
    }

    return () => {
      unsubscribe();
      if (interval) clearInterval(interval);
    };
  }, [rideId, user?.id, ride?.riderId, ride?.status]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  if (!ride) {
    return (
      <View style={styles.center}>
        <Text>Ride not found</Text>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={{ color: COLORS.primary, marginTop: 12 }}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const riderLocation = ride.riderLocation || { latitude: ride.pickup.latitude, longitude: ride.pickup.longitude };

  return (
    <View style={styles.container}>
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={{
          latitude: riderLocation.latitude,
          longitude: riderLocation.longitude,
          latitudeDelta: 0.02,
          longitudeDelta: 0.02,
        }}
      >
        <Marker coordinate={{ latitude: ride.pickup.latitude, longitude: ride.pickup.longitude }} title="Pickup">
          <View style={styles.markerContainer}>
            <View style={[styles.markerDot, { backgroundColor: COLORS.secondary }]} />
          </View>
        </Marker>

        <Marker coordinate={{ latitude: ride.destination.latitude, longitude: ride.destination.longitude }} title="Destination">
          <View style={styles.markerContainer}>
            <View style={[styles.markerDot, { backgroundColor: COLORS.primary }]} />
          </View>
        </Marker>
        
        <Marker coordinate={riderLocation} title="Rider">
          <Icon name="car" size={32} color={COLORS.black} />
        </Marker>
      </MapView>

      <TouchableOpacity 
        style={[styles.backButton, { backgroundColor: colors.white, ...shadows.light }]}
        onPress={() => navigation.goBack()}
      >
        <Icon name="arrow-left" size={24} color={colors.black} />
      </TouchableOpacity>

      <View style={[styles.bottomSheet, { backgroundColor: colors.white, ...shadows.medium }]}>
        <View style={styles.indicator} />
        
        <View style={styles.statusHeader}>
          <View>
            <Text style={styles.statusText}>
              {ride.status === 'active' ? 'Heading to Pickup' : ride.status === 'ongoing' ? 'En Route' : 'Completed'}
            </Text>
            <Text style={styles.subStatus}>
              {ride.status === 'active' ? 'Arriving in 5 mins' : 'Trip in progress'}
            </Text>
          </View>
          <View style={[styles.badge, { backgroundColor: ride.status === 'ongoing' ? '#E3F2FD' : '#E8F5E9' }]}>
            <Text style={[styles.badgeText, { color: ride.status === 'ongoing' ? '#1565C0' : '#2E7D32' }]}>
              {ride.status.toUpperCase()}
            </Text>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.riderRow}>
          <View style={styles.avatar}>
            <Icon name="account" size={30} color={COLORS.gray600} />
          </View>
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={styles.riderName}>{ride.riderName}</Text>
            <Text style={styles.carInfo}>White Toyota Glanza • GJ 01 XX 1234</Text>
          </View>
          <TouchableOpacity style={styles.callButton}>
            <Icon name="phone" size={20} color={COLORS.white} />
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <TouchableOpacity style={styles.actionButton}>
            <Icon name="shield-check" size={20} color={COLORS.primary} />
            <Text style={styles.actionText}>Safety</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Icon name="share-variant" size={20} color={COLORS.black} />
            <Text style={styles.actionText}>Share Trip</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionButton, { borderColor: COLORS.error }]}>
            <Icon name="close-circle" size={20} color={COLORS.error} />
            <Text style={[styles.actionText, { color: COLORS.error }]}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  bottomSheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 24,
    paddingTop: 12,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
  },
  indicator: {
    width: 40,
    height: 4,
    backgroundColor: COLORS.gray200,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 20,
  },
  statusHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  statusText: { fontSize: 22, fontWeight: '800', color: COLORS.black },
  subStatus: { fontSize: 14, color: COLORS.gray600, marginTop: 4 },
  badge: {
    backgroundColor: COLORS.secondary + '20',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  badgeText: { color: COLORS.secondary, fontWeight: '700', fontSize: 12 },
  divider: { height: 1, backgroundColor: COLORS.gray100, marginBottom: 20 },
  riderRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 24 },
  avatar: { width: 48, height: 48, borderRadius: 24, backgroundColor: COLORS.gray100, justifyContent: 'center', alignItems: 'center' },
  riderName: { fontSize: 16, fontWeight: '700', color: COLORS.black },
  carInfo: { fontSize: 12, color: COLORS.gray500, marginTop: 2 },
  callButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: COLORS.primary, justifyContent: 'center', alignItems: 'center' },
  footer: { flexDirection: 'row', justifyContent: 'space-between' },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 44,
    borderWidth: 1,
    borderColor: COLORS.gray100,
    borderRadius: 12,
    marginHorizontal: 4,
  },
  actionText: { marginLeft: 8, fontSize: 13, fontWeight: '600', color: COLORS.black },
  markerContainer: { width: 30, height: 30, justifyContent: 'center', alignItems: 'center' },
  markerDot: { width: 12, height: 12, borderRadius: 6, borderWidth: 2, borderColor: COLORS.white },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});
