import { View, Text, StyleSheet, ActivityIndicator } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import Colors from '@/data/Colors'
import { LinearGradient } from 'expo-linear-gradient'
import EmptyState from '@/components/Clubs/EmptyState'
import axios from 'axios'
import PostList from '@/components/Post/PostList'
import { AuthContext } from '@/context/AuthContext'
import Button from '@/components/Shared/Button'
import { useRouter } from 'expo-router'

const Clubs = () => {
  const [followedClubs, setFollowedClubs] = useState<any[]>([]);
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useContext(AuthContext);
  const router = useRouter();

  useEffect(() => {
    getFollowedClubs();
  }, []);

  const getFollowedClubs = async () => {
    try {
      setLoading(true);
      const result = await axios.get(
        process.env.EXPO_PUBLIC_HOST_URL + '/clubfollower?u_email=' + user?.email
      );
      const clubs = result.data;

      setFollowedClubs(clubs);

      if (clubs.length > 0) {
        const clubIds = clubs.map((c: any) => c.club_id).join(',');
        await getPosts(clubIds);
      } else {
        setPosts([]);
      }
    } catch (err) {
      console.log('Error fetching followed clubs:', err);
    } finally {
      setLoading(false);
    }
  };

  const getPosts = async (clubIds: string) => {
    try {
      const result = await axios.get(
        process.env.EXPO_PUBLIC_HOST_URL + `/post?club=${clubIds}&orderField=post.id`
      );
      setPosts(result.data);
    } catch (err) {
      console.log('Error fetching posts:', err);
    }
  };

  return (
    <LinearGradient colors={[Colors.SURFACE, Colors.BACKGROUND]} style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.title}>Clubs</Text>
          <Button text='Explore Clubs' onPress={() => router.push('/explore-clubs')} />
        </View>
      </View>
      
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.PRIMARY} />
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      ) : (
        <>
          {posts.length === 0 && <EmptyState />}
          <PostList posts={posts} loading={loading} onRefresh={getFollowedClubs} />
        </>
      )}
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1 
  },
  header: { 
    paddingHorizontal: 16, 
    paddingTop: 40,
    paddingBottom: 16,
  },
  headerContent: {
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center'
  },
  title: { 
    fontSize: 28, 
    fontWeight: 'bold', 
    color: Colors.PRIMARY 
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: Colors.PRIMARY,
    fontWeight: '600'
  }
});

export default Clubs;