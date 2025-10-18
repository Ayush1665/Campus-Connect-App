import { View, TextInput, StyleSheet, Animated } from 'react-native'
import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react'
import Colors from '@/data/Colors'
import Text from '@/components/Shared/Text'
import { useFonts, Poppins_700Bold_Italic, Poppins_300Light } from "@expo-google-fonts/poppins";

type TextInputFieldProps = {
  label: string,
  onChangeText: (text: string) => void,
  password?: boolean,
  error?: string,
  icon?: React.ReactNode
}

const TextInputField = React.memo(({ label, onChangeText, password = false, error, icon }: TextInputFieldProps) => {
  const [isFocused, setIsFocused] = useState(false)
  const [value, setValue] = useState('')
  const animatedValue = useRef(new Animated.Value(0)).current

  const [fontsLoaded] = useFonts({
    Poppins_700Bold_Italic,
    Poppins_300Light
  });


  // Memoized animation config
  const animationConfig = useMemo(() => ({
    toValue: isFocused || value ? 1 : 0,
    duration: 200,
    useNativeDriver: false,
  }), [isFocused, value])

  useEffect(() => {
    Animated.timing(animatedValue, animationConfig).start()
  }, [animationConfig])

  // Memoized label styles
  const labelStyle = useMemo(() => ({
    position: 'absolute' as 'absolute',
    left: 12,
    top: animatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: [18, -8],
    }),
    fontSize: animatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: [16, 12],
    }),
    color: animatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: [Colors.GRAY_400, Colors.PRIMARY],
    }),
    backgroundColor: Colors.SURFACE,
    paddingHorizontal: 4,
    zIndex: 1,
  }), [animatedValue])

  const handleTextChange = useCallback((text: string) => {
    setValue(text)
    onChangeText(text)
  }, [onChangeText])

  const handleFocus = useCallback(() => setIsFocused(true), [])
  const handleBlur = useCallback(() => setIsFocused(false), [])

  // Memoized text input style
  const textInputStyle = useMemo(() => [
    styles.textInput,
    isFocused && styles.textInputFocused,
    error && styles.textInputError,
    icon && styles.textInputWithIcon
  ], [isFocused, error, icon])

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        {icon && <View style={styles.iconContainer}>{icon}</View>}
        <Animated.Text style={labelStyle}>{label}</Animated.Text>
        <TextInput 
          placeholder=""
          style={textInputStyle}
          secureTextEntry={password}
          onChangeText={handleTextChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          value={value}
          placeholderTextColor={Colors.GRAY_500}
        />
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  )
})

// Fix display name for React DevTools
TextInputField.displayName = 'TextInputField'

export default TextInputField


const styles = StyleSheet.create({
  container: {
    marginVertical: 12,
  },
  inputContainer: {
    position: 'relative',
  },
  iconContainer: {
    position: 'absolute',
    left: 16,
    top: 16,
    zIndex: 2,
  },
  textInput: {
    padding: 16,
    paddingLeft: 20,
    borderWidth: 1.5,
    borderColor: Colors.GRAY_700,
    borderRadius: 16,
    fontSize: 16,
    color: Colors.WHITE,
    backgroundColor: Colors.SURFACE,
    fontFamily: 'Poppins_300Light',
  },
  textInputFocused: {
    borderColor: Colors.PRIMARY,
  },
  textInputError: {
    borderColor: Colors.ERROR,
  },
  textInputWithIcon: {
    paddingLeft: 52,
  },
  errorText: {
    color: Colors.ERROR,
    fontSize: 12,
    marginTop: 6,
    marginLeft: 16,
  },
})