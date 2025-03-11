import { useState } from "react";
import { Alert, Button, Text } from "react-native";
import { TextInput } from "react-native";
import { View } from "react-native";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage"

export default function LoginScreen() {
  const apiurl = "http://192.168.0.182:8080"

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const Login = async () => {
    try {
    const response = await fetch(apiurl + '/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({email: email, password: password})
    })
    return await response;
  } catch (err) {
    Alert.alert("Error", "dunno")
    return false;
  }
  }

  async function submit() {
    const response = await Login();
    if (!response) {return;}
    if (response.ok) {
      const jwt = response.headers.get('set-cookie')?.split("=")[1]
      if (jwt) {
        await AsyncStorage.setItem('jwt', jwt)
        router.replace("/")
      }
    } else {
      Alert.alert('Incorrect Login', 'Error')
    }
  }




  return (
    <View style={{ marginLeft: 20, marginTop: 20, marginRight: 20}}>
      <Text style={{ fontSize: 48, color: 'black' }}>Login</Text>
      <TextInput placeholder="Email" value={email} onChangeText={setEmail} style={{ height: 60, borderColor: 'black', borderWidth: 2, fontSize: 24, marginBottom: 10, marginTop: 20}} />
      <TextInput placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry={true} style={{ height: 60, borderColor: 'black', borderWidth: 2, fontSize: 24, marginBottom: 10, marginTop: 20}} />
      <Button title="Login" onPress={() => submit()} />
    </View>
  );
}
