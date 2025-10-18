import { AuthContext } from '@/context/AuthContext'
import React, { useContext } from 'react'
import { View, StyleSheet } from 'react-native'
import Colors from '@/data/Colors'
import { LinearGradient } from 'expo-linear-gradient'
import CreateClub from '@/components/Clubs/CreateClub'

const AddClub = () => {
  const { user } = useContext(AuthContext)
  
  return (
    <LinearGradient colors={[Colors.SURFACE, Colors.BACKGROUND]} style={styles.container}>
      <View style={styles.content}>
        <CreateClub/>
      </View>
    </LinearGradient>
  )
}

export default AddClub

const styles = StyleSheet.create({
  container: { 
    flex: 1 
  },
  content: { 
    flex: 1, 
    padding: 32, 
    paddingTop: 24 
  }
})