import { View, Image, Text,StyleSheet } from 'react-native'
import React from 'react'
import Button from '../Shared/Button'
import Colors from '@/data/Colors'
import { useRouter } from 'expo-router'
import { LinearGradient } from 'expo-linear-gradient'

const EmptyState = () => {
  const router = useRouter();
  
  return (
    <LinearGradient colors={[Colors.SURFACE, Colors.BACKGROUND]} style={styles.container}>
      <View style={styles.content}>
        <Image 
          source={require('./../../assets/images/no_club.png')} 
          style={styles.image}
        />
        <Text style={styles.title}>You are not following any Teams or Clubs</Text>
        <Button 
          text='Explore Now' 
          outline     
          onPress={() => router.push('/explore-clubs')}
        />
      </View>
    </LinearGradient>
  )
}

export default EmptyState

const styles = StyleSheet.create({
  container: { 
    flex: 1 
  },
  content: { 
    flex: 1, 
    padding: 32, 
    paddingTop: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: 200,
    height: 200,
    marginBottom: 24,
  },
  title: {
    fontSize: 18,
    textAlign: 'center', 
    color: Colors.GRAY_400,
    marginBottom: 24,
    fontWeight: '500',
  },
})