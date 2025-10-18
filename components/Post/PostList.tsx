import { View, FlatList } from 'react-native'
import React from 'react'
import PostCard from './PostCard'

const PostList = ({ posts,OnRefresh,loading }: any) => {
  return (
    <View>
      <FlatList 
        data={posts}
        onRefresh={OnRefresh}
        refreshing={loading}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <PostCard post={item} />
        )}
      />
    </View>
  )
}

export default PostList
