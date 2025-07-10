import React from 'react';
import { StyleSheet, Text, View, SafeAreaView, ScrollView } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { GradientBackground } from '../styles/themes';
import { useSelector } from 'react-redux';
import { RootState } from '../store';

const HomeScreen = () => {
  const { t, container, text } = useTheme();
  const currentTheme = useSelector((state: RootState) => state.theme.currentTheme);

  const Content = () => (
    <SafeAreaView style={[container, styles.container]}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Text style={[text, styles.greeting]}>{t('home.greeting')}</Text>
          <Text style={[text, styles.title]}>{t('home.title')}</Text>
        </View>

        <View style={styles.section}>
          <Text style={[text, styles.sectionTitle]}>{t('home.categories')}</Text>
          <View style={styles.categoriesContainer}>
            <Text style={[text, styles.categoryItem]}>{t('categories.shlokas')}</Text>
            <Text style={[text, styles.categoryItem]}>{t('categories.vedas')}</Text>
            <Text style={[text, styles.categoryItem]}>{t('categories.bhagbat')}</Text>
            <Text style={[text, styles.categoryItem]}>{t('categories.stories')}</Text>
            <Text style={[text, styles.categoryItem]}>{t('categories.mantras')}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[text, styles.sectionTitle]}>{t('home.books')}</Text>
          <View style={styles.booksContainer}>
            <Text style={[text, styles.bookItem]}>{t('books.book1.title')}</Text>
            <Text style={[text, styles.bookAuthor]}>{t('books.book1.author')}</Text>
            
            <Text style={[text, styles.bookItem]}>{t('books.book2.title')}</Text>
            <Text style={[text, styles.bookAuthor]}>{t('books.book2.author')}</Text>
            
            <Text style={[text, styles.bookItem]}>{t('books.book3.title')}</Text>
            <Text style={[text, styles.bookAuthor]}>{t('books.book3.author')}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[text, styles.sectionTitle]}>{t('carousel.item1.title1')}</Text>
          <Text style={[text, styles.quote]}>{t('carousel.item1.content')}</Text>
        </View>

        <View style={styles.section}>
          <Text style={[text, styles.sectionTitle]}>{t('carousel.item2.title1')}</Text>
          <Text style={[text, styles.quote]}>{t('carousel.item2.content')}</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );

  return currentTheme === 'gradient' ? (
    <GradientBackground>
      <Content />
    </GradientBackground>
  ) : (
    <Content />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    padding: 20,
  },
  header: {
    marginBottom: 30,
    alignItems: 'center',
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  categoriesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  categoryItem: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 10,
    borderRadius: 8,
    fontSize: 14,
  },
  booksContainer: {
    gap: 10,
  },
  bookItem: {
    fontSize: 16,
    fontWeight: '600',
  },
  bookAuthor: {
    fontSize: 14,
    opacity: 0.7,
    marginBottom: 10,
  },
  quote: {
    fontSize: 16,
    lineHeight: 24,
    fontStyle: 'italic',
    padding: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#941b1b',
  },
});

export default HomeScreen;