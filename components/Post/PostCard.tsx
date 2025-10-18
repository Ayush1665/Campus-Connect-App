import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native'
import React from 'react'
import UserAvatar from './UserAvatar'
import Colors from '@/data/Colors'
import AntDesign from '@expo/vector-icons/AntDesign';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

const PostCard = ({ post }: any) => {
  return (
    <View style={styles.container}>
      <UserAvatar name={post?.name} image={post?.image} date={post?.createdon} />
      
      <Text style={styles.content}>{post?.content}</Text>
      
      {post.imageurl && (
        <Image 
          source={{uri: post.imageurl}} 
          style={styles.postImage}
          resizeMode="cover"
        />
      )} 
      
      <View style={styles.actionsContainer}>
        <TouchableOpacity style={styles.actionButton}>
          <AntDesign name="like" size={20} color={Colors.GRAY_400} />
          <Text style={styles.actionText}>25</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.actionButton}>
          <MaterialCommunityIcons name="comment-text-outline" size={20} color={Colors.GRAY_400} />
          <Text style={styles.actionText}>25</Text>
        </TouchableOpacity>
      </View>
      
      <TouchableOpacity>
        <Text style={styles.commentsText}>View All Comments</Text>
      </TouchableOpacity>
    </View>
  )
}

export default PostCard

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: Colors.GRAY_800,
    borderRadius: 16,
    marginVertical: 8,
    marginHorizontal:6,
    shadowColor: Colors.BLACK,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
    borderWidth: 1,
    borderColor: Colors.GRAY_700,
  },
  content: {
    fontSize: 16,
    lineHeight: 22,
    color: Colors.GRAY_100,
    marginBottom: 12,
  },
  postImage: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    marginBottom: 12,
    backgroundColor: Colors.GRAY_700,
  },
  actionsContainer: {
    flexDirection: 'row',
    gap: 24,
    alignItems: 'center',
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: Colors.GRAY_700,
    borderBottomWidth: 1,
    borderBottomColor: Colors.GRAY_700,
    marginBottom: 8,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  actionText: {
    fontSize: 15,
    color: Colors.GRAY_400,
    fontWeight: '500',
  },
  commentsText: {
    fontSize: 13,
    color: Colors.GRAY_500,
    fontWeight: '500',
  },
})