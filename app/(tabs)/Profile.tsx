import { View, Text, Image, FlatList, TouchableOpacity, ActivityIndicator, ToastAndroid, StyleSheet, Share, Modal, Pressable } from 'react-native'
import React, { useContext, useState } from 'react'
import Colors from '@/data/Colors'
import { LinearGradient } from 'expo-linear-gradient'
import { AuthContext } from '@/context/AuthContext'
import Ionicons from '@expo/vector-icons/Ionicons'
import { useRouter } from 'expo-router'
import { signOut } from 'firebase/auth'
import { auth } from '@/configs/FirebaseConfig'

const profileOptions = [
  {
    id: 1,
    name: 'Add Post',
    path: '/add-post',
    icon: 'add-circle-outline'
  },
  {
    id: 2,
    name: 'Events',
    path: '/(tabs)/Events',
    icon: 'calendar-outline'
  },
  {
    id: 3,
    name: 'Share the App',
    path: 'share',
    icon: 'share-social-outline'
  },
  {
    id: 4,
    name: 'Reset Password',
    path: '/(auth)/Forgot', 
    icon: 'key-outline'
  },
  {
    id: 5,
    name: 'Logout', 
    path: 'logout',
    icon: 'log-out-outline'
  },
]

const Profile = () => {
  const { user, setUser } = useContext(AuthContext);
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const shareApp = async () => {
    const result = await Share.share({
      message: 'Check out this amazing app! Download it from: http://localhost:8080',
      url: 'http://localhost:8080',
      title: 'College Campus'
    });
  };

  const handleLogout = async () => {
    setShowLogoutModal(false);
    setLoggingOut(true);
    try {
      await signOut(auth);
      setUser(null);
      ToastAndroid.show('Logged out successfully', ToastAndroid.BOTTOM);
      router.replace('/landing');
    } catch (error) {
      ToastAndroid.show('Logout failed', ToastAndroid.BOTTOM);
    } finally {
      setLoggingOut(false);
    }
  };

  const OnPressOption = async (item: any) => {
    if (item.path === 'logout') {
      setShowLogoutModal(true);
    } else if (item.path === 'share') {
      await shareApp();
    } else {
      router.push(item.path as any);
    }
  }

  return (
    <LinearGradient colors={[Colors.SURFACE, Colors.BACKGROUND]} style={styles.container}>
      <View style={styles.content}>
        {/* Header */}
        <Text style={styles.header}>Profile</Text>

        {/* User Info Section */}
        <View style={styles.userInfoContainer}>
          <Image
            source={{ uri: user?.image }}
            style={styles.avatar}
          />
          <Text style={styles.userName}>{user?.name}</Text>
          <Text style={styles.userEmail}>{user?.email}</Text>
        </View>

        {/* Options List */}
        <FlatList
          data={profileOptions}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => OnPressOption(item)}
              style={styles.optionItem}
              disabled={loggingOut && item.path === 'logout'}
            >
              <View style={styles.optionLeft}>
                <Ionicons name={item.icon} size={24} color={Colors.PRIMARY} />
                <Text style={styles.optionText}>{item.name}</Text>
              </View>

              {loggingOut && item.path === 'logout' ? (
                <ActivityIndicator size="small" color={Colors.PRIMARY} />
              ) : (
                <Ionicons name="chevron-forward" size={20} color={Colors.GRAY_500} />
              )}
            </TouchableOpacity>
          )}
          style={styles.optionsList}
          showsVerticalScrollIndicator={false}
        />
      </View>

      {/* Logout Confirmation Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={showLogoutModal}
        onRequestClose={() => setShowLogoutModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Ionicons name="log-out-outline" size={32} color={Colors.ERROR} />
              <Text style={styles.modalTitle}>Confirm Logout</Text>
            </View>
            
            <Text style={styles.modalMessage}>
              Are you sure you want to logout?
            </Text>

            <View style={styles.modalButtons}>
              <Pressable 
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowLogoutModal(false)}
              >
                <Text style={styles.cancelButtonText}>No</Text>
              </Pressable>
              
              <Pressable 
                style={[styles.modalButton, styles.confirmButton]}
                onPress={handleLogout}
              >
                {loggingOut ? (
                  <ActivityIndicator size="small" color={Colors.WHITE} />
                ) : (
                  <Text style={styles.confirmButtonText}>Yes</Text>
                )}
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </LinearGradient>
  )
}

export default Profile

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  content: {
    flex: 1,
    padding: 20,
    paddingTop: 40
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.PRIMARY,
    marginBottom: 8,
  },
  userInfoContainer: {
    alignItems: 'center',
    marginTop: 14,
    marginBottom: 18,
    paddingVertical: 24,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 16,
    borderWidth: 3,
    borderColor: Colors.PRIMARY,
    // transform: [{ translateY: -10 }]
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.WHITE,
    marginBottom: 4,
    textAlign: 'center',
  },
  userEmail: {
    fontSize: 16,
    color: Colors.GRAY_400,
    textAlign: 'center',
  },
  optionsList: {
    marginTop: 8,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    marginVertical: 6,
    backgroundColor: Colors.SURFACE_LIGHT,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.GRAY_600,
  },
  optionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  optionText: {
    fontSize: 18,
    color: Colors.WHITE,
    fontWeight: '500',
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
    justifyContent: 'space-between',
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
  cancelButton: {
    backgroundColor: Colors.GRAY_700,
    borderWidth: 1,
    borderColor: Colors.GRAY_600,
  },
  confirmButton: {
    backgroundColor: Colors.ERROR,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.GRAY_300,
  },
  confirmButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.WHITE,
  },
})