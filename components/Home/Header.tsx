import { View, Image, StyleSheet, TouchableOpacity } from 'react-native'
import React, { useContext } from 'react'
import Colors from '@/data/Colors'
import { AuthContext } from '@/context/AuthContext'
import Text from '@/components/Shared/Text'
import { useRouter } from 'expo-router'

const Header = () => {
  const { user } = useContext(AuthContext);
  const router=useRouter();
  return (
    <View style={styles.container}>
      <View style={styles.textContainer}>
        <Text style={styles.greeting}>Hey, {user?.name}</Text>
        <Text style={styles.subtitle}>Chitkara University</Text>
      </View>
      <TouchableOpacity onPress={() => router.push('/(tabs)/Profile')}>
      <Image 
        source={{ uri: user?.image }} 
        style={styles.profileImage} 
      />
      </TouchableOpacity>
    </View>
  )
}

export default Header

const styles = StyleSheet.create({
  container: {
    display: 'flex', 
    margin:10,
    flexDirection: 'row', 
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  textContainer: {
    flex: 1
  },
  greeting: { 
    fontSize: 24, 
    color: Colors.PRIMARY, 
    fontWeight: 'bold',
    marginBottom: 4
  },
  subtitle: { 
    fontSize: 14, 
    color: Colors.GRAY_400,
    fontWeight: '500'
  },
  profileImage: { 
    width: 50, 
    height: 50, 
    borderRadius: 25,
    borderWidth: 1.6,
    borderColor: Colors.PRIMARY
  }
});
