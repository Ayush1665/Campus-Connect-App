import React, { useState, useCallback, useContext } from 'react';
import { View, StyleSheet, ToastAndroid, ActivityIndicator, Pressable, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import TextInputField from '@/components/Shared/TextInputField';
import Button from '@/components/Shared/Button';
import Text from '@/components/Shared/Text';
import Colors from '@/data/Colors';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '@/configs/FirebaseConfig';
import { useRouter } from 'expo-router';
import { AuthContext } from '@/context/AuthContext';

const Forgot = () => {
  const router = useRouter();
  const { user } = useContext(AuthContext);
  const [email, setEmail] = useState(user?.email || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();

  const validate = () => {
    if (!email) {
      setError('Email is required');
      return false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Invalid email address');
      return false;
    } else if (user && user.email !== email) {
      setError('Entered email does not match your logged-in account');
      return false;
    }
    setError(undefined);
    return true;
  };

  const onSendClick = useCallback(async () => {
    if (!validate()) return;

    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
      ToastAndroid.show('Password reset email sent', ToastAndroid.BOTTOM);
      router.replace('/(auth)/SignIn');
    } catch (err: any) {
      if (err.code === 'auth/user-not-found') {
        ToastAndroid.show("Account doesn't exist", ToastAndroid.BOTTOM);
      } else if (err.code === 'auth/invalid-email') {
        ToastAndroid.show('Invalid email address', ToastAndroid.BOTTOM);
      } else if (err.code === 'auth/requires-recent-login') {
        ToastAndroid.show('Please log out and try again', ToastAndroid.BOTTOM);
      } else {
        ToastAndroid.show('Something went wrong', ToastAndroid.BOTTOM);
      }
    } finally {
      setLoading(false);
    }
  }, [email, router, user]);

  const buttonContent = loading ? <ActivityIndicator color={Colors.WHITE} /> : 'Reset Password';

  return (
    <LinearGradient colors={[Colors.SURFACE, Colors.BACKGROUND]} style={styles.container}>
      <View style={styles.content}>
        {/* Header Section */}
        <View style={styles.headerSection}>
          <Text style={styles.title}>Forgot Password</Text>
          <Text style={styles.subtitle}>
            Enter your email address to receive a password reset link
          </Text>
        </View>

        {/* Image Container */}
        <View style={styles.imageContainer}>
          <Image
            source={require('./../../assets/images/forgot.jpg')}
            style={styles.image}
            resizeMode="contain"
          />
        </View>

        {/* Input Section */}
        <View style={styles.inputSection}>
          <TextInputField
            label="Email Address"
            value={email}
            onChangeText={setEmail}
            error={error}
            autoCapitalize="none"
            keyboardType="email-address"
            placeholder={user?.email || "Enter your email address"}
            containerStyle={styles.inputContainer}
          />
        </View>

        {/* Button Section */}
        <View style={styles.buttonSection}>
          <Button 
            text={buttonContent} 
            onPress={onSendClick} 
            disabled={loading}
            style={styles.button}
          />
          <Pressable 
            onPress={() => router.push('/(auth)/SignIn')} 
            style={styles.backLink}
          >
            <Text style={styles.backText}>Back to Sign In</Text>
          </Pressable>
        </View>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 32,
    paddingVertical: 20,      
    justifyContent: 'center',
    marginTop:-50
  },
  headerSection: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    color: Colors.PRIMARY,
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    color: Colors.GRAY_600,
    lineHeight: 22,
    paddingHorizontal: 20,
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 28,
    paddingHorizontal: 20,
  },
  image: {
    width: 120,
    height: 120,
    borderRadius: 110,
  },
  inputSection: {
    marginTop: -10,
    marginBottom:30,
  },
  inputContainer: {
    marginBottom: 0,
  },
  buttonSection: {
    gap: 20,
  },
  button: {
    borderRadius: 12,
    height: 54,
    shadowColor: Colors.PRIMARY,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  backLink: {
    alignSelf: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  backText: {
    color: Colors.PRIMARY,
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default React.memo(Forgot);