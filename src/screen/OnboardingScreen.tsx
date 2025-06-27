import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
  Dimensions,
  SafeAreaView,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

interface OnboardingScreenProps {
  onFinish: () => void;
}

const { width } = Dimensions.get('window');

const onboardingData = [
  {
    id: '1',
    title: 'Welcome to the Divine Journey!',
    description:
      'Explore the sacred world of Jagannath, Krishna, and the rich heritage of Bhagabat Sanskriti.',
    image: require('../assets/images/ob_1.png'),
  },
  {
    id: '2',
    title: 'Timeless Stories & Teachings',
    description:
      'Immerse yourself in inspiring stories, ancient scriptures, and spiritual traditions.',
    image: require('../assets/images/ob_2.png'),
  },
  {
    id: '3',
    title: 'Light Up Your Soul',
    description:
      'Discover cultural traditions that awaken the heart and elevate the spirit.',
    image: require('../assets/images/ob_3.png'),
  },
];

const OnboardingScreen: React.FC<OnboardingScreenProps> = ({ onFinish }) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [musicOn, setMusicOn] = useState<boolean>(true);
  const flatListRef = useRef<FlatList>(null);

  const handleNext = () => {
    if (currentIndex < onboardingData.length - 1) {
      flatListRef.current?.scrollToIndex({ index: currentIndex + 1 });
    } else {
      onFinish();
    }
  };

  const handleSkip = () => {
    onFinish();
  };

  const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index);
    }
  }).current;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => setMusicOn(!musicOn)}>
          <Icon
            name={musicOn ? 'play-circle-outline' : 'pause-circle-outline'}
            size={30}
            color="#941b1b"
          />

        </TouchableOpacity>

        <Image
          source={require('../assets/images/m4.png')}
          style={styles.centerImage}
        />

        <TouchableOpacity onPress={handleSkip}>
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        ref={flatListRef}
        data={onboardingData}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={item => item.id}
        onViewableItemsChanged={onViewableItemsChanged}
        renderItem={({ item }) => (
          <View style={styles.slide}>
            <Image source={item.image} style={styles.logo} />
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.description}>{item.description}</Text>
          </View>
        )}
      />

      <View style={styles.footer}>
        <View style={styles.dotContainer}>
          {onboardingData.map((_, index) => (
            <View
              key={index}
              style={[styles.dot, currentIndex === index && styles.activeDot]}
            />
          ))}
        </View>
        <TouchableOpacity style={styles.button} onPress={handleNext}>
          <Text style={styles.buttonText}>
            {currentIndex === onboardingData.length - 1
              ? 'Get Started'
              : 'Next'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default OnboardingScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fce8e6',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'relative',
    paddingLeft: 20,
    paddingRight: 20,
  },

  centerImage: {
    position: 'absolute',
    left: '50%',
    transform: [{ translateX: -55 }],
    width: 150,
    height: 150,
    resizeMode: 'contain',
    tintColor: '#941b1b',
  },

  skipText: {
    fontSize: 16,
    color: '#941b1b',
    fontWeight: 'bold',
  },
  slide: {
    width: width,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  logo: {
    width: 180,
    height: 180,
    resizeMode: 'contain',
    marginBottom: 30,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#941b1b',
    textAlign: 'center',
    marginBottom: 15,
  },
  description: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  footer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  dotContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#d3a4a4',
    marginHorizontal: 5,
  },
  activeDot: {
    backgroundColor: '#941b1b',
  },
  button: {
    backgroundColor: '#f09c60',
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 25,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
