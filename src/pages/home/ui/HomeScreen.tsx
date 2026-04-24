import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Platform, Image } from 'react-native';
import { ListaProyectos } from '@widgets/lista-proyectos/ui/ListaProyectos';
import { Colors } from '../../../shared/ui/Colors';

export function HomeScreen() {
  const [busqueda, setBusqueda] = useState('');

  return (
    <View style={styles.contenedor}>
      {/* 1. Nuevo encabezado institucional ESFOT - EPN */}
      <View style={styles.headerContainer}>
        {/* Asegúrate de haber guardado un logo-esfot.png en tu carpeta de assets */}
        <Image 
          source={require('../../../../assets/images/logo.png')} // <-- Cambia 'react-logo.png' por 'logo-esfot.png' cuando lo descargues
          style={styles.logo}
          resizeMode="contain"
        />
        <View style={styles.headerTextContainer}>
          <Text style={styles.headerTitle}>Gestión de Tesis</Text>
          <Text style={styles.headerSubtitle}>ESFOT — EPN</Text>
        </View>
      </View>
      
      {/* 2. Buscador integrado visualmente al header */}
      <View style={styles.buscadorContenedor}>
        <TextInput
          style={styles.inputBusqueda}
          placeholder="Buscar por título o autor..."
          placeholderTextColor={Colors.gray[400]}
          value={busqueda}
          onChangeText={setBusqueda}
          clearButtonMode="while-editing"
        />
      </View>

      <ListaProyectos searchQuery={busqueda} />
    </View>
  );
}

// ── ESTILOS ──────────────────────────────────────────────────
const styles = StyleSheet.create({
  contenedor: { 
    flex: 1, 
    backgroundColor: Colors.background 
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 20 : 24,
    paddingBottom: 16,
    backgroundColor: Colors.white,
  },
  logo: {
    width: 150,
    height: 48,
    marginRight: 5,
  },
  headerTextContainer: {
    flex: 1,
  },
  headerTitle: { 
    fontSize: 22, 
    fontWeight: '800', 
    color: Colors.navy,
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: 14,
    color: Colors.primary.light,
    fontWeight: '600',
    marginTop: 2,
  },
  buscadorContenedor: {
    backgroundColor: Colors.white,
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray[200],
  },
  inputBusqueda: {
    backgroundColor: Colors.inputBg,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: Platform.OS === 'ios' ? 12 : 10,
    fontSize: 16,
    color: '#1C1C1E',
  }
});