import { View, Text, Pressable, StyleSheet } from 'react-native'
import React, { useEffect, useState } from 'react'
import Colors from '@/data/Colors';
import axios from 'axios';
import PostList from '../Post/PostList';

const LatestPost = () => {
  const [selectedTab, setSelectedTab] = useState(0);
  const [posts, setPosts] = useState();
  const [loading, setLoading] = useState(false);

  useEffect(()=>{
    GetPosts();
  },[]);

  const GetPosts=async()=>{
    // Fetch all post
    setLoading(true)
    const result=await axios.get(process.env.EXPO_PUBLIC_HOST_URL+'/post?club=0&orderField=post.id') 

    setPosts(result?.data)
    setLoading(false)
  }

  return (
    <View style={styles.container}>
      <View style={styles.tabContainer}>
        <Pressable 
          onPress={()=>setSelectedTab(0)}
          style={[
            styles.tabButton,
            selectedTab === 0 && styles.activeTabButton
          ]}
        >
          <Text style={[
            styles.tabText,
            selectedTab === 0 ? styles.activeTabText : styles.inactiveTabText
          ]}>Latest</Text>
        </Pressable>
        <Pressable 
          onPress={()=>setSelectedTab(1)}
          style={[
            styles.tabButton,
            selectedTab === 1 && styles.activeTabButton
          ]}
        >
          <Text style={[
            styles.tabText,
            selectedTab === 1 ? styles.activeTabText : styles.inactiveTabText
          ]}>Trending</Text>
        </Pressable>
      </View>
      <PostList 
        posts={posts}
        loading={loading}
        onRefresh={GetPosts} 
      />
    </View>
  )
}

export default LatestPost

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: Colors.SURFACE,
    marginTop: 20,
  },
  tabContainer: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  tabButton: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    backgroundColor: Colors.GRAY_800,
    borderWidth: 1,
    borderColor: Colors.GRAY_600,
  },
  activeTabButton: {
    backgroundColor: Colors.PRIMARY,
    borderColor: Colors.PRIMARY,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    padding: 4,
  },
  activeTabText: {
    color: Colors.WHITE,
  },
  inactiveTabText: {
    color: Colors.GRAY_400,
  },
})