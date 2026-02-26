import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Searchbar, Card, Title, Paragraph, FAB, ActivityIndicator } from 'react-native-paper';
import { collection, query, onSnapshot } from 'firebase/firestore';
import { db } from '@config/firebase';
import { Customer } from '@types/index';

export default function CustomersScreen() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'customers'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const customersData: Customer[] = [];
      snapshot.forEach((doc) => {
        customersData.push({ id: doc.id, ...doc.data() } as Customer);
      });
      setCustomers(customersData);
      setFilteredCustomers(customersData);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const onChangeSearch = (query: string) => {
    setSearchQuery(query);
    if (query === '') {
      setFilteredCustomers(customers);
    } else {
      const filtered = customers.filter(
        (customer) =>
          customer.name.toLowerCase().includes(query.toLowerCase()) ||
          customer.phone.includes(query) ||
          customer.address.zipCode.includes(query)
      );
      setFilteredCustomers(filtered);
    }
  };

  const renderCustomer = ({ item }: { item: Customer }) => (
    <Card style={styles.card} onPress={() => {}}>
      <Card.Content>
        <Title>{item.name}</Title>
        <Paragraph>{item.phone}</Paragraph>
        <Paragraph>{item.address.street}</Paragraph>
        <Paragraph>
          {item.address.city}, {item.address.state} {item.address.zipCode}
        </Paragraph>
        <Paragraph style={styles.revenue}>
          Total Revenue: ${item.totalRevenue.toFixed(2)}
        </Paragraph>
      </Card.Content>
    </Card>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Searchbar
        placeholder="Search customers..."
        onChangeText={onChangeSearch}
        value={searchQuery}
        style={styles.searchbar}
      />

      <FlatList
        data={filteredCustomers}
        renderItem={renderCustomer}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
      />

      <FAB
        style={styles.fab}
        icon="plus"
        onPress={() => {
          // Open add customer modal
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchbar: {
    margin: 16,
  },
  list: {
    padding: 16,
  },
  card: {
    marginBottom: 16,
    elevation: 2,
  },
  revenue: {
    marginTop: 8,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: '#007AFF',
  },
});
