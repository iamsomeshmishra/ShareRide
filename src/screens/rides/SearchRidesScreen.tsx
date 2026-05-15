import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  FlatList,
  StatusBar,
  Platform
} from 'react-native';
import { useTheme } from '../../constants/theme';
import { Feather as Icon } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { RideCard } from '../../components/RideCard';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { rideService } from '../../services/rideService';
import { Ride } from '../../types/ride';
import Animated, { FadeInUp, FadeIn } from 'react-native-reanimated';

export default function SearchRidesScreen() {
  const { colors, sizes, shadows } = useTheme();
  const navigation = useNavigation<any>();
  const [pickup, setPickup] = React.useState('');
  const [destination, setDestination] = React.useState('');
  const [rides, setRides] = React.useState<Ride[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);

  const fetchRides = async (p: string, d: string) => {
    if (!p && !d) return;
    setIsLoading(true);
    try {
      const results = await rideService.searchRides(p, d);
      setRides(results);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.white }]}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-left" size={24} color={colors.black} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.black, fontSize: 24 }]}>Plan your ride</Text>
      </View>

      <Animated.View entering={FadeInUp.duration(600)} style={styles.inputsContainer}>
        <View style={styles.inputWrapper}>
          <View style={styles.inputLine}>
            <View style={[styles.dot, { backgroundColor: colors.black }]} />
            <View style={[styles.line, { backgroundColor: colors.gray200 }]} />
            <View style={[styles.square, { backgroundColor: colors.black }]} />
          </View>
          
          <View style={styles.googleInputs}>
            <GooglePlacesAutocomplete
              placeholder="Where from?"
              onPress={(data) => {
                setPickup(data.description);
                fetchRides(data.description, destination);
              }}
              query={{ key: 'YOUR_GOOGLE_MAPS_API_KEY', language: 'en' }}
              styles={{
                container: { flex: 0 },
                textInput: [styles.input, { backgroundColor: colors.gray50, color: colors.black }],
              }}
            />
            <View style={{ height: 16 }} />
            <GooglePlacesAutocomplete
              placeholder="Where to?"
              onPress={(data) => {
                setDestination(data.description);
                fetchRides(pickup, data.description);
              }}
              query={{ key: 'YOUR_GOOGLE_MAPS_API_KEY', language: 'en' }}
              styles={{
                container: { flex: 0 },
                textInput: [styles.input, { backgroundColor: colors.gray50, color: colors.black }],
              }}
            />
          </View>
        </View>
      </Animated.View>

      <View style={styles.resultsHeader}>
        <Text style={[styles.resultsTitle, { color: colors.black }]}>Available Shared Rides</Text>
        {isLoading && <Text style={{ color: colors.gray400, fontWeight: '600' }}>Updating...</Text>}
      </View>

      <FlatList
        data={rides}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => (
          <Animated.View entering={FadeInUp.delay(index * 100)}>
            <RideCard
              riderName={item.riderName}
              riderRating={4.8}
              pickupTime={item.time}
              seatsLeft={item.availableSeats}
              totalSeats={item.totalSeats}
              pricePerSeat={item.pricePerSeat}
              onPress={() => navigation.navigate('RideDetails', { ride: item })}
            />
          </Animated.View>
        )}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={!isLoading ? (
          <Animated.View entering={FadeIn.delay(400)} style={styles.emptyState}>
            <View style={[styles.emptyIconBox, { backgroundColor: colors.gray50 }]}>
              <Icon name="search" size={40} color={colors.gray300} />
            </View>
            <Text style={[styles.emptyText, { color: colors.gray500 }]}>
              No rides found for this route.{'\n'}Try adjusting your locations.
            </Text>
          </Animated.View>
        ) : null}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 24 
  },
  header: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginTop: Platform.OS === 'ios' ? 40 : 12, 
    marginBottom: 32 
  },
  backButton: {
    padding: 8,
    marginLeft: -8,
  },
  title: { 
    fontWeight: '900', 
    marginLeft: 12,
    letterSpacing: -1,
  },
  inputsContainer: { 
    marginBottom: 32 
  },
  inputWrapper: {
    flexDirection: 'row',
  },
  inputLine: {
    width: 20,
    alignItems: 'center',
    marginRight: 16,
    paddingVertical: 18,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  line: {
    width: 2,
    flex: 1,
    marginVertical: 4,
  },
  square: {
    width: 8,
    height: 8,
  },
  googleInputs: {
    flex: 1,
  },
  input: { 
    height: 52,
    fontSize: 16,
    fontWeight: '600',
    borderRadius: 16,
    paddingHorizontal: 16,
  },
  resultsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  resultsTitle: { 
    fontSize: 18, 
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  listContent: { 
    paddingBottom: 40 
  },
  emptyState: {
    marginTop: 60,
    alignItems: 'center',
  },
  emptyIconBox: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  emptyText: {
    fontSize: 15,
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: 22,
  },
});

