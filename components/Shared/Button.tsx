import { Text, TouchableOpacity, Animated, StyleSheet, ActivityIndicator } from 'react-native'
import React, { useRef, useEffect } from 'react'
import Colors from '@/data/Colors'

type ButtonProps = {
  text: string,
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  disabled?: boolean;
  loading?: boolean;
  size?: 'small' | 'medium' | 'large';
  outline?: boolean
}

export default function Button({ 
  text, 
  onPress, 
  variant = 'primary', 
  disabled = false, 
  loading = false,
  size = 'medium',
  outline = false 
}: ButtonProps) {
  const scaleAnim = useRef(new Animated.Value(1)).current
  const pulseAnim = useRef(new Animated.Value(1)).current

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start()
  }

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
    }).start()
  }

  // Pulsing animation for loading state
  useEffect(() => {
    if (loading) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 0.95,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
        ])
      ).start()
    }
  }, [loading])

  const getButtonStyle = () => {
    const baseStyle = [styles.button, styles[size]];

    if (outline) {
      return [...baseStyle, styles.outlineButton, (disabled || loading) && styles.buttonDisabled];
    }

    switch (variant) {
      case 'primary':
        return [...baseStyle, styles.primaryButton, (disabled || loading) && styles.buttonDisabled];
      case 'secondary':
        return [...baseStyle, styles.secondaryButton, (disabled || loading) && styles.buttonDisabled];
      case 'outline':
        return [...baseStyle, styles.outlineButton, (disabled || loading) && styles.buttonDisabled];
      default:
        return [...baseStyle, styles.primaryButton, (disabled || loading) && styles.buttonDisabled];
    }
  };

  const getTextStyle = () => {
    if (outline) return [styles.text, styles.outlineText, styles[size + 'Text']];
    
    switch (variant) {
      case 'primary':
        return [styles.text, styles.primaryText, styles[size + 'Text']]
      case 'secondary':
        return [styles.text, styles.secondaryText, styles[size + 'Text']]
      case 'outline':
        return [styles.text, styles.outlineText, styles[size + 'Text']]
      default:
        return [styles.text, styles.primaryText, styles[size + 'Text']]
    }
  }

  return (
    <Animated.View style={[
      { transform: [{ scale: loading ? pulseAnim : scaleAnim }] },
      loading && styles.loadingContainer
    ]}>
      <TouchableOpacity
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled || loading}
        style={getButtonStyle()}
        activeOpacity={0.8}
      >
        {loading ? (
          <ActivityIndicator 
            size="small" 
            color={variant === 'outline' || outline ? Colors.PRIMARY : Colors.WHITE} 
          />
        ) : (
          <Text style={getTextStyle()}>
            {text}
          </Text>
        )}
      </TouchableOpacity>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  loadingContainer: {
    opacity: 0.9,
  },
  button: {
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  small: {
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  medium: {
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  large: {
    paddingVertical: 20,
    paddingHorizontal: 32,
  },
  primaryButton: {
    backgroundColor: Colors.PRIMARY,
  },
  secondaryButton: {
    backgroundColor: Colors.SECONDARY,
  },
  outlineButton: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: Colors.PRIMARY,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  text: {
    fontWeight: '600',
    letterSpacing: 0.5,
    textAlign: 'center',
  },
  smallText: {
    fontSize: 14,
  },
  mediumText: {
    fontSize: 16,
  },
  largeText: {
    fontSize: 18,
  },
  primaryText: {
    color: Colors.WHITE,
  },
  secondaryText: {
    color: Colors.WHITE,
  },
  outlineText: {
    color: Colors.PRIMARY,
  },
})