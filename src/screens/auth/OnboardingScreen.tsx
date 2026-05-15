import React from 'react';
import { View, Text, StyleSheet, Dimensions, Image, SafeAreaView } from 'react-native';
import { useTheme } from '../../constants/theme';
import { useNavigation } from '@react-navigation/native';
import { Button } from '../../components/Button';
import Animated, { FadeInUp, FadeInDown } from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');

export default function OnboardingScreen() {
  const { colors, sizes, spacing } = useTheme();
  const navigation = useNavigation<any>();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.white }]}>
      <View style={styles.content}>
        <Animated.View entering={FadeInUp.delay(200).duration(800)} style={styles.imageContainer}>
          <Image 
            source={{ uri: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=800' }} 
            style={styles.image}
            resizeMode="cover"
          />
          <View style={[styles.overlay, { backgroundColor: 'rgba(0,0,0,0.4)' }]} />
        </Animated.View>

        <View style={styles.textContainer}>
          <Animated.Text 
            entering={FadeInDown.delay(400).duration(800)} 
            style={[styles.title, { color: colors.black, fontSize: sizes.font_h2 }]}
          >
            Ride sharing made simple.
          </Animated.Text>
          <Animated.Text 
            entering={FadeInDown.delay(600).duration(800)} 
            style={[styles.description, { color: colors.gray600, fontSize: sizes.font_body }]}
          >
            Connect with people traveling to the same destination. Save money, meet friends, and help the environment.
          </Animated.Text>
        </View>
      </View>

      <Animated.View entering={FadeInDown.delay(800).duration(800)} style={styles.footer}>
        <Button 
          title="Get Started" 
          onPress={() => navigation.navigate('Signup')} 
          variant="primary" 
          size="lg"
        />
        <Button 
          title="Sign In" 
          onPress={() => navigation.navigate('Login')} 
          variant="outline" 
          size="lg"
          style={{ marginTop: 12 }}
        />
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  imageContainer: {
    width: width,
    height: height * 0.55,
    overflow: 'hidden',
    borderBottomRightRadius: 80,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
  },
  textContainer: {
    padding: 32,
    paddingTop: 40,
  },
  title: {
    fontWeight: '800',
    lineHeight: 44,
    letterSpacing: -1,
  },
  description: {
    marginTop: 16,
    lineHeight: 24,
  },
  footer: {
    padding: 32,
    paddingBottom: 40,
  },
});
