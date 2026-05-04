import { proyectoApi } from "@entities/proyecto-tesis/api/proyectoApi";
import type { ProyectoTesis } from "@entities/proyecto-tesis/model/types";
import { ProyectoCard } from "../../proyecto-card/ProyectoCard";
import { useFocusEffect } from "expo-router";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { ActivityIndicator, StyleSheet, Text } from "react-native";
// 1. Usamos LinearTransition, que es perfecto para listas verticales
import Animated, { LinearTransition } from 'react-native-reanimated';

interface Props {
  searchQuery?: string;
}

export function ListaProyectos({ searchQuery = "" }: Props) {
  const [proyectos, setProyectos] = useState<ProyectoTesis[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const primeraEntrada = useRef(true);

  const cargarProyectos = useCallback(async (query: string, silent = false) => {
    if (!silent) setCargando(true);
    setError(null);

    try {
      const data = query.trim() !== ""
        ? await proyectoApi.search(query.trim())
        : await proyectoApi.getAll();
        
      setProyectos(data);
    } catch (e) {
      const mensaje = e instanceof Error ? e.message : "Error desconocido";
      setError(mensaje);
    } finally {
      if (!silent) setCargando(false);
    }
  }, []); 

  // =====================================================================
  // 🐛 [FIX-09] DEBOUNCE: ESPERAR A QUE EL USUARIO TERMINE DE ESCRIBIR
  // Evita que las animaciones colapsen al hacer demasiadas búsquedas
  // =====================================================================
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      cargarProyectos(searchQuery, false);
    }, 300); // 300ms de retraso

    return () => clearTimeout(timeoutId); // Si escribe otra letra antes de los 300ms, cancela la búsqueda anterior
  }, [searchQuery, cargarProyectos]);

  useFocusEffect(
    useCallback(() => {
      if (primeraEntrada.current) {
        primeraEntrada.current = false;
        return;
      }
      cargarProyectos(searchQuery, true);
    }, [cargarProyectos, searchQuery]),
  );

  if (cargando && proyectos.length === 0) return <ActivityIndicator size="large" color="#1A3A5C" style={styles.centro} />;
  if (error) return <Text style={styles.error}>Error al cargar proyectos: {error}</Text>;
  
  if (proyectos.length === 0 && !cargando) return <Text style={styles.vacio}>{searchQuery.trim() !== "" ? "No se encontraron proyectos con esa búsqueda." : "No hay proyectos registrados aún."}</Text>;

  return (
    <Animated.FlatList
      data={proyectos}
      keyExtractor={(p) => p.id}
      // =====================================================================
      // 🐛 [FIX-10] LA LISTA REACOMODA VERTICALMENTE A LAS TARJETAS
      // Al usar LinearTransition con springify, las tarjetas subirán
      // suavemente llenando los huecos sin curvas extrañas ni superposiciones.
      // =====================================================================
      itemLayoutAnimation={LinearTransition.springify().damping(50).stiffness(200)}
      renderItem={({ item }) => (
        <ProyectoCard 
          proyecto={item} 
          onDeleteSuccess={() => cargarProyectos(searchQuery, true)} 
        />
      )}
      contentContainerStyle={styles.lista}
    />
  );
}

const styles = StyleSheet.create({
  lista: { padding: 16 },
  centro: { flex: 1, justifyContent: "center" },
  error: { color: "#E74C3C", textAlign: "center", padding: 20 },
  vacio: { color: "#888", textAlign: "center", padding: 40 },
});