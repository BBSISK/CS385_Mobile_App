// src/app/category/[name].tsx
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { FlatList, View } from 'react-native';
import { Searchbar, Text, useTheme } from 'react-native-paper';
import ItemCard from '../../components/ItemCard';
import TopBar from '../../components/TopBar';
import { useItems } from '../../api/items';

export default function CategoryItems() {
  const { name } = useLocalSearchParams<{ name: string }>();
  const router = useRouter();
  const theme = useTheme();
  const [query, setQuery] = useState('');
  const items = useItems();

  const shown = items.filter(
    (i) => i.subcategory === name && i.title.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <View style={{ flex: 1 }}>
      <TopBar title={name ?? ''} leftIcon="arrow-left" onLeftPress={() => router.back()} />
      <Searchbar
        placeholder="Search for an item"
        value={query}
        onChangeText={setQuery}
        style={{ margin: 16 }}
      />
      <FlatList
        data={shown}
        keyExtractor={(i) => i.id}
        numColumns={2}
        columnWrapperStyle={{ justifyContent: 'space-between' }}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 24 }}
        renderItem={({ item }) => <ItemCard item={item} />}
        ListEmptyComponent={
          <Text
            variant="bodyMedium"
            style={{ textAlign: 'center', marginTop: 32, color: theme.colors.onSurfaceVariant }}
          >
            No items in {name} yet
          </Text>
        }
      />
    </View>
  );
}
