import HeaderNav from "@/components/Header";
import { API_URL } from "@/config_connexion_api/conf-api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  ScrollView,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  VictoryAxis,
  VictoryBar,
  VictoryChart,
  VictoryTheme,
  VictoryTooltip,
} from "victory-native";

const screenWidth = Dimensions.get("window").width;

interface StatTechnicien {
  nbIntervention_vdev: number;
  nbDistance_vdev: number;
}

interface StatEmploye {
  nomEmploye_vdev: string;
  nbIntervention_vdev: number;
  nbDistance_vdev: number;
}

export default function Statistiques() {
  const [datas, setData] = useState<StatTechnicien | StatEmploye[] | null>(
    null,
  );
  const [role, setRole] = useState<string | null>(null);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchStats = async () => {
      const token = await AsyncStorage.getItem("token");
      if (!token) return;

      const payload = JSON.parse(atob(token.split(".")[1]));
      const matricule = payload.sub;
      const userRole = payload.roles[0];
      const agence = payload.agence;
      setRole(userRole);

      const lien =
        userRole === "Technicien"
          ? `${API_URL}/intervention/getStatEmploye/${matricule}`
          : `${API_URL}/intervention/getStats/${agence}`;

      const response = await fetch(lien, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 401) {
        navigation.navigate("Login" as never);
        return;
      }
      if (!response.ok) {
        console.error("Erreur serveur");
        return;
      }

      const ldata = await response.json();
      setData(ldata);
    };
    fetchStats();
  }, [navigation]);

  const chartDataTechnicien =
    datas && !Array.isArray(datas)
      ? [
          {
            x: "Interventions",
            y: (datas as StatTechnicien).nbIntervention_vdev,
          },
          { x: "Distance (km)", y: (datas as StatTechnicien).nbDistance_vdev },
        ]
      : [];

  const chartDataManager = Array.isArray(datas)
    ? (datas as StatEmploye[]).map((emp: StatEmploye) => ({
        x: emp.nomEmploye_vdev,
        y: emp.nbIntervention_vdev,
        label: `${emp.nomEmploye_vdev}\n${emp.nbIntervention_vdev} interventions`,
      }))
    : [];

  const chartDataManagerDist = Array.isArray(datas)
    ? (datas as StatEmploye[]).map((emp: StatEmploye) => ({
        x: emp.nomEmploye_vdev,
        y: emp.nbDistance_vdev,
        label: `${emp.nomEmploye_vdev}\n${emp.nbDistance_vdev} km`,
      }))
    : [];

  if (!datas) {
    return (
      <View className="flex-1 bg-gray-100">
        <HeaderNav />
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#EF4444" />
          <Text>Chargement...</Text>
        </View>
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <HeaderNav />
      <ScrollView
        contentContainerStyle={{ alignItems: "center", padding: 24, gap: 32 }}
      >
        {role === "Technicien" && (
          <View style={{ width: "100%", maxWidth: 480 }}>
            <Text
              style={{
                fontSize: 16,
                fontWeight: "500",
                textAlign: "center",
                marginBottom: 8,
              }}
            >
              Mes statistiques
            </Text>
            <VictoryChart
              theme={VictoryTheme.material}
              domainPadding={40}
              width={screenWidth - 48}
            >
              <VictoryAxis />
              <VictoryAxis dependentAxis />
              <VictoryBar
                data={chartDataTechnicien}
                style={{ data: { fill: "#185FA5" } }}
                labels={({ datum }: { datum: { y: number } }) => datum.y}
                labelComponent={<VictoryTooltip />}
              />
            </VictoryChart>
          </View>
        )}

        {role !== "Technicien" && (
          <>
            <View style={{ width: "100%", maxWidth: 672 }}>
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "500",
                  textAlign: "center",
                  marginBottom: 8,
                }}
              >
                Interventions par technicien
              </Text>
              <VictoryChart
                theme={VictoryTheme.material}
                domainPadding={30}
                width={screenWidth - 48}
              >
                <VictoryAxis
                  style={{ tickLabels: { angle: -30, fontSize: 10 } }}
                />
                <VictoryAxis dependentAxis />
                <VictoryBar
                  data={chartDataManager}
                  style={{ data: { fill: "#185FA5" } }}
                  labelComponent={<VictoryTooltip />}
                />
              </VictoryChart>
            </View>

            <View style={{ width: "100%", maxWidth: 672 }}>
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "500",
                  textAlign: "center",
                  marginBottom: 8,
                }}
              >
                Distance parcourue par technicien (km)
              </Text>
              <VictoryChart
                theme={VictoryTheme.material}
                domainPadding={30}
                width={screenWidth - 48}
              >
                <VictoryAxis
                  style={{ tickLabels: { angle: -30, fontSize: 10 } }}
                />
                <VictoryAxis dependentAxis />
                <VictoryBar
                  data={chartDataManagerDist}
                  style={{ data: { fill: "#3B6D11" } }}
                  labelComponent={<VictoryTooltip />}
                />
              </VictoryChart>
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
