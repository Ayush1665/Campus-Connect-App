import { FlatList, View } from 'react-native'
import React, { useEffect, useRef } from 'react'
import Colors from '@/data/Colors'
import Header from '@/components/Home/Header'
import Category from '@/components/Home/Category'
import { LinearGradient } from 'expo-linear-gradient'
import LatestPost from '@/components/Home/LatestPost'
import { useLocalSearchParams, useFocusEffect } from 'expo-router'
import { useCallback } from 'react'

const Home = () => {
  const { scrollTo } = useLocalSearchParams();
  const listRef = useRef<FlatList>(null);

  useFocusEffect(
    useCallback(() => {
      if (scrollTo && listRef.current) {
        requestAnimationFrame(() => {
          listRef.current?.scrollToOffset({
            offset: Number(scrollTo),
            animated: false, // fast instant scroll
          });
        });
      }
    }, [scrollTo])
  );

  return (
    <FlatList
      ref={listRef}
      data={[]}
      renderItem={null}
      ListHeaderComponent={
        <LinearGradient colors={[Colors.SURFACE, Colors.BACKGROUND]} style={{ flex: 1 }}>
          <View style={styles.container}>
            <Header />
            <Category />
            <LatestPost />
          </View>
        </LinearGradient>
      }
    />
  )
}

export default Home

const styles = {
  container: {
    padding: 20,
    paddingTop: 40,
    flex: 1,
  },
}
