import Colors from '@/data/Colors'
import React, { useState, useCallback, useContext, useEffect } from 'react'
import { Image, StyleSheet, TextInput, View, ToastAndroid, TouchableOpacity } from 'react-native'
import DropDownPicker from 'react-native-dropdown-picker'
import Button from '../Shared/Button'
import * as ImagePicker from 'expo-image-picker'
import { upload } from 'cloudinary-react-native'
import { cld, options } from '@/configs/CloudinaryConfig'
import axios from 'axios'
import { AuthContext } from '@/context/AuthContext'
import { useRouter } from 'expo-router'

const WritePost = () => {
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState(null)
  const [selectedImage, setSelectedImage] = useState<string>()
  const [content, setContent] = useState('')
  const { user } = useContext(AuthContext)
  const [loading, setLoading] = useState(false)
  const [items, setItems] = useState([
  { label: 'Public', value: 0 },
])


  const router = useRouter();

  useEffect(()=>{
    user && getUserFollowedClubs()
  },[user])

  const onPostBtnClick = async () => {
    if (!content.trim()) {
      ToastAndroid.show('Please enter content', ToastAndroid.BOTTOM)
      return
    }
    
    setLoading(true)
    
    let uploadImageUrl = ''
    if (selectedImage) {
      try {
        const resultData: any = await new Promise((resolve, reject) => {
          upload(cld, {
            file: selectedImage,
            options: options,
            callback: (error: any, response: any) => {
              error ? reject(error) : resolve(response)
            }
          })
        })
        uploadImageUrl = resultData?.url || ''
      } catch (error) {
        ToastAndroid.show('Image upload failed', ToastAndroid.BOTTOM)
        setLoading(false)
        return
      }
    }
    
    try {
      await axios.post(`${process.env.EXPO_PUBLIC_HOST_URL}/post`, {
        content,
        imageUrl: uploadImageUrl,
        visibleIn: value,
        email: user?.email
      })
      setLoading(false)
      ToastAndroid.show('Posted Successfully', ToastAndroid.BOTTOM) 
      router.replace('/(tabs)/Home')
    } catch (error) {
      setLoading(false)
      ToastAndroid.show('Failed to create post', ToastAndroid.BOTTOM)
    }
  }

  const pickImage = useCallback(async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    })
    
    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri)
      ToastAndroid.show('Image added', ToastAndroid.BOTTOM)
    }
  }, [])

  const getUserFollowedClubs=async()=>{
    const result = await axios.get(process.env.EXPO_PUBLIC_HOST_URL + '/clubfollower?u_email='+user?.email)
    const data=result.data?.map((item:any)=>({
      label:item?.name,
      value:item.club_id
    }));
    setItems(prev=>[...prev,...data])
  }

  return (
    <View style={styles.container}>
      <TextInput 
        placeholder='Write your post here...' 
        placeholderTextColor={Colors.GRAY_500} 
        style={styles.textInput} 
        multiline 
        numberOfLines={5} 
        maxLength={500} 
        onChangeText={setContent}
      />

      <TouchableOpacity onPress={pickImage}>
        <Image 
          source={selectedImage ? { uri: selectedImage } : require('./../../assets/images/add.png')} 
          style={styles.image} 
        />
      </TouchableOpacity>
      
      <View style={styles.dropdownContainer}>
        <DropDownPicker
          items={items}
          open={open}
          value={value}
          setOpen={setOpen}
          setValue={setValue}
          setItems={setItems}
          style={styles.dropdown}
          textStyle={styles.dropdownText}
          dropDownContainerStyle={styles.dropdownList}
        />
      </View>
      
      <Button text='Post' onPress={onPostBtnClick} loading={loading}/>
    </View>
  )
}

export default WritePost

const styles = StyleSheet.create({
  container: {
    gap: 20,
  },
  textInput: {
    padding: 16,
    backgroundColor: Colors.SURFACE_LIGHT,
    height: 160,
    borderRadius: 16,
    textAlignVertical: 'top',
    color: Colors.WHITE,
    fontSize: 16,
    fontWeight: '500',
    borderWidth: 1,
    borderColor: Colors.GRAY_600,
  },
  image: {
    width: 120,
    height: 120,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.GRAY_600,
  },
  dropdownContainer: {
    marginTop: 15
  },
  dropdown: {
    borderWidth: 0,
    backgroundColor: Colors.SURFACE_LIGHT,
    borderRadius: 12,
    borderColor: Colors.GRAY_600,
  },
  dropdownText: {
    color: Colors.GRAY_400,
    fontSize: 16,
    fontWeight: '500'
  },
  dropdownList: {
    backgroundColor: Colors.SURFACE_LIGHT,
    borderColor: Colors.GRAY_600,
    borderRadius: 12,
  },
})