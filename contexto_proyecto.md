# Contexto Completo del Proyecto CV-CREATOR-APP


================================================
📄 ARCHIVO: .env
================================================

EXPO_PUBLIC_SUPABASE_URL=https://dglvthjefzqrzlahsjab.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_K-HGHmzP6Yc8fWJhvE_dOg_2qmA_noZ

================================================
📄 ARCHIVO: .env.example
================================================

EXPO_PUBLIC_SUPABASE_URL=
EXPO_PUBLIC_SUPABASE_ANON_KEY=
EOF

================================================
📄 ARCHIVO: .gitignore
================================================

# Learn more https://docs.github.com/en/get-started/getting-started-with-git/ignoring-files

# dependencies
node_modules/

# Expo
.expo/
dist/
web-build/
expo-env.d.ts

# Native
.kotlin/
*.orig.*
*.jks
*.p8
*.p12
*.key
*.mobileprovision

# Metro
.metro-health-check*

# debug
npm-debug.*
yarn-debug.*
yarn-error.*

# macOS
.DS_Store
*.pem

# local env files
.env*.local

# typescript
*.tsbuildinfo

app-example

# generated native folders
/ios
/android

.env.local
.env.*.local
EOF

================================================
📄 ARCHIVO: app\(tabs)\index.tsx
================================================

// app/(tabs)/index.tsx  ← App layer: solo importa de pages/
import { HomeScreen } from '@pages/home/ui/HomeScreen';
export default HomeScreen;

================================================
📄 ARCHIVO: app\(tabs)\registro.tsx
================================================

// app/(tabs)/registro.tsx
import { RegistroScreen } from '@pages/registro/ui/RegistroScreen';
export default RegistroScreen;

================================================
📄 ARCHIVO: app\(tabs)\_layout.tsx
================================================

import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
 
export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#1A3A5C',
        headerStyle: { backgroundColor: '#1A3A5C' },
        headerTintColor: '#fff',
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

================================================
📄 ARCHIVO: app\+not-found.tsx
================================================

// app/+not-found.tsx
import { Link, Stack } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: "Not found" }} />
      <View style={styles.container}>
        <Text style={styles.title}>Pantalla no encontrada</Text>
        <Link href="/" style={styles.link}>
          Volver al inicio
        </Link>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
    gap: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
  },
  link: {
    fontSize: 16,
    color: "#0a7ea4",
  },
});

================================================
📄 ARCHIVO: app\proyecto\[id].tsx
================================================

import { ProyectoDetalleScreen } from '@pages/proyecto-detalle/ui/ProyectoDetalleScreen';

// EL SECRETO ESTÁ AQUÍ: Tiene que decir "export default"
export default function ProyectoDetalleRoute() {
  return <ProyectoDetalleScreen />;
}

================================================
📄 ARCHIVO: app\_layout.tsx
================================================

// app/_layout.tsx

import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="+not-found" />
    </Stack>
  );
}

================================================
📄 ARCHIVO: app.json
================================================

{
  "expo": {
    "name": "esfot-tesis",
    "slug": "esfot-tesis",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/images/icon.png",
    "scheme": "esfottesis",
    "userInterfaceStyle": "automatic",
    "newArchEnabled": true,
    "ios": {
      "supportsTablet": true
    },
    "android": {
      "adaptiveIcon": {
        "backgroundColor": "#E6F4FE",
        "foregroundImage": "./assets/images/android-icon-foreground.png",
        "backgroundImage": "./assets/images/android-icon-background.png",
        "monochromeImage": "./assets/images/android-icon-monochrome.png"
      },
      "edgeToEdgeEnabled": true,
      "predictiveBackGestureEnabled": false
    },
    "web": {
      "output": "static",
      "favicon": "./assets/images/favicon.png"
    },
    "plugins": [
      "expo-router",
      [
        "expo-splash-screen",
        {
          "image": "./assets/images/splash-icon.png",
          "imageWidth": 200,
          "resizeMode": "contain",
          "backgroundColor": "#ffffff",
          "dark": {
            "backgroundColor": "#000000"
          }
        }
      ]
    ],
    "experiments": {
      "typedRoutes": true,
      "reactCompiler": true
    }
  }
}


================================================
📄 ARCHIVO: eslint.config.js
================================================

// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');

