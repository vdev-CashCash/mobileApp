import AsyncStorage from "@react-native-async-storage/async-storage";
import { useState } from "react";
import {
    Alert,
    Image,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

const API_URL = "http://localhost:8080";

const Login = async (matricule: string, password: string) => {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ matricule, password }),
  });
  const data = await response.json();
  //localStorage n'existe pas en React Native → on utilise AsyncStorage
  await AsyncStorage.setItem("token", data.token);
  return data;
};

const LoginSignup = () => {
  const [useMatricule, setMatricule] = useState("");
  const [usePassword, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      await Login(useMatricule, usePassword);
      // navigation.navigate('MesFiches');
      Alert.alert("Succès", "Connexion réussie !");
    } catch (error) {
      console.error("Error:", error);
      Alert.alert("Erreur", "Identifiants incorrects");
    }
  };

  return (
    <View className="flex-1 justify-center bg-white w-screen gap-3">
      <Image
        source={require("../assets/images/cashcashlogo.png")}
        className="w-2/3 self-center justify-self-start"
        resizeMode="contain"
      />
      <View className="w-full px-8 gap-y-5 self-center max-w-[400px]">
        {/* Header */}
        <View className="items-center mb-5">
          <Text className="text-[32px] font-bold text-[#2B2E42] mb-2">
            Login
          </Text>
          <View className="h-2 w-48 rounded-full bg-[#EE2449]" />
        </View>

        {/* Inputs */}
        <View className="gap-y-4">
          {/* Champ Matricule */}
          <View className="flex-row items-center gap-x-4 px-3 py-2 bg-[#EDF2F4] rounded-md">
            <Image
              source={require("../assets/login.png")}
              className="w-6 h-6"
              resizeMode="contain"
            />
            <TextInput
              className="flex-1 text-base text-[#2B2E42] py-1"
              placeholder="Matricule interne"
              placeholderTextColor="#9ca3af"
              value={useMatricule}
              onChangeText={setMatricule}
            />
          </View>

          {/* Champ Mot de passe */}
          <View className="flex-row items-center gap-x-4 px-3 py-2 bg-[#EDF2F4] rounded-md">
            <Image
              source={require("../assets/password.png")}
              className="w-6 h-6"
              resizeMode="contain"
            />
            <TextInput
              className="flex-1 text-base text-[#2B2E42] py-1"
              placeholder="Mot de passe"
              placeholderTextColor="#9ca3af"
              value={usePassword}
              onChangeText={setPassword}
              secureTextEntry // équivalent de type="password"
            />
          </View>
        </View>

        {/* Bouton Submit */}
        <TouchableOpacity
          onPress={handleLogin}
          activeOpacity={0.85}
          className="w-full h-[50px] bg-[#EE2449] rounded-md items-center justify-center mt-4"
        >
          <Text className="text-white text-base font-bold">Login</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default LoginSignup;
