import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  RefreshControl, 
  SafeAreaView,
  StatusBar
} from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { useTheme } from '../../constants/theme';
import { useAuthStore } from '../../store/useAuthStore';
import { rideService } from '../../services/rideService';
import { Ride, Booking } from '../../types/ride';
import { Feather as Icon } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import Animated, { FadeInDown, FadeIn } from 'react-native-reanimated';

export default function BookingsScreen() {
  const { colors, sizes, shadows, spacing } = useTheme();
  const { user } = useAuthStore();
  const navigation = useNavigation<any>();
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<'active' | 'past'>('active');

  const fetchData = async () => {
    if (!user) return;
    setLoading(true);
    try {
      if (user.role === 'rider') {
        const rides = await rideService.getUserRides(user.id);
        setData(rides || []);
      } else {
        const bookings = await rideService.getUserBookings(user.id);
        setData(bookings || []);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user?.role]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  const renderRideItem = ({ item, index }: { item: Ride; index: number }) => (
    <Animated.View entering={FadeInDown.delay(index * 100).duration(600)}>
      <TouchableOpacity 
        style={[styles.card, { backgroundColor: colors.white, borderBottomColor: colors.gray100, borderBottomWidth: 1 }]}
        onPress={() => navigation.navigate('RideDetails', { rideId: item.id })}
      >
        <View style={styles.cardHeader}>
          <View>
            <Text style={[styles.date, { color: colors.black }]}>{item.date}</Text>
            <Text style={[styles.time, { color: colors.gray500 }]}>{item.time}</Text>
          </View>
          <Text style={[styles.price, { color: colors.black }]}>₹{item.pricePerSeat}</Text>
        </View>
        
        <View style={styles.routeContainer}>
          <View style={styles.routeLine}>
            <View style={[styles.dot, { backgroundColor: colors.black }]} />
            <View style={[styles.line, { backgroundColor: colors.gray200 }]} />
            <Icon name="map-pin" size={14} color={colors.black} />
          </View>
          <View style={styles.addressContainer}>
            <Text style={[styles.address, { color: colors.black }]} numberOfLines={1}>{item.pickup.address}</Text>
            <Text style={[styles.address, { color: colors.black }]} numberOfLines={1}>{item.destination.address}</Text>
          </View>
        </View>

        <View style={styles.cardFooter}>
          <View style={styles.infoRow}>
            <Icon name="users" size={16} color={colors.gray600} />
            <Text style={[styles.infoText, { color: colors.gray600 }]}>{item.passengers.length} Joined</Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: item.status === 'active' ? colors.black : colors.gray100 }]}>
            <Text style={[styles.statusText, { color: item.status === 'active' ? colors.white : colors.gray600 }]}>
              {item.status.toUpperCase()}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );

  const renderBookingItem = ({ item, index }: { item: Booking; index: number }) => (
    <Animated.View entering={FadeInDown.delay(index * 100).duration(600)}>
      <TouchableOpacity 
        style={[styles.card, { backgroundColor: colors.white, borderBottomColor: colors.gray100, borderBottomWidth: 1 }]}
        onPress={() => navigation.navigate('LiveTracking', { rideId: item.rideId })}
      >
        <View style={styles.cardHeader}>
          <View>
            <Text style={[styles.rideId, { color: colors.gray500 }]}>Booking ID: ...{item.id.slice(-6)}</Text>
            <Text style={[styles.date, { color: colors.black }]}>Confirmed</Text>
          </View>
          <Text style={[styles.price, { color: colors.black }]}>₹{item.totalPrice}</Text>
        </View>
        
        <View style={[styles.infoRow, { marginTop: 16 }]}>
          <View style={[styles.iconContainer, { backgroundColor: colors.gray50 }]}>
            <Icon name="truck" size={18} color={colors.black} />
          </View>
          <View style={{ marginLeft: 16 }}>
            <Text style={[styles.rideName, { color: colors.black }]}>Secure Journey</Text>
            <Text style={{ color: colors.gray500, fontSize: 12 }}>View Live Tracking</Text>
          </View>
        </View>

        <View style={styles.cardFooter}>
          <View style={styles.infoRow}>
            <Icon name="calendar" size={16} color={colors.gray600} />
            <Text style={[styles.infoText, { color: colors.gray600 }]}>
              {new Date(item.createdAt).toLocaleDateString()}
            </Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: colors.black }]}>
            <Text style={[styles.statusText, { color: colors.white }]}>CONFIRMED</Text>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );

  const filteredData = data.filter(item => {
    if (activeTab === 'active') {
      return ['active', 'ongoing', 'confirmed', 'pending'].includes(item.status);
    }
    return ['completed', 'cancelled'].includes(item.status);
  });

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.white }]}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <Animated.View entering={FadeIn.duration(800)}>
          <Text style={[styles.title, { color: colors.black, fontSize: sizes.font_h3 }]}>
            {user?.role === 'rider' ? 'My Rides' : 'Activity'}
          </Text>
        </Animated.View>
        
        <View style={[styles.tabContainer, { backgroundColor: colors.gray50, borderWidth: 1, borderColor: colors.gray100 }]}>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'active' && { backgroundColor: colors.black }]}
            onPress={() => setActiveTab('active')}
          >
            <Text style={[styles.tabText, { color: activeTab === 'active' ? colors.white : colors.gray500 }]}>Active</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'past' && { backgroundColor: colors.black }]}
            onPress={() => setActiveTab('past')}
          >
            <Text style={[styles.tabText, { color: activeTab === 'past' ? colors.white : colors.gray500 }]}>History</Text>
          </TouchableOpacity>
        </View>
      </View>
      
      <View style={{ flex: 1 }}>
        <FlashList
          data={filteredData}
          estimatedItemSize={180}
          keyExtractor={(item) => item.id}
          renderItem={({ item, index }) => {
            if (user?.role === 'rider') {
              return renderRideItem({ item: item as Ride, index });
            }
            return renderBookingItem({ item: item as Booking, index });
          }}
          contentContainerStyle={styles.list}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.black} />
          }
          ListEmptyComponent={
            <View style={styles.empty}>
              <View style={[styles.emptyIconContainer, { backgroundColor: colors.gray50 }]}>
                <Icon name="archive" size={40} color={colors.gray300} />
              </View>
              <Text style={[styles.emptyText, { color: colors.gray500 }]}>
                No {user?.role === 'rider' ? 'rides' : 'activity'} found
              </Text>
              <TouchableOpacity 
                style={[styles.emptyButton, { backgroundColor: colors.black }]}
                onPress={() => {
                  if (user?.role === 'rider') {
                    navigation.navigate('Home', { screen: 'PostRide' });
                  } else {
                    navigation.navigate('Home', { screen: 'SearchRides' });
                  }
                }}
              >
                <Text style={styles.emptyButtonText}>
                  {user?.role === 'rider' ? 'Post a Ride' : 'Explore Journeys'}
                </Text>
              </TouchableOpacity>
            </View>
          }
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { padding: 24, paddingTop: 16 },
  title: { fontWeight: '900', marginBottom: 24, letterSpacing: -1 },
  list: { paddingBottom: 40 },
  card: { paddingVertical: 24, paddingHorizontal: 24 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 },
  date: { fontSize: 16, fontWeight: '800', letterSpacing: -0.5 },
  time: { fontSize: 13, marginTop: 2, fontWeight: '600' },
  price: { fontSize: 20, fontWeight: '900', letterSpacing: -1 },
  routeContainer: { flexDirection: 'row', marginBottom: 24 },
  routeLine: { width: 24, alignItems: 'center', marginRight: 16 },
  dot: { width: 8, height: 8, borderRadius: 4 },
  line: { width: 1, flex: 1, marginVertical: 4 },
  addressContainer: { flex: 1, justifyContent: 'space-between', height: 56 },
  address: { fontSize: 15, fontWeight: '600', letterSpacing: -0.3 },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 12 },
  infoRow: { flexDirection: 'row', alignItems: 'center' },
  infoText: { marginLeft: 8, fontSize: 14, fontWeight: '700', letterSpacing: -0.2 },
  statusBadge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 100 },
  statusText: { fontSize: 10, fontWeight: '900', letterSpacing: 0.5 },
  rideId: { fontSize: 12, fontWeight: '700', marginBottom: 4, letterSpacing: 0.2 },
  rideName: { fontSize: 16, fontWeight: '800', letterSpacing: -0.4 },
  iconContainer: { width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center' },
  tabContainer: { flexDirection: 'row', borderRadius: 100, padding: 6 },
  tab: { flex: 1, paddingVertical: 12, alignItems: 'center', borderRadius: 100 },
  tabText: { fontSize: 14, fontWeight: '800', letterSpacing: -0.2 },
  empty: { flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 100, paddingHorizontal: 40 },
  emptyIconContainer: { width: 90, height: 90, borderRadius: 45, justifyContent: 'center', alignItems: 'center', marginBottom: 24 },
  emptyText: { fontSize: 16, fontWeight: '700', textAlign: 'center', letterSpacing: -0.3 },
  emptyButton: { marginTop: 28, paddingHorizontal: 36, paddingVertical: 16, borderRadius: 100 },
  emptyButtonText: { color: '#FFF', fontWeight: '800', fontSize: 15, letterSpacing: -0.2 },
});


