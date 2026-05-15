import React, { useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Dimensions, 
  StatusBar 
} from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring, 
  withDelay,
  FadeIn
} from 'react-native-reanimated';
import { useTheme } from '../../constants/theme';
import { Feather as Icon } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default function SplashScreen({ navigation }: any) {
  const { colors, sizes } = useTheme();
  const scale = useSharedValue(0.5);
  const opacity = useSharedValue(0);

  useEffect(() => {
    scale.value = withSpring(1, { damping: 12 });
    opacity.value = withSpring(1);

    const timer = setTimeout(() => {
      navigation.replace('Auth');
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  return (
    <View style={[styles.container, { backgroundColor: colors.black }]}>
      <StatusBar barStyle="light-content" />
      
      <Animated.View style={[styles.logoContainer, animatedStyle]}>
        <View style={[styles.iconBox, { backgroundColor: colors.white }]}>
          <Icon name="zap" size={48} color={colors.black} />
        </View>
        <Text style={[styles.title, { color: colors.white, fontSize: sizes.font_h1 }]}>
          ShareRide
        </Text>
        <Text style={[styles.subtitle, { color: colors.gray400, fontSize: 16 }]}>
          Elevate your commute
        </Text>
      </Animated.View>

      <Animated.View 
        entering={FadeIn.delay(1000).duration(1000)}
        style={styles.footer}
      >
        <Text style={[styles.footerText, { color: colors.gray600 }]}>
          Version 1.0.0
        </Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    alignItems: 'center',
  },
  iconBox: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontWeight: '900',
    letterSpacing: -2,
  },
  subtitle: {
    marginTop: 8,
    fontWeight: '600',
  },
  footer: {
    position: 'absolute',
    bottom: 50,
  },
  footerText: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
  },
});
