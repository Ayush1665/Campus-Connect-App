import { Image } from 'react-native'
import React, { useContext } from 'react'
import { Tabs } from 'expo-router'
import Ionicons from '@expo/vector-icons/Ionicons'
import { AuthContext } from '@/context/AuthContext'
import Colors from '@/data/Colors'
const TabLayout = () => {
  const { user } = useContext(AuthContext);
  return (
    <Tabs screenOptions={{
      tabBarActiveTintColor: Colors.PRIMARY,
      tabBarInactiveTintColor: Colors.GRAY_500,
      tabBarStyle: {
        backgroundColor: Colors.SURFACE,
        borderTopWidth: 1,
        borderTopColor: Colors.GRAY_800,
        elevation: 8,
        shadowColor: Colors.PRIMARY,
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      tabBarLabelStyle: {
        fontSize: 12,
        fontWeight: '500',
      },
      headerShown: false
    }}>
      <Tabs.Screen name='Home' options={{
        tabBarIcon: ({ color, size }) => <Ionicons name='home' size={size} color={color} />
      }} />
      <Tabs.Screen name='Events' options={{
        tabBarIcon: ({ color, size }) => <Ionicons name='calendar' size={size} color={color} />
      }} />
      <Tabs.Screen name='Clubs' options={{
        tabBarIcon: ({ color, size }) => <Ionicons name='people' size={size} color={color} />
      }} />
      <Tabs.Screen name='Profile' options={{
        tabBarIcon: ({ color, size }) => <Image source={{ uri: user?.image }} style={{
          width: size,
          height: size,
          borderRadius: 99
        }} />
      }} />
    </Tabs>
  )
}

export default TabLayout