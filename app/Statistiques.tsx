import HeaderNav from "@/components/Header";
import { Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Statistiques() {
  return (
    <SafeAreaView>
      <HeaderNav />
      <Text>Stats</Text>
    </SafeAreaView>
  );
}
