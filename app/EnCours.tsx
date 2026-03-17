import HeaderNav from "@/components/Header";
import { API_URL } from "@/config_connexion_api/conf-api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface Fiche {
  numIntervention_vdev: string;
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
      <View>
        {LesFiches.length !== 0 ? (
          LesFiches.map((fiche) => (
            <TouchableOpacity
              key={fiche.numIntervention_vdev}
              onPress={() =>
                router.replace(
                  `/InterventionPreVisualisation/${fiche.numIntervention_vdev}`,
                )
              }
            >
              <Text>Fiche n°{fiche.numIntervention_vdev}</Text>
            </TouchableOpacity>
          ))
        ) : (
          <Text>Pas de fiches affectées..</Text>
        )}
      </View>
    </SafeAreaView>
  );
}
