import LoginSignup from "@/components/Login";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Index() {
  return (
    <SafeAreaView className="flex flex-1 justify-center items-center">
      <LoginSignup />
    </SafeAreaView>
  );
}
