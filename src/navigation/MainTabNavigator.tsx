import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@contexts/AuthContext';
import { UserRole } from '@types/index';

// Screens
import DashboardScreen from '@screens/dashboard/DashboardScreen';
import MapScreen from '@screens/map/MapScreen';
import ScheduleScreen from '@screens/schedule/ScheduleScreen';
import CustomersScreen from '@screens/customers/CustomersScreen';
import JobsScreen from '@screens/jobs/JobsScreen';
import ProfileScreen from '@screens/profile/ProfileScreen';

export type MainTabParamList = {
  Dashboard: undefined;
  Map: undefined;
  Schedule: undefined;
  Customers: undefined;
  Jobs: undefined;
  Profile: undefined;
};

const Tab = createBottomTabNavigator<MainTabParamList>();

export default function MainTabNavigator() {
  const { user } = useAuth();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap = 'home';

          switch (route.name) {
            case 'Dashboard':
              iconName = focused ? 'speedometer' : 'speedometer-outline';
              break;
            case 'Map':
              iconName = focused ? 'map' : 'map-outline';
              break;
            case 'Schedule':
              iconName = focused ? 'calendar' : 'calendar-outline';
              break;
            case 'Customers':
              iconName = focused ? 'people' : 'people-outline';
              break;
            case 'Jobs':
              iconName = focused ? 'briefcase' : 'briefcase-outline';
              break;
            case 'Profile':
              iconName = focused ? 'person' : 'person-outline';
              break;
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: 'gray',
        headerShown: true,
      })}
    >
      {user?.role === UserRole.ADMIN && (
        <Tab.Screen name="Dashboard" component={DashboardScreen} />
      )}
      
      {(user?.role === UserRole.ADMIN || user?.role === UserRole.SALESPERSON) && (
        <Tab.Screen name="Map" component={MapScreen} />
      )}
      
      <Tab.Screen name="Schedule" component={ScheduleScreen} />
      
      {(user?.role === UserRole.ADMIN || user?.role === UserRole.SALESPERSON) && (
        <Tab.Screen name="Customers" component={CustomersScreen} />
      )}
      
      <Tab.Screen name="Jobs" component={JobsScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}
