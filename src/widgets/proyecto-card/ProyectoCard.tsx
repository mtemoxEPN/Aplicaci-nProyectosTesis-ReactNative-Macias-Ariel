import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import type { ProyectoTesis } from '@entities/proyecto-tesis/model/types';
import { useRouter } from 'expo-router';
import { proyectoApi } from '@entities/proyecto-tesis/api/proyectoApi';
import { Colors, getEstadoColor } from '@shared/ui/Colors';

interface Props {
  proyecto: ProyectoTesis;
  // Prop para avisar al componente padre que la eliminación fue exitosa
  onDeleteSuccess?: () => void; 
}

export function ProyectoCard({ proyecto, onDeleteSuccess }: Props) {
  const router = useRouter();
  const [eliminando, setEliminando] = useState(false);

  const irAlDetalle = () => {
    router.push(`/proyecto/${proyecto.id}`);
  };

  // RETO 4: Lógica de confirmación
  const confirmarEliminacion = () => {
    Alert.alert(
      "Eliminar Proyecto",
      `¿Estás seguro de que deseas eliminar la tesis de ${proyecto.autores}? Esta acción no se puede deshacer.`,
      [
        { text: "Cancelar", style: "cancel" },
        { 
          text: "Eliminar", 
          style: "destructive", 
          onPress: async () => {
            try {
              setEliminando(true);
              await proyectoApi.delete(proyecto.id);
              onDeleteSuccess?.(); // Avisamos hacia arriba que ya se borró
            } catch (error) {
              Alert.alert("Error", "No se pudo eliminar el proyecto.");
              setEliminando(false); // Solo quitamos el loading si falla
            }
          }
        }
      ]
    );
  };

  return (
    <TouchableOpacity style={styles.tarjeta} onPress={irAlDetalle} activeOpacity={0.7} disabled={eliminando}>
      <View style={styles.encabezado}>
        <Text style={styles.titulo} numberOfLines={2}>{proyecto.titulo}</Text>
        <View style={[styles.badge, { backgroundColor: getEstadoColor(proyecto.estado) }]}>
          <Text style={styles.badgeTexto}>{proyecto.estado}</Text>
        </View>
      </View>

      <Text style={styles.etiqueta}>Autores</Text>
      <Text style={styles.valor}>{proyecto.autores}</Text>

      <Text style={styles.etiqueta}>Tutor Docente</Text>
      <Text style={styles.valor}>{proyecto.tutor_docente}</Text>

      <Text style={styles.etiqueta}>Tecnologías</Text>
      <Text style={styles.valor} numberOfLines={1}>{proyecto.tecnologias_utilizadas}</Text>

      <View style={styles.filaFechas}>
        <View style={styles.fecha}>
          <Text style={styles.etiqueta}>Inicio</Text>
          <Text style={styles.valor}>{proyecto.fecha_inicio}</Text>
        </View>
        {proyecto.fecha_fin && (
          <View style={styles.fecha}>
            <Text style={styles.etiqueta}>Fin</Text>
            <Text style={styles.valor}>{proyecto.fecha_fin}</Text>
          </View>
        )}
      </View>

      {/* RETO 4: Botón de Eliminar */}
      <TouchableOpacity 
        style={styles.botonEliminar} 
        onPress={confirmarEliminacion}
        disabled={eliminando}
      >
        {eliminando 
          ? <ActivityIndicator size="small" color={Colors.danger} /> 
          : <Text style={styles.botonEliminarTexto}>Eliminar registro</Text>
        }
      </TouchableOpacity>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  tarjeta: { backgroundColor: Colors.white, borderRadius: 12, padding: 16, marginBottom: 12, shadowColor: Colors.navy, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 6, elevation: 3 },
  encabezado: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 },
  titulo: { fontSize: 16, fontWeight: '700', color: Colors.navy, flex: 1, marginRight: 8 },
  badge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 },
  badgeTexto: { color: Colors.white, fontSize: 11, fontWeight: '700' },
  etiqueta: { fontSize: 11, color: Colors.gray[400], fontWeight: '600', marginTop: 8 },
  valor: { fontSize: 14, color: '#333', marginTop: 2 },
  filaFechas: { flexDirection: 'row', gap: 24 },
  fecha: { flex: 1 },
  botonEliminar: { marginTop: 16, borderTopWidth: 1, borderTopColor: '#F0F0F0', paddingTop: 12, alignItems: 'flex-end' },
  botonEliminarTexto: { color: Colors.danger, fontSize: 13, fontWeight: '600' }
});