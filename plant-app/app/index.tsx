import { useEffect, useState } from "react";
import { Alert, Button, Text } from "react-native";
import { View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage"
import { router } from "expo-router";

export default function HomeScreen() {
  const apiurl = "http://192.168.0.52:8080"
  
  const [firstname, setFirstname] = useState('Loading')

  async function logout() {
    await AsyncStorage.removeItem("jwt");
    router.replace("/login")
  }

  useEffect(() => {
    const getFirstname = async () => {
        try {
        const jwt = await AsyncStorage.getItem("jwt");
        const response = await fetch(apiurl + '/getFirstname', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({jwt: jwt})
        })
        const res = await response;
        if (res.ok) {
          const data = await res.json();
          setFirstname(data.firstname);
        } else {
          router.replace("/login")
        }
      } catch (err) {
        Alert.alert("Error", "dunno")
        router.replace("/login")
      }
      }
      getFirstname()
  }, [])

  return (
      <View style={{ marginLeft: 20, marginTop: 20, marginRight: 20}}>
        <Text style={{ fontSize: 24, color: 'black' }}>Welcome, {firstname}!</Text>
        <Text style={{ fontSize: 18, color: 'black', marginBottom: 300 }}>Double check notifications are enabled!</Text>
        <Button title="Logout" color={'red'} onPress={() => logout()} />
      </View>
  );
}
