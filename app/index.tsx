import { AuthContext } from "@/context/AuthContext";
import axios from "axios";
import { Redirect, useRouter } from "expo-router";
import { onAuthStateChanged } from "firebase/auth";
import { useContext } from "react";
import { ActivityIndicator, View } from "react-native";
import { auth } from '@/configs/FirebaseConfig'

export default function Index() {
  const { user, setUser } = useContext(AuthContext);
  const router = useRouter();

  onAuthStateChanged(auth, async(userData)=>{
    if(userData && userData?.email){
      const result = await axios.get(`${process.env.EXPO_PUBLIC_HOST_URL}/user?email=${userData?.email}`)
      setUser(result.data);
      router.replace('/(tabs)/Home');
    }else{
      router.replace('/landing')
    }
  })
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Redirect href={'/landing'} />
      <ActivityIndicator />
    </View>
  );
}
