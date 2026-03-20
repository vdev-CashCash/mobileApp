import HeaderNav from "@/components/Header";
import { API_URL } from "@/config_connexion_api/conf-api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function MesFiches() {
  const [LesFiches, setFiches] = useState([]);
  const router = useRouter();
  const [roleUtil, setRoleUtil] = useState("");

  useEffect(() => {
    const fetchFiches = async () => {
      const token = await AsyncStorage.getItem("token");
      const payload = JSON.parse(atob(token.split(".")[1]));
      const matricule = payload.sub;
      const agence = payload.agence;
      const role = payload.roles[0];
      setRoleUtil(role);

      const lien =
        role === "Technicien"
          ? `${API_URL}/intervention/getFichesByMatricule/${matricule}`
          : `${API_URL}/intervention/getFiches/${agence}`;

      const response = await fetch(lien, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

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
    <SafeAreaView classname="flex flex-1">
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
                {roleUtil === "Gestionnaire" && (
                  <Text>Employé : {fiche.dateIntervention_vdev}</Text>
                )}
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
