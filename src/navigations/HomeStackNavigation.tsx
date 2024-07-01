// src/navigations/HomeStackNavigation.tsx
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from '../screens/Home';
import MovieDetail from '../screens/MovieDetail';

export type RootStackParamList = {
  HomeScreen: undefined;
  MovieDetail: { id: number }; // Pastikan parameter untuk MovieDetail ditentukan dengan jelas
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const HomeStackNavigation = () => {
  return (
    <Stack.Navigator initialRouteName="HomeScreen">
      <Stack.Screen name="HomeScreen" component={Home} />
      <Stack.Screen name="MovieDetail" component={MovieDetail} />
    </Stack.Navigator>
  );
};

export default HomeStackNavigation;
