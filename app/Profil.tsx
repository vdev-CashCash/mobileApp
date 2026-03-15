import HeaderNav from "@/components/Header";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type Payload = {
  nom: string;
  prenom: string;
  roles: string[];
  sub: string;
};

export default function Profil() {
  const router = useRouter();
  const [payload, setPayload] = useState<Payload | null>(null);

  useEffect(() => {
    const loadToken = async () => {
      const token = await AsyncStorage.getItem("token");
      if (!token) return router.replace("/");
      const decoded: Payload = JSON.parse(atob(token.split(".")[1]));
      setPayload(decoded);
    };
    loadToken();
  }, []);

  const handleLogout = async () => {
    await AsyncStorage.removeItem("token");
    router.replace("/");
  };

  if (!payload) {
    return (
      <View className="flex-1 bg-gray-100">
        <HeaderNav />
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#EF4444" />
        </View>
      </View>
    );
  }

  const fields: { label: string; value: string }[] = [
    { label: "Nom", value: payload.nom },
    { label: "Prénom", value: payload.prenom },
    { label: "Rôle", value: payload.roles[0] },
    { label: "Matricule", value: payload.sub },
  ];

  return (
    // Colonne : header collé en haut, reste de l'espace pour le contenu
    <SafeAreaView className="flex-1 bg-gray-100">
      <HeaderNav />

      {/* Zone centrale : prend tout l'espace restant et centre la carte */}
      <View className="flex-1 items-center justify-center px-4">
        <View className="w-full bg-white rounded-2xl p-8 shadow-md">
          <Text className="text-2xl font-bold mb-6 text-gray-900">
            Mon Profil
          </Text>

          <View className="gap-3">
            {fields.map(({ label, value }) => (
              <View
                key={label}
                className="flex-row justify-between items-center"
              >
                <Text className="text-sm text-gray-500">{label} :</Text>
                <Text className="text-sm font-medium text-gray-800 text-right">
                  {value}
                </Text>
              </View>
            ))}
          </View>

          <TouchableOpacity
            className="mt-8 w-full bg-red-500 active:bg-red-600 rounded-xl py-3 items-center"
            onPress={handleLogout}
            activeOpacity={0.8}
          >
            <Text className="text-white font-semibold text-base">
              Déconnexion
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
