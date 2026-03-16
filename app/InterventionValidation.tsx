import HeaderNav from "@/components/Header";
import { API_URL } from "@/config_connexion_api/conf-api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
    Alert,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type InterventionData = {
  numIntervention_vdev: string;
  dateIntervention_vdev: string;
  heureIntervention_vdev: string;
  numSerie_vdev: string;
  emplacement_vdev: string;
  adressePostale_vdev: string;
  dureeDeplacement_vdev: number;
  distanceAgenceClient_vdev: number;
  telephone_vdev: string;
  mail_vdev: string;
  matriculeTechnicien_vdev: string;
  nom_vdev: string;
  prenom_vdev: string;
};

type Props = {
  datas: InterventionData;
};

// ── Sous-composant : ligne de champ en lecture seule ──────────────────────────
const ReadOnlyField = ({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) => (
  <View className="mb-3 border-b border-dotted border-slate-400 pb-1">
    <Text className="text-slate-500 text-xs">{label}</Text>
    <Text className="text-slate-800 text-sm mt-0.5">{value ?? "-"}</Text>
  </View>
);

// ── Sous-composant : section
const Section = ({ title }: { title: string }) => (
  <Text className="text-base font-bold text-slate-700 mt-5 mb-2 border-b border-slate-300 pb-1">
    {title}
  </Text>
);

export default function InterventionValidation({ datas }: Props) {
  const router = useRouter();

  const [tempPasse_vdev, setTempPasse_vdev] = useState("");
  const [commentaire_vdev, setCommentaire_vdev] = useState("");

  const handleValidation = async () => {
    if (commentaire_vdev.trim() === "") {
      Alert.alert("Champ manquant", "Veuillez remplir la section commentaire.");
      return;
    }

    const tempPasseInt = parseInt(tempPasse_vdev);
    if (tempPasseInt === 0 || isNaN(tempPasseInt)) {
      Alert.alert(
        "Champ manquant",
        "Veuillez saisir votre temps passé sur l'intervention (en minutes).",
      );
      return;
    }

    const token = await AsyncStorage.getItem("token");

    const res = await fetch(`${API_URL}/intervention/valideInterv`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        numIntervention_vdev: datas.numIntervention_vdev,
        commentaire_vdev,
        tempPasse_vdev: tempPasseInt,
      }),
    });

    if (res.status === 401) {
      Alert.alert("Session expirée", "Veuillez vous reconnecter.", [
        { text: "OK", onPress: () => router.replace("/") },
      ]);
      return;
    }

    if (!res.ok) {
      Alert.alert("Erreur", "Erreur lors de la validation de l'intervention.");
      return;
    }

    Alert.alert("Succès", "La fiche d'intervention a bien été validée.", [
      { text: "OK", onPress: () => router.replace("/MesFiches") },
    ]);
  };

  return (
    <SafeAreaView className="flex-1 bg-slate-100">
      <HeaderNav />
      <ScrollView contentContainerClassName="p-4 pb-10">
        <View className="bg-white border border-slate-300 rounded-lg p-5">
          {/* Titre */}
          <Text className="text-xl font-bold uppercase text-center border-b border-slate-300 pb-4 mb-2 text-slate-800">
            Fiche intervention : Validation
          </Text>

          {/* ── Intervention ── */}
          <Section title="Information de l'intervention" />
          <ReadOnlyField
            label="Date de l'intervention"
            value={datas.dateIntervention_vdev}
          />
          <ReadOnlyField
            label="Heure de l'intervention"
            value={datas.heureIntervention_vdev}
          />

          {/* Temps passé — seul champ modifiable hors commentaire */}
          <View className="mb-3">
            <Text className="text-slate-500 text-xs mb-1">
              Temps passé (minutes)
            </Text>
            <TextInput
              className="border border-slate-300 rounded-lg px-3 py-2 text-slate-800 text-sm"
              placeholder="ex: 45"
              keyboardType="numeric"
              value={tempPasse_vdev}
              onChangeText={setTempPasse_vdev}
            />
          </View>

          {/* ── Matériel ── */}
          <Section title="Information sur le matériel" />
          <ReadOnlyField label="Numéro de série" value={datas.numSerie_vdev} />
          <ReadOnlyField label="Emplacement" value={datas.emplacement_vdev} />

          {/* ── Client ── */}
          <Section title="Information sur le client" />
          <ReadOnlyField label="Adresse" value={datas.adressePostale_vdev} />
          <ReadOnlyField label="Mail" value={datas.mail_vdev} />
          <ReadOnlyField label="Téléphone" value={datas.telephone_vdev} />
          <ReadOnlyField
            label="Durée du déplacement"
            value={datas.dureeDeplacement_vdev}
          />
          <ReadOnlyField
            label="Distance (km)"
            value={datas.distanceAgenceClient_vdev}
          />

          {/* ── Technicien ── */}
          <Section title="Information sur le technicien" />
          <ReadOnlyField
            label="Matricule"
            value={datas.matriculeTechnicien_vdev}
          />
          <ReadOnlyField label="Nom" value={datas.nom_vdev} />
          <ReadOnlyField label="Prénom" value={datas.prenom_vdev} />

          {/* ── Commentaire ── */}
          <Section title="Commentaire" />
          <TextInput
            className="border border-slate-300 rounded-lg px-3 py-2 text-slate-800 text-sm min-h-[80px]"
            placeholder="Entrez un commentaire..."
            multiline
            textAlignVertical="top"
            value={commentaire_vdev}
            onChangeText={setCommentaire_vdev}
          />

          {/* ── Bouton validation ── */}
          <TouchableOpacity
            className="mt-6 bg-rose-700 active:bg-rose-950 py-3 rounded-xl items-center"
            onPress={handleValidation}
            activeOpacity={0.8}
          >
            <Text className="text-white font-bold text-base">
              Valider la fiche intervention
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
