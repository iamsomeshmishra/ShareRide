import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView,
  KeyboardAvoidingView, 
  Platform,
  Pressable,
  SafeAreaView
} from 'react-native';
import { useTheme } from '../../constants/theme';
import { useNavigation } from '@react-navigation/native';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { Feather as Icon } from '@expo/vector-icons';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';

export default function SignupScreen() {
  const { colors, sizes, spacing, shadows } = useTheme();
  const navigation = useNavigation<any>();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignup = () => {
    if (!name || !email) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigation.navigate('OTP', { email, name });
    }, 1000);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.white }]}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent} 
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Pressable 
            onPress={() => navigation.goBack()} 
            style={({ pressed }) => [
              styles.backButton,
              { opacity: pressed ? 0.6 : 1 }
            ]}
          >
            <Icon name="arrow-left" size={24} color={colors.black} />
          </Pressable>

          <Animated.View entering={FadeIn.duration(800)} style={styles.header}>
            <Text style={[styles.title, { color: colors.black, fontSize: sizes.font_h2 }]}>
              Create account
            </Text>
            <Text style={[styles.subtitle, { color: colors.gray500, fontSize: sizes.font_body }]}>
              Join the community. Moving together, saving together.
            </Text>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(200).duration(800)} style={styles.form}>
            <Input
              label="Full Name"
              placeholder="e.g. John Doe"
              value={name}
              onChangeText={setName}
              autoCapitalize="words"
            />
            
            <View style={{ height: 16 }} />

            <Input
              label="Email"
              placeholder="name@example.com"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
            />

            <Button
              title="Create Account"
              onPress={handleSignup}
              variant="primary"
              size="lg"
              loading={loading}
              disabled={!name || !email}
              style={{ marginTop: 32 }}
            />
          </Animated.View>

          <View style={styles.dividerContainer}>
            <View style={[styles.divider, { backgroundColor: colors.gray200 }]} />
            <Text style={[styles.dividerText, { color: colors.gray400, backgroundColor: colors.white }]}>or</Text>
          </View>

          <Animated.View entering={FadeInDown.delay(400).duration(800)} style={styles.socialButtons}>
            <Button
              title="Continue with Google"
              onPress={() => {}}
              variant="outline"
              size="lg"
              icon={<Icon name="chrome" size={20} color={colors.black} />}
            />
            <Button
              title="Continue with Apple"
              onPress={() => {}}
              variant="outline"
              size="lg"
              style={{ marginTop: 12 }}
              icon={<Icon name="command" size={20} color={colors.black} />}
            />
          </Animated.View>

          <View style={styles.termsContainer}>
            <Text style={[styles.termsText, { color: colors.gray500 }]}>
              By signing up, you agree to our{' '}
              <Text style={[styles.termsLink, { color: colors.black }]}>Terms of Service</Text> and{' '}
              <Text style={[styles.termsLink, { color: colors.black }]}>Privacy Policy</Text>.
            </Text>
          </View>

          <View style={styles.footer}>
            <Text style={[styles.footerText, { color: colors.gray500 }]}>
              Already have an account?{' '}
            </Text>
            <Pressable onPress={() => navigation.navigate('Login')}>
              <Text style={[styles.link, { color: colors.black }]}>Sign in</Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
    paddingTop: 12,
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
    letterSpacing: -0.8,
  },
  subtitle: {
    marginTop: 8,
    lineHeight: 22,
  },
  form: {
    width: '100%',
  },
  dividerContainer: {
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 12,
  },
  divider: {
    width: '100%',
    height: 1,
  },
  dividerText: {
    position: 'absolute',
    paddingHorizontal: 16,
    fontSize: 14,
    fontWeight: '600',
  },
  socialButtons: {
    width: '100%',
  },
  termsContainer: {
    marginTop: 32,
  },
  termsText: {
    fontSize: 12,
    lineHeight: 18,
    textAlign: 'center',
  },
  termsLink: {
    fontWeight: '700',
    textDecorationLine: 'underline',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 40,
    paddingBottom: 32,
  },
  footerText: {
    fontSize: 15,
  },
  link: {
    fontSize: 15,
    fontWeight: '700',
    textDecorationLine: 'underline',
  },
});
