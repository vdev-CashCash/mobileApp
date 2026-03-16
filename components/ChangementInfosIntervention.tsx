import { API_URL } from "@/config_connexion_api/conf-api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Alert, Text, TouchableOpacity } from "react-native";

type Props = {
  numIntervention_vdev: string;
  dateVisite_vdev: string;
  heureVisite_vdev: string;
  matriculeEmploye_vdev: string;
};

export default function ChangementInfosIntervention({
  numIntervention_vdev,
  dateVisite_vdev,
  heureVisite_vdev,
  matriculeEmploye_vdev,
}: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSetUpdate = async () => {
    const token = await AsyncStorage.getItem("token");
    setLoading(true);

    const res = await fetch(`${API_URL}/intervention/updateIntervention`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        numIntervention_vdev,
        dateVisite_vdev,
        heureVisite_vdev,
        matriculeEmploye_vdev,
      }),
    });

    setLoading(false);

    if (res.status === 401) {
      Alert.alert(
        "Session expirée",
        "Vous avez été déconnecté de l'application. Veuillez vous reconnecter.",
        [{ text: "OK", onPress: () => router.replace("/") }],
      );
      return;
    }

    if (!res.ok) {
      Alert.alert(
        "Erreur",
        "Erreur lors de la modification de l'intervention.",
      );
      return;
    }

    Alert.alert(
      "Succès",
      "Les modifications de l'intervention ont bien été prises en compte.",
      [{ text: "OK", onPress: () => router.replace("/MesFiches") }],
    );
  };

  return (
    <TouchableOpacity
      className="bg-rose-700 active:bg-rose-950 py-2 px-4 rounded-full items-center"
      onPress={handleSetUpdate}
      activeOpacity={0.8}
      disabled={loading}
    >
      <Text className="text-white font-semibold text-center">
        {loading ? "Enregistrement..." : "Confirmer changements"}
      </Text>
    </TouchableOpacity>
  );
}
