import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useState } from 'react';
import { FlatList, Image, StyleSheet, Text, View } from 'react-native';
import { WEATHER_API_KEY } from '@env';

const API_KEY = WEATHER_API_KEY;
const cities = ['New York', 'London', 'Tokyo', 'Paris', 'Sydney', 'Dubai', 'Berlin'];

export default function Explore() {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    const fetchAll = async () => {
      const results = await Promise.all(
        cities.map(async (city) => {
          const res = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
          );
          const json = await res.json();
          return { ...json, name: city };
        })
      );
      setData(results);
    };
    fetchAll();
  }, []);

  return (
    <LinearGradient colors={['#43cea2', '#185a9d']} style={styles.container}>
      <Text style={styles.title}>Explore Weather</Text>

      <FlatList
        data={data}
        keyExtractor={(item) => item.name}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.city}>{item.name}</Text>
            <Image
              style={styles.icon}
              source={{
                uri: `https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`,
              }}
            />
            <Text style={styles.temp}>{Math.round(item.main.temp)}°C</Text>
            <Text style={styles.desc}>{item.weather[0].main}</Text>
          </View>
        )}
      />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 60, paddingHorizontal: 20 },
  title: {
    fontSize: 26,
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  card: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 15,
    padding: 20,
    marginVertical: 10,
    alignItems: 'center',
  },
  city: { fontSize: 20, color: '#fff', fontWeight: '600' },
  icon: { width: 70, height: 70 },
  temp: { fontSize: 28, color: '#fff', fontWeight: 'bold' },
  desc: { color: '#fff', fontSize: 16, textTransform: 'capitalize' },
});
