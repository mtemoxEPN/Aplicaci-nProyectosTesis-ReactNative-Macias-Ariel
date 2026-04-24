import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { useLocalSearchParams, Stack, useRouter } from 'expo-router';
import { proyectoApi } from '@entities/proyecto-tesis/api/proyectoApi';
import type { ProyectoTesis } from '@entities/proyecto-tesis/model/types';
import { Colors, getEstadoColor } from '@shared/ui/Colors';

export function ProyectoDetalleScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter(); // Necesario para navegar a la pantalla de edición
  
  const [proyecto, setProyecto] = useState<ProyectoTesis | null>(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const cargarDetalle = async () => {
      if (!id) return;
      try {
        setCargando(true);
        const data = await proyectoApi.getById(id);
        setProyecto(data);
      } catch (e) {
        setError("No se pudo cargar la información del proyecto.");
      } finally {
        setCargando(false);
      }
    };

    cargarDetalle();
  }, [id]);

  const abrirRepo = () => {
    if (proyecto?.repositorio_github) {
      Linking.openURL(proyecto.repositorio_github);
    }
  };

  if (cargando) {
    return <View style={styles.centro}><ActivityIndicator size="large" color={Colors.primary.main} /></View>;
  }

  if (error || !proyecto) {
    return <View style={styles.centro}><Text style={styles.error}>{error || "Proyecto no encontrado"}</Text></View>;
  }

  return (
    <ScrollView style={styles.contenedor} contentContainerStyle={styles.scroll}>
      <Stack.Screen options={{ title: "Detalle del Proyecto" }} />

      <View style={styles.tarjeta}>
        <Text style={styles.titulo}>{proyecto.titulo}</Text>
        
        <View style={styles.seccion}><Text style={styles.etiqueta}>Descripción</Text><Text style={styles.valor}>{proyecto.descripcion || "Sin descripción."}</Text></View>
        <View style={styles.seccion}><Text style={styles.etiqueta}>Autores</Text><Text style={styles.valor}>{proyecto.autores}</Text></View>
        <View style={styles.seccion}><Text style={styles.etiqueta}>Tutor Docente</Text><Text style={styles.valor}>{proyecto.tutor_docente}</Text></View>
        <View style={styles.seccion}><Text style={styles.etiqueta}>Tecnologías Utilizadas</Text><Text style={styles.valorDestacado}>{proyecto.tecnologias_utilizadas}</Text></View>
        
        <View style={styles.filaSeccion}>
          <View style={styles.mitad}><Text style={styles.etiqueta}>Inicio</Text><Text style={styles.valor}>{proyecto.fecha_inicio}</Text></View>
          <View style={styles.mitad}><Text style={styles.etiqueta}>Fin</Text><Text style={styles.valor}>{proyecto.fecha_fin || "En curso"}</Text></View>
        </View>
        <View style={styles.seccion}>
          <Text style={styles.etiqueta}>Estado Actual</Text>
          <View style={[styles.badge, { backgroundColor: getEstadoColor(proyecto.estado) }]}>
            <Text style={styles.badgeTexto}>{proyecto.estado}</Text>
          </View>
        </View>

        {proyecto.repositorio_github && (
          <TouchableOpacity style={styles.botonGit} onPress={abrirRepo}>
            <Text style={styles.botonGitTexto}>Ver Repositorio en GitHub</Text>
          </TouchableOpacity>
        )}

        {/* RETO 3: BOTÓN DE EDITAR */}
        <TouchableOpacity 
          style={styles.botonEditar} 
          onPress={() => router.push(`/editar/${proyecto.id}`)}
        >
          <Text style={styles.botonEditarTexto}>Editar Proyecto</Text>
        </TouchableOpacity>

      </View>
    </ScrollView>
  );
}

// ── ESTILOS ──────────────────────────────────────────────────
const styles = StyleSheet.create({
  contenedor: { flex: 1, backgroundColor: Colors.background },
  scroll: { padding: 16 },
  centro: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  error: { color: Colors.danger, fontSize: 16 },
  tarjeta: { backgroundColor: Colors.white, borderRadius: 16, padding: 20, shadowColor: Colors.navy, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 2 },
  titulo: { fontSize: 22, fontWeight: '800', color: Colors.navy, marginBottom: 20 },
  seccion: { marginBottom: 16 },
  filaSeccion: { flexDirection: 'row', marginBottom: 16 },
  mitad: { flex: 1 },
  etiqueta: { fontSize: 12, fontWeight: '600', color: Colors.gray[400], textTransform: 'uppercase', marginBottom: 4 },
  valor: { fontSize: 16, color: '#333', lineHeight: 24 },
  valorDestacado: { fontSize: 15, color: Colors.primary.main, fontWeight: '600', backgroundColor: Colors.primary.light + '20', alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, overflow: 'hidden' },
  badge: { alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 12, marginTop: 4 },
  badgeTexto: { color: Colors.white, fontSize: 12, fontWeight: '700' },
  botonGit: { marginTop: 24, backgroundColor: Colors.navy, paddingVertical: 14, borderRadius: 10, alignItems: 'center' },
  botonGitTexto: { color: Colors.white, fontSize: 16, fontWeight: '700' },
  botonEditar: { marginTop: 12, backgroundColor: Colors.primary.light + '15', paddingVertical: 14, borderRadius: 10, alignItems: 'center', borderWidth: 1, borderColor: Colors.primary.main },
  botonEditarTexto: { color: Colors.primary.main, fontSize: 16, fontWeight: '700' },
});