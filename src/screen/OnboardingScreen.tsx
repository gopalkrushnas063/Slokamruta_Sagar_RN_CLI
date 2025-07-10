import React, { useRef, useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
  Dimensions,
  SafeAreaView,
  AppState,
  Modal,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import TrackPlayer from 'react-native-track-player';
import { useTheme } from '../context/ThemeContext';
import { setLanguage } from '../store/slices/languageSlice';
import { RootState } from '../store';

interface OnboardingScreenProps {
  onFinish: () => void;
}

const { width, height } = Dimensions.get('window');

const languages = [
  { code: 'en', name: 'English', icon: '🇬🇧', countryCode: "En"},
  { code: 'hi', name: 'हिंदी', icon: '🇮🇳', countryCode: "Hi"},
  { code: 'or', name: 'ଓଡ଼ିଆ', icon: '🇮🇳', countryCode: "Od"},
  { code: 'bn', name: 'বাংলা', icon: '🇧🇩', countryCode: "Bn"},
];

const OnboardingScreen: React.FC<OnboardingScreenProps> = ({ onFinish }) => {
  const dispatch = useDispatch();
  const { t, changeLanguage, currentLanguage } = useTheme();
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [musicOn, setMusicOn] = useState<boolean>(true);
  const [isPlayerReady, setIsPlayerReady] = useState<boolean>(false);
  const [showLanguageDropdown, setShowLanguageDropdown] = useState<boolean>(false);
  const flatListRef = useRef<FlatList>(null);

  // Get current language object
  const selectedLanguage = languages.find(lang => lang.code === currentLanguage) || languages[0];

  // Dynamic onboarding data based on current language
  const onboardingData = [
    {
      id: '1',
      title: t('onboarding.screen1.title'),
      description: t('onboarding.screen1.description'),
      image: require('../assets/images/ob_1.png'),
    },
    {
      id: '2',
      title: t('onboarding.screen2.title'),
      description: t('onboarding.screen2.description'),
      image: require('../assets/images/ob_2.png'),
    },
    {
      id: '3',
      title: t('onboarding.screen3.title'),
      description: t('onboarding.screen3.description'),
      image: require('../assets/images/ob_3.png'),
    },
  ];

  // Initialize the track player
  useEffect(() => {
    const setupPlayer = async () => {
      try {
        await TrackPlayer.setupPlayer();
        await TrackPlayer.add({
          id: 'bgMusic',
          url: require('../assets/sounds/bg_2.mp3'),
          title: 'Background Music',
          artist: 'App',
          artwork: require('../assets/images/ob_1.png'),
          isLive: false,
        });
        await TrackPlayer.setVolume(0.5);
        setIsPlayerReady(true);

        if (musicOn) {
          await TrackPlayer.play();
        }
      } catch (error) {
        console.log('Error setting up player:', error);
      }
    };

    setupPlayer();

    return () => {
      TrackPlayer.reset();
    };
  }, []);

  // Handle play/pause when musicOn state changes
  useEffect(() => {
    if (!isPlayerReady) return;

    const togglePlayback = async () => {
      if (musicOn) {
        await TrackPlayer.play();
      } else {
        await TrackPlayer.pause();
      }
    };

    togglePlayback();
  }, [musicOn, isPlayerReady]);

  // Handle app state changes
  useEffect(() => {
    const handleAppStateChange = async (nextAppState: string) => {
      if (nextAppState === 'active' && musicOn && isPlayerReady) {
        await TrackPlayer.play();
      }
    };

    const subscription = AppState.addEventListener(
      'change',
      handleAppStateChange,
    );

    return () => {
      subscription.remove();
    };
  }, [musicOn, isPlayerReady]);

  const toggleMusic = () => {
    setMusicOn(!musicOn);
  };

  const toggleLanguageDropdown = () => {
    setShowLanguageDropdown(!showLanguageDropdown);
  };

  const selectLanguage = (language: typeof languages[0]) => {
    changeLanguage(language.code);
    setShowLanguageDropdown(false);
    console.log('Language changed to:', language.name);
  };

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
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <TouchableOpacity 
            onPress={toggleLanguageDropdown}
            style={styles.languageButton}
          >
            <Image
              source={require('../assets/images/lang.png')}
              style={[styles.icon, { tintColor: '#941b1b' }]}
            />
            <Text style={styles.languageText}>{selectedLanguage.countryCode}</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={toggleMusic} style={styles.musicButton}>
            {musicOn ? (
              <Image
                source={require('../assets/images/play.png')}
                style={[styles.icon, { tintColor: '#941b1b' }]}
              />
            ) : (
              <Image
                source={require('../assets/images/pause.png')}
                style={[styles.icon, { tintColor: '#941b1b' }]}
              />
            )}
          </TouchableOpacity>
        </View>

        <Image
          source={require('../assets/images/m4.png')}
          style={styles.centerImage}
        />

        <TouchableOpacity onPress={handleSkip}>
          <Text style={styles.skipText}>{t('common.skip')}</Text>
        </TouchableOpacity>
      </View>

      {/* Language Dropdown Modal */}
      <Modal
        visible={showLanguageDropdown}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowLanguageDropdown(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPressOut={() => setShowLanguageDropdown(false)}
        >
          <View style={styles.dropdownContainer}>
            {languages.map((lang) => (
              <TouchableOpacity
                key={lang.code}
                style={[
                  styles.languageItem,
                  selectedLanguage.code === lang.code && styles.selectedLanguageItem,
                ]}
                onPress={() => selectLanguage(lang)}
              >
                <Text style={styles.languageFlag}>{lang.icon}</Text>
                <Text style={styles.languageName}>{lang.name}</Text>
                {selectedLanguage.code === lang.code && (
                  <Image
                    source={require('../assets/images/tick.png')}
                    style={styles.checkIcon}
                  />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>

      <FlatList
        ref={flatListRef}
        data={onboardingData}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
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
              ? t('common.getStarted')
              : t('common.next')}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

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
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  languageButton: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  musicButton: {
    padding: 10,
  },
  icon: {
    width: 24,
    height: 24,
  },
  languageText: {
    fontSize: 20,
    marginRight: 5,
    color: '#941b1b',
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
    paddingTop: 40,
  },
  logo: {
    width: 250,
    height: 250,
    resizeMode: 'contain',
    marginBottom: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#941b1b',
    textAlign: 'center',
    marginBottom: 15,
    paddingHorizontal: 20,
  },
  description: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    paddingHorizontal: 30,
    lineHeight: 24,
  },
  footer: {
    alignItems: 'center',
    marginBottom: 40,
    paddingHorizontal: 20,
  },
  dotContainer: {
    flexDirection: 'row',
    marginBottom: 25,
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
    width: 20,
  },
  button: {
    backgroundColor: '#f09c60',
    paddingVertical: 15,
    paddingHorizontal: 50,
    borderRadius: 30,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-start',
    paddingTop: 60,
    paddingLeft: 20,
  },
  dropdownContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingVertical: 5,
    width: 180,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  languageItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  selectedLanguageItem: {
    backgroundColor: '#f5f5f5',
  },
  languageFlag: {
    fontSize: 20,
    marginRight: 12,
  },
  languageName: {
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
  checkIcon: {
    width: 16,
    height: 16,
    tintColor: '#941b1b',
  },
});

export default OnboardingScreen;