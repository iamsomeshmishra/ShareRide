import React from 'react';
import { View, TextInput, Text, StyleSheet, ViewStyle, TextInputProps } from 'react-native';
import { useTheme } from '../constants/theme';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  containerStyle?: ViewStyle;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  containerStyle,
  ...props
}) => {
  const { colors, sizes } = useTheme();

  return (
    <View style={[styles.container, containerStyle]}>
      {label && (
        <Text style={[styles.label, { color: colors.black, fontSize: sizes.font_caption }]}>
          {label}
        </Text>
      )}
      <TextInput
        style={[
          styles.input,
          {
            backgroundColor: colors.white,
            borderRadius: sizes.radius_sm,
            color: colors.black,
            fontSize: sizes.font_body,
            borderColor: error ? colors.error : colors.black,
            borderWidth: 1,
          },
        ]}
        placeholderTextColor={colors.mutedGray}
        {...props}
      />
      {error && (
        <Text style={[styles.error, { color: colors.error, fontSize: sizes.font_micro }]}>
          {error}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: 16,
  },
  label: {
    marginBottom: 8,
    fontWeight: '500',
  },
  input: {
    height: 56,
    paddingHorizontal: 16,
  },
  error: {
    marginTop: 4,
  },
});
