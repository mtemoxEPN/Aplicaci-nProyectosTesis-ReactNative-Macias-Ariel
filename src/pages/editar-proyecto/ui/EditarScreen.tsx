import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ActivityIndicator, Text } from 'react-native';
import { RegistroProyectoForm } from '@features/registro-proyecto/ui/RegistroProyectoForm';
import { router, useLocalSearchParams, Stack } from 'expo-router';
import { proyectoApi } from '@entities/proyecto-tesis/api/proyectoApi';
import type { ProyectoTesis } from '@entities/proyecto-tesis/model/types';

export function EditarScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [proyecto, setProyecto] = useState<ProyectoTesis | null>(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const cargarProyecto = async () => {
      if (!id) return;
      try {
        const data = await proyectoApi.getById(id);
        setProyecto(data);
      } catch (e) {
        console.error(e);
      } finally {
        setCargando(false);
      }
    };
    cargarProyecto();
  }, [id]);

  if (cargando) {
    return (
      <View style={styles.centro}>
        <ActivityIndicator size="large" color="#1A3A5C" />
      </View>
    );
  }

  if (!proyecto) {
    return (
      <View style={styles.centro}>
        <Text>Error: Proyecto no encontrado.</Text>
      </View>
    );
  }

  return (
    <View style={styles.contenedor}>
      <Stack.Screen options={{ title: "Editar Proyecto" }} />
      {/* Reutilizamos tu mismo formulario, pero pasándole la data inicial! */}
      <RegistroProyectoForm 
        proyectoEditar={proyecto} 
        onSuccess={() => router.navigate('/')} 
      />
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: { flex: 1 },
  centro: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});