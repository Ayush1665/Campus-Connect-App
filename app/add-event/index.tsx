import { View, Text, TouchableOpacity, ToastAndroid, Image, ActivityIndicator, StyleSheet, Modal, Pressable } from 'react-native'
import React, { useCallback, useContext, useState } from 'react'
import Colors from '@/data/Colors'
import * as ImagePicker from 'expo-image-picker'
import TextInputField from '@/components/Shared/TextInputField'
import { LinearGradient } from 'expo-linear-gradient'
import RNDateTimePicker from '@react-native-community/datetimepicker'
import moment from 'moment'
import axios from 'axios'
import { cld, options } from '@/configs/CloudinaryConfig'
import { upload } from 'cloudinary-react-native'
import { AuthContext } from '@/context/AuthContext'
import { useRouter } from 'expo-router'
import Ionicons from '@expo/vector-icons/Ionicons'

const AddEvent = () => {
  const [image, setImage] = useState<string>()
  const [eventName, setEventName] = useState<string>('')
  const [location, setLocation] = useState<string>('')
  const [link, setLink] = useState<string>('')

  const [time, setTime] = useState('Select Time')
  const [date, setDate] = useState('Select Date')
  const [openTimePicker, setOpenTimePicker] = useState(false)
  const [openDatePicker, setOpenDatePicker] = useState(false)
  const [loading, setLoading] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [showErrorModal, setShowErrorModal] = useState(false)
  const [showMissingInfoModal, setShowMissingInfoModal] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const { user } = useContext(AuthContext);
  const router = useRouter();

  const pickImage = useCallback(async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
    })

    if (!result.canceled) {
      setImage(result.assets[0].uri)
      ToastAndroid.show('Image added', ToastAndroid.SHORT)
    }
  }, [])

  const onTimeChange = (_: any, selectedDate?: Date) => {
    setOpenTimePicker(false)
    if (selectedDate) setTime(moment(selectedDate).format('hh:mm a'))
  }

  const onDateChange = (_: any, selectedDate?: Date) => {
    setOpenDatePicker(false)
    if (selectedDate) setDate(moment(selectedDate).format('DD MMM YYYY'))
  }

  const onSubmitBtnPress = async () => {
    if (!image || !eventName || !location || !date || !time) {
      setShowMissingInfoModal(true)
      return
    }
    setLoading(true)

    upload(cld, {
      file: image,
      options,
      callback: async (error, resp) => {
        if (error) {
          setErrorMessage(error.message)
          setShowErrorModal(true)
          setLoading(false)
          return
        }

        if (resp?.url) {
          try {
            await axios.post(process.env.EXPO_PUBLIC_HOST_URL + '/events', {
              eventName,
              bannerUrl: resp.url || resp.secure_url,
              location,
              link,
              eventDate: date,
              eventTime: time,
              email: user?.email,
            })
            setShowSuccessModal(true)
          } catch (err) {
            setErrorMessage('Failed to add event')
            setShowErrorModal(true)
          } finally {
            setLoading(false)
          }
        }
      },
    })
  }

  const handleSuccessConfirm = () => {
    setShowSuccessModal(false)
    router.replace('/(tabs)/Events')
  }

  return (
    <LinearGradient colors={[Colors.SURFACE, Colors.BACKGROUND]} style={styles.container}>
      <View style={styles.content}>
        <TouchableOpacity onPress={pickImage} style={styles.imageContainer}>
          <Image
            source={image ? { uri: image } : require('./../../assets/images/add.png')}
            style={styles.image}
          />
        </TouchableOpacity>

        <View style={styles.form}>
          <TextInputField label="Event Name" onChangeText={setEventName} />
          <TextInputField label="Location" onChangeText={setLocation} />
          <TextInputField label="Link for Event" onChangeText={setLink} />

          <View style={styles.datetimeContainer}>
            <TouchableOpacity 
              style={[
                styles.datetimeButton,
                date !== 'Select Date' && styles.datetimeButtonSelected
              ]} 
              onPress={() => setOpenDatePicker(true)}
            >
              <Text style={[
                styles.datetimeButtonText,
                date !== 'Select Date' && styles.datetimeButtonTextSelected
              ]}>
                {date}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[
                styles.datetimeButton,
                time !== 'Select Time' && styles.datetimeButtonSelected
              ]} 
              onPress={() => setOpenTimePicker(true)}
            >
              <Text style={[
                styles.datetimeButtonText,
                time !== 'Select Time' && styles.datetimeButtonTextSelected
              ]}>
                {time}
              </Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity 
            style={styles.submitButton}
            onPress={onSubmitBtnPress}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator size="small" color={Colors.WHITE} />
            ) : (
              <Text style={styles.submitButtonText}>Submit</Text>
            )}
          </TouchableOpacity>
        </View>

        {openDatePicker && (
          <RNDateTimePicker
            mode="date"
            value={new Date()}
            onChange={onDateChange}
          />
        )}
        {openTimePicker && (
          <RNDateTimePicker
            mode="time"
            value={new Date()}
            onChange={onTimeChange}
          />
        )}
      </View>

      {/* Success Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={showSuccessModal}
        onRequestClose={handleSuccessConfirm}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Ionicons name="checkmark-circle" size={32} color={Colors.SUCCESS} />
              <Text style={styles.modalTitle}>Great!</Text>
            </View>
            
            <Text style={styles.modalMessage}>
              New Event added successfully!
            </Text>

            <View style={styles.modalButtons}>
              <Pressable 
                style={[styles.modalButton, styles.confirmButton]}
                onPress={handleSuccessConfirm}
              >
                <Text style={styles.confirmButtonText}>Ok</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      {/* Error Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={showErrorModal}
        onRequestClose={() => setShowErrorModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Ionicons name="alert-circle" size={32} color={Colors.ERROR} />
              <Text style={styles.modalTitle}>Error</Text>
            </View>
            
            <Text style={styles.modalMessage}>
              {errorMessage}
            </Text>

            <View style={styles.modalButtons}>
              <Pressable 
                style={[styles.modalButton, styles.confirmButton]}
                onPress={() => setShowErrorModal(false)}
              >
                <Text style={styles.confirmButtonText}>Ok</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      {/* Missing Info Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={showMissingInfoModal}
        onRequestClose={() => setShowMissingInfoModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Ionicons name="information-circle" size={32} color={Colors.WARNING} />
              <Text style={styles.modalTitle}>Missing Info</Text>
            </View>
            
            <Text style={styles.modalMessage}>
              Please fill all fields to continue.
            </Text>

            <View style={styles.modalButtons}>
              <Pressable 
                style={[styles.modalButton, styles.confirmButton]}
                onPress={() => setShowMissingInfoModal(false)}
              >
                <Text style={styles.confirmButtonText}>Ok</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </LinearGradient>
  )
}

export default AddEvent

const styles = StyleSheet.create({
  container: { 
    flex: 1 
  },
  content: {
    flex: 1,
    padding: 24,
    paddingTop: 24,
  },
  imageContainer: {
    alignSelf: 'center',
    marginBottom: 24,
  },
  image: {
    width: 140,
    height: 140,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: Colors.GRAY_600,
    borderStyle: 'dashed',
  },
  form: {
    gap: 2,
  },
  datetimeContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
    marginBottom: 30,
  },
  datetimeButton: {
    flex: 1,
    paddingVertical: 16,
    paddingHorizontal: 12,
    backgroundColor: Colors.GRAY_800,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.GRAY_600,
    alignItems: 'center',
    justifyContent: 'center',
  },
  datetimeButtonSelected: {
    backgroundColor: Colors.PRIMARY + '20',
    borderColor: Colors.PRIMARY,
  },
  datetimeButtonText: {
    color: Colors.GRAY_400,
    fontSize: 16,
    fontWeight: '500',
  },
  datetimeButtonTextSelected: {
    color: Colors.PRIMARY,
    fontWeight: '600',
  },
  submitButton: {
    backgroundColor: Colors.PRIMARY,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 56,
  },
  submitButtonText: {
    color: Colors.WHITE,
    fontSize: 16,
    fontWeight: '600',
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContainer: {
    backgroundColor: Colors.SURFACE_LIGHT,
    borderRadius: 20,
    padding: 24,
    width: '100%',
    maxWidth: 320,
    borderWidth: 1,
    borderColor: Colors.GRAY_600,
    shadowColor: Colors.BLACK,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.WHITE,
  },
  modalMessage: {
    fontSize: 16,
    color: Colors.GRAY_300,
    lineHeight: 22,
    marginBottom: 24,
    textAlign: 'center',
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'center',
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 44,
  },
  confirmButton: {
    backgroundColor: Colors.PRIMARY,
  },
  confirmButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.WHITE,
  },
})