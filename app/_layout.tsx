import { Stack, useRouter, useSegments } from "expo-router";
import { useEffect } from "react";
import { AuthProvider, useAuth } from "../src/shared/auth/AuthContext";
// =====================================================================
// 🎨 [ANIMATION-02] IMPORTACIÓN DEL MOTOR DE CLASES GLOBALES
// =====================================================================
import '../src/global.css';

// =====================================================================
// 🚨 [AUTH-07] COMPONENTE INTERNO PARA GESTIONAR LA REDIRECCIÓN
// =====================================================================
function RootLayoutNav() {
  const { session, isLoading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === 'login';

    // Si NO hay sesión y NO está en la pantalla de login, redirigir a login
    if (!session && !inAuthGroup) {
      router.replace('/login');
    } 
    // Si HAY sesión y está intentando acceder al login, redirigir a inicio
    else if (session && inAuthGroup) {
      router.replace('/');
    }
  }, [session, isLoading, segments]);

  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="login" options={{ headerShown: false }} />
      <Stack.Screen name="+not-found" />
    </Stack>
  );
}

// =====================================================================
// 🚨 [AUTH-08] WRAPPER PRINCIPAL CON EL PROVEEDOR DE CONTEXTO
// =====================================================================
export default function RootLayout() {
  return (
    <AuthProvider>
      <RootLayoutNav />
    </AuthProvider>
  );
}