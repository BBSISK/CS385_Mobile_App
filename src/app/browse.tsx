// src/app/browse.tsx
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { FlatList, View } from 'react-native';
import { Searchbar } from 'react-native-paper';
import CategoryTile from '../components/CategoryTile';
import TopBar from '../components/TopBar';
import { browseCategories, categoryImages } from '../constants/mockData';

export default function Browse() {
  const router = useRouter();
  const [query, setQuery] = useState('');

  const shown = browseCategories.filter((c) => c.toLowerCase().includes(query.toLowerCase()));

  return (
    <View style={{ flex: 1 }}>
      <TopBar title="MintedMU" leftIcon="menu" showAvatar />
      <Searchbar
        placeholder="Search for an item"
        value={query}
        onChangeText={setQuery}
        style={{ margin: 16 }}
      />
      <FlatList
        data={shown}
        keyExtractor={(c) => c}
        numColumns={2}
        columnWrapperStyle={{ justifyContent: 'space-between' }}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 24 }}
        renderItem={({ item }) => (
          <CategoryTile
            label={item}
            image={categoryImages[item]?.image}
            onPress={() => router.push({ pathname: '/category/[name]', params: { name: item } })}
          />
        )}
      />
    </View>
  );
}