module.exports = defineConfig([
  expoConfig,
  {
    ignores: ['dist/*'],
  },
  // =================================================================
  // RETO 0: REGLAS DE FRONTERAS FSD (Feature-Sliced Design)
  // =================================================================

  // 1. REGLAS PARA LA CAPA SHARED
  {
    files: ['src/shared/**'],
    rules: {
      'no-restricted-imports': ['error', {
        patterns: [
          {
            group: ['@entities/*', '@features/*', '@widgets/*', '@pages/*', 'app/*'],
            message: '🚨 FSD: La capa "shared" es la base. NO puede importar de entities, features, widgets, pages ni app.'
          },
          {
            group: ['@shared/*'],
            message: '🚨 FSD Cross-Import: Ninguna capa importa del mismo nivel. (ej. shared/api NO importa de shared/ui usando el alias).'
          }
        ]
      }]
    }
  },

  // 2. REGLAS PARA LA CAPA ENTITIES
  {
    files: ['src/entities/**'],
    rules: {
      'no-restricted-imports': ['error', {
        patterns: [
          {
            group: ['@features/*', '@widgets/*', '@pages/*', 'app/*'],
            message: '🚨 FSD: La capa "entities" NO puede importar de features, widgets, pages ni app.'
          },
          {
            group: ['@entities/*'],
            message: '🚨 FSD Cross-Import: No importes entre diferentes módulos de entities usando el alias.'
          }
        ]
      }]
    }
  },

  // 3. REGLAS PARA LA CAPA FEATURES
  {
    files: ['src/features/**'],
    rules: {
      'no-restricted-imports': ['error', {
        patterns: [
          {
            group: ['@widgets/*', '@pages/*', 'app/*'],
            message: '🚨 FSD: La capa "features" NO puede importar de widgets, pages ni app.'
          },
          {
            group: ['@features/*'],
            message: '🚨 FSD Cross-Import: No importes entre diferentes features usando el alias.'
          }
        ]
      }]
    }
  },

  // 4. REGLAS PARA LA CAPA WIDGETS
  {
    files: ['src/widgets/**'],
    rules: {
      'no-restricted-imports': ['error', {
        patterns: [
          {
            group: ['@pages/*', 'app/*'],
            message: '🚨 FSD: La capa "widgets" NO puede importar de pages ni app.'
          },
          {
            group: ['@widgets/*'],
            message: '🚨 FSD Cross-Import: No importes entre diferentes widgets usando el alias.'
          }
        ]
      }]
    }
  },

  // 5. REGLAS PARA LA CAPA PAGES
  {
    files: ['src/pages/**'],
    rules: {
      'no-restricted-imports': ['error', {
        patterns: [
          {
            group: ['app/*'],
            message: '🚨 FSD: La capa "pages" NO puede importar de app.'
          },
          {
            group: ['@pages/*'],
            message: '🚨 FSD Cross-Import: No importes entre diferentes pages usando el alias.'
          }
        ]
      }]
    }
  }
  // La capa "app/" no necesita bloqueos porque está en la cima, puede importar de todo.
]);

================================================
📄 ARCHIVO: expo-env.d.ts
================================================

/// <reference types="expo/types" />

// NOTE: This file should not be edited and should be in your git ignore

================================================
📄 ARCHIVO: package.json
================================================

{
  "name": "esfot-tesis",
  "main": "expo-router/entry",
  "version": "1.0.0",
  "scripts": {
    "start": "expo start",
    "reset-project": "node ./scripts/reset-project.js",
    "android": "expo start --android",
    "ios": "expo start --ios",
    "web": "expo start --web",
    "lint": "expo lint"
  },
  "dependencies": {
    "@expo/vector-icons": "^15.0.3",
    "@react-native-async-storage/async-storage": "2.2.0",
    "@react-navigation/bottom-tabs": "^7.4.0",
    "@react-navigation/elements": "^2.6.3",
    "@react-navigation/native": "^7.1.8",
    "@supabase/supabase-js": "^2.104.1",
    "expo": "~54.0.33",
    "expo-constants": "~18.0.13",
    "expo-font": "~14.0.11",
    "expo-haptics": "~15.0.8",
    "expo-image": "~3.0.11",
    "expo-linking": "~8.0.11",
    "expo-router": "~6.0.23",
    "expo-splash-screen": "~31.0.13",
    "expo-status-bar": "~3.0.9",
    "expo-symbols": "~1.0.8",
    "expo-system-ui": "~6.0.9",
    "expo-web-browser": "~15.0.10",
    "react": "19.1.0",
    "react-dom": "19.1.0",
    "react-native": "0.81.5",
    "react-native-gesture-handler": "~2.28.0",
    "react-native-reanimated": "~4.1.1",
    "react-native-safe-area-context": "~5.6.0",
    "react-native-screens": "~4.16.0",
    "react-native-url-polyfill": "^3.0.0",
    "react-native-web": "~0.21.0",
    "react-native-worklets": "0.5.1"
  },
  "devDependencies": {
    "@types/react": "~19.1.0",
    "eslint": "^9.25.0",
    "eslint-config-expo": "~10.0.0",
    "typescript": "~5.9.2"
  },
  "private": true
}


