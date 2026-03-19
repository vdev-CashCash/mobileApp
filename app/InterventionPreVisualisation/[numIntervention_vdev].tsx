import ChangementInfosIntervention from "@/components/ChangementInfosIntervention";
import HeaderNav from "@/components/Header";
import SuppressionIntervention from "@/components/SuppressionIntervention";
import { API_URL } from "@/config_connexion_api/conf-api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import InterventionValidation from "../InterventionValidation";

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

const FIELDS: { label: string; key: keyof InterventionData }[] = [
  { label: "Date de l'intervention", key: "dateIntervention_vdev" },
  { label: "Heure de l'intervention", key: "heureIntervention_vdev" },
  { label: "Numéro de série du matériel", key: "numSerie_vdev" },
  { label: "Emplacement du matériel", key: "emplacement_vdev" },
  { label: "Adresse du client", key: "adressePostale_vdev" },
  { label: "Durée du déplacement client", key: "dureeDeplacement_vdev" },
  { label: "Distance agence-client (km)", key: "distanceAgenceClient_vdev" },
  { label: "Téléphone client", key: "telephone_vdev" },
  { label: "Email client", key: "mail_vdev" },
  { label: "Matricule du technicien", key: "matriculeTechnicien_vdev" },
  { label: "Nom du technicien", key: "nom_vdev" },
  { label: "Prénom du technicien", key: "prenom_vdev" },
];

export default function InterventionPreVisualisation() {
  const { numIntervention_vdev } = useLocalSearchParams<{
    numIntervention_vdev: string;
  }>();
  const router = useRouter();

  const [datas, setDatas] = useState<InterventionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState<"1" | "2">("1");
  const [commentaire, setCommentaire] = useState("");
  const [tempsPasse, setTempsPasse] = useState(0);
  const [isTechnicien, setIsTechnicien] = useState(false);

  useEffect(() => {
    const load = async () => {
      const token = await AsyncStorage.getItem("token");
      if (!token) return router.replace("/");

      const payload = JSON.parse(atob(token.split(".")[1]));
      setIsTechnicien(payload.roles?.[0] === "Technicien");

      const res = await fetch(
        `${API_URL}/intervention/getDetailsInterv/${numIntervention_vdev}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (res.status === 401) {
        Alert.alert("Session expirée", "Veuillez vous reconnecter.", [
          { text: "OK", onPress: () => router.replace("/") },
        ]);
        return;
      }

      const data = await res.json();
      setDatas(data);
      setLoading(false);

      const resComTP = await fetch(
        `${API_URL}/intervention/getCommentaireTP/${numIntervention_vdev}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (resComTP.status === 401) {
        Alert.alert("Session expirée", "Veuillez vous reconnecter.", [
          { text: "OK", onPress: () => router.replace("/") },
        ]);
        return;
      }

      const dataB = await resComTP.json();
      setCommentaire(dataB.commentaire_vdev);
      setTempsPasse(dataB.tempPasse_vdev);
    };

    load();
  }, [numIntervention_vdev]);

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-slate-50">
        <ActivityIndicator size="large" color="#BE123C" />
      </View>
    );
  }

  if (step === "2" && datas) {
    return <InterventionValidation datas={datas} />;
  }

  return (
    <SafeAreaView className="flex-1">
      <HeaderNav />
      <ScrollView
        className="flex-1 bg-slate-100"
        contentContainerClassName="p-4 pb-10"
      >
        <View className="bg-slate-50 border border-slate-300 rounded-lg p-5">
          <Text className="text-xl font-bold uppercase text-center border-b border-slate-300 pb-4 mb-5 text-slate-800">
            Fiche intervention : Pré-visualisation
          </Text>

          {FIELDS.map(({ label, key }) => (
            <View
              key={key}
              className="mb-4 border-b border-dotted border-slate-400 pb-2"
            >
              <Text className="text-slate-500 text-sm">{label}</Text>
              <Text className="text-slate-800 text-base mt-0.5">
                {datas?.[key] ?? "-"}
              </Text>
            </View>
          ))}

          <View className="mb-4 border-b border-dotted border-slate-400 pb-2">
            <Text className="text-slate-500 text-sm">Commentaire</Text>
            <Text className="text-slate-800 text-base mt-0.5">
              {commentaire ?? "-"}
            </Text>
          </View>
          <View className="mb-4 border-b border-dotted border-slate-400 pb-2">
            <Text className="text-slate-500 text-sm">Temps passé</Text>
            <Text className="text-slate-800 text-base mt-0.5">
              {tempsPasse ?? "-"} minutes
            </Text>
          </View>

          {isTechnicien && commentaire === "" && tempsPasse === 0 && (
            <TouchableOpacity
              className="mt-4 self-start bg-green-700 active:bg-green-950 py-2 px-4 rounded-full"
              onPress={() => setStep("2")}
              activeOpacity={0.8}
            >
              <Text className="text-white font-semibold">
                Terminer la fiche
              </Text>
            </TouchableOpacity>
          )}
          {!isTechnicien && (
            <View className="flex-1 flex-row justify-between">
              {datas && <SuppressionIntervention datas={datas} />}

              {datas && (
                <ChangementInfosIntervention
                  numIntervention_vdev={datas.numIntervention_vdev}
                  dateVisite_vdev={datas.dateIntervention_vdev}
                  heureVisite_vdev={datas.heureIntervention_vdev}
                  matriculeEmploye_vdev={datas.matriculeTechnicien_vdev}
                />
              )}
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
