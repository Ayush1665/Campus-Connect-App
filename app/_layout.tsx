import { AuthContext } from "@/context/AuthContext";
import Colors from "@/data/Colors";
import { Stack } from "expo-router";
import { useState } from "react";

interface USER {
  id: number,
  name: string,
  email: string,
  image: string
}

export default function RootLayout() {
  const [user, setUser] = useState<USER | undefined>(undefined);
  
  return (
    <AuthContext.Provider value={{ user, setUser }}>
      <Stack>
        <Stack.Screen name="landing" options={{ headerShown: false }} />
        <Stack.Screen 
          name="(auth)/SignUp"
          options={{
            headerTransparent: true,
            headerTitle: '',
            headerTintColor: Colors.PRIMARY,
            headerBackTitle: 'Back',
          }}
        />
        <Stack.Screen 
          name="(auth)/SignIn"
          options={{
            headerTransparent: true,
            headerTitle: '',
            headerTintColor: Colors.PRIMARY,
            headerBackTitle: 'Back',
          }}
        />
        <Stack.Screen 
          name="(auth)/Forgot"
          options={{
            headerTransparent: true,
            headerTitle: '',
            headerTintColor: Colors.PRIMARY,
            headerBackTitle: 'Back',
          }}
        />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen 
          name="add-post/index"
          options={{
            headerTitle: 'Add New Post',
            headerTitleStyle: {
              color: Colors.WHITE,
              fontSize: 18,
              fontWeight: '700',
            },
            headerStyle: {
              backgroundColor: Colors.SURFACE,
              // @ts-ignore
              elevation: 2,
              shadowColor: Colors.BLACK,
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 4,
            },
            headerTintColor: Colors.PRIMARY,
            headerBackTitle: 'Back',
          }}
        />
        <Stack.Screen 
          name="add-club/index"
          options={{
            headerTitle: 'Add New Club',
            headerTitleStyle: {
              color: Colors.WHITE,
              fontSize: 18,
              fontWeight: '700',
            },
            headerStyle: {
              backgroundColor: Colors.SURFACE,
              // @ts-ignore
              elevation: 2,
              shadowColor: Colors.BLACK,
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 4,
            },
            headerTintColor: Colors.PRIMARY,
            headerBackTitle: 'Back',
          }}
        />
        <Stack.Screen 
          name="explore-clubs/index"
          options={{
            headerTitle: 'Explore Club',
            headerTitleStyle: {
              color: Colors.WHITE,
              fontSize: 18,
              fontWeight: '700',
            },
            headerStyle: {
              backgroundColor: Colors.SURFACE,
              // @ts-ignore
              elevation: 2,
              shadowColor: Colors.BLACK,
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 4,
            },
            headerTintColor: Colors.PRIMARY,
            headerBackTitle: 'Back',
          }}
        />
        <Stack.Screen 
          name="add-event/index"
          options={{
            headerTitle: 'Add New Event',
            headerTitleStyle: {
              color: Colors.WHITE,
              fontSize: 18,
              fontWeight: '700',
            },
            headerStyle: {
              backgroundColor: Colors.SURFACE,
              // @ts-ignore
              elevation: 2,
              shadowColor: Colors.BLACK,
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 4,
            },
            headerTintColor: Colors.PRIMARY,
            headerBackTitle: 'Back',
          }}
        />
      </Stack>
    </AuthContext.Provider>
  );
}