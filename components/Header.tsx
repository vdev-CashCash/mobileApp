import AsyncStorage from "@react-native-async-storage/async-storage";
import { usePathname, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Svg, { Circle, Path, Rect } from "react-native-svg";
import { JSX } from "react/jsx-runtime";

// ─── Icônes SVG ────────────────────────────────────────────────────────────────
const IconFiches = ({ color }: { color: string }) => (
  <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
    <Rect
      x="4"
      y="3"
      width="13"
      height="17"
      rx="2"
      stroke={color}
      strokeWidth="1.8"
    />
    <Path
      d="M8 8h7M8 12h7M8 16h4"
      stroke={color}
      strokeWidth="1.8"
      strokeLinecap="round"
    />
  </Svg>
);

const IconPlus = ({ color }: { color: string }) => (
  <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="9" stroke={color} strokeWidth="1.8" />
    <Path
      d="M12 8v8M8 12h8"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
    />
  </Svg>
);

const IconStats = ({ color }: { color: string }) => (
  <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
    <Rect x="3" y="12" width="4" height="9" rx="1" fill={color} opacity="0.4" />
    <Rect
      x="10"
      y="7"
      width="4"
      height="14"
      rx="1"
      fill={color}
      opacity="0.7"
    />
    <Rect x="17" y="3" width="4" height="18" rx="1" fill={color} />
  </Svg>
);

const IconProfil = ({ color }: { color: string }) => (
  <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="8" r="4" stroke={color} strokeWidth="1.8" />
    <Path
      d="M4 20c0-3.314 3.582-6 8-6s8 2.686 8 6"
      stroke={color}
      strokeWidth="1.8"
      strokeLinecap="round"
    />
  </Svg>
);

// ─── Types & données ───────────────────────────────────────────────────────────
type NavItem = {
  label: string;
  route: string;
  icon: (color: string) => JSX.Element;
  isAction?: boolean;
};

const NAV_ITEMS: NavItem[] = [
  {
    label: "Fiches",
    route: "/MesFiches",
    icon: (c) => <IconFiches color={c} />,
  },
  {
    label: "Statistiques",
    route: "/Statistiques",
    icon: (c) => <IconStats color={c} />,
  },
  {
    label: "+ Nouveau",
    route: "/InterventionCreation",
    icon: (c) => <IconPlus color={c} />,
    isAction: true,
  },
  { label: "Profil", route: "/Profil", icon: (c) => <IconProfil color={c} /> },
];

const ICON_ACTIVE = "#C0392B";
const ICON_INACTIVE = "#9CA3AF";

// ─── Composant ─────────────────────────────────────────────────────────────────
export default function HeaderNav() {
  const router = useRouter();
  const pathname = usePathname();
  const insets = useSafeAreaInsets();

  const [isGestionnaire, setIsGestionnaire] = useState(false);

  // Lecture du rôle depuis le token JWT stocké en AsyncStorage
  useEffect(() => {
    const loadRole = async () => {
      const token = await AsyncStorage.getItem("token");
      if (!token) return;
      const payload = JSON.parse(atob(token.split(".")[1]));
      setIsGestionnaire(payload.roles?.[0] === "Gestionnaire");
    };
    loadRole();
  }, []);

  // Filtre le bouton "+ Nouveau" si l'utilisateur n'est pas Gestionnaire
  const visibleItems = NAV_ITEMS.filter(
    (item) => !item.isAction || isGestionnaire,
  );

  return (
    <View
      className="bg-white border-b border-gray-200"
      style={{ paddingTop: insets.top }}
    >
      {/* ── Top bar ── */}
      <View className="flex-row items-center justify-between px-4 pt-2.5 pb-2">
        <View className="flex-row items-center gap-2.5">
          <View className="w-10 h-10 rounded-xl bg-gray-100 border border-gray-200 items-center justify-center overflow-hidden">
            <Image
              source={require("../assets/images/cashcashlogo.png")}
              className="w-8 h-8"
              resizeMode="contain"
            />
          </View>
          <View>
            <Text className="text-gray-900 text-base font-bold tracking-wide">
              CashCash
            </Text>
            <Text className="text-gray-400 text-[11px] mt-0.5">
              Gestion interventions
            </Text>
          </View>
        </View>

        <View className="flex-row items-center gap-1.5 bg-gray-100 border border-gray-200 px-3 py-1.5 rounded-full">
          <View className="w-1.5 h-1.5 rounded-full bg-green-400" />
          <Text className="text-gray-400 text-[11px] font-medium">
            En ligne
          </Text>
        </View>
      </View>

      {/* ── Séparateur ── */}
      <View className="h-px mx-4 bg-gray-200" />

      {/* ── Barre de navigation ── */}
      <View className="flex-row items-center px-2 py-2 gap-1">
        {visibleItems.map((item) => {
          const isActive = pathname === item.route;

          if (item.isAction) {
            return (
              <TouchableOpacity
                key={item.route}
                className="flex-[1.4] mx-1"
                onPress={() => router.replace(item.route as any)}
                activeOpacity={0.75}
                accessibilityLabel="Créer une nouvelle intervention"
              >
                <View className="bg-red-700 rounded-xl py-2 items-center justify-center gap-1">
                  {item.icon("#FFFFFF")}
                  <Text className="text-white text-[10px] font-bold tracking-wide">
                    {item.label}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          }

          return (
            <TouchableOpacity
              key={item.route}
              className={`flex-1 items-center justify-center py-1.5 rounded-xl gap-0.5 relative ${
                isActive ? "bg-red-50" : ""
              }`}
              onPress={() => router.replace(item.route as any)}
              activeOpacity={0.7}
            >
              {isActive && (
                <View className="absolute top-0 w-6 h-0.5 rounded-full bg-red-700" />
              )}
              {item.icon(isActive ? ICON_ACTIVE : ICON_INACTIVE)}
              <Text
                className={`text-[10px] tracking-wide ${
                  isActive
                    ? "text-red-700 font-bold"
                    : "text-gray-400 font-medium"
                }`}
              >
                {item.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}
