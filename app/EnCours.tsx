import HeaderNav from "@/components/Header";
import { API_URL } from "@/config_connexion_api/conf-api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface Fiche {
  numIntervention_vdev: string;
  raisonSociale_vdev: string;
  dateIntervention_vdev: string;
  heureIntervention_vdev: string;
}

export default function EnCours() {
  const [LesFiches, setFiches] = useState<Fiche[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchFiches = async () => {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        alert("Token introuable. Reconnectez-vous");
        router.replace("/");
        return;
      }
      const payload = JSON.parse(atob(token.split(".")[1]));
      const matricule = payload.sub;

      const response = await fetch(
        `${API_URL}/intervention/getFichesByMatriculeNV/${matricule}`,
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
    <SafeAreaView className="flex flex-1">
      <HeaderNav />
      <ScrollView>
        {LesFiches.length !== 0 ? (
          LesFiches.map((fiche) => (
            <View
              key={fiche.numIntervention_vdev}
              className="w-full h-auto p-3 rounded border border-red-800 mb-4 m-1"
            >
              <View>
                <Text className="mb-2">
                  Intervention #{fiche.numIntervention_vdev}
                </Text>
                <Text>Client : {fiche.raisonSociale_vdev}</Text>
                <View className="flex-1 flex-row gap-2">
                  <Text>Date : {fiche.dateIntervention_vdev}</Text>
                  <Text>Heure : {fiche.dateIntervention_vdev}</Text>
                </View>
              </View>
              <TouchableOpacity
                className="absolute right-0 mr-2 top-[50%] border border-red-500 bg-red-500 rounded-md p-2"
                onPress={() =>
                  router.replace(
                    `/InterventionPreVisualisation/${fiche.numIntervention_vdev}`,
                  )
                }
              >
                <Text className="text-white">Voir</Text>
              </TouchableOpacity>
            </View>
          ))
        ) : (
          <Text>Pas de fiches affectées..</Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
