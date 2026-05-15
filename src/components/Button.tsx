import React from 'react';
import { 
  Pressable, 
  Text, 
  StyleSheet, 
  ActivityIndicator, 
  ViewStyle, 
  TextStyle, 
  View,
  Platform
} from 'react-native';
import { useTheme } from '../constants/theme';

export interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle | ViewStyle[];
  textStyle?: TextStyle;
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  style,
  textStyle,
  icon,
}) => {
  const { colors, sizes, shadows } = useTheme();

  const getBaseStyle = (): ViewStyle => ({
    borderRadius: sizes.radius_pill,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  });

  const getVariantStyle = (pressed: boolean): ViewStyle => {
    switch (variant) {
      case 'primary':
        return {
          backgroundColor: pressed ? '#333333' : colors.black,
          ...shadows.medium,
        };
      case 'secondary':
        return {
          backgroundColor: pressed ? colors.hoverGray : colors.white,
          ...shadows.light,
        };
      case 'outline':
        return {
          backgroundColor: pressed ? 'rgba(0,0,0,0.05)' : 'transparent',
          borderWidth: 1.5,
          borderColor: colors.black,
        };
      case 'ghost':
        return {
          backgroundColor: pressed ? 'rgba(0,0,0,0.05)' : 'transparent',
        };
      default:
        return { backgroundColor: colors.black };
    }
  };

  const getSizeStyle = (): ViewStyle => {
    switch (size) {
      case 'sm':
        return { height: 40, paddingHorizontal: 16 };
      case 'md':
        return { height: 52, paddingHorizontal: 24 };
      case 'lg':
        return { height: 60, paddingHorizontal: 32 };
      default:
        return { height: 52, paddingHorizontal: 24 };
    }
  };

  const getTextStyle = (): TextStyle => {
    const baseText: TextStyle = {
      fontWeight: '700',
      fontSize: size === 'sm' ? sizes.font_caption : sizes.font_body,
      letterSpacing: -0.2,
    };

    switch (variant) {
      case 'primary':
        return { ...baseText, color: colors.white };
      case 'secondary':
      case 'outline':
      case 'ghost':
        return { ...baseText, color: colors.black };
      default:
        return baseText;
    }
  };

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }) => [
        getBaseStyle(),
        getSizeStyle(),
        getVariantStyle(pressed),
        ...(Array.isArray(style) ? style : [style || {}]),
        (disabled || loading) && { opacity: 0.5 },
      ]}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'primary' ? colors.white : colors.black} />
      ) : (
        <>
          {icon && <View style={styles.iconContainer}>{icon}</View>}
          <Text style={[getTextStyle(), textStyle]}>{title}</Text>
        </>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  iconContainer: {
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
