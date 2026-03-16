import { Stack } from "expo-router";
import "../global.css";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="MesFiches" options={{ headerShown: false }} />
      <Stack.Screen
        name="InterventionCreation"
        options={{ headerShown: false }}
      />
      <Stack.Screen name="Profil" options={{ headerShown: false }} />
      <Stack.Screen name="Statistiques" options={{ headerShown: false }} />
      <Stack.Screen
        name="InterventionPreVisualisation/[numIntervention_vdev]"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="InterventionValidation"
        options={{ headerShown: false }}
      />
    </Stack>
  );
}
