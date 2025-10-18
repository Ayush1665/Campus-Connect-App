import { View, Image, Pressable, StyleSheet, FlatList, Dimensions } from 'react-native'
import React, { useCallback, useRef, useState } from 'react'
import Colors from '@/data/Colors'
import Button from '@/components/Shared/Button'
import { useRouter } from 'expo-router'
import { LinearGradient } from 'expo-linear-gradient'
import Text from '@/components/Shared/Text'
import { useFonts, Poppins_700Bold_Italic, Poppins_300Light } from "@expo-google-fonts/poppins";

const { width, height } = Dimensions.get('window')

// Slides data with login as first image
const slides = [
  {
    id: '1',
    image: require('./../assets/images/login.png'),
    title: 'Welcome to College Campus',
    subtitle: 'Connect, Explore, Learn',
  },
  {
    id: '2',
    image: require('./../assets/images/campus_events.jpg'),
    title: 'Campus Events',
    subtitle: 'Never miss out an exciting events happening across campus.',
  },
  {
    id: '3',
    image: require('./../assets/images/clubs_societies.jpg'),
    title: 'Clubs & Societies',
    subtitle: 'Find your tribe, join like-minded communities',
  },
]

const Landing = () => {
  const router = useRouter()
  const [activeIndex, setActiveIndex] = useState(0)
  const flatListRef = useRef(null)

  const navigateToSignUp = useCallback(() => {
    router.push('/(auth)/SignUp')
  }, [router])

  const navigateToSignIn = useCallback(() => {
    router.push('/(auth)/SignIn')
  }, [router])

  const [fontsLoaded] = useFonts({
      Poppins_700Bold_Italic,
      Poppins_300Light
    });

  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setActiveIndex(viewableItems[0].index)
    }
  }).current

  const viewConfigRef = useRef({ viewAreaCoveragePercentThreshold: 50 })

  const renderSlide = useCallback(({ item }) => (
    <View style={styles.slide}>
      <Image source={item.image} style={styles.image} resizeMode="cover" />
      <LinearGradient 
        colors={['rgba(0,0,0,0.3)', 'rgba(0,0,0,0.5)', 'rgba(26,26,46,0.8)']} 
        locations={[0, 0.5, 1]}
        style={styles.imageOverlay} 
      />
      <View style={styles.textContainer}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.subtitle}>{item.subtitle}</Text>
      </View>
    </View>
  ), [])

  const renderDot = useCallback((_, index) => (
    <View
      key={index.toString()}
      style={[styles.dot, activeIndex === index && styles.activeDot]}
    />
  ), [activeIndex])

  return (
    <View style={styles.container}>
      {/* Swipeable Slides */}
      <FlatList
        ref={flatListRef}
        data={slides}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewConfigRef.current}
        renderItem={renderSlide}
        decelerationRate="fast"
        snapToInterval={width}
        snapToAlignment="center"
      />

      {/* Bottom Content Area */}
      <View style={styles.bottomSection}>
        {/* Pagination Dots */}
        <View style={styles.dotsContainer}>
          {slides.map(renderDot)}
        </View>

        {/* Buttons */}
        <View style={styles.buttonContainer}>
          <Button 
            text="Get Started" 
            onPress={navigateToSignUp}
            style={styles.primaryButton}
            textStyle={styles.primaryButtonText}
          />

          <Pressable
            onPress={navigateToSignIn}
            style={({ pressed }) => [
              styles.signInButton, 
              pressed && styles.signInButtonPressed
            ]}
          >
            <Text style={styles.signInText}>
              Already have an account?{' '}
              <Text style={styles.signInHighlight}>Sign in</Text>
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  )
}

export default React.memo(Landing)

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: Colors.SURFACE 
  },
  slide: { 
    width, 
    height: height,
    position: 'relative',
    justifyContent: 'center',
  },
  image: { 
    width: '100%', 
    height: '100%',
    position: 'absolute',
  },
  imageOverlay: { 
    position: 'absolute', 
    top: 0, 
    left: 0, 
    right: 0, 
    bottom: 0,
  },
  textContainer: { 
    position: 'absolute',
    top: height * 0.1, 
    paddingHorizontal: 32, 
    width: '100%',
    alignItems: 'center',
  },
  title: { 
    fontSize: 28, 
    fontFamily: 'Poppins_700Bold_Italic',     
    fontWeight: '800', 
    textAlign: 'center', 
    color: '#FFFFFF', 
    marginBottom: 16,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 2 },
    textShadowRadius: 10,
    letterSpacing: 0.8,
    lineHeight: 36,
  },
  subtitle: { 
    fontSize: 18, 
    lineHeight: 24, 
    textAlign: 'center', 
    color: '#E0FFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 8,
    fontWeight: '500',
    letterSpacing: 0.3,
    opacity: 0.95,
  },
  bottomSection: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.SURFACE,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 32,
    paddingBottom: 40,
    paddingHorizontal: 24,
    shadowColor: Colors.BLACK,
    shadowOffset: {
      width: 0,
      height: -4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
  dotsContainer: { 
    flexDirection: 'row', 
    justifyContent: 'center', 
    marginBottom: 28,
  },
  dot: { 
    width: 8, 
    height: 8, 
    borderRadius: 4, 
    backgroundColor: Colors.GRAY_600, 
    marginHorizontal: 6,
    opacity: 0.6,
  },
  activeDot: { 
    backgroundColor: Colors.PRIMARY, 
    width: 24,
    opacity: 1,
  },
  buttonContainer: { 
    gap: 18,
  },
  primaryButton: {
    backgroundColor: Colors.PRIMARY,
    borderRadius: 16,
    paddingVertical: 18,
    shadowColor: Colors.PRIMARY,
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  primaryButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.WHITE,
    letterSpacing: 0.5,
  },
  signInButton: { 
    paddingVertical: 12,
  },
  signInButtonPressed: { 
    opacity: 0.7 
  },
  signInText: { 
    fontSize: 16, 
    textAlign: 'center', 
    color: Colors.GRAY_300, 
    fontWeight: '500',
    letterSpacing: 0.2,
  },
  signInHighlight: { 
    color: Colors.PRIMARY, 
    fontWeight: '700',
    fontSize: 16,
  },
})