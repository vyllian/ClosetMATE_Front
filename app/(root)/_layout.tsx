import { Redirect, Slot } from "expo-router";
import { ActivityIndicator, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAuth } from "@/lib/useAuth";
import { useRouter } from "expo-router";
import { ProfileProvider } from "@/components/ProfileContext";

export default function AppLayout() {
  const { auth, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !auth) {
    //  router.replace('/sign-in');
    }
  }, [loading, auth, router]);

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }


  return (
    <ProfileProvider>
      <Slot />
    </ProfileProvider>
  );
}
