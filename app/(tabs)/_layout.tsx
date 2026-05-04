import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../src/shared/ui/Colors';
import { TouchableOpacity, Alert } from 'react-native';
import { supabase } from '../../src/shared/api/supabase';

export default function TabLayout() {

  // =====================================================================
  // 🚨 [AUTH-09] FUNCIÓN PARA EJECUTAR EL CIERRE DE SESIÓN
  // =====================================================================
  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) Alert.alert("Error", "No se pudo cerrar sesión");
  };

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.primary.main,
        headerStyle: { backgroundColor: Colors.navy },
        headerTintColor: Colors.white,
        // =====================================================================
        // 🚨 [AUTH-10] INTEGRACIÓN DEL BOTÓN DE LOGOUT EN EL HEADER
        // =====================================================================
        headerRight: () => (
          <TouchableOpacity onPress={handleLogout} style={{ marginRight: 16 }}>
            <Ionicons name="log-out-outline" size={24} color={Colors.white} />
          </TouchableOpacity>
        ),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Proyectos',
          tabBarIcon: ({ color, size }) =>
            <Ionicons name="list" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="registro"
        options={{
          title: 'Registrar',
          tabBarIcon: ({ color, size }) =>
            <Ionicons name="add-circle" size={size} color={color} />,
        }}
      />
    </Tabs>
  );
}