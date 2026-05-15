import React from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, Dimensions, StatusBar } from 'react-native';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import { useTheme } from '../../constants/theme';
import Icon from 'react-native-vector-icons/Feather';
import Animated, { FadeInUp, FadeInRight, FadeIn } from 'react-native-reanimated';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useAuthStore } from '../../store/useAuthStore';
import { rideService } from '../../services/rideService';
import { Button } from '../../components/Button';

const { width, height } = Dimensions.get('window');

export default function HomeScreen() {
  const { colors, sizes, shadows, spacing } = useTheme();
  const navigation = useNavigation<any>();
  const { user } = useAuthStore();
  const [riderStats, setRiderStats] = React.useState({ earnings: 0, rating: 4.8, totalRides: 0 });
  const [activeRide, setActiveRide] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);

  useFocusEffect(
    React.useCallback(() => {
      if (user?.role === 'rider') {
        fetchRiderData();
      }
    }, [user])
  );

  const fetchRiderData = async () => {
    try {
      const rides = await rideService.getUserRides(user!.id);
      const active = rides.find(r => r.status === 'active');
      const completed = rides.filter(r => r.status === 'completed');
      
      const earnings = completed.reduce((acc, r) => acc + (r.totalSeats - r.availableSeats) * r.pricePerSeat, 0);
      
      setRiderStats({
        earnings,
        rating: 4.8,
        totalRides: completed.length
      });
      setActiveRide(active);
    } catch (error) {
      console.error('Error fetching rider data:', error);
    } finally {
      setLoading(false);
    }
  };

  const isRider = user?.role === 'rider';

  const renderRiderDashboard = () => (
    <View style={styles.riderDashboard}>
      <Animated.View 
        entering={FadeInUp.delay(200).duration(800)}
        style={[styles.statsRow, { backgroundColor: colors.white, ...shadows.medium }]}
      >
        <View style={styles.statItem}>
          <Text style={[styles.statValue, { color: colors.black }]}>₹{riderStats.earnings}</Text>
          <Text style={[styles.statLabel, { color: colors.gray500 }]}>Earnings</Text>
        </View>
        <View style={[styles.statDivider, { backgroundColor: colors.gray100 }]} />
        <View style={styles.statItem}>
          <Text style={[styles.statValue, { color: colors.black }]}>{riderStats.rating}</Text>
          <Text style={[styles.statLabel, { color: colors.gray500 }]}>Rating</Text>
        </View>
        <View style={[styles.statDivider, { backgroundColor: colors.gray100 }]} />
        <View style={styles.statItem}>
          <Text style={[styles.statValue, { color: colors.black }]}>{riderStats.totalRides}</Text>
          <Text style={[styles.statLabel, { color: colors.gray500 }]}>Rides</Text>
        </View>
      </Animated.View>

      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, { color: colors.black, fontSize: sizes.font_h5 }]}>
          {activeRide ? 'Current Ride' : 'No Active Ride'}
        </Text>
        {activeRide && (
          <Pressable onPress={() => navigation.navigate('Bookings')}>
            <Text style={[styles.viewAll, { color: colors.black }]}>History</Text>
          </Pressable>
        )}
      </View>
      
      {activeRide ? (
        <Animated.View entering={FadeInUp.delay(400).duration(800)}>
          <Pressable 
            style={({ pressed }) => [
              styles.activeRideCard, 
              { 
                backgroundColor: colors.black, 
                ...shadows.medium,
                opacity: pressed ? 0.9 : 1,
                borderRadius: sizes.radius_lg
              }
            ]}
            onPress={() => navigation.navigate('RideDetails', { rideId: activeRide.id })}
          >
            <View style={styles.activeRideHeader}>
              <View style={styles.rideTypeTag}>
                <Icon name="users" size={14} color={colors.white} />
                <Text style={styles.rideTypeText}>POOLING</Text>
              </View>
              <View style={styles.statusBadge}>
                <View style={styles.statusDot} />
                <Text style={styles.statusText}>ONGOING</Text>
              </View>
            </View>
            
            <Text style={styles.activeRideRoute} numberOfLines={1}>
              {activeRide.pickup.address.split(',')[0]} → {activeRide.destination.address.split(',')[0]}
            </Text>
            
            <View style={styles.activeRideFooter}>
              <View style={styles.passengerAvatars}>
                {[1, 2, 3].slice(0, activeRide.totalSeats - activeRide.availableSeats).map((_, i) => (
                  <View key={i} style={[styles.avatarCircle, { marginLeft: i === 0 ? 0 : -8, borderColor: colors.black, backgroundColor: colors.gray300 }]} />
                ))}
                <Text style={[styles.passengerCount, { color: colors.gray400 }]}>
                  {activeRide.totalSeats - activeRide.availableSeats} Passengers
                </Text>
              </View>
              <Icon name="arrow-right" size={20} color={colors.white} />
            </View>
          </Pressable>
        </Animated.View>
      ) : (
        <Animated.View entering={FadeInUp.delay(400).duration(800)}>
          <View style={[styles.emptyStateCard, { backgroundColor: colors.gray50, borderColor: colors.gray200 }]}>
            <View style={[styles.iconContainer, { backgroundColor: colors.white, ...shadows.light }]}>
              <Icon name="plus" size={32} color={colors.black} />
            </View>
            <Text style={[styles.emptyStateTitle, { color: colors.black }]}>Ready to earn?</Text>
            <Text style={[styles.emptyStateSub, { color: colors.gray500 }]}>
              Post your upcoming trip and share the cost with passengers.
            </Text>
            <Button 
              title="Post a Ride"
              onPress={() => navigation.navigate('PostRide')}
              variant="primary"
              size="md"
              style={{ width: '100%', marginTop: 8 }}
            />
          </View>
        </Animated.View>
      )}
    </View>
  );

  const renderPassengerDashboard = () => (
    <View style={styles.content}>
      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, { color: colors.black, fontSize: sizes.font_h5 }]}>
          Recommended for you
        </Text>
      </View>
      
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.cardsContainer}>
        {[
          { title: 'Daily Carpool', sub: 'Save up to 40%', icon: 'users' },
          { title: 'Pre-book', sub: 'Plan ahead', icon: 'calendar' },
          { title: 'Verified Rides', sub: 'Safe & Secure', icon: 'shield' },
        ].map((item, idx) => (
          <Pressable 
            key={idx}
            style={({ pressed }) => [
              styles.card, 
              { 
                backgroundColor: colors.white, 
                borderRadius: sizes.radius_md, 
                borderWidth: 1,
                borderColor: colors.gray100,
                opacity: pressed ? 0.9 : 1,
                ...shadows.light
              }
            ]}
          >
            <View style={[styles.cardIconBox, { backgroundColor: colors.gray50 }]}>
              <Icon name={item.icon as any} size={20} color={colors.black} />
            </View>
            <Text style={[styles.cardTitle, { color: colors.black }]}>{item.title}</Text>
            <Text style={[styles.cardSubtitle, { color: colors.gray500 }]}>{item.sub}</Text>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.white }]}>
      <StatusBar barStyle="dark-content" />
      <View style={isRider ? styles.riderMapContainer : styles.mapContainer}>
        <MapView
          provider={PROVIDER_GOOGLE}
          style={styles.map}
          customMapStyle={mapStyle}
          initialRegion={{
            latitude: 28.6139,
            longitude: 77.2090,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        />
        
        {!isRider && (
          <Animated.View entering={FadeIn.delay(500)} style={styles.searchBarContainer}>
            <Pressable 
              style={({ pressed }) => [
                styles.searchBar, 
                { 
                  backgroundColor: colors.white, 
                  borderRadius: sizes.radius_pill,
                  ...shadows.medium,
                  opacity: pressed ? 0.98 : 1
                }
              ]}
              onPress={() => navigation.navigate('SearchRides')}
            >
              <Icon name="search" size={20} color={colors.black} />
              <Text style={[styles.searchText, { color: colors.gray500 }]}>Where to?</Text>
            </Pressable>
          </Animated.View>
        )}
      </View>

      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        {isRider ? renderRiderDashboard() : renderPassengerDashboard()}
      </ScrollView>

      {/* Action FAB */}
      <Animated.View entering={FadeInUp.delay(600)} style={styles.fabContainer}>
        <Button 
          title={isRider ? 'Post a Ride' : 'Find a Ride'}
          onPress={() => navigation.navigate(isRider ? 'PostRide' : 'SearchRides')}
          variant="primary"
          size="lg"
          icon={<Icon name={isRider ? 'plus' : 'search'} size={20} color={colors.white} />}
          style={styles.fabButton}
        />
      </Animated.View>
    </View>
  );
}

const mapStyle = [
  { "elementType": "geometry", "stylers": [{ "color": "#f5f5f5" }] },
  { "elementType": "labels.icon", "stylers": [{ "visibility": "off" }] },
  { "elementType": "labels.text.fill", "stylers": [{ "color": "#616161" }] },
  { "elementType": "labels.text.stroke", "stylers": [{ "color": "#f5f5f5" }] },
  { "featureType": "road", "elementType": "geometry", "stylers": [{ "color": "#ffffff" }] },
  { "featureType": "water", "elementType": "geometry", "stylers": [{ "color": "#e9e9e9" }] }
];

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mapContainer: {
    height: height * 0.55,
    position: 'relative',
  },
  riderMapContainer: {
    height: height * 0.35,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  searchBarContainer: {
    position: 'absolute',
    top: 60,
    left: 20,
    right: 20,
    zIndex: 10,
  },
  searchBar: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  searchText: {
    marginLeft: 12,
    fontSize: 16,
    fontWeight: '600',
  },
  content: {
    padding: 24,
  },
  riderDashboard: {
    padding: 24,
    marginTop: -40,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    marginTop: 16,
  },
  viewAll: {
    fontSize: 14,
    fontWeight: '700',
    textDecorationLine: 'underline',
  },
  statsRow: {
    flexDirection: 'row',
    padding: 24,
    borderRadius: 16,
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  statLabel: {
    fontSize: 12,
    marginTop: 4,
    fontWeight: '600',
  },
  statDivider: {
    width: 1,
    height: 30,
  },
  activeRideCard: {
    padding: 20,
  },
  activeRideHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  rideTypeTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
  },
  rideTypeText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: '900',
    marginLeft: 6,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(52, 199, 89, 0.15)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#34C759',
    marginRight: 6,
  },
  statusText: {
    color: '#34C759',
    fontSize: 10,
    fontWeight: '900',
  },
  activeRideRoute: {
    fontSize: 24,
    fontWeight: '800',
    color: '#FFF',
    marginBottom: 24,
    letterSpacing: -0.5,
  },
  activeRideFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)',
    paddingTop: 16,
  },
  passengerAvatars: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
  },
  passengerCount: {
    fontSize: 14,
    marginLeft: 12,
    fontWeight: '600',
  },
  emptyStateCard: {
    padding: 32,
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderStyle: 'dashed',
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 8,
  },
  emptyStateSub: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  cardsContainer: {
    paddingRight: 24,
    paddingVertical: 8,
  },
  card: {
    width: 160,
    padding: 20,
    marginRight: 16,
  },
  cardIconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardTitle: {
    fontWeight: '800',
    fontSize: 15,
  },
  cardSubtitle: {
    fontSize: 13,
    marginTop: 4,
    fontWeight: '600',
  },
  fabContainer: {
    position: 'absolute',
    bottom: 30,
    left: 24,
    right: 24,
    zIndex: 100,
  },
  fabButton: {
    width: '100%',
    height: 60,
  },
});


