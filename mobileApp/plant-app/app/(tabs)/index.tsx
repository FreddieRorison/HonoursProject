import { Button, Text } from "react-native";
import { TextInput } from "react-native";
import { View } from "react-native";

export default function HomeScreen() {
  return (
    <View style={{ marginLeft: 20, marginTop: 20, marginRight: 20}}>
      <Text style={{ fontSize: 48, color: 'black' }}>Login</Text>
      <TextInput placeholder="Email" style={{ height: 60, borderColor: 'black', borderWidth: 2, fontSize: 24, marginBottom: 10, marginTop: 20}} />
      <TextInput placeholder="Password" secureTextEntry={true} style={{ height: 60, borderColor: 'black', borderWidth: 2, fontSize: 24, marginBottom: 10, marginTop: 20}} />
      <Button title="Login" onPress={() => alert("Pressed")} />
    </View>
  );
}