================================================
📄 ARCHIVO: README.md
================================================

# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.


================================================
📄 ARCHIVO: src\entities\proyecto-tesis\api\proyectoApi.ts
================================================

import { supabase } from "@shared/api/supabase";
import type { CreateProyectoDto, ProyectoTesis } from "../model/types";

const TABLE = "proyectos_tesis";

export const proyectoApi = {
  /** Obtiene todos los proyectos ordenados por fecha de creación */
  async getAll(): Promise<ProyectoTesis[]> {
    const { data, error } = await supabase
      .from(TABLE)
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("[proyectoApi.getAll]", error.message);
      throw new Error(error.message);
    }
    return data ?? [];
  },

  /** Obtiene un proyecto por su ID */
  async getById(id: string): Promise<ProyectoTesis> {
    const { data, error } = await supabase
      .from(TABLE)
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw new Error(error.message);
    return data;
  },

  /** Crea un nuevo proyecto de tesis */
  async create(dto: CreateProyectoDto): Promise<ProyectoTesis> {
    const payload: CreateProyectoDto = { ...dto };

    // Evita enviar strings vacios a columnas opcionales (ej. fecha/date).
    if (!payload.fecha_fin?.trim()) delete payload.fecha_fin;
    if (!payload.repositorio_github?.trim()) delete payload.repositorio_github;

    const { data, error } = await supabase
      .from(TABLE)
      .insert([payload])
      .select()
      .single();

    if (error) {
      console.error("[proyectoApi.create]", error.message);
      throw new Error(error.message);
    }
    return data;
  },

  /** Busca proyectos por título o autor */
  async search(query: string): Promise<ProyectoTesis[]> {
    const { data, error } = await supabase
      .from(TABLE)
      .select("*")
      .or(`titulo.ilike.%${query}%,autores.ilike.%${query}%`)
      .order("created_at", { ascending: false });

    if (error) throw new Error(error.message);
    return data ?? [];
  },
};

================================================
📄 ARCHIVO: src\entities\proyecto-tesis\model\types.ts
================================================

export type EstadoProyecto = 'En Progreso' | 'Completado' | 'Suspendido';
 
export interface ProyectoTesis {
  id: string;
  titulo: string;
  descripcion: string;
  autores: string;               // Ej: "Ana Torres, Luis Pérez"
  tutor_docente: string;         // Ej: "Ing. Sergio Granizo García"
  tecnologias_utilizadas: string; // Ej: "React Native, Node.js, PostgreSQL"
  fecha_inicio: string;          // Formato: "YYYY-MM-DD"
  fecha_fin?: string;            // Opcional: puede estar aún en progreso
  repositorio_github?: string;   // Ej: "https://github.com/usuario/repo"
  estado: EstadoProyecto;
  created_at: string;
}
 
// DTO para crear un nuevo proyecto (sin id ni created_at, los genera Supabase)
export type CreateProyectoDto = Omit<ProyectoTesis, 'id' | 'created_at'>;
 
// DTO para actualizar (todos los campos opcionales excepto el id)
export type UpdateProyectoDto = Partial<CreateProyectoDto>;

================================================
📄 ARCHIVO: src\features\registro-proyecto\api\createProyecto.ts
================================================

// src/features/registro-proyecto/api/createProyecto.ts
import { proyectoApi } from "@entities/proyecto-tesis/api/proyectoApi";
import type { CreateProyectoDto } from "@entities/proyecto-tesis/model/types";

export interface ValidationError {
  field: keyof CreateProyectoDto;
  message: string;
}

/** Valida el formulario antes de enviar a Supabase */
export function validateProyecto(
  dto: Partial<CreateProyectoDto>,
): ValidationError[] {
  const errors: ValidationError[] = [];

  if (!dto.titulo?.trim())
    errors.push({ field: "titulo", message: "El título es obligatorio" });

  if (!dto.autores?.trim())
    errors.push({ field: "autores", message: "Ingresa al menos un autor" });

  if (!dto.tutor_docente?.trim())
    errors.push({
      field: "tutor_docente",
      message: "El tutor docente es obligatorio",
    });

  if (!dto.tecnologias_utilizadas?.trim())
    errors.push({
      field: "tecnologias_utilizadas",
      message: "Especifica las tecnologías",
    });

  if (!dto.fecha_inicio?.trim())
    errors.push({
      field: "fecha_inicio",
      message: "La fecha de inicio es obligatoria",
    });

  if (dto.fecha_inicio && !/^\d{4}-\d{2}-\d{2}$/.test(dto.fecha_inicio))
    errors.push({ field: "fecha_inicio", message: "Formato: AAAA-MM-DD" });

  if (dto.repositorio_github && !/^https?:\/\/.+/.test(dto.repositorio_github))
    errors.push({
      field: "repositorio_github",
      message: "Debe ser una URL válida",
    });

  return errors;
}

/** Crea el proyecto tras validar */
export async function createProyecto(dto: CreateProyectoDto) {
  return proyectoApi.create(dto);
}

================================================
📄 ARCHIVO: src\features\registro-proyecto\ui\RegistroProyectoForm.tsx
================================================

import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, ScrollView,
  StyleSheet, Alert, ActivityIndicator, Platform,
} from 'react-native';
import type { CreateProyectoDto, EstadoProyecto }
  from '@entities/proyecto-tesis/model/types';
import { createProyecto, validateProyecto }
  from '../api/createProyecto';

// Valor inicial del formulario
const FORM_INICIAL: CreateProyectoDto = {
  titulo: '',
  descripcion: '',
  autores: '',
  tutor_docente: '',
  tecnologias_utilizadas: '',
  fecha_inicio: '',
  fecha_fin: '',
  repositorio_github: '',
  estado: 'En Progreso',
};

const ESTADOS: EstadoProyecto[] = ['En Progreso', 'Completado', 'Suspendido'];

interface Props {
  onSuccess?: () => void;
}

// 1. Campo extraído ARRIBA del componente principal con sus props completas
const Campo = ({
  label, campo, placeholder, multiline = false, keyboardType = 'default',
  form, errores, actualizar
}: {
  label: string;
  campo: keyof CreateProyectoDto;
  placeholder: string;
  multiline?: boolean;
  keyboardType?: 'default' | 'url';
  form: CreateProyectoDto;
  errores: Record<string, string>;
  actualizar: (campo: keyof CreateProyectoDto, valor: string) => void;
}) => (
  <View style={styles.campoContenedor}>
    <Text style={styles.etiqueta}>{label}</Text>
    <TextInput
      style={[
        styles.input,
        multiline && styles.inputMultiline,
        errores[campo] ? styles.inputError : null,
      ]}
      placeholder={placeholder}
      placeholderTextColor="#999"
      value={form[campo] as string}
      onChangeText={val => actualizar(campo, val)}
      multiline={multiline}
      numberOfLines={multiline ? 3 : 1}
      keyboardType={keyboardType}
      autoCapitalize={campo === 'repositorio_github' ? 'none' : 'sentences'}
    />
    {errores[campo] ? (
      <Text style={styles.textoError}>{errores[campo]}</Text>
    ) : null}
  </View>
);

