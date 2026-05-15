import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  KeyboardAvoidingView, 
  Platform,
  Pressable,
  SafeAreaView
} from 'react-native';
import { useTheme } from '../../constants/theme';
import { useAuthStore } from '../../store/useAuthStore';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Animated, { FadeInUp } from 'react-native-reanimated';

export default function OTPScreen({ route, navigation }: any) {
  const { email } = route.params || {};
  const { colors, sizes, spacing } = useTheme();
  const setUser = useAuthStore(state => state.setUser);
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);

  const handleVerify = () => {
    if (otp.length < 6) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setUser({
        id: '1',
        name: 'John Doe',
        email: email || 'john@example.com',
        role: 'passenger',
        profileCompleted: false, // Force role selection
      });
    }, 1000);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.white }]}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <View style={styles.content}>
          <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
            <Icon name="arrow-left" size={28} color={colors.black} />
          </Pressable>

          <Animated.View entering={FadeInUp.duration(600)} style={styles.header}>
            <Text style={[styles.title, { color: colors.black, fontSize: sizes.font_h3 }]}>
              Check your email
            </Text>
            <Text style={[styles.subtitle, { color: colors.gray500, fontSize: sizes.font_body }]}>
              We've sent a 6-digit verification code to{' '}
              <Text style={{ color: colors.black, fontWeight: '700' }}>{email || 'your email'}</Text>
            </Text>
          </Animated.View>

          <View style={styles.form}>
            <Input
              placeholder="0 0 0 0 0 0"
              value={otp}
              onChangeText={setOtp}
              keyboardType="number-pad"
              maxLength={6}
              style={styles.otpInput}
            />

            <Button
              title="Verify Code"
              onPress={handleVerify}
              variant="primary"
              size="lg"
              loading={loading}
              disabled={otp.length < 6}
              style={{ marginTop: 32 }}
            />
          </View>

          <View style={styles.resendContainer}>
            <Text style={[styles.resendText, { color: colors.gray500 }]}>
              Didn't receive the code?{' '}
            </Text>
            <Pressable onPress={() => {}}>
              <Text style={[styles.resendLink, { color: colors.black }]}>Resend</Text>
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
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
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    marginBottom: 32,
  },
  header: {
    marginBottom: 40,
  },
  title: {
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  subtitle: {
    marginTop: 8,
    lineHeight: 22,
  },
  form: {
    width: '100%',
  },
  otpInput: {
    fontSize: 28,
    textAlign: 'center',
    letterSpacing: 12,
    fontWeight: '800',
  },
  resendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 32,
  },
  resendText: {
    fontSize: 15,
  },
  resendLink: {
    fontSize: 15,
    fontWeight: '700',
    textDecorationLine: 'underline',
  },
});
