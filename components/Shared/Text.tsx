// components/Shared/Text.tsx
import React from 'react'
import { Text as RNText, TextProps, StyleSheet } from 'react-native'
import {useFonts, Poppins_700Bold_Italic, Poppins_300Light } from "@expo-google-fonts/poppins"

const AppText: React.FC<TextProps> = ({ style, children, ...props }) => {
  const [fontLoades] = useFonts({
      Poppins_700Bold_Italic,
      Poppins_300Light
    })
  return (
    <RNText {...props} style={[styles.text, style]}>
      {children}
    </RNText>
  )
}

export default AppText

const styles = StyleSheet.create({
  text: {
    fontFamily: 'Poppins_300Light',               
  },
})
