// src/app/index.tsx
import { useState } from 'react';
import { FlatList, View } from 'react-native';
import { Searchbar } from 'react-native-paper';
import ChipRow from '../components/ChipRow';
import ItemCard from '../components/ItemCard';
import TopBar from '../components/TopBar';
import { useItems } from '../api/items';
import { categories } from '../constants/mockData';

export default function HomeScreen() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');
  const items = useItems(); // includes items listed in this session

  const shown = items.filter(
    (i) =>
      (category === 'All' || i.category === category) &&
      i.title.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <View style={{ flex: 1 }}>
      <TopBar title="MintedMU" leftIcon="menu" showAvatar />
      <Searchbar
        placeholder="Search for an item"
        value={query}
        onChangeText={setQuery}
        style={{ margin: 16 }}
      />
      <ChipRow options={categories} active={category} onSelect={setCategory} />
      <FlatList
        style={{ marginTop: 16 }}
        data={shown}
        keyExtractor={(i) => i.id}
        numColumns={2}
        columnWrapperStyle={{ justifyContent: 'space-between' }}
        contentContainerStyle={{ paddingHorizontal: 16 }}
        renderItem={({ item }) => <ItemCard item={item} />}
      />
    </View>
  );
}
