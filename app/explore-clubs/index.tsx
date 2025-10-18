import { View, FlatList, Text, StyleSheet, ActivityIndicator } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import axios from 'axios'
import ClubCard from '@/components/Clubs/ClubCard'
import Button from '@/components/Shared/Button'
import Colors from '@/data/Colors'
import { LinearGradient } from 'expo-linear-gradient'
import { AuthContext } from '@/context/AuthContext'
import { useRouter } from 'expo-router'

export type CLUB = {
  id: number,
  name: string,
  club_logo: string,
  about: string,
  createdon: string,
  isFollowed:boolean
}

export default function ExploreClubs() {
  const [clubList, setClubList] = useState<CLUB[] | []>([]);
  const {user} = useContext(AuthContext);
  const [followedClub, setFollowedClub] = useState<any>()
  const [loading, setLoading] = useState(true);
  const router=useRouter();

  useEffect(() => {
    GetAllClubs();
  }, [])

  const GetAllClubs = async () => {
    try {
      setLoading(true);
      const result = await axios.get(process.env.EXPO_PUBLIC_HOST_URL + '/clubs')
      setClubList(result.data)
      getUserFollowedClubs();
    } catch (error) {
      console.error('Error fetching clubs:', error)
    } finally {
      setLoading(false);
    }
  }    

  const getUserFollowedClubs=async()=>{
    const result = await axios.get(process.env.EXPO_PUBLIC_HOST_URL + '/clubfollower?u_email='+user?.email)
    // console.log(result?.data)
    setFollowedClub(result?.data)
  }

  const onAddClubBtnClick = () => {
    // @ts-ignore
    router.push('/add-club');
  }

  const isFollowed=(clubId:number)=>{
    const record=followedClub&&followedClub?.find((item:any)=>item.club_id==clubId)
    return record?true:false
  }

  if (loading) {
    // Full screen loading
    return (
      <LinearGradient colors={[Colors.SURFACE, Colors.BACKGROUND]} style={styles.loadingWrapper}>
        <ActivityIndicator size="large" color={Colors.PRIMARY} />
        <Text style={styles.loadingText}>Loading...</Text>
      </LinearGradient>
    )
  }

  return (
    <LinearGradient colors={[Colors.SURFACE, Colors.BACKGROUND]} style={styles.container}>
      <View style={styles.content}>
        <View style={styles.headerContainer}>
          <Text style={styles.headerText}>New Teams/Clubs</Text>
          <Button text='+ Create' onPress={onAddClubBtnClick} />
        </View>

        <FlatList
          data={clubList}
          numColumns={2}
          renderItem={({ item:CLUB }) => (
            <ClubCard {...CLUB} isFollowed={isFollowed(CLUB.id)} refreshData={GetAllClubs}/>
          )}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContainer}
        />
      </View>
    </LinearGradient>
  )
}

const styles = StyleSheet.create({
  container: { 
    flex: 1 
  },
  content: { 
    flex: 1, 
    padding: 20, 
    paddingTop: 24 
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: Colors.SURFACE_LIGHT,
    borderRadius: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: Colors.GRAY_600,
    borderStyle: 'dashed'
  },
  headerText: {
    fontSize: 16,
    color: Colors.GRAY_400,
    fontWeight: '500',
    flex: 1,
    marginRight: 12
  },
  listContainer: {
    paddingBottom: 20
  },
  loadingWrapper: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  loadingText: { 
    marginTop: 12, 
    fontSize: 16, 
    color: Colors.PRIMARY, 
    fontWeight: '500' 
  }
})
