import { View, Image, Pressable, StyleSheet, ToastAndroid, ActivityIndicator, TouchableOpacity } from 'react-native'
import React, { useCallback, useState, useMemo, useContext } from 'react'
import Colors from '@/data/Colors'
import Button from '@/components/Shared/Button'
import TextInputField from '@/components/Shared/TextInputField'
import { useRouter } from 'expo-router'
import { LinearGradient } from 'expo-linear-gradient'
import Ionicons from '@expo/vector-icons/Ionicons'
import * as ImagePicker from 'expo-image-picker'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { auth } from '@/configs/FirebaseConfig'
import { cld, options } from '@/configs/CloudinaryConfig'
import { upload } from 'cloudinary-react-native'
import axios from 'axios'
import Text from '@/components/Shared/Text'
import { AuthContext } from '@/context/AuthContext'

const placeholderImage = require('./../../assets/images/profile.png')

const Signup = () => {
  const [profileImage, setProfileImage] = useState<string>()
  const [errors, setErrors] = useState<{ fullName?: string; email?: string; password?: string }>({})

  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const router = useRouter()
  const { user, setUser } = useContext(AuthContext)

  const validate = () => {
    const errs: { fullName?: string; email?: string; password?: string } = {}
    if (!fullName) errs.fullName = 'Full Name is required'
    if (!email) errs.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(email)) errs.email = 'Email is invalid'
    if (!password) errs.password = 'Password is required'
    else if (password.length < 6) errs.password = 'Password must be at least 6 characters'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const pickImage = useCallback(async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    })
    if (!result.canceled) {
      setProfileImage(result.assets[0].uri)
      ToastAndroid.show('Image added', ToastAndroid.BOTTOM)
    }
  }, [])

  const getErrorMessage = useCallback((errorCode: string) => {
    const errorMessages: { [key: string]: string } = {
      'auth/invalid-email': 'Invalid email address.',
      'auth/email-already-in-use': 'Email already in use. Try signing in instead.',
      'auth/weak-password': 'Password should be at least 6 characters.',
      'auth/missing-password': 'Please enter your password.',
    }
    return errorMessages[errorCode] || 'Something went wrong. Please try again.'
  }, [])

  const onBtnPress = useCallback(async () => {
    if (!validate()) return

    setLoading(true)
    try {
      await createUserWithEmailAndPassword(auth, email, password)

      const imageToUpload = profileImage || Image.resolveAssetSource(placeholderImage).uri

      setTimeout(async () => {
        upload(cld, {
          file: imageToUpload,
          options: options,
          callback: async (error: any, response: any) => {
            setLoading(false)
            if (error) return ToastAndroid.show('Image upload failed', ToastAndroid.BOTTOM)

            await axios.post(`${process.env.EXPO_PUBLIC_HOST_URL}/user`, {
              name: fullName,
              email,
              image: response?.url
            })
            setUser({ name: fullName, email, image: response?.url ?? '' })
            ToastAndroid.show(`Welcome, ${fullName}`, ToastAndroid.BOTTOM)
            router.replace('/(tabs)/Home')
          },
        })
      }, 0)
    } catch (error: any) {
      setLoading(false)
      const message = getErrorMessage(error.code)
      ToastAndroid.show(message, ToastAndroid.BOTTOM)
    }
  }, [email, password, fullName, profileImage, getErrorMessage, router, setUser])


  const navigateToSignIn = useCallback(() => router.push('/(auth)/SignIn'), [router])
  const profileImageSource = useMemo(() => (profileImage ? { uri: profileImage } : placeholderImage), [profileImage])
  const buttonContent = useMemo(
    () => (loading ? <ActivityIndicator color={Colors.WHITE} /> : 'Create Account'),
    [loading]
  )

  return (
    <LinearGradient colors={[Colors.SURFACE, Colors.BACKGROUND]} style={styles.container}>
      <View style={styles.content}>
        <View style={styles.profileSection}>
          <TouchableOpacity onPress={pickImage}>
            <Image source={profileImageSource} style={styles.profileImage} resizeMode="cover" />
            <Ionicons name="camera" size={23} color={Colors.PRIMARY} style={styles.cameraIcon} />
          </TouchableOpacity>
        </View>

        <Text style={styles.title}>Create New Account</Text>

        <TextInputField label="Full Name" onChangeText={setFullName} error={errors.fullName} />
        <TextInputField label="College Email" onChangeText={setEmail} error={errors.email} />
        <View>
          <TextInputField
            label="Password"
            password={!showPassword}
            onChangeText={setPassword}
            error={errors.password}
          />
          <Pressable
            onPress={() => setShowPassword(prev => !prev)}
            style={styles.eyeIconContainer}
          >
            <Ionicons
              name={showPassword ? 'eye-off' : 'eye'}
              size={22}
              color={Colors.GRAY_500}
            />
          </Pressable>
        </View>

        <View style={styles.buttonContainer}>
          <Button text={buttonContent} onPress={onBtnPress} disabled={loading} />
          <Text style={styles.signInText}>
            Already have an account?{' '}
            <Text style={styles.signInHighlight} onPress={navigateToSignIn}>
              Sign in
            </Text>
          </Text>

        </View>
      </View>
    </LinearGradient>
  )
}

export default React.memo(Signup)

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { flex: 1, padding: 32, paddingTop: 70 },
  profileSection: { alignItems: 'center', marginBottom: 32 },
  profileImage: { width: 100, height: 100, borderRadius: 50 },
  cameraIcon: { position: 'absolute', bottom: 0, right: 0 },
  title: { fontSize: 28, fontWeight: '800', textAlign: 'center', color: Colors.WHITE, marginBottom: 24 },
  buttonContainer: { gap: 16, marginTop: 24 },
  signInButton: { padding: 16 },
  signInButtonPressed: { opacity: 0.7 },
  signInText: { fontSize: 16, textAlign: 'center', color: Colors.GRAY_400, fontWeight: '500' },
  signInHighlight: { color: Colors.PRIMARY, fontWeight: '600' },
  eyeIconContainer: { position: 'absolute', right: 20, top: 30 },
})
