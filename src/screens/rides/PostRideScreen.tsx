import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  ScrollView, 
  Alert,
  Pressable,
  Platform,
  StatusBar
} from 'react-native';
import { useTheme } from '../../constants/theme';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { Feather as Icon } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { rideService } from '../../services/rideService';
import { useAuthStore } from '../../store/useAuthStore';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';

export default function PostRideScreen() {
  const { colors, sizes, spacing, shadows } = useTheme();
  const navigation = useNavigation<any>();
  const [pickupCoords, setPickupCoords] = useState<{lat: number, lng: number} | null>(null);
  const [destinationCoords, setDestinationCoords] = useState<{lat: number, lng: number} | null>(null);
  const { user } = useAuthStore();
  
  const [pickup, setPickup] = useState('');
  const [destination, setDestination] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [price, setPrice] = useState('');
  const [seats, setSeats] = useState('3');
  const [loading, setLoading] = useState(false);

  const handlePostRide = async () => {
    if (!pickup || !destination || !date || !time || !price || (!pickupCoords && Platform.OS !== 'web')) {
      Alert.alert('Incomplete Form', 'Please fill all fields to post your ride.');
      return;
    }

    setLoading(true);
    try {
      await rideService.postRide({
        riderId: user?.id || 'unknown',
        riderName: user?.name || 'Anonymous',
        pickup: {
          address: pickup,
          latitude: pickupCoords?.lat || 0,
          longitude: pickupCoords?.lng || 0,
        },
        destination: {
          address: destination,
          latitude: destinationCoords?.lat || 0,
          longitude: destinationCoords?.lng || 0,
        },
        date,
        time,
        totalSeats: parseInt(seats),
        availableSeats: parseInt(seats),
        pricePerSeat: parseFloat(price),
      });

      Alert.alert('Ride Published', 'Your journey is now visible to passengers.', [
        { text: 'View Bookings', onPress: () => navigation.navigate('Bookings') }
      ]);
    } catch (error) {
      Alert.alert('Error', 'Failed to publish ride. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  const SectionHeader = ({ title, icon }: { title: string, icon: string }) => (
    <View style={styles.sectionHeader}>
      <Icon name={icon as any} size={18} color={colors.black} style={{ marginRight: 10 }} />
      <Text style={[styles.sectionTitle, { color: colors.black, fontSize: 16 }]}>
        {title}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.white }]}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.fixedHeader}>
        <Pressable 
          onPress={() => navigation.goBack()} 
          style={({ pressed }) => [
            styles.backButton,
            { opacity: pressed ? 0.6 : 1 }
          ]}
        >
          <Icon name="x" size={24} color={colors.black} />
        </Pressable>
        <Text style={[styles.headerTitle, { color: colors.black, fontSize: 16 }]}>
          Post a Ride
        </Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView 
        contentContainerStyle={styles.scrollContent} 
        keyboardShouldPersistTaps="always"
        showsVerticalScrollIndicator={false}
      >
        <Animated.View entering={FadeIn.duration(800)}>
          <Text style={[styles.mainTitle, { color: colors.black, fontSize: sizes.font_h2 }]}>
            Where are you{'\n'}heading?
          </Text>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(200).duration(800)} style={styles.formSection}>
          <SectionHeader title="Route Details" icon="map" />
          
          <GooglePlacesAutocomplete
            placeholder="Pickup Location"
            fetchDetails={true}
            onPress={(data, details = null) => {
              setPickup(data.description);
              if (details) setPickupCoords(details.geometry.location);
            }}
            query={{ key: 'YOUR_GOOGLE_MAPS_API_KEY', language: 'en' }}
            styles={{
              textInput: [styles.googleInput, { backgroundColor: colors.gray50, borderRadius: sizes.radius_md }],
              container: { flex: 0, marginBottom: 12 },
              listView: { backgroundColor: colors.white, borderRadius: sizes.radius_sm, marginTop: 4, ...shadows.medium, zIndex: 1000 },
              row: { padding: 16, height: 56, flexDirection: 'row', alignItems: 'center' },
              description: { color: colors.black, fontSize: 14, fontWeight: '500' }
            }}
          />

          <GooglePlacesAutocomplete
            placeholder="Destination Location"
            fetchDetails={true}
            onPress={(data, details = null) => {
              setDestination(data.description);
              if (details) setDestinationCoords(details.geometry.location);
            }}
            query={{ key: 'YOUR_GOOGLE_MAPS_API_KEY', language: 'en' }}
            styles={{
              textInput: [styles.googleInput, { backgroundColor: colors.gray50, borderRadius: sizes.radius_md }],
              container: { flex: 0 },
              listView: { backgroundColor: colors.white, borderRadius: sizes.radius_sm, marginTop: 4, ...shadows.medium, zIndex: 999 },
              row: { padding: 16, height: 56, flexDirection: 'row', alignItems: 'center' },
              description: { color: colors.black, fontSize: 14, fontWeight: '500' }
            }}
          />
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(300).duration(800)} style={styles.formSection}>
          <SectionHeader title="Schedule" icon="calendar" />
          <View style={styles.row}>
            <View style={{ flex: 1.2 }}>
              <Input 
                label="Date" 
                placeholder="Tomorrow" 
                value={date} 
                onChangeText={setDate}
              />
            </View>
            <View style={{ width: 16 }} />
            <View style={{ flex: 0.8 }}>
              <Input 
                label="Time" 
                placeholder="09:00 AM" 
                value={time} 
                onChangeText={setTime}
              />
            </View>
          </View>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(400).duration(800)} style={styles.formSection}>
          <SectionHeader title="Preferences" icon="settings" />
          <View style={styles.row}>
            <View style={{ flex: 1 }}>
              <Input 
                label="Seats" 
                placeholder="3" 
                keyboardType="numeric"
                value={seats}
                onChangeText={setSeats}
              />
            </View>
            <View style={{ width: 16 }} />
            <View style={{ flex: 1 }}>
              <Input 
                label="Price/Seat (₹)" 
                placeholder="250" 
                keyboardType="numeric"
                value={price}
                onChangeText={setPrice}
              />
            </View>
          </View>
        </Animated.View>

        <Animated.View 
          entering={FadeInDown.delay(500).duration(800)}
          style={[styles.infoCard, { backgroundColor: colors.gray50, borderRadius: sizes.radius_lg, borderWidth: 1, borderColor: colors.gray100 }]}
        >
          <View style={[styles.infoIconBox, { backgroundColor: colors.white }]}>
            <Icon name="info" size={16} color={colors.black} />
          </View>
          <Text style={[styles.infoText, { color: colors.gray600, fontSize: 13 }]}>
            Drivers earn 95% of the total ride fare. Payments are processed securely via Stripe.
          </Text>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(600).duration(800)}>
          <Button 
            title="Publish Ride" 
            onPress={handlePostRide} 
            variant="primary" 
            size="lg"
            loading={loading}
            style={{ marginTop: 8, marginBottom: 40 }}
          />
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  fixedHeader: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  scrollContent: {
    padding: 24,
    paddingTop: 8,
  },
  mainTitle: {
    fontWeight: '900',
    letterSpacing: -1.5,
    marginBottom: 32,
    lineHeight: 40,
  },
  formSection: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  sectionTitle: {
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  googleInput: {
    height: 56,
    paddingHorizontal: 16,
    fontSize: 15,
    fontWeight: '600',
  },
  row: {
    flexDirection: 'row',
  },
  infoCard: {
    flexDirection: 'row',
    padding: 20,
    alignItems: 'center',
    marginBottom: 32,
  },
  infoIconBox: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  infoText: {
    flex: 1,
    lineHeight: 20,
    fontWeight: '600',
  },
});