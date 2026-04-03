import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Searchbar, Card, Text, FAB, ActivityIndicator, Chip } from 'react-native-paper';
import { collection, query, onSnapshot, where } from 'firebase/firestore';
import { db } from '@config/firebase';
import { useAuth } from '@contexts/AuthContext';
import { Customer, UserRole } from '@appTypes/index';

export default function CustomersScreen({ navigation }: any) {
  const { user } = useAuth();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [filtered, setFiltered] = useState<Customer[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'customers'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data: Customer[] = [];
      snapshot.forEach((d) => data.push({ id: d.id, ...d.data() } as Customer));
      const sorted = data.sort((a, b) => a.name.localeCompare(b.name));
      setCustomers(sorted);
      setFiltered(applySearch(sorted, searchQuery));
      setLoading(false);
    }, (error) => {
      console.error('Customers snapshot error:', error);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const applySearch = (list: Customer[], q: string) => {
    if (!q) return list;
    const lower = q.toLowerCase();
    return list.filter(
      (c) =>
        c.name.toLowerCase().includes(lower) ||
        c.phone.includes(q) ||
        c.address.zipCode.includes(q) ||
        c.address.city.toLowerCase().includes(lower)
    );
  };

  const onChangeSearch = (q: string) => {
    setSearchQuery(q);
    setFiltered(applySearch(customers, q));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return '#34C759';
      case 'inactive': return '#8E8E93';
      case 'dnc': return '#FF3B30';
      default: return '#8E8E93';
    }
  };

  const canAdd = user?.role === UserRole.ADMIN || user?.role === UserRole.SALESPERSON || user?.role === UserRole.TECHNICIAN;

  const renderCustomer = ({ item }: { item: Customer }) => (
    <Card style={styles.card} onPress={() => navigation.navigate('CustomerDetail', { customerId: item.id })}>
      <Card.Content>
        <View style={styles.cardHeader}>
          <Text style={styles.name}>{item.name}</Text>
          <Chip
            style={[styles.statusChip, { backgroundColor: getStatusColor(item.status) }]}
            textStyle={styles.chipText}
            compact
          >
            {item.status === 'dnc' ? 'DNC' : item.status}
          </Chip>
        </View>
        <Text style={styles.phone}>{item.phone}</Text>
        <Text style={styles.address}>
          {item.address.street}, {item.address.city} {item.address.zipCode}
        </Text>
        {item.totalRevenue > 0 && (
          <Text style={styles.revenue}>Revenue: ${item.totalRevenue.toFixed(2)}</Text>
        )}
      </Card.Content>
    </Card>
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#4CBB17" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Searchbar
        placeholder="Search by name, phone, city, zip..."
        onChangeText={onChangeSearch}
        value={searchQuery}
        style={styles.searchbar}
        inputStyle={styles.searchInput}
      />

      <FlatList
        data={filtered}
        renderItem={renderCustomer}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>
              {searchQuery ? 'No customers match your search' : 'No customers yet'}
            </Text>
          </View>
        }
      />

      {canAdd && (
        <FAB
          style={styles.fab}
          icon="plus"
          onPress={() => navigation.navigate('AddEditCustomer', {})}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  searchbar: { margin: 12, borderRadius: 10, elevation: 1 },
  searchInput: { fontSize: 15 },
  list: { padding: 12, paddingTop: 0, paddingBottom: 80 },
  card: { marginBottom: 10, elevation: 1 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  name: { fontSize: 17, fontWeight: '700', color: '#1C1C1E', flex: 1, marginRight: 8 },
  statusChip: { height: 22 },
  chipText: { color: '#fff', fontSize: 10, fontWeight: '700' },
  phone: { fontSize: 14, color: '#3C3C43', marginBottom: 2 },
  address: { fontSize: 13, color: '#8E8E93' },
  revenue: { fontSize: 14, fontWeight: '600', color: '#34C759', marginTop: 4 },
  empty: { flex: 1, alignItems: 'center', paddingTop: 60 },
  emptyText: { color: '#8E8E93', fontSize: 16 },
  fab: { position: 'absolute', margin: 16, right: 0, bottom: 0, backgroundColor: '#4CBB17' },
});
