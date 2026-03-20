import HeaderNav from "@/components/Header";
import { API_URL } from "@/config_connexion_api/conf-api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import InterventionConfirmation from "./InterventionConfirmation";

type Technicien = {
  matriculeEmploye_vdev: string;
  nom_vdev: string;
  prenom_vdev: string;
};

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

export default function InterventionCreation() {
  const router = useRouter();

  const [lesTechniciens, setLesTechniciens] = useState<Technicien[]>([]);
  const [intervStep, setIntervStep] = useState<"1" | "2">("1");

  const [dateIntervention_vdev, setDateIntervention] = useState("");
  const [heureIntervention_vdev, setHeureIntervention] = useState("");
  const [matriculeEmploye_vdev, setMatriculeEmploye] = useState("");
  const [numSerie_vdev, setNumSerieMateriel] = useState("");

  const [error, setError] = useState("");
  const [data, setData] = useState<InterventionData | null>(null);
  const [loadingTech, setLoadingTech] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const loadTechniciens = async () => {
      const token = await AsyncStorage.getItem("token");
      if (!token) return router.replace("/");

      const payload = JSON.parse(atob(token.split(".")[1]));
      const agence = payload.agence;

      const res = await fetch(
        `${API_URL}/employe/getTechniciens/from/${agence}`,
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

      const techData = await res.json();
      setLesTechniciens(techData);
      setLoadingTech(false);
    };

    loadTechniciens();
  }, []);

  const CreaInterv = async () => {
    if (!dateIntervention_vdev || !heureIntervention_vdev || !numSerie_vdev) {
      setError("Veuillez remplir tous les champs obligatoires.");
      return;
    }

    setSubmitting(true);
    setError("");

    const token = await AsyncStorage.getItem("token");
    if (!token) return router.replace("/");

    const response = await fetch(`${API_URL}/intervention/createIntervention`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        dateIntervention_vdev,
        heureIntervention_vdev,
        matriculeEmploye_vdev,
        numSerie_vdev,
      }),
    });

    setSubmitting(false);

    if (response.status === 401) {
      Alert.alert("Session expirée", "Veuillez vous reconnecter.", [
        { text: "OK", onPress: () => router.replace("/") },
      ]);
      return;
    }

    if (!response.ok) {
      setError("Erreur lors de la création de l'intervention..");
      return;
    }

    const responseData = await response.json();
    setData(responseData);
    setIntervStep("2");
  };

  if (intervStep === "2" && data) {
    return <InterventionConfirmation datas={data} />;
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
            Fiche intervention : Création
          </Text>

          {/* Date */}
          <View className="mb-4">
            <Text className="text-slate-500 text-xs mb-1">
              Date de intervention
            </Text>
            <TextInput
              className="border border-slate-300 rounded-lg px-3 py-2 text-slate-800 text-sm"
              placeholder="YYYY-MM-DD"
              keyboardType="numbers-and-punctuation"
              value={dateIntervention_vdev}
              onChangeText={setDateIntervention}
            />
          </View>

          {/* Heure */}
          <View className="mb-4">
            <Text className="text-slate-500 text-xs mb-1">
              Heure de intervention
            </Text>
            <TextInput
              className="border border-slate-300 rounded-lg px-3 py-2 text-slate-800 text-sm"
              placeholder="HH:MM"
              keyboardType="numbers-and-punctuation"
              value={heureIntervention_vdev}
              onChangeText={setHeureIntervention}
            />
          </View>

          {/* Sélection technicien */}
          <View className="mb-4">
            <Text className="text-slate-500 text-xs mb-1">
              Technicien en charge
            </Text>
            {loadingTech ? (
              <ActivityIndicator size="small" color="#BE123C" />
            ) : (
              <View className="border border-slate-300 rounded-lg overflow-hidden">
                {lesTechniciens.length === 0 ? (
                  <Text className="px-3 py-2 text-slate-400 text-sm">
                    Aucun technicien disponible
                  </Text>
                ) : (
                  <>
                    <TouchableOpacity
                      className={`px-3 py-2 border-b border-slate-200 ${
                        matriculeEmploye_vdev === "" ? "bg-rose-50" : "bg-white"
                      }`}
                      onPress={() => setMatriculeEmploye("")}
                    >
                      <Text className="text-slate-400 text-sm">
                        -- Choisir un technicien --
                      </Text>
                    </TouchableOpacity>
                    {lesTechniciens.map((tech, i) => (
                      <TouchableOpacity
                        key={i}
                        className={`px-3 py-2 border-b border-slate-100 ${
                          matriculeEmploye_vdev === tech.matriculeEmploye_vdev
                            ? "bg-rose-100"
                            : "bg-white"
                        }`}
                        onPress={() =>
                          setMatriculeEmploye(tech.matriculeEmploye_vdev)
                        }
                      >
                        <Text className="text-slate-800 text-sm">
                          {tech.matriculeEmploye_vdev} - {tech.nom_vdev}{" "}
                          {tech.prenom_vdev}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </>
                )}
              </View>
            )}
          </View>

          {/* Numéro de série */}
          <View className="mb-5">
            <Text className="text-slate-500 text-xs mb-1">
              Numéro de série du matériel
            </Text>
            <TextInput
              className="border border-slate-300 rounded-lg px-3 py-2 text-slate-800 text-sm"
              placeholder="num de série"
              keyboardType="default"
              value={numSerie_vdev}
              onChangeText={setNumSerieMateriel}
            />
          </View>

          {error !== "" && (
            <Text className="text-red-500 text-sm text-center mb-3">
              {error}
            </Text>
          )}

          <TouchableOpacity
            className="bg-rose-700 active:bg-rose-950 py-2 px-4 rounded-full self-center"
            onPress={CreaInterv}
            activeOpacity={0.8}
            disabled={submitting}
          >
            {submitting ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text className="text-white font-semibold text-sm">
                Pré-visualiser les détails intervention
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