export function RegistroProyectoForm({ onSuccess }: Props) {
  const [form, setForm] = useState<CreateProyectoDto>(FORM_INICIAL);
  const [errores, setErrores] = useState<Record<string, string>>({});
  const [cargando, setCargando] = useState(false);

  const actualizar = (campo: keyof CreateProyectoDto, valor: string) => {
    setForm(prev => ({ ...prev, [campo]: valor }));
    // Limpiar error del campo al escribir
    if (errores[campo]) setErrores(prev => ({ ...prev, [campo]: '' }));
  };

  const handleGuardar = async () => {
    const validacion = validateProyecto(form);
    if (validacion.length > 0) {
      const mapa: Record<string, string> = {};
      validacion.forEach(e => { mapa[e.field] = e.message; });
      setErrores(mapa);
      Alert.alert('Formulario incompleto', 'Revisa los campos marcados en rojo.');
      return;
    }

    try {
      setCargando(true);
      await createProyecto(form);
      Alert.alert('¡Éxito!', 'Proyecto de tesis registrado correctamente.', [
        { text: 'OK', onPress: () => { setForm(FORM_INICIAL); onSuccess?.(); } }
      ]);
    } catch {
      Alert.alert('Error', 'No se pudo guardar el proyecto. Verifica tu conexión.');
    } finally {
      setCargando(false);
    }
  };

  return (
    <ScrollView
      style={styles.contenedor}
      contentContainerStyle={styles.scroll}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={styles.titulo}>Nuevo Proyecto de Tesis</Text>
      <Text style={styles.subtitulo}>ESFOT — Tecnología Superior en Desarrollo de Software</Text>

      {/* 2. Todos los campos ahora pasan form, errores y actualizar */}
      <Campo label="Título del Proyecto *" campo="titulo" placeholder="Ej: Sistema de gestión de inventarios para PYMES" form={form} errores={errores} actualizar={actualizar} />
      <Campo label="Descripción" campo="descripcion" placeholder="Describe brevemente el objetivo del proyecto..." multiline form={form} errores={errores} actualizar={actualizar} />
      <Campo label="Autores * (separa con comas)" campo="autores" placeholder="Ej: Ana Torres, Luis Pérez" form={form} errores={errores} actualizar={actualizar} />
      <Campo label="Tutor Docente *" campo="tutor_docente" placeholder="Ej: Ing. Juan Carlos Gonzalez Msc." form={form} errores={errores} actualizar={actualizar} />
      <Campo label="Tecnologías Utilizadas * (separa con comas)" campo="tecnologias_utilizadas" placeholder="Ej: React Native, Node.js, PostgreSQL, AWS" form={form} errores={errores} actualizar={actualizar} />
      <Campo label="Fecha de Inicio * (AAAA-MM-DD)" campo="fecha_inicio" placeholder="Ej: 2025-03-01" form={form} errores={errores} actualizar={actualizar} />
      <Campo label="Fecha de Fin (AAAA-MM-DD)" campo="fecha_fin" placeholder="Ej: 2025-12-31 (dejar vacío si está en progreso)" form={form} errores={errores} actualizar={actualizar} />
      <Campo label="Repositorio GitHub" campo="repositorio_github" placeholder="https://github.com/usuario/repositorio" keyboardType="url" form={form} errores={errores} actualizar={actualizar} />

      {/* Selector de Estado */}
      <View style={styles.campoContenedor}>
        <Text style={styles.etiqueta}>Estado del Proyecto</Text>
        <View style={styles.estadoContenedor}>
          {ESTADOS.map(est => (
            <TouchableOpacity
              key={est}
              style={[
                styles.estadoBoton,
                form.estado === est && styles.estadoBotonActivo,
              ]}
              onPress={() => actualizar('estado', est)}
            >
              <Text style={[
                styles.estadoTexto,
                form.estado === est && styles.estadoTextoActivo,
              ]}>{est}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <TouchableOpacity
        style={[styles.botonGuardar, cargando && styles.botonDeshabilitado]}
        onPress={handleGuardar}
        disabled={cargando}
      >
        {cargando
          ? <ActivityIndicator color="#fff" />
          : <Text style={styles.botonTexto}>Registrar Proyecto</Text>
        }
      </TouchableOpacity>
    </ScrollView>
  );
}

// ── ESTILOS ──────────────────────────────────────────────────
const AZUL = '#1A3A5C';
const AZUL_CLARO = '#2E6DA4';

const styles = StyleSheet.create({
  contenedor: { flex: 1, backgroundColor: '#F5F7FA' },
  scroll: { padding: 20, paddingBottom: 40 },
  titulo: { fontSize: 22, fontWeight: '700', color: AZUL, marginBottom: 4 },
  subtitulo: { fontSize: 13, color: '#666', marginBottom: 24 },
  campoContenedor: { marginBottom: 16 },
  etiqueta: { fontSize: 13, fontWeight: '600', color: '#444', marginBottom: 6 },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#DDE2E8',
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: Platform.OS === 'ios' ? 12 : 10,
    fontSize: 15,
    color: '#1A1A1A',
  },
  inputMultiline: { height: 80, textAlignVertical: 'top', paddingTop: 10 },
  inputError: { borderColor: '#E74C3C', borderWidth: 1.5 },
  textoError: { color: '#E74C3C', fontSize: 12, marginTop: 4 },
  estadoContenedor: { flexDirection: 'row', gap: 10 },
  estadoBoton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#DDE2E8',
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  estadoBotonActivo: { backgroundColor: AZUL_CLARO, borderColor: AZUL_CLARO },
  estadoTexto: { fontSize: 13, color: '#555' },
  estadoTextoActivo: { color: '#fff', fontWeight: '700' },
  botonGuardar: {
    backgroundColor: AZUL,
    borderRadius: 10,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 10,
  },
  botonDeshabilitado: { opacity: 0.6 },
  botonTexto: { color: '#fff', fontSize: 16, fontWeight: '700' },
});

================================================
📄 ARCHIVO: src\pages\home\ui\HomeScreen.tsx
================================================

// RETO 2
// Agrega un buscador en HomeScreen que filtre proyectos

import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Platform } from 'react-native';
import { ListaProyectos } from '@widgets/lista-proyectos/ui/ListaProyectos';

export function HomeScreen() {
  // Estado para controlar el texto del buscador
  const [busqueda, setBusqueda] = useState('');

  return (
    <View style={styles.contenedor}>
      <Text style={styles.header}>Proyectos de Tesis — ESFOT</Text>
      
      {/* Contenedor del Buscador */}
      <View style={styles.buscadorContenedor}>
        <TextInput
          style={styles.inputBusqueda}
          placeholder="Buscar por título o autor..."
          placeholderTextColor="#8E8E93"
          value={busqueda}
          onChangeText={setBusqueda} // Actualiza el estado al escribir
          clearButtonMode="while-editing" // Botón de limpiar (solo iOS)
        />
      </View>

      {/* Le pasamos el estado actual al widget */}
      <ListaProyectos searchQuery={busqueda} />
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: { 
    flex: 1, 
    backgroundColor: '#F5F7FA' 
  },
  header: { 
    fontSize: 20, 
    fontWeight: '700', 
    color: '#1A3A5C',
    padding: 16, 
    paddingBottom: 8, // Reducido para acercarlo al buscador
  },
  buscadorContenedor: {
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E6EE',
  },
  inputBusqueda: {
    backgroundColor: '#E3E8ED', // Gris sutil tipo sistema moderno
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: Platform.OS === 'ios' ? 10 : 8,
    fontSize: 16,
    color: '#1C1C1E',
  }
});

================================================
📄 ARCHIVO: src\pages\proyecto-detalle\index.ts
================================================

export * from './ui/ProyectoDetalleScreen';

================================================
📄 ARCHIVO: src\pages\proyecto-detalle\ui\ProyectoDetalleScreen.tsx
================================================

import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { useLocalSearchParams, Stack } from 'expo-router';
import { proyectoApi } from '@entities/proyecto-tesis/api/proyectoApi';
import type { ProyectoTesis } from '@entities/proyecto-tesis/model/types';

export function ProyectoDetalleScreen() {
  // 1. Extraemos el ID dinámico de la URL que nos manda la tarjeta
  const { id } = useLocalSearchParams<{ id: string }>();
  
  // 2. Estados para manejar la información
  const [proyecto, setProyecto] = useState<ProyectoTesis | null>(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 3. Efecto para cargar los datos desde Supabase al abrir la pantalla
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

  // 4. Pantalla de Carga
  if (cargando) {
    return (
      <View style={styles.centro}>
        <ActivityIndicator size="large" color="#1A3A5C" />
      </View>
    );
  }

  // 5. Pantalla de Error
  if (error || !proyecto) {
    return (
      <View style={styles.centro}>
        <Text style={styles.error}>{error || "Proyecto no encontrado"}</Text>
      </View>
    );
  }

  // 6. Pantalla Principal de Detalle
  return (
    <ScrollView style={styles.contenedor} contentContainerStyle={styles.scroll}>
      {/* Configuración dinámica del título superior en Expo Router */}
      <Stack.Screen options={{ title: "Detalle del Proyecto" }} />

      <View style={styles.tarjeta}>
        <Text style={styles.titulo}>{proyecto.titulo}</Text>
        
        <View style={styles.seccion}>
          <Text style={styles.etiqueta}>Descripción</Text>
          <Text style={styles.valor}>{proyecto.descripcion || "Sin descripción detallada."}</Text>
        </View>

        <View style={styles.seccion}>
          <Text style={styles.etiqueta}>Autores</Text>
          <Text style={styles.valor}>{proyecto.autores}</Text>
        </View>

        <View style={styles.seccion}>
          <Text style={styles.etiqueta}>Tutor Docente</Text>
          <Text style={styles.valor}>{proyecto.tutor_docente}</Text>
        </View>

        <View style={styles.seccion}>
          <Text style={styles.etiqueta}>Tecnologías Utilizadas</Text>
          <Text style={styles.valorDestacado}>{proyecto.tecnologias_utilizadas}</Text>
        </View>

        <View style={styles.filaSeccion}>
          <View style={styles.mitad}>
            <Text style={styles.etiqueta}>Fecha de Inicio</Text>
            <Text style={styles.valor}>{proyecto.fecha_inicio}</Text>
          </View>
          <View style={styles.mitad}>
            <Text style={styles.etiqueta}>Fecha de Fin</Text>
            <Text style={styles.valor}>{proyecto.fecha_fin || "En curso"}</Text>
          </View>
        </View>

        <View style={styles.seccion}>
          <Text style={styles.etiqueta}>Estado Actual</Text>
          <Text style={styles.valor}>{proyecto.estado}</Text>
        </View>

        {/* Muestra el botón solo si el proyecto tiene un link a GitHub */}
        {proyecto.repositorio_github && (
          <TouchableOpacity style={styles.botonGit} onPress={abrirRepo}>
            <Text style={styles.botonGitTexto}>Ver Repositorio en GitHub</Text>
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
  );
}

// ── ESTILOS ──────────────────────────────────────────────────
const styles = StyleSheet.create({
  contenedor: { flex: 1, backgroundColor: '#F5F7FA' },
  scroll: { padding: 16 },
  centro: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  error: { color: '#E74C3C', fontSize: 16 },
  tarjeta: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  titulo: { fontSize: 22, fontWeight: '800', color: '#1A3A5C', marginBottom: 20 },
  seccion: { marginBottom: 16 },
  filaSeccion: { flexDirection: 'row', marginBottom: 16 },
  mitad: { flex: 1 },
  etiqueta: { fontSize: 12, fontWeight: '600', color: '#888', textTransform: 'uppercase', marginBottom: 4 },
  valor: { fontSize: 16, color: '#333', lineHeight: 24 },
  valorDestacado: { fontSize: 15, color: '#2E6DA4', fontWeight: '600', backgroundColor: '#EBF5FB', alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, overflow: 'hidden' },
  botonGit: { marginTop: 24, backgroundColor: '#1A1A1A', paddingVertical: 14, borderRadius: 10, alignItems: 'center' },
  botonGitTexto: { color: '#fff', fontSize: 16, fontWeight: '700' },
});

================================================
📄 ARCHIVO: src\pages\registro\ui\RegistroScreen.tsx
================================================

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { RegistroProyectoForm }
  from '@features/registro-proyecto/ui/RegistroProyectoForm';
import { router } from 'expo-router';
 
export function RegistroScreen() {
  return (
    <View style={styles.contenedor}>
      <RegistroProyectoForm onSuccess={() => router.back()} />
    </View>
  );
}
 
const styles = StyleSheet.create({
  contenedor: { flex: 1 },
});

================================================
📄 ARCHIVO: src\shared\api\supabase.ts
================================================

import AsyncStorage from '@react-native-async-storage/async-storage';
import { ENV } from '../config/env';
import { createClient } from '@supabase/supabase-js';
import 'react-native-url-polyfill/auto';

export const supabase = createClient(ENV.supabaseUrl, ENV.supabaseAnonKey, {
  auth: {
    // En react Native no hay localStorage del navegador, por eso usamos AsyncStorage.
    // Aqui Supabase guarda y recupera los tokes de sesión.
    storage: AsyncStorage,
    // Renueva automáticamente el token de sesión antes de que expire.
    autoRefreshToken: true,
    // Mantiene la sesión incluso después de cerrar la aplicación.
    persistSession: true,
    // En mobile no se manejan callbacks de sesion por URL como web.
    detectSessionInUrl: false,
  },
  
});

================================================
📄 ARCHIVO: src\shared\config\env.ts
================================================

// src/shared/config/env.ts

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
        'Faltan las variables de entorno. Crea el archivo .env' +
        'EXPO_PUBLIC_SUPABASE_URL y EXPO_PUBLIC_SUPABASE_ANON_KEY con los valores correspondientes.'
    );
};

export const ENV = {
    supabaseUrl,
    supabaseAnonKey,
} as const;

================================================
📄 ARCHIVO: src\shared\ui\Button.tsx
================================================



================================================
📄 ARCHIVO: src\widgets\lista-proyectos\ui\ListaProyectos.tsx
================================================

// RETO 1
// En FSD, las Features no pueden ensamblar Widgets.
// Es al revés: los Widgets son bloques más grandes que ensamblan Features y Entities.
// RETO 2
// Agrega un buscador en HomeScreen que filtre proyectos 
// La pantalla HomeScreen (que controla la vista) tendrá el campo de texto (buscador) y guardará lo que escribas.
// El widget ListaProyectos recibirá ese texto como prop y hará la búsqueda cada vez que cambie.
// si hay texto: si está vacío, llamará a getAll(), pero si tiene letras, llamará automáticamente a proyectoApi.search() para filtrar.
import { proyectoApi } from "@entities/proyecto-tesis/api/proyectoApi";
import type { ProyectoTesis } from "@entities/proyecto-tesis/model/types";
import { ProyectoCard } from "../../proyecto-card/ProyectoCard";
import { useFocusEffect } from "expo-router";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { ActivityIndicator, FlatList, StyleSheet, Text } from "react-native";

// 1. Añadimos la interfaz para recibir el texto de búsqueda
interface Props {
  searchQuery?: string;
}

export function ListaProyectos({ searchQuery = "" }: Props) {
  const [proyectos, setProyectos] = useState<ProyectoTesis[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const primeraEntrada = useRef(true);

  const cargarProyectos = useCallback(async (silent = false) => {
    if (!silent) setCargando(true);
    setError(null);

    try {
      // 2. Lógica condicional: Si hay texto busca, si no, trae todos
      const data = searchQuery.trim() !== ""
        ? await proyectoApi.search(searchQuery.trim())
        : await proyectoApi.getAll();
        
      setProyectos(data);
    } catch (e) {
      const mensaje = e instanceof Error ? e.message : "Error desconocido";
      setError(mensaje);
    } finally {
      if (!silent) setCargando(false);
    }
  }, [searchQuery]); // 3. Importante: Dependencia actualizada

  // Esto hace que busque automáticamente cada vez que escribes una letra
  useEffect(() => {
    cargarProyectos();
  }, [cargarProyectos]);

  useFocusEffect(
    useCallback(() => {
      if (primeraEntrada.current) {
        primeraEntrada.current = false;
        return;
      }
      cargarProyectos(true);
    }, [cargarProyectos]),
  );

  if (cargando)
    return <ActivityIndicator size="large" color="#1A3A5C" style={styles.centro} />;

  if (error)
    return <Text style={styles.error}>Error al cargar proyectos: {error}</Text>;

  if (proyectos.length === 0)
    return (
      <Text style={styles.vacio}>
        {searchQuery.trim() !== "" 
          ? "No se encontraron proyectos con esa búsqueda." 
          : "No hay proyectos registrados aún."}
      </Text>
    );

  return (
    <FlatList
      data={proyectos}
      keyExtractor={(p) => p.id}
      renderItem={({ item }) => <ProyectoCard proyecto={item} />}
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

================================================
📄 ARCHIVO: src\widgets\proyecto-card\ProyectoCard.tsx
================================================

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Linking } from 'react-native';
import type { ProyectoTesis } from '@entities/proyecto-tesis/model/types';
import { useRouter } from 'expo-router';

const BADGE_COLOR: Record<string, string> = {
  'En Progreso': '#3498DB',
  'Completado':  '#27AE60',
  'Suspendido':  '#E74C3C',
};

interface Props {
  proyecto: ProyectoTesis;
}

export function ProyectoCard({ proyecto }: Props) {
  const router = useRouter();

  const abrirRepo = () => {
    if (proyecto.repositorio_github)
      Linking.openURL(proyecto.repositorio_github);
  };

  const irAlDetalle = () => {
    router.push(`/proyecto/${proyecto.id}`);
  };

  return (
    <TouchableOpacity 
      style={styles.tarjeta} 
      onPress={irAlDetalle} 
      activeOpacity={0.7}
    >
      <View style={styles.encabezado}>
        <Text style={styles.titulo} numberOfLines={2}>{proyecto.titulo}</Text>
        <View style={[styles.badge, { backgroundColor: BADGE_COLOR[proyecto.estado] }]}>
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
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  tarjeta: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  encabezado: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 },
  titulo: { fontSize: 16, fontWeight: '700', color: '#1A3A5C', flex: 1, marginRight: 8 },
  badge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 },
  badgeTexto: { color: '#fff', fontSize: 11, fontWeight: '700' },
  etiqueta: { fontSize: 11, color: '#888', fontWeight: '600', marginTop: 8 },
  valor: { fontSize: 14, color: '#333', marginTop: 2 },
  filaFechas: { flexDirection: 'row', gap: 24 },
  fecha: { flex: 1 },
});

================================================
📄 ARCHIVO: tsconfig.json
================================================

{
  "extends": "expo/tsconfig.base",
  "compilerOptions": {
    "strict": true,
    "paths": {
      "@/*": [
        "./src/*"
      ],
      "@shared/*": [
        "./src/shared/*"
      ],
      "@entities/*": [
        "./src/entities/*"
      ],
      "@features/*": [
        "./src/features/*"
      ],
      "@widgets/*": [
        "./src/widgets/*"
      ],
      "@pages/*": [
        "./src/pages/*"
      ]
    }
  },
  "include": [
    "**/*.ts",
    "**/*.tsx",
    ".expo/types/**/*.d.ts",
    "expo-env.d.ts",
    ".expo/types/**/*.ts"
  ]
}
