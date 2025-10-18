import UserAvatar from '@/components/Post/UserAvatar'
import WritePost from '@/components/Post/WritePost'
import { AuthContext } from '@/context/AuthContext'
import React, { useContext } from 'react'
import { View, StyleSheet } from 'react-native'
import Colors from '@/data/Colors'
import { LinearGradient } from 'expo-linear-gradient'

const AddPost = () => {
  const { user } = useContext(AuthContext)
  
  return (
    <LinearGradient colors={[Colors.SURFACE, Colors.BACKGROUND]} style={styles.container}>
      <View style={styles.content}>
        <UserAvatar name={user?.name} image={user?.image} date='Now' />
        <WritePost/>
      </View>
    </LinearGradient>
  )
}

export default AddPost

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