import { API_URL } from "@/config_connexion_api/conf-api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Alert, Text, TouchableOpacity } from "react-native";

type InterventionData = {
  numIntervention_vdev: string;
  dateIntervention_vdev: string;
  heureIntervention_vdev: string;
  numSerie_vdev: string;
  emplacement_vdev: string;
  telephone_vdev: string;
  adressePostale_vdev: string;
  dureeDeplacement_vdev: string;
  distanceAgenceClient_vdev: string;
  mail_vdev: string;
  matriculeTechnicien_vdev: string;
  nom_vdev: string;
  prenom_vdev: string;
};

type Props = {
  datas: InterventionData;
};

export default function SuppressionIntervention({ datas }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const deleteInterv = async () => {
    // Confirmation avant suppression
    Alert.alert(
      "Confirmer la suppression",
      "Êtes-vous sûr de vouloir supprimer cette fiche d'intervention ?",
      [
        { text: "Annuler", style: "cancel" },
        { text: "Supprimer", style: "destructive", onPress: confirmDelete },
      ],
    );
  };

  const confirmDelete = async () => {
    const token = await AsyncStorage.getItem("token");
    setLoading(true);

    const res = await fetch(`${API_URL}/intervention/deleteIntervention`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(datas),
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
      Alert.alert("Erreur", "Erreur lors de la suppression de l'intervention.");
      return;
    }

    Alert.alert("Succès", "Suppression de l'intervention effectuée.", [
      { text: "OK", onPress: () => router.replace("/MesFiches") },
    ]);
  };

  return (
    <TouchableOpacity
      className="bg-rose-700 active:bg-rose-950 py-2 px-4 rounded-full items-center"
      onPress={deleteInterv}
      activeOpacity={0.8}
      disabled={loading}
    >
      <Text className="text-white font-semibold text-center">
        {loading ? "Suppression..." : "Supprimer"}
      </Text>
    </TouchableOpacity>
  );
}
