import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@contexts/AuthContext';
import { UserRole } from '@appTypes/index';

// Screens
import DashboardScreen from '@screens/dashboard/DashboardScreen';
import GroupSMSScreen from '@screens/dashboard/GroupSMSScreen';
import MapScreen from '@screens/map/MapScreen';
import ScheduleScreen from '@screens/schedule/ScheduleScreen';
import CustomersScreen from '@screens/customers/CustomersScreen';
import CustomerDetailScreen from '@screens/customers/CustomerDetailScreen';
import AddEditCustomerScreen from '@screens/customers/AddEditCustomerScreen';
import JobsScreen from '@screens/jobs/JobsScreen';
import JobDetailScreen from '@screens/jobs/JobDetailScreen';
import AddEditJobScreen from '@screens/jobs/AddEditJobScreen';
import ProfileScreen from '@screens/profile/ProfileScreen';
import AvailabilityScreen from '@screens/profile/AvailabilityScreen';
import RegisterScreen from '@screens/auth/RegisterScreen';
import TermsOfServiceScreen from '@screens/legal/TermsOfServiceScreen';
import PrivacyPolicyScreen from '@screens/legal/PrivacyPolicyScreen';
import EULAScreen from '@screens/legal/EULAScreen';

import {
  DashboardStackParamList,
  MapStackParamList,
  ScheduleStackParamList,
  CustomersStackParamList,
  JobsStackParamList,
  ProfileStackParamList,
} from './types';

const DashboardStack = createStackNavigator<DashboardStackParamList>();
const MapStack = createStackNavigator<MapStackParamList>();
const ScheduleStack = createStackNavigator<ScheduleStackParamList>();
const CustomersStack = createStackNavigator<CustomersStackParamList>();
const JobsStack = createStackNavigator<JobsStackParamList>();
const ProfileStack = createStackNavigator<ProfileStackParamList>();
const Tab = createBottomTabNavigator();

const stackScreenOptions = {
  headerStyle: { backgroundColor: '#fff' },
  headerTintColor: '#4CBB17',
  headerTitleStyle: { fontWeight: '600' as const },
};

function DashboardStackScreen() {
  return (
    <DashboardStack.Navigator screenOptions={stackScreenOptions}>
      <DashboardStack.Screen name="DashboardHome" component={DashboardScreen} options={{ title: 'Dashboard' }} />
      <DashboardStack.Screen name="GroupSMS" component={GroupSMSScreen} options={{ title: 'Group SMS' }} />
    </DashboardStack.Navigator>
  );
}

function MapStackScreen() {
  return (
    <MapStack.Navigator screenOptions={{ headerShown: false }}>
      <MapStack.Screen name="MapHome" component={MapScreen} />
    </MapStack.Navigator>
  );
}

function ScheduleStackScreen() {
  return (
    <ScheduleStack.Navigator screenOptions={stackScreenOptions}>
      <ScheduleStack.Screen name="ScheduleHome" component={ScheduleScreen} options={{ title: 'Schedule' }} />
    </ScheduleStack.Navigator>
  );
}

function CustomersStackScreen() {
  return (
    <CustomersStack.Navigator screenOptions={stackScreenOptions}>
      <CustomersStack.Screen name="CustomersList" component={CustomersScreen} options={{ title: 'Customers' }} />
      <CustomersStack.Screen name="CustomerDetail" component={CustomerDetailScreen} options={{ title: 'Customer' }} />
      <CustomersStack.Screen
        name="AddEditCustomer"
        component={AddEditCustomerScreen}
        options={({ route }) => ({ title: route.params?.customerId ? 'Edit Customer' : 'Add Customer' })}
      />
    </CustomersStack.Navigator>
  );
}

function JobsStackScreen() {
  return (
    <JobsStack.Navigator screenOptions={stackScreenOptions}>
      <JobsStack.Screen name="JobsList" component={JobsScreen} options={{ title: 'Jobs' }} />
      <JobsStack.Screen name="JobDetail" component={JobDetailScreen} options={{ title: 'Job Details' }} />
      <JobsStack.Screen
        name="AddEditJob"
        component={AddEditJobScreen}
        options={({ route }) => ({ title: route.params?.jobId ? 'Edit Job' : 'New Job' })}
      />
    </JobsStack.Navigator>
  );
}

function ProfileStackScreen() {
  return (
    <ProfileStack.Navigator screenOptions={stackScreenOptions}>
      <ProfileStack.Screen name="ProfileHome" component={ProfileScreen} options={{ title: 'Profile' }} />
      <ProfileStack.Screen name="Availability" component={AvailabilityScreen} options={{ title: 'My Availability' }} />
      <ProfileStack.Screen name="AddEmployee" component={RegisterScreen} options={{ title: 'Add Employee' }} />
      <ProfileStack.Screen name="TermsOfService" component={TermsOfServiceScreen} options={{ headerShown: false }} />
      <ProfileStack.Screen name="PrivacyPolicy" component={PrivacyPolicyScreen} options={{ headerShown: false }} />
      <ProfileStack.Screen name="EULA" component={EULAScreen} options={{ headerShown: false }} />
    </ProfileStack.Navigator>
  );
}

export default function MainTabNavigator() {
  const { user } = useAuth();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap = 'home';
          switch (route.name) {
            case 'Dashboard': iconName = focused ? 'speedometer' : 'speedometer-outline'; break;
            case 'Map': iconName = focused ? 'map' : 'map-outline'; break;
            case 'Schedule': iconName = focused ? 'calendar' : 'calendar-outline'; break;
            case 'Customers': iconName = focused ? 'people' : 'people-outline'; break;
            case 'Jobs': iconName = focused ? 'briefcase' : 'briefcase-outline'; break;
            case 'Profile': iconName = focused ? 'person' : 'person-outline'; break;
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#4CBB17',
        tabBarInactiveTintColor: '#8E8E93',
        headerShown: false,
      })}
    >
      {user?.role === UserRole.ADMIN && (
        <Tab.Screen name="Dashboard" component={DashboardStackScreen} />
      )}
      {(user?.role === UserRole.ADMIN || user?.role === UserRole.SALESPERSON) && (
        <Tab.Screen name="Map" component={MapStackScreen} />
      )}
      <Tab.Screen name="Schedule" component={ScheduleStackScreen} />
      <Tab.Screen name="Customers" component={CustomersStackScreen} />
      <Tab.Screen name="Jobs" component={JobsStackScreen} />
      <Tab.Screen name="Profile" component={ProfileStackScreen} />
    </Tab.Navigator>
  );
}
