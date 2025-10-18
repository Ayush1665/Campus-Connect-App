import { View, Text, StyleSheet, FlatList, Pressable } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import Colors from '@/data/Colors'
import { LinearGradient } from 'expo-linear-gradient'
import { useRouter } from 'expo-router'
import Button from '@/components/Shared/Button'
import axios from 'axios'
import EventCard from '@/components/Events/EventCard'
import { AuthContext } from '@/context/AuthContext'
import Ionicons from '@expo/vector-icons/Ionicons'

const Events = () => {
  const router = useRouter();
  const [eventList, setEventList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedTab, setSelectedTab] = useState(0);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    if (selectedTab === 0) {
      GetAllEvents();
    } else {
      GetUserEvents();
    }
  }, [selectedTab]);

  const GetAllEvents = async () => {
    setLoading(true);
    try {
      const result = await axios.get(process.env.EXPO_PUBLIC_HOST_URL + '/events');
      setEventList(result.data);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  const GetUserEvents = async () => {
    setLoading(true);
    try {
      const result = await axios.get(process.env.EXPO_PUBLIC_HOST_URL + '/event-register?email=' + user?.email);
      setEventList(result.data);
    } catch (error) {
      console.error('Error fetching user events:', error);
      setEventList([]);
    } finally {
      setLoading(false);
    }
  };

  const handleTabPress = (tabIndex: number) => {
    setSelectedTab(tabIndex);
  };

  return (
    <LinearGradient colors={[Colors.SURFACE, Colors.BACKGROUND]} style={styles.gradient}>
      <View style={styles.container}>
        <Text style={styles.title}>Events</Text>
        <Button text="+ Add" onPress={() => router.push('/add-event')} />
      </View>
      
      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        <Pressable
          onPress={() => handleTabPress(0)}
          style={[
            styles.tabButton,
            selectedTab === 0 && styles.activeTabButton
          ]}
        >
          <Text style={[
            styles.tabText,
            selectedTab === 0 ? styles.activeTabText : styles.inactiveTabText
          ]}>Upcoming Events</Text>
        </Pressable>
        <Pressable
          onPress={() => handleTabPress(1)}
          style={[
            styles.tabButton,
            selectedTab === 1 && styles.activeTabButton
          ]}
        >
          <Text style={[
            styles.tabText,
            selectedTab === 1 ? styles.activeTabText : styles.inactiveTabText
          ]}>Registered Events</Text>
        </Pressable>
      </View>

      {/* Events List */}
      <FlatList
        data={eventList}
        onRefresh={selectedTab === 0 ? GetAllEvents : GetUserEvents}
        refreshing={loading}
        renderItem={({ item, index }) => (
          <EventCard {...item} key={index} isRegistered={selectedTab === 1} />
        )}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={[
          styles.listContent,
          eventList.length === 0 && styles.emptyListContent
        ]}
        ListEmptyComponent={
          !loading ? (
            <View style={styles.emptyState}>
              <Ionicons 
                name={selectedTab === 1 ? "calendar-outline" : "calendar"} 
                size={64} 
                color={Colors.GRAY_500} 
              />
              <Text style={styles.emptyStateText}>
                {selectedTab === 1 
                  ? "No events registered yet" 
                  : "No upcoming events"
                }
              </Text>
              <Text style={styles.emptyStateSubtext}>
                {selectedTab === 1 
                  ? "Register for events to see them here!" 
                  : "Check back later for new events"
                }
              </Text>
              {selectedTab === 1 && eventList.length === 0 && (
                <Button 
                  text="Browse Events" 
                  onPress={() => setSelectedTab(0)}
                  style={styles.browseButton}
                />
              )}
            </View>
          ) : null
        }
      />
    </LinearGradient>
  );
};

export default Events;

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    paddingTop: 40,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  tabContainer: {
    flexDirection: 'row',
    gap: 15,
    backgroundColor: Colors.SURFACE,
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  tabButton: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: Colors.GRAY_800,
    borderWidth: 1,
    borderColor: Colors.GRAY_600,
    minWidth: 100,
    alignItems: 'center',
  },
  activeTabButton: {
    backgroundColor: Colors.PRIMARY,
    borderColor: Colors.PRIMARY,
  },
  tabText: {
    fontSize: 12.1,
    fontWeight: '600',
    // paddingHorizontal: 4,
  },
  activeTabText: {
    color: Colors.WHITE,
  },
  inactiveTabText: {
    color: Colors.GRAY_400,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: Colors.PRIMARY,
  },
  listContent: {
    flexGrow: 1,
  },
  emptyListContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 20,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.GRAY_400,
    marginTop: 16,
    textAlign: 'center',
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: Colors.GRAY_500,
    marginTop: 8,
    textAlign: 'center',
    marginBottom: 20,
  },
  browseButton: {
    marginTop: 16,
  },
});