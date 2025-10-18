import Colors from '@/data/Colors';
import React, { useState, useCallback, useContext } from 'react';
import { Image, StyleSheet, TextInput, View, ToastAndroid, TouchableOpacity } from 'react-native';
import Button from '../Shared/Button';
import * as ImagePicker from 'expo-image-picker';
import { upload } from 'cloudinary-react-native';
import { cld, options } from '@/configs/CloudinaryConfig';
import axios from 'axios';
import { AuthContext } from '@/context/AuthContext';
import { useRouter } from 'expo-router';
import TextInputField from '../Shared/TextInputField';

const CreateClub = () => {
  const [clubName, setClubName] = useState('');
  const [clubContent, setClubContent] = useState('');
  const [selectedImage, setSelectedImage] = useState<string>();
  const [loading, setLoading] = useState(false);
  const { user } = useContext(AuthContext);
  const router = useRouter();

  const pickImage = useCallback(async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
      ToastAndroid.show('Image added', ToastAndroid.SHORT);
    }
  }, []);

  const onCreateClub = async () => {
    if (!clubName.trim() || !clubContent.trim()) {
      ToastAndroid.show('Please fill all fields', ToastAndroid.BOTTOM);
      return;
    }

    setLoading(true);

    let imageUrl = '';
    if (selectedImage) {
      try {
        const uploadResult: any = await new Promise((resolve, reject) => {
          upload(cld, {
            file: selectedImage,
            options,
            callback: (error: any, response: any) => (error ? reject(error) : resolve(response)),
          });
        });
        imageUrl = uploadResult?.url || '';
      } catch {
        ToastAndroid.show('Image upload failed', ToastAndroid.BOTTOM);
        setLoading(false);
        return;
      }
    }

    try {
      await axios.post(`${process.env.EXPO_PUBLIC_HOST_URL}/clubs`, {
        clubName,
        imageUrl,
        about: clubContent,
        email: user?.email
      });
      ToastAndroid.show('Club Created', ToastAndroid.SHORT);
      setLoading(false);
      router.replace('/(tabs)/Clubs');
    } catch {
      setLoading(false);
      ToastAndroid.show('Failed to create club', ToastAndroid.BOTTOM);
    }
  }; 

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={pickImage} style={styles.imageContainer}>
        <Image
          source={selectedImage ? { uri: selectedImage } : require('./../../assets/images/add.png')}
          style={styles.image}
        />
      </TouchableOpacity>

      <TextInputField label="Club Name" onChangeText={setClubName} />
      <TextInput
        placeholder="Write about your club..."
        placeholderTextColor={Colors.GRAY_500}
        style={styles.textInput}
        multiline
        numberOfLines={5}
        maxLength={500}
        onChangeText={setClubContent}
      />

      <Button text="Create" onPress={onCreateClub} loading={loading} />
    </View>
  );
};

export default CreateClub;

const styles = StyleSheet.create({
  container: { gap: 20, padding: 16 },
  textInput: {
    padding: 16,
    borderRadius: 16,
    textAlignVertical: 'top',
    fontSize: 16,
    fontWeight: '500',
    borderWidth: 1,
    color:Colors.GRAY_400,
    borderColor: Colors.GRAY_600,
    height: 160,
  },
  imageContainer: {
    alignSelf: 'center',
  },
  image: {
    width: 120,
    height: 120,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.GRAY_600,
  },
});

