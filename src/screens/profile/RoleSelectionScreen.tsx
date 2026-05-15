import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  TouchableOpacity,
  StatusBar
} from 'react-native';
import { useTheme } from '../../constants/theme';
import { Button } from '../../components/Button';
import { useAuthStore } from '../../store/useAuthStore';
import { Feather as Icon } from '@expo/vector-icons';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';

export default function RoleSelectionScreen() {
  const { colors, sizes, shadows } = useTheme();
  const { setRole } = useAuthStore();
  const [selectedRole, setSelectedRole] = React.useState<'passenger' | 'rider'>('passenger');

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.white }]}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.content}>
        <Animated.View entering={FadeIn.duration(800)}>
          <Text style={[styles.title, { color: colors.black, fontSize: 32 }]}>
            How will you{'\n'}use ShareRide?
          </Text>
          <Text style={[styles.subtitle, { color: colors.gray500 }]}>
            Choose your primary role. You can switch between these anytime in your profile.
          </Text>
        </Animated.View>

        <View style={styles.roleContainer}>
          <Animated.View entering={FadeInDown.delay(200).duration(800)} style={{ flex: 1 }}>
            <TouchableOpacity 
              activeOpacity={0.8}
              style={[
                styles.roleCard, 
                { borderColor: selectedRole === 'passenger' ? colors.black : colors.gray100 },
                selectedRole === 'passenger' && { backgroundColor: colors.gray50 }
              ]}
              onPress={() => setSelectedRole('passenger')}
            >
              <View style={[
                styles.iconCircle, 
                { backgroundColor: selectedRole === 'passenger' ? colors.black : colors.gray50 }
              ]}>
                <Icon 
                  name="user" 
                  size={32} 
                  color={selectedRole === 'passenger' ? colors.white : colors.black} 
                />
              </View>
              <Text style={[styles.roleName, { color: colors.black }]}>Passenger</Text>
              <Text style={[styles.roleDesc, { color: colors.gray600 }]}>
                I want to find a ride and travel comfortably.
              </Text>
            </TouchableOpacity>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(300).duration(800)} style={{ flex: 1 }}>
            <TouchableOpacity 
              activeOpacity={0.8}
              style={[
                styles.roleCard, 
                { borderColor: selectedRole === 'rider' ? colors.black : colors.gray100 },
                selectedRole === 'rider' && { backgroundColor: colors.gray50 }
              ]}
              onPress={() => setSelectedRole('rider')}
            >
              <View style={[
                styles.iconCircle, 
                { backgroundColor: selectedRole === 'rider' ? colors.black : colors.gray50 }
              ]}>
                <Icon 
                  name="truck" 
                  size={32} 
                  color={selectedRole === 'rider' ? colors.white : colors.black} 
                />
              </View>
              <Text style={[styles.roleName, { color: colors.black }]}>Driver</Text>
              <Text style={[styles.roleDesc, { color: colors.gray600 }]}>
                I want to offer seats and share travel costs.
              </Text>
            </TouchableOpacity>
          </Animated.View>
        </View>

        <Animated.View entering={FadeInDown.delay(400).duration(800)} style={styles.footer}>
          <Button 
            title="Continue" 
            onPress={() => setRole(selectedRole)} 
            variant="primary"
            size="lg"
          />
        </Animated.View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  title: {
    fontWeight: '900',
    letterSpacing: -1.5,
    marginBottom: 12,
    lineHeight: 40,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 48,
    lineHeight: 24,
    letterSpacing: -0.2,
  },
  roleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
  },
  roleCard: {
    flex: 1,
    borderRadius: 32,
    padding: 24,
    borderWidth: 2,
    alignItems: 'center',
    height: 240,
    justifyContent: 'center',
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  roleName: {
    fontSize: 18,
    fontWeight: '900',
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  roleDesc: {
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 18,
    fontWeight: '600',
  },
  footer: {
    marginTop: 64,
  },
});
