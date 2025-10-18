import { View, Text, Image, StyleSheet, Alert, ActivityIndicator, Modal, } from 'react-native'
import React, { useContext, useState } from 'react'
import Colors from '@/data/Colors'
import Ionicons from '@expo/vector-icons/Ionicons'
import Button from '../Shared/Button'
import axios from 'axios'
import { AuthContext } from '@/context/AuthContext'
import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';

type EVENT = {
  id: number,
  name: string,
  bannerurl: string,
  location: string,
  link: string,
  event_date: string,
  event_time: string,
  createdby: string,
  username: string,
  isRegistered: boolean
}

const EventCard = (event: EVENT) => {
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [isRegistered, setIsRegistered] = useState(event.isRegistered);

  const RegisterForEvent = () => {
    Alert.alert('Register for event?', 'Do you want to register for this event?', [
      {
        text: 'Yes',
        onPress: () => {
          saveEventRegistration();
        }
      },
      {
        text: 'Cancel',
        onPress: () => {},
        style: 'cancel'
      },
    ])
  }

  const saveEventRegistration = async () => {
    setLoading(true)
    try {
      const result = await axios.post(
        process.env.EXPO_PUBLIC_HOST_URL + '/event-register',
        {
          eventId: event.id,
          userEmail: user?.email,
        }
      )
      if (result.data.length > 0) {
        Alert.alert('Info', 'You have already registered for this event.')
        setIsRegistered(true);
      } else {
        Alert.alert('Great!', 'You successfully registered for the event!')
        setIsRegistered(true);
      }
    } catch (err) {
      console.log(err)
      Alert.alert('Error', 'Something went wrong!')
    } finally {
      setLoading(false)
    }
  }

  const shareImage = async (event: any) => {
    try {
      const fileUri = FileSystem.documentDirectory + 'shared-image.jpg';
      const { uri } = await FileSystem.downloadAsync(event.bannerurl, fileUri);

      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(uri, {
          dialogTitle: 'Check out this image',
          mimeType: 'image/jpeg',
          UTI: 'public.jpeg',
        });
      } else {
        Alert.alert('Sharing is not available on this device');
      }
    } catch (error) {
      console.log('Error Sharing image:', error);
      Alert.alert('Error', 'Could not share the image');
    }
  };

  return (
    <View style={styles.container}>
      <Modal
        visible={loading}
        transparent={true}
        animationType="fade"
        statusBarTranslucent={true}
      >
        <View style={styles.simpleFullScreenOverlay}>
          <ActivityIndicator size="large" color={Colors.PRIMARY} />
          <Text style={styles.simpleLoadingText}>Please wait a moment...</Text>
        </View>
      </Modal>

      <Image source={{ uri: event.bannerurl }} style={styles.bannerImage} />

      <Text style={styles.eventName}>{event.name}</Text>

      <Text style={styles.organizer}>
        Event by <Text style={styles.username}>{event.username}</Text>
      </Text>

      <View style={styles.detailContainer}>
        <Ionicons name="location-outline" size={20} color={Colors.GRAY_400} />
        <Text style={styles.detailText}>{event.location}</Text>
      </View>

      <View style={styles.detailContainer}>
        <Ionicons name="calendar-outline" size={20} color={Colors.GRAY_400} />
        <Text style={styles.detailText}>
          {event.event_date} at {event.event_time}
        </Text>
      </View>

      <View style={styles.buttonContainer}>
        {!isRegistered ? (
          <>
            <Button text="Register" onPress={RegisterForEvent} />
            <Button text="Share" outline onPress={() => shareImage(event)} />
          </>
        ) : (
          <>
            <Button 
              text="Registered" 
              onPress={() => {}} 
              disabled={true}
              style={styles.registeredButton}
            />
            <Button text="Share" outline onPress={() => shareImage(event)} />
          </>
        )}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.SURFACE_LIGHT,
    borderRadius: 12,
    margin: 16,
    marginVertical: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.GRAY_600,
  },
  bannerImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 12,
  },
  eventName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.WHITE,
    marginBottom: 4,
  },
  organizer: {
    fontSize: 14,
    color: Colors.GRAY_400,
    marginBottom: 12,
  },
  username: {
    color: Colors.PRIMARY,
    fontWeight: '600',
  },
  detailContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  detailText: {
    fontSize: 14,
    color: Colors.GRAY_300,
    flex: 1,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent:'space-between',
    gap: 12,
    marginTop: 16,
  },
  registeredButton: {
    backgroundColor: Colors.GRAY_600,
    borderColor: Colors.GRAY_500,
  },
  simpleFullScreenOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  simpleLoadingText: {
    color: Colors.WHITE,
    marginTop: 16,
    fontSize: 16,
  },
});

export default EventCard;