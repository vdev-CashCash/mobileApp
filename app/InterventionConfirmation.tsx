import ChangementInfosIntervention from "@/components/ChangementInfosIntervention";
import HeaderNav from "@/components/Header";
import SuppressionIntervention from "@/components/SuppressionIntervention";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
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

// Champs en lecture seule (affichage uniquement)
const READ_ONLY_FIELDS: { label: string; key: keyof InterventionData }[] = [
  { label: "Numéro de série du matériel", key: "numSerie_vdev" },
  { label: "Emplacement du matériel", key: "emplacement_vdev" },
  { label: "Adresse du client", key: "adressePostale_vdev" },
  { label: "Durée du déplacement client", key: "dureeDeplacement_vdev" },
  { label: "Distance agence-client (km)", key: "distanceAgenceClient_vdev" },
  { label: "Téléphone client", key: "telephone_vdev" },
  { label: "Email client", key: "mail_vdev" },
  { label: "Nom du technicien", key: "nom_vdev" },
  { label: "Prénom du technicien", key: "prenom_vdev" },
];

export default function InterventionConfirmation({ datas }: Props) {
  const router = useRouter();

  const [dateIntervention_vdev, setDateIntervention] = useState(
    datas.dateIntervention_vdev,
  );
  const [heureIntervention_vdev, setHeureIntervention] = useState(
    datas.heureIntervention_vdev,
  );
  const [matriculeTech_vdev, setMatriculeTech] = useState(
    datas.matriculeTechnicien_vdev,
  );

  return (
    <SafeAreaView className="flex-1">
      <HeaderNav />
      <ScrollView
        className="flex-1 bg-slate-100"
        contentContainerClassName="p-4 pb-10"
      >
        <View className="bg-slate-50 border border-slate-300 rounded-lg p-5">
          <Text className="text-xl font-bold uppercase text-center border-b border-slate-300 pb-4 mb-5 text-slate-800">
            Fiche intervention : Confirmation
          </Text>

          {/* Date — modifiable */}
          <View className="mb-4">
            <Text className="text-slate-500 text-xs mb-1">
              Date intervention
            </Text>
            <TextInput
              className="border border-slate-300 rounded-lg px-3 py-2 text-slate-800 text-sm"
              placeholder="YYYY-MM-DD"
              keyboardType="numbers-and-punctuation"
              value={dateIntervention_vdev}
              onChangeText={setDateIntervention}
            />
          </View>

          {/* Heure — modifiable */}
          <View className="mb-4">
            <Text className="text-slate-500 text-xs mb-1">
              Heure intervention
            </Text>
            <TextInput
              className="border border-slate-300 rounded-lg px-3 py-2 text-slate-800 text-sm"
              placeholder="HH:MM"
              keyboardType="numbers-and-punctuation"
              value={heureIntervention_vdev}
              onChangeText={setHeureIntervention}
            />
          </View>

          {/* Champs en lecture seule */}
          {READ_ONLY_FIELDS.map(({ label, key }) => (
            <View
              key={key}
              className="mb-4 border-b border-dotted border-slate-400 pb-2"
            >
              <Text className="text-slate-500 text-sm">{label}</Text>
              <Text className="text-slate-800 text-base mt-0.5">
                {datas[key] ?? "-"}
              </Text>
            </View>
          ))}

          {/* Matricule technicien — modifiable */}
          <View className="mb-5">
            <Text className="text-slate-500 text-xs mb-1">
              Matricule du technicien
            </Text>
            <TextInput
              className="border border-slate-300 rounded-lg px-3 py-2 text-slate-800 text-sm"
              placeholder="matricule"
              keyboardType="default"
              value={matriculeTech_vdev}
              onChangeText={setMatriculeTech}
            />
          </View>

          {/* Actions */}
          <View className="flex-row justify-between items-center mt-2">
            <SuppressionIntervention datas={datas} />

            <ChangementInfosIntervention
              numIntervention_vdev={datas.numIntervention_vdev}
              dateVisite_vdev={dateIntervention_vdev}
              heureVisite_vdev={heureIntervention_vdev}
              matriculeEmploye_vdev={matriculeTech_vdev}
            />
          </View>

          <TouchableOpacity
            className="mt-4 bg-rose-700 active:bg-rose-950 py-2 px-4 rounded-full self-center"
            onPress={() => router.replace("/InterventionCreation")}
            activeOpacity={0.8}
          >
            <Text className="text-white font-semibold text-sm">Continuer</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
