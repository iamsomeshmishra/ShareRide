import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  SafeAreaView, 
  ScrollView,
  StatusBar
} from 'react-native';
import { Feather as Icon } from '@expo/vector-icons';
import { useTheme } from '../../constants/theme';
import { useAuthStore } from '../../store/useAuthStore';
import Animated, { FadeInUp, FadeInRight } from 'react-native-reanimated';

export default function ProfileScreen() {
  const { colors, sizes, shadows, spacing } = useTheme();
  const { user, logout, setRole } = useAuthStore();

  const menuItems = [
    { icon: 'user', label: 'Personal Information', sublabel: 'Name, email, phone number' },
    { icon: 'credit-card', label: 'Payments & Payouts', sublabel: 'Manage your payment methods' },
    { icon: 'clock', label: 'Ride History', sublabel: 'Your past rides and bookings' },
    { icon: 'shield', label: 'Safety & Verification', sublabel: 'Keep your account secure' },
    { icon: 'bell', label: 'Notifications', sublabel: 'Push, email & SMS' },
    { icon: 'settings', label: 'Settings', sublabel: 'Privacy and app preferences' },
  ];

  const handleSwitchRole = () => {
    const newRole = user?.role === 'passenger' ? 'rider' : 'passenger';
    setRole(newRole);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.white }]}>
      <StatusBar barStyle="dark-content" />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <Animated.View entering={FadeInUp.duration(800)} style={styles.header}>
          <View style={[styles.avatarContainer, { backgroundColor: colors.gray50, borderWidth: 1, borderColor: colors.gray100 }]}>
            <Icon name="user" size={40} color={colors.black} />
            <TouchableOpacity style={[styles.editAvatar, { backgroundColor: colors.black }]}>
              <Icon name="camera" size={14} color={colors.white} />
            </TouchableOpacity>
          </View>
          
          <View style={styles.userInfo}>
            <Text style={[styles.name, { color: colors.black }]}>{user?.name || 'User Name'}</Text>
            <Text style={[styles.email, { color: colors.gray500 }]}>{user?.email || 'user@example.com'}</Text>
          </View>
        </Animated.View>

        <Animated.View entering={FadeInUp.delay(200).duration(800)} style={styles.roleContainer}>
          <View style={[styles.roleCard, { backgroundColor: colors.gray50, borderWidth: 1, borderColor: colors.gray100 }]}>
            <View style={styles.roleInfo}>
              <Text style={[styles.roleLabel, { color: colors.gray500 }]}>ACTIVE MODE</Text>
              <Text style={[styles.roleName, { color: colors.black }]}>
                {user?.role === 'rider' ? 'Rider (Driver)' : 'Passenger'}
              </Text>
            </View>
            <TouchableOpacity 
              style={[styles.switchBtn, { backgroundColor: colors.black }]}
              onPress={handleSwitchRole}
            >
              <Text style={styles.switchBtnText}>Switch</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>

        <View style={styles.menuSection}>
          <Text style={[styles.sectionTitle, { color: colors.gray400 }]}>ACCOUNT SETTINGS</Text>
          {menuItems.map((item, index) => (
            <Animated.View 
              key={index} 
              entering={FadeInRight.delay(300 + index * 50).duration(600)}
            >
              <TouchableOpacity style={styles.menuItem}>
                <View style={[styles.menuIcon, { backgroundColor: colors.gray50 }]}>
                  <Icon name={item.icon as any} size={20} color={colors.black} />
                </View>
                <View style={styles.menuTextContainer}>
                  <Text style={[styles.menuLabel, { color: colors.black }]}>{item.label}</Text>
                  <Text style={[styles.menuSublabel, { color: colors.gray500 }]}>{item.sublabel}</Text>
                </View>
                <Icon name="chevron-right" size={18} color={colors.gray300} />
              </TouchableOpacity>
            </Animated.View>
          ))}
        </View>

        <TouchableOpacity
          style={[styles.logoutButton, { borderColor: colors.gray100, backgroundColor: colors.gray50 }]}
          onPress={logout}
        >
          <Icon name="log-out" size={18} color={colors.black} />
          <Text style={[styles.logoutText, { color: colors.black }]}>Sign Out</Text>
        </TouchableOpacity>

        <Text style={[styles.versionText, { color: colors.gray300 }]}>Version 1.0.4 • ShareRide Premium</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { padding: 24, paddingBottom: 40 },
  header: { flexDirection: 'row', alignItems: 'center', marginTop: 12, marginBottom: 32 },
  avatarContainer: { width: 88, height: 88, borderRadius: 44, justifyContent: 'center', alignItems: 'center', position: 'relative' },
  editAvatar: { position: 'absolute', bottom: 4, right: 0, width: 28, height: 28, borderRadius: 14, justifyContent: 'center', alignItems: 'center', borderWidth: 3, borderColor: '#FFF' },
  userInfo: { marginLeft: 20, flex: 1 },
  name: { fontSize: 24, fontWeight: '900', letterSpacing: -1 },
  email: { fontSize: 14, marginTop: 2, fontWeight: '600', letterSpacing: -0.2 },
  roleContainer: { marginBottom: 40 },
  roleCard: { flexDirection: 'row', alignItems: 'center', padding: 24, borderRadius: 24, justifyContent: 'space-between' },
  roleInfo: { flex: 1 },
  roleLabel: { fontSize: 10, fontWeight: '900', letterSpacing: 1, marginBottom: 6 },
  roleName: { fontSize: 18, fontWeight: '800', letterSpacing: -0.5 },
  switchBtn: { paddingHorizontal: 20, paddingVertical: 10, borderRadius: 100 },
  switchBtnText: { color: '#FFF', fontSize: 13, fontWeight: '800', letterSpacing: -0.2 },
  menuSection: { marginBottom: 32 },
  sectionTitle: { fontSize: 11, fontWeight: '900', letterSpacing: 1, marginBottom: 20 },
  menuItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 16 },
  menuIcon: { width: 48, height: 48, borderRadius: 16, justifyContent: 'center', alignItems: 'center', marginRight: 16 },
  menuTextContainer: { flex: 1 },
  menuLabel: { fontSize: 16, fontWeight: '800', letterSpacing: -0.4 },
  menuSublabel: { fontSize: 13, marginTop: 3, fontWeight: '500', letterSpacing: -0.2 },
  logoutButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 18, borderRadius: 20, borderWidth: 1, marginTop: 12 },
  logoutText: { fontWeight: '800', marginLeft: 12, fontSize: 16, letterSpacing: -0.3 },
  versionText: { textAlign: 'center', marginTop: 40, fontSize: 12, fontWeight: '700', letterSpacing: 0.5, textTransform: 'uppercase' },
});

