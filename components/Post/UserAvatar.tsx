import Colors from '@/data/Colors'
import React from 'react'
import { Text, View, Image, StyleSheet } from 'react-native'
import Ionicons from '@expo/vector-icons/Ionicons'
import moment from 'moment';

type USER_AVATAR = {
  name: string,
  image: string,
  date: string
}

const UserAvatar = ({ name, image, date }: USER_AVATAR) => {
  return (
    <View style={styles.container}>
      <View style={styles.userInfo}>
        <Image source={{ uri: image }} style={styles.avatarImage} />
        <View style={styles.textContainer}>
          <Text style={styles.name} numberOfLines={1}>{name}</Text>
          <Text style={styles.date}>{moment(date).fromNow()}</Text>
        </View>
      </View>
      <Ionicons name="ellipsis-vertical" size={20} color={Colors.GRAY_400} />
    </View>
  )
}

export default UserAvatar

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  userInfo: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
    flex: 1,
  },
  avatarImage: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.GRAY_200,
  },
  textContainer: {
    flex: 1,
    gap: 4,
  },
  name: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.GRAY_100,
  },
  date: {
    fontSize: 13,
    color: Colors.GRAY_400,
    fontWeight: '500',
  },
})