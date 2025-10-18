import {
  View,
  Image,
  Pressable,
  StyleSheet,
  ToastAndroid,
  ActivityIndicator,
} from 'react-native'
import React, { useState, useMemo, useCallback, useContext } from 'react'
import Colors from '@/data/Colors'
import { signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth'
import Button from '@/components/Shared/Button'
import TextInputField from '@/components/Shared/TextInputField'
import { useRouter } from 'expo-router'
import { LinearGradient } from 'expo-linear-gradient'
import Text from '@/components/Shared/Text'
import { auth } from '@/configs/FirebaseConfig'
import axios from 'axios'
import { AuthContext } from '@/context/AuthContext'
import Ionicons from '@expo/vector-icons/Ionicons'

const SignIn = () => {
  const router = useRouter()
  const { user,setUser } = useContext(AuthContext)

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({})

  const navigateToSignUp = useCallback(() => router.push('/(auth)/SignUp'), [router])

  const validate = () => {
    const errs: { email?: string; password?: string } = {}
    if (!email) errs.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(email)) errs.email = 'Email is invalid'

    if (!password) errs.password = 'Password is required'
    else if (password.length < 6) errs.password = 'Password must be at least 6 characters'

    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const onSignInBtnClick = useCallback(async () => {
    if (!validate()) return

    setLoading(true)
    try {
      const resp = await signInWithEmailAndPassword(auth, email, password)
      if (resp.user?.email) {
        const result = await axios.get(`${process.env.EXPO_PUBLIC_HOST_URL}/user?email=${resp.user.email}`)
        setUser(result?.data)
        ToastAndroid.show(`Welcome back, ${result.data.name}`, ToastAndroid.BOTTOM)
        router.replace('/(tabs)/Home')
      }
    } catch (e: any) {
      if (e.code === 'auth/wrong-password') {
        ToastAndroid.show('Wrong password', ToastAndroid.BOTTOM)
      } else if (e.code === 'auth/user-not-found') {
        ToastAndroid.show("Account doesn't exist", ToastAndroid.BOTTOM)
      } else if (e.code === 'auth/invalid-email') {
        ToastAndroid.show('Invalid email address', ToastAndroid.BOTTOM)
      } else if (e.code === 'auth/too-many-requests') {
        ToastAndroid.show('Too many attempts. Try again later.', ToastAndroid.BOTTOM)
      } else {
        ToastAndroid.show('Something went wrong', ToastAndroid.BOTTOM)
      }
    } finally {
      setLoading(false)
    }
  }, [email, password, router, setUser])

  const onForgotPassword = useCallback(async () => {
    if (!email) {
      ToastAndroid.show('Please enter your email first', ToastAndroid.BOTTOM)
      return
    }

    try {
      await sendPasswordResetEmail(auth, email)
      ToastAndroid.show('Password reset email sent', ToastAndroid.BOTTOM)
    } catch (error: any) {
      if (error.code === 'auth/user-not-found') {
        ToastAndroid.show("Account doesn't exist", ToastAndroid.BOTTOM)
      } else if (error.code === 'auth/invalid-email') {
        ToastAndroid.show('Invalid email address', ToastAndroid.BOTTOM)
      } else {
        ToastAndroid.show('Something went wrong', ToastAndroid.BOTTOM)
      }
    }
  }, [email])


  const buttonContent = useMemo(() =>
    loading ? <ActivityIndicator color={Colors.WHITE} /> : 'Sign In',
    [loading]
  )

  return (
    <LinearGradient colors={[Colors.SURFACE, Colors.BACKGROUND]} style={styles.container}>
      <View style={styles.content}>
        <View style={styles.profileSection}>
          <Image
            source={require('./../../assets/images/logo.png')}
            style={styles.profileImage}
            resizeMode="contain"
          />
        </View>

        <Text style={styles.title}>Sign In to Campus</Text>

        <TextInputField
          label="College Email"
          onChangeText={setEmail}
          error={errors.email}
          // @ts-ignore
          autoCapitalize="none"
          keyboardType="email-address"
        />

        <View style={styles.passwordContainer}>
          <TextInputField
            label="Password"
            onChangeText={setPassword}
            password={!showPassword}
            error={errors.password}
            // @ts-ignore
            autoCapitalize="none"
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

          <Pressable
            onPress={() => router.push('/(auth)/Forgot')}
            style={{ marginTop: 8 }}
          >
            <Text style={{ color: Colors.PRIMARY, textAlign: 'right', fontWeight: '500' }}>
              Forgot Password?
            </Text>
          </Pressable>

        </View>

        <View style={styles.buttonContainer}>
          <Button
            // @ts-ignore
            text={buttonContent}
            onPress={onSignInBtnClick}
            disabled={loading}
          />
          <Text style={styles.signInText}>
            {"Don't have an account? "}
            <Text
              style={styles.signInHighlight}
              onPress={navigateToSignUp}
            >
              Sign up
            </Text>
          </Text>

        </View>
      </View>
    </LinearGradient>
  )
}

export default React.memo(SignIn)

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  content: {
    flex: 1,
    padding: 32,
    paddingTop: 50
  },
  profileSection: {
    alignItems: 'center',
    marginBottom: 16
  },
  profileImage: {
    width: 220,
    height: 220
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    textAlign: 'center',
    color: Colors.WHITE,
    marginBottom: 16,
    marginTop: -25
  },
  passwordContainer: {
    position: 'relative',
  },
  buttonContainer: {
    gap: 16,
    marginTop: 24
  },
  signInButton: {
    padding: 16
  },
  signInButtonPressed: {
    opacity: 0.7
  },
  signInText: {
    fontSize: 16,
    textAlign: 'center',
    color: Colors.GRAY_400,
    fontWeight: '500'
  },
  signInHighlight: {
    color: Colors.PRIMARY,
    fontWeight: '600'
  },
  eyeIconContainer: {
    position: 'absolute',
    right: 20,
    top: 30,
  },
})