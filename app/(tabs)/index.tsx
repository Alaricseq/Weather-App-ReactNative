import React, { useState, useEffect } from "react";
import { WEATHER_API_KEY } from '@env';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  FlatList,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";

const API_KEY = WEATHER_API_KEY;

export default function Index() {
  const [city, setCity] = useState("Bangalore");
  const [weather, setWeather] = useState<any>(null);
  const [forecast, setForecast] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchWeather = async (location: string) => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${location}&units=metric&appid=${API_KEY}`
      );
      const data = await response.json();
      setWeather(data);

      const forecastResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${location}&units=metric&appid=${API_KEY}`
      );
      const forecastData = await forecastResponse.json();
      setForecast(forecastData.list.slice(0, 5));
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeather(city);
  }, []);

  const getGradientColors = () => {
    if (!weather) return ["#4c669f", "#3b5998", "#192f6a"];
    const main = weather.weather[0].main.toLowerCase();
    switch (main) {
      case "clear":
        return ["#56CCF2", "#2F80ED"];
      case "clouds":
        return ["#757F9A", "#D7DDE8"];
      case "rain":
        return ["#00C6FB", "#005BEA"];
      case "thunderstorm":
        return ["#141E30", "#243B55"];
      case "snow":
        return ["#E0EAFC", "#CFDEF3"];
      case "mist":
      case "fog":
        return ["#606c88", "#3f4c6b"];
      default:
        return ["#4c669f", "#3b5998", "#192f6a"];
    }
  };

  return (
    <LinearGradient colors={getGradientColors()} style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.inner}
      >
        <Text style={styles.title}>🌤️ Weather Forecast</Text>

        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search city..."
            placeholderTextColor="#ccc"
            value={city}
            onChangeText={setCity}
            onSubmitEditing={() => fetchWeather(city)}
          />
          <TouchableOpacity onPress={() => fetchWeather(city)}>
            <Text style={styles.searchButton}>🔍</Text>
          </TouchableOpacity>
        </View>

        {loading ? (
          <ActivityIndicator size="large" color="#fff" style={{ marginTop: 20 }} />
        ) : (
          weather && (
            <View style={styles.weatherBox}>
              <Text style={styles.cityName}>{weather.name}</Text>
              <Text style={styles.temp}>{Math.round(weather.main.temp)}°C</Text>
              <Image
                source={{
                  uri: `https://openweathermap.org/img/wn/${weather.weather[0].icon}@4x.png`,
                }}
                style={styles.weatherIcon}
              />
              <Text style={styles.description}>
                {weather.weather[0].description.toUpperCase()}
              </Text>
            </View>
          )
        )}

        <Text style={styles.forecastTitle}>Next 5 Forecasts</Text>
        <FlatList
          data={forecast}
          keyExtractor={(_, index) => index.toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 10 }}
          renderItem={({ item }) => (
            <View style={styles.forecastCard}>
              <Text style={styles.forecastTime}>
                {new Date(item.dt * 1000).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </Text>
              <Image
                source={{
                  uri: `https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`,
                }}
                style={{ width: 50, height: 50 }}
              />
              <Text style={styles.forecastTemp}>
                {Math.round(item.main.temp)}°C
              </Text>
            </View>
          )}
        />
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  inner: { flex: 1, alignItems: "center", justifyContent: "center", padding: 20 },
  title: { fontSize: 28, fontWeight: "700", color: "#fff", marginBottom: 20 },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 12,
    paddingHorizontal: 15,
    marginBottom: 25,
    width: "90%",
  },
  searchInput: { flex: 1, color: "#fff", fontSize: 18, paddingVertical: 8 },
  searchButton: { fontSize: 22, color: "#fff" },
  weatherBox: { alignItems: "center", marginBottom: 20 },
  cityName: { fontSize: 26, fontWeight: "bold", color: "#fff" },
  temp: { fontSize: 60, color: "#fff", fontWeight: "700" },
  weatherIcon: { width: 120, height: 120 },
  description: { fontSize: 18, color: "#fff", marginTop: 5 },
  forecastTitle: { fontSize: 22, fontWeight: "600", color: "#fff", marginBottom: 10 },
  forecastCard: {
    backgroundColor: "rgba(255,255,255,0.3)",
    borderRadius: 15,
    padding: 10,
    marginHorizontal: 5,
    alignItems: "center",
  },
  forecastTime: { color: "#fff", fontWeight: "600" },
  forecastTemp: { color: "#fff", fontSize: 18, marginTop: 5 },
});
