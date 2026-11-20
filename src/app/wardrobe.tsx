// src/app/wardrobe.tsx
import { useState } from 'react';
import { FlatList, View } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import ChipRow from '../components/ChipRow';
import ItemCard from '../components/ItemCard';
import ScheduledRow from '../components/ScheduledRow';
import TopBar from '../components/TopBar';
import TopTabs from '../components/TopTabs';
import TransactionRow from '../components/TransactionRow';
import { useItems } from '../api/items';
import { scheduled as scheduledData, transactions } from '../constants/mockData';

const sections = ['My items', 'Messages', 'Scheduled'];
const statuses = ['Active', 'Liked', 'Completed'];
const scheduleViews = ['Scheduled', 'Requests'];

export default function Wardrobe() {
  const theme = useTheme();
  const [section, setSection] = useState('My items');
  const [status, setStatus] = useState('Active');
  const [scheduleView, setScheduleView] = useState('Scheduled');
  const [scheduled, setScheduled] = useState(scheduledData);
  const items = useItems();

  const shown = items.filter((i) => i.status === status);

  const empty = (message: string) => (
    <Text
      variant="bodyMedium"
      style={{ textAlign: 'center', marginTop: 32, color: theme.colors.onSurfaceVariant }}
    >
      {message}
    </Text>
  );

  const chips = (options: string[], active: string, onSelect: (o: string) => void) => (
    <View style={{ height: 44, marginVertical: 12 }}>
      <ChipRow options={options} active={active} onSelect={onSelect} />
    </View>
  );

  return (
    <View style={{ flex: 1 }}>
      <TopBar title="MintedMU" leftIcon="menu" showAvatar />
      <TopTabs tabs={sections} active={section} onSelect={setSection} />

      {section === 'My items' && (
        <>
          {chips(statuses, status, setStatus)}
          {status === 'Completed' ? (
            <FlatList
              key="transactions"
              data={transactions}
              keyExtractor={(t) => t.id}
              renderItem={({ item }) => <TransactionRow transaction={item} />}
              ListEmptyComponent={empty('No completed transactions yet')}
            />
          ) : (
            <FlatList
              key="grid"
              data={shown}
              keyExtractor={(i) => i.id}
              numColumns={2}
              columnWrapperStyle={{ justifyContent: 'space-between' }}
              contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 24 }}
              renderItem={({ item }) => <ItemCard item={item} showLike={status === 'Liked'} />}
              ListEmptyComponent={empty(`No ${status.toLowerCase()} items yet`)}
            />
          )}
        </>
      )}

      {section === 'Scheduled' && (
        <>
          {chips(scheduleViews, scheduleView, setScheduleView)}
          {scheduleView === 'Scheduled' ? (
            <FlatList
              key="scheduled"
              data={scheduled}
              keyExtractor={(s) => s.id}
              renderItem={({ item }) => (
                <ScheduledRow
                  entry={item}
                  onComplete={() => setScheduled((prev) => prev.filter((s) => s.id !== item.id))}
                />
              )}
              ListEmptyComponent={empty('Nothing scheduled yet')}
            />
          ) : (
            empty('Requests coming soon')
          )}
        </>
      )}

      {section === 'Messages' && (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Text variant="titleMedium">Messages coming soon</Text>
        </View>
      )}
    </View>
  );
}
