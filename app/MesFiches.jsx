import { API_URL } from "@/config_connexion_api/conf-api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function MesFiches() {
  const [LesFiches, setFiches] = useState([]);
  const [matcheck, setmatcheck] = useState("");
  const router = useRouter();

  useEffect(() => {
    const fetchFiches = async () => {
      const token = await AsyncStorage.getItem("token");
      const payload = JSON.parse(atob(token.split(".")[1]));
      const matricule = payload.sub;

      const response = await fetch(
        `${API_URL}/intervention/getFichesByMatricule/${matricule}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.status === 401) {
        alert(
          "Vous avez été déconnecté de l'application. Veuillez vous reconnecter à l'application..",
        );
        router.replace("/");
        return;
      }
      if (!response.ok) {
        Alert.alert("Erreur", "Impossible de charger vos interventions");
        return;
      }

      const data = await response.json();
      setFiches(data);
    };

    fetchFiches();
  }, []);

  return (
    <SafeAreaView classname="flex flex-1 justify-center items-center">
      <View>
        <Text>{LesFiches[0].numIntervention_vdev}</Text>
      </View>
    </SafeAreaView>
  );
}
