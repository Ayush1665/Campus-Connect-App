import { View, FlatList, Image, StyleSheet, Dimensions, TouchableOpacity } from 'react-native'
import React from 'react'
import Colors from '@/data/Colors'
import Text from '@/components/Shared/Text'
import { LinearGradient } from 'expo-linear-gradient'
import { useRouter } from 'expo-router'

const categoryOptions = [
  {
    name: 'Events',
    banner: require('./../../assets/images/event.png'),
    path: '/(tabs)/Events'
  },
  {
    name: 'Latest Post',
    banner: require('./../../assets/images/news.png'),
    path: '/(tabs)/Home'
  },
  {
    name: 'Clubs',
    banner: require('./../../assets/images/clubs.png'),
    path: '/(tabs)/Clubs'
  },
  {
    name: 'Add New Post',
    banner: require('./../../assets/images/add-post.png'),
    path: 'add-post'
  }
]

const Category = () => {
  const router = useRouter(); 

  const handlePress = (item: any) => {
    if (item.name === 'Latest Post') {
      router.push({
        pathname: item.path,
        params: { scrollTo: 300 }, 
      });
    } else {
      router.push(item.path as any);
    }
  };

  return (
    <View style={styles.container}>
      <FlatList 
        data={categoryOptions} 
        numColumns={2}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <TouchableOpacity 
            onPress={() => handlePress(item)}
            style={styles.cardContainer}
          >
            <Image source={item.banner} style={styles.bannerImage}/>
            <LinearGradient
              colors={['transparent', 'rgba(0,0,0,0.4)']}
              style={styles.gradient}
            />
            <Text style={styles.text}>{item.name}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  )
}

export default Category

const styles = StyleSheet.create({
  container: {
    marginTop: 12,
  },
  listContent: {
    paddingBottom: 20
  },
  cardContainer: {
    margin: 8,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: Colors.PRIMARY,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  bannerImage: {
    height: 72,
    width: Dimensions.get('screen').width * 0.42,
    borderRadius: 10
  },
  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '50%',
  },
  text: {
    position: 'absolute',
    padding: 12,
    fontSize: 12,
    color: Colors.WHITE,
    fontWeight: '600',
  }
})
