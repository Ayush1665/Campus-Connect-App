import { View, Text, Image, StyleSheet, ToastAndroid } from 'react-native'
import React, { useContext, useState } from 'react'
import Colors from '@/data/Colors'
import Button from '../Shared/Button'
import { AuthContext } from '@/context/AuthContext'
import axios from 'axios'

type CLUB = {
  id: number,
  name: string,
  club_logo: string,
  about: string,
  createdon: string
  isFollowed: boolean,
  refreshData: () => void
}

const ClubCard = (club: CLUB) => {
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);

  const onFollowBtnClick = async () => {
  setLoading(true)

  try {
    if (club.isFollowed) {
      await axios.delete(process.env.EXPO_PUBLIC_HOST_URL + '/clubfollower?u_email='+user.email+"&club_id="+club.id);
      
      ToastAndroid.show(`Unfollowed ${club.name}`, ToastAndroid.SHORT);
    } else {
      await axios.post(process.env.EXPO_PUBLIC_HOST_URL + '/clubfollower', {
        u_email: user?.email,
        clubId: club?.id
      });
      
      ToastAndroid.show(`Followed ${club.name}`, ToastAndroid.SHORT);
    }
      club.refreshData();
    
  } catch (err: any) {
    ToastAndroid.show(`Action failed`, ToastAndroid.SHORT);
  } finally {
    setLoading(false)
  }
}

  return (
    <View style={styles.container}>
      <Image
        source={{ uri: club.club_logo }}
        style={styles.logo}
      />
      <Text style={styles.name}>{club.name}</Text>

      <Text numberOfLines={2} style={styles.about}>
        {club.about}
      </Text>

      <Button
        text={club.isFollowed ? 'Unfollow' : 'Follow'}
        loading={loading}
        onPress={onFollowBtnClick}
        outline={club.isFollowed}
      />
    </View>
  )
}

export default ClubCard

const styles = StyleSheet.create({
  container: {
    width: '45%',
    padding: 12,
    backgroundColor: Colors.SURFACE_LIGHT,
    margin: 8,
    alignItems: 'center',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.GRAY_600,
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 10,
    backgroundColor: Colors.GRAY_700,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.WHITE,
    textAlign: 'center',
    marginBottom: 6,
  },
  about: {
    color: Colors.GRAY_400,
    textAlign: 'center',
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 12,
  },
})  