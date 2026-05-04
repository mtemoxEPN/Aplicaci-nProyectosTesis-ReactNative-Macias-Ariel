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
📄 ARCHIVO: app\editar\[id].tsx
================================================

// Cambia la línea 1 de app/editar/[id].tsx por esta:
import { EditarScreen } from '@pages/editar-proyecto/ui/EditarScreen';

export default function EditarRoute() {
  return <EditarScreen />;
}

================================================
📄 ARCHIVO: app\login.tsx
================================================

import { LoginScreen } from '@pages/login/ui/LoginScreen';

export default function LoginRoute() {
  return <LoginScreen />;
}

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
📄 ARCHIVO: metro.config.js
================================================

// =====================================================================
// 🎨 [ANIMATION-01] CONFIGURACIÓN DE METRO PARA UNIWIND
// =====================================================================
const { getDefaultConfig } = require('expo/metro-config');
const { withUniwindConfig } = require('uniwind/metro');

const config = getDefaultConfig(__dirname);

module.exports = withUniwindConfig(config, {
  cssEntryFile: './src/global.css',
  dtsFile: './src/uniwind-types.d.ts'
});

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
    "expo-document-picker": "~14.0.8",
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
    "react-hook-form": "^7.73.1",
    "react-native": "0.81.5",
    "react-native-gesture-handler": "~2.28.0",
    "react-native-reanimated": "~4.1.1",
    "react-native-safe-area-context": "~5.6.0",
    "react-native-screens": "~4.16.0",
    "react-native-url-polyfill": "^3.0.0",
    "react-native-web": "~0.21.0",
    "react-native-worklets": "0.5.1",
    "tailwindcss": "^4.2.4",
    "uniwind": "^1.6.3"
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
import type { CreateProyectoDto, ProyectoTesis, UpdateProyectoDto } from "../model/types";
import { Platform } from 'react-native';

const TABLE = "proyectos_tesis";

export const proyectoApi = {
  async getAll(): Promise<ProyectoTesis[]> {
    const { data, error } = await supabase.from(TABLE).select("*").order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return data ?? [];
  },

  async getById(id: string): Promise<ProyectoTesis> {
    const { data, error } = await supabase.from(TABLE).select("*").eq("id", id).single();
    if (error) throw new Error(error.message);
    return data;
  },

  async create(dto: CreateProyectoDto): Promise<ProyectoTesis> {
    const payload: CreateProyectoDto = { ...dto };
    if (!payload.fecha_fin?.trim()) delete payload.fecha_fin;
    if (!payload.repositorio_github?.trim()) delete payload.repositorio_github;

    const { data, error } = await supabase.from(TABLE).insert([payload]).select().single();
    if (error) throw new Error(error.message);
    return data;
  },

  async search(query: string): Promise<ProyectoTesis[]> {
    const { data, error } = await supabase.from(TABLE).select("*").or(`titulo.ilike.%${query}%,autores.ilike.%${query}%`).order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return data ?? [];
  },

  async update(id: string, dto: UpdateProyectoDto): Promise<ProyectoTesis> {
    const payload: any = { ...dto };
    if (payload.fecha_fin === "") payload.fecha_fin = null;
    if (payload.repositorio_github === "") payload.repositorio_github = null;

    const { data, error } = await supabase.from(TABLE).update(payload).eq("id", id).select().single();
    if (error) {
      console.error("[proyectoApi.update]", error.message);
      throw new Error(error.message);
    }
    return data;
  },

  // RETO 4: NUEVA FUNCIÓN PARA ELIMINAR
  async delete(id: string): Promise<void> {
    const { error } = await supabase.from(TABLE).delete().eq("id", id);
    if (error) {
      console.error("[proyectoApi.delete]", error.message);
      throw new Error(error.message);
    }
  },

  // =====================================================================
  // 📦 [STORAGE-02] FUNCIÓN EXCLUSIVA PARA SUBIR EL PDF A SUPABASE
  // =====================================================================
  async uploadDocument(uri: string, fileName: string): Promise<string> {
    try {
      // =====================================================================
      // 🐛 [FIX-05] SANITIZAR EL NOMBRE DEL ARCHIVO (Quitar tildes, espacios y ñ)
      // =====================================================================
      const nombreSeguro = fileName
        .normalize("NFD") // Descompone las letras de sus tildes (ej. Ó -> O + ´)
        .replace(/[\u0300-\u036f]/g, "") // Elimina las tildes descompuestas
        .replace(/[^a-zA-Z0-9.\-_]/g, "_"); // Reemplaza espacios y cualquier símbolo raro por un guion bajo "_"

      // Ahora usamos el "nombreSeguro" en lugar del "fileName" original
      const uniqueFileName = `${Date.now()}-${nombreSeguro}`;
      const filePath = `tesis/${uniqueFileName}`;

      const formData = new FormData();
      
      formData.append('file', {
        uri: Platform.OS === 'android' ? uri : uri.replace('file://', ''),
        name: uniqueFileName,
        type: 'application/pdf',
      } as any);

      const { data, error } = await supabase.storage
        .from('documentos')
        .upload(filePath, formData);

      if (error) throw new Error(error.message);

      const { data: publicData } = supabase.storage
        .from('documentos')
        .getPublicUrl(filePath);

      return publicData.publicUrl;
    } catch (error: any) {
      console.error("[proyectoApi.uploadDocument]", error.message);
      throw new Error("No se pudo subir el documento: " + error.message);
    }
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
  // =====================================================================
  // 📦 [STORAGE-01] NUEVO CAMPO PARA ALMACENAR LA URL DEL PDF
  // =====================================================================
  documento_url?: string;
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
import { useForm, Controller } from 'react-hook-form';
import type { CreateProyectoDto, EstadoProyecto, ProyectoTesis } from '@entities/proyecto-tesis/model/types';
import { createProyecto } from '../api/createProyecto';
import { proyectoApi } from '@entities/proyecto-tesis/api/proyectoApi';
import { Colors } from '@shared/ui/Colors';
// =====================================================================
// 📦 [STORAGE-03] IMPORTAR DOCUMENT PICKER Y EXPO VECTOR ICONS
// =====================================================================
import * as DocumentPicker from 'expo-document-picker';
import { Ionicons } from '@expo/vector-icons';

// =====================================================================
// 🎨 [ANIMATION-05] IMPORTACIÓN DE HOOKS DE REANIMATED
// =====================================================================
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolateColor,
  // =====================================================================
  // 🌟 [EXTRA-03] IMPORTAR WITHSPRING PARA LA FÍSICA DEL BOTÓN
  // =====================================================================
  withSpring
} from 'react-native-reanimated';

// Convertimos TextInput a un componente animado
const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);

// =====================================================================
// 🌟 [EXTRA-04] CREAR UNA VERSIÓN ANIMADA DEL TOUCHABLE OPACITY
// =====================================================================
const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

// =====================================================================
// 🌟 [EXTRA-05] DEFINIR EL ESTADO Y ESTILO ANIMADO PARA EL BOTÓN
// =====================================================================
const buttonScale = useSharedValue(1);

const animatedButtonStyle = useAnimatedStyle(() => {
  return {
    transform: [{ scale: buttonScale.value }],
  };
});

const SOLO_LETRAS_REGEX = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
const ANIO_MINIMO = 2015;
const ANIO_MAXIMO = 2027;

const validarSoloLetras = (valor: string) =>
  SOLO_LETRAS_REGEX.test(valor) || 'Solo se permiten letras y espacios';

const validarFechaInicio = (valor: string) => {
  if (!valor) return true;
  const anio = parseInt(valor.split('-')[0], 10);
  if (anio < ANIO_MINIMO) return `El año debe ser ${ANIO_MINIMO} o posterior`;
  if (anio > ANIO_MAXIMO) return `El año no puede ser mayor a ${ANIO_MAXIMO}`;
  return true;
};

const FORM_INICIAL: CreateProyectoDto = {
  titulo: '', descripcion: '', autores: '', tutor_docente: '',
  tecnologias_utilizadas: '', fecha_inicio: '', fecha_fin: '',
  repositorio_github: '', estado: 'En Progreso',
};

const ESTADOS: EstadoProyecto[] = ['En Progreso', 'Completado', 'Suspendido'];

interface Props {
  onSuccess?: () => void;
  proyectoEditar?: ProyectoTesis;
}

// =====================================================================
// 🎨 [ANIMATION-06] REESTRUCTURACIÓN DE CAMPORHF PARA TRANSICIÓN DE BORDES
// =====================================================================
const CampoRHF = ({ control, name, label, placeholder, rules, multiline = false, keyboardType = 'default' }: any) => {
  // 1. Estado compartido que representa si el input tiene el foco (0 = inactivo, 1 = activo)
  const isFocused = useSharedValue(0);

  // 2. Estilo animado que interpola el color del borde basado en el estado isFocused
  const animatedBorderStyle = useAnimatedStyle(() => {
    const borderColor = interpolateColor(
      isFocused.value,
      [0, 1],
      [Colors.gray[300], Colors.primary.main] // Transición de gris a azul primario
    );

    return {
      borderColor,
      borderWidth: isFocused.value ? 1.5 : 1, // Ligero engrosamiento al enfocarse
    };
  });

  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
        <View style={styles.campoContenedor}>
          <Text style={styles.etiqueta}>{label}</Text>
          <AnimatedTextInput
            style={[
              styles.input,
              multiline && styles.inputMultiline,
              animatedBorderStyle, // Inyección del estilo dinámico
              error ? styles.inputError : null,
            ]}
            placeholder={placeholder}
            placeholderTextColor="#999"
            onFocus={() => {
              // Animación de entrada al recibir el foco
              isFocused.value = withTiming(1, { duration: 300 });
            }}
            onBlur={(e) => {
              // Animación de salida al perder el foco y ejecución del onBlur original
              isFocused.value = withTiming(0, { duration: 300 });
              onBlur(e);
            }}
            onChangeText={onChange}
            value={value as string}
            multiline={multiline}
            numberOfLines={multiline ? 3 : 1}
            keyboardType={keyboardType}
            autoCapitalize={name === 'repositorio_github' ? 'none' : 'sentences'}
          />
          {error && <Text style={styles.textoError}>{error.message}</Text>}
        </View>
      )}
    />
  );
};

export function RegistroProyectoForm({ onSuccess, proyectoEditar }: Props) {
  const esEdicion = !!proyectoEditar;
  const [cargando, setCargando] = useState(false);
  // =====================================================================
  // 📦 [STORAGE-04] ESTADO PARA GUARDAR EL ARCHIVO SELECCIONADO LOCALMENTE
  // =====================================================================
  const [archivoPDF, setArchivoPDF] = useState<DocumentPicker.DocumentPickerAsset | null>(null);

  // 2. Inicializamos React Hook Form
  const { control, handleSubmit, reset } = useForm<CreateProyectoDto>({
    defaultValues: esEdicion ? {
      titulo: proyectoEditar.titulo,
      descripcion: proyectoEditar.descripcion || '',
      autores: proyectoEditar.autores,
      tutor_docente: proyectoEditar.tutor_docente,
      tecnologias_utilizadas: proyectoEditar.tecnologias_utilizadas,
      fecha_inicio: proyectoEditar.fecha_inicio,
      fecha_fin: proyectoEditar.fecha_fin || '',
      repositorio_github: proyectoEditar.repositorio_github || '',
      estado: proyectoEditar.estado,
    } : FORM_INICIAL,
  });

  // =====================================================================
  // 📦 [STORAGE-05] FUNCIÓN PARA ABRIR EL SELECTOR DE ARCHIVOS
  // =====================================================================
  const seleccionarDocumento = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'application/pdf', // Solo permitimos PDFs
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setArchivoPDF(result.assets[0]);
      }
    } catch (err) {
      Alert.alert('Error', 'Hubo un problema al seleccionar el documento.');
    }
  };

  // 3. Función onSubmit que SOLO se ejecuta si el formulario es válido
  const onSubmit = async (data: CreateProyectoDto) => {
    if (data.fecha_inicio && data.fecha_fin) {
      const fechaIni = new Date(data.fecha_inicio);
      const fechaFin = new Date(data.fecha_fin);
      if (fechaFin < fechaIni) {
        Alert.alert('Error', 'La fecha fin debe ser posterior a la fecha de inicio');
        return;
      }
    }
    try {
      setCargando(true);

      // =====================================================================
      // 📦 [STORAGE-06] LÓGICA DE SUBIDA ANTES DE GUARDAR EN LA BASE DE DATOS
      // =====================================================================
      let urlDocumentoFinal = data.documento_url; // Por si ya tenía uno en edición

      if (archivoPDF) {
        // Subimos el archivo a Supabase Storage y obtenemos la URL pública
        urlDocumentoFinal = await proyectoApi.uploadDocument(archivoPDF.uri, archivoPDF.name);
      }

      // Preparamos los datos finales sumando la URL del documento
      const datosFinales: CreateProyectoDto = {
        ...data,
        documento_url: urlDocumentoFinal,
      };

      if (esEdicion) {
        await proyectoApi.update(proyectoEditar.id, datosFinales);
        Alert.alert('¡Éxito!', 'Proyecto actualizado.', [{ text: 'OK', onPress: () => onSuccess?.() }]);
      } else {
        await createProyecto(datosFinales);
        Alert.alert('¡Éxito!', 'Proyecto registrado.', [{
          text: 'OK', onPress: () => {
            reset(FORM_INICIAL);
            setArchivoPDF(null); // Limpiamos el PDF seleccionado
            onSuccess?.();
          }
        }]);
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'No se pudo guardar la información.');
    } finally {
      setCargando(false);
    }
  };

  return (
    <ScrollView style={styles.contenedor} contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
      <Text style={styles.titulo}>{esEdicion ? "Editar Proyecto" : "Nuevo Proyecto"}</Text>
      <Text style={styles.subtitulo}>ESFOT — Tecnología Superior en Desarrollo de Software</Text>

      {/* 4. Implementamos los campos con sus reglas de validación */}
      <CampoRHF control={control} name="titulo" label="Título del Proyecto *" placeholder="Ej: Sistema de gestión..."
        rules={{
          required: "El título es obligatorio",
          minLength: { value: 5, message: "Mínimo 5 caracteres" },
          maxLength: { value: 150, message: "Máximo 150 caracteres" }
        }} />

      <CampoRHF control={control} name="descripcion" label="Descripción" placeholder="Describe brevemente..." multiline
        rules={{ maxLength: { value: 500, message: "Máximo 500 caracteres" } }} />

      <CampoRHF control={control} name="autores" label="Autores * (separa con comas)" placeholder="Ej: Ana Torres, Luis Pérez"
        rules={{
          required: "Ingresa al menos un autor",
          validate: {
            soloLetras: (v: string) => {
              const nombres = v.split(',').map(n => n.trim());
              return nombres.every(n => SOLO_LETRAS_REGEX.test(n) && n.length > 0) || 'Solo letras en nombres';
            }
          }
        }} />

      <CampoRHF control={control} name="tutor_docente" label="Tutor Docente *" placeholder="Ej: Ing. Juan Carlos..."
        rules={{
          required: "El tutor docente es obligatorio",
          validate: validarSoloLetras,
          maxLength: { value: 100, message: "Máximo 100 caracteres" }
        }} />

      <CampoRHF control={control} name="tecnologias_utilizadas" label="Tecnologías Utilizadas *" placeholder="Ej: React Native, Node.js..."
        rules={{
          required: "Especifica las tecnologías",
          minLength: { value: 3, message: "Mínimo 3 caracteres" },
          maxLength: { value: 200, message: "Máximo 200 caracteres" }
        }} />

      <CampoRHF control={control} name="fecha_inicio" label="Fecha de Inicio * (AAAA-MM-DD)" placeholder="Ej: 2025-03-01"
        rules={{
          required: "La fecha de inicio es obligatoria",
          pattern: { value: /^\d{4}-\d{2}-\d{2}$/, message: "Formato inválido. Usa AAAA-MM-DD" },
          validate: validarFechaInicio
        }} />

      <CampoRHF control={control} name="fecha_fin" label="Fecha de Fin (AAAA-MM-DD)" placeholder="Ej: 2025-12-31"
        rules={{
          pattern: { value: /^\d{4}-\d{2}-\d{2}$/, message: "Formato inválido. Usa AAAA-MM-DD" },
          validate: (v: string) => {
            if (!v) return true;
            const anio = parseInt(v.split('-')[0], 10);
            if (anio < ANIO_MINIMO) return `El año debe ser ${ANIO_MINIMO} o posterior`;
            if (anio > ANIO_MAXIMO + 2) return `El año no puede ser mayor a ${ANIO_MAXIMO + 2}`;
            return true;
          }
        }} />

      <CampoRHF control={control} name="repositorio_github" label="Repositorio GitHub" placeholder="https://github.com/..." keyboardType="url"
        rules={{
          pattern: { value: /^https?:\/\/.+/, message: "Debe ser una URL válida (http/https)" }
        }} />

      {/* =====================================================================
          📦 [STORAGE-07] UI DEL BOTÓN PARA SELECCIONAR EL PDF
          ===================================================================== */}
      <View style={styles.campoContenedor}>
        <Text style={styles.etiqueta}>Documento del Proyecto (Opcional - Solo PDF)</Text>
        <TouchableOpacity style={styles.botonArchivo} onPress={seleccionarDocumento}>
          <Ionicons name="document-attach-outline" size={24} color={Colors.primary.main} />
          <Text style={styles.textoArchivo} numberOfLines={1} ellipsizeMode="tail">
            {archivoPDF ? archivoPDF.name : (proyectoEditar?.documento_url ? 'PDF Actual (Toca para cambiar)' : 'Seleccionar Archivo PDF')}
          </Text>
        </TouchableOpacity>
        {archivoPDF && (
          <Text style={styles.pesoArchivo}>Tamaño: {(archivoPDF.size || 0) / 1000} KB</Text>
        )}
      </View>

      {/* 5. Custom Controller para los botones de estado */}
      <Controller
        control={control}
        name="estado"
        render={({ field: { onChange, value } }) => (
          <View style={styles.campoContenedor}>
            <Text style={styles.etiqueta}>Estado del Proyecto</Text>
            <View style={styles.estadoContenedor}>
              {ESTADOS.map(est => (
                <TouchableOpacity
                  key={est}
                  style={[styles.estadoBoton, value === est && styles.estadoBotonActivo]}
                  onPress={() => onChange(est)} // Actualiza el estado en RHF
                >
                  <Text style={[styles.estadoTexto, value === est && styles.estadoTextoActivo]}>{est}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}
      />

      {/* =====================================================================
          🌟 [EXTRA-06] INTEGRAR EVENTOS DE PRESIÓN EN EL BOTÓN ANIMADO
          ===================================================================== */}
      <AnimatedTouchableOpacity 
        style={[
          styles.botonGuardar, 
          cargando && styles.botonDeshabilitado,
          animatedButtonStyle // <-- Se inyecta la escala animada
        ]} 
        onPress={handleSubmit(onSubmit)}
        onPressIn={() => {
          // Al presionar, se encoge al 95% de su tamaño con un resorte rápido
          buttonScale.value = withSpring(0.97, { damping: 15, stiffness: 300 });
        }}
        onPressOut={() => {
          // Al soltar, regresa a su tamaño original rebotando sutilmente
          buttonScale.value = withSpring(1, { damping: 10, stiffness: 300 });
        }}
        disabled={cargando}
        // Desactivamos la opacidad nativa para que la animación destaque más
        activeOpacity={1} 
      >
        {cargando ? <ActivityIndicator color="#fff" /> : <Text style={styles.botonTexto}>{esEdicion ? "Guardar Cambios" : "Registrar Proyecto"}</Text>}
      </AnimatedTouchableOpacity>
    </ScrollView>
  );
}

// ── ESTILOS ──────────────────────────────────────────────────
const styles = StyleSheet.create({
  contenedor: { flex: 1, backgroundColor: Colors.background },
  scroll: { padding: 20, paddingBottom: 40 },
  titulo: { fontSize: 22, fontWeight: '700', color: Colors.navy, marginBottom: 4 },
  subtitulo: { fontSize: 13, color: Colors.gray[500], marginBottom: 24 },
  campoContenedor: { marginBottom: 16 },
  etiqueta: { fontSize: 13, fontWeight: '600', color: Colors.gray[700], marginBottom: 6 },
  input: { backgroundColor: Colors.white, borderWidth: 1, borderColor: Colors.gray[300], borderRadius: 8, paddingHorizontal: 14, paddingVertical: Platform.OS === 'ios' ? 12 : 10, fontSize: 15, color: '#1A1A1A' },
  inputMultiline: { height: 80, textAlignVertical: 'top', paddingTop: 10 },
  inputError: { borderColor: Colors.danger, borderWidth: 1.5 },
  textoError: { color: Colors.danger, fontSize: 12, marginTop: 4 },
  estadoContenedor: { flexDirection: 'row', gap: 10 },
  estadoBoton: { flex: 1, paddingVertical: 10, borderRadius: 8, borderWidth: 1, borderColor: Colors.gray[300], backgroundColor: Colors.white, alignItems: 'center' },
  estadoBotonActivo: { backgroundColor: Colors.primary.light, borderColor: Colors.primary.light },
  estadoTexto: { fontSize: 13, color: Colors.gray[600] },
  estadoTextoActivo: { color: Colors.white, fontWeight: '700' },
  botonGuardar: { backgroundColor: Colors.primary.main, borderRadius: 10, paddingVertical: 16, alignItems: 'center', marginTop: 10 },
  botonDeshabilitado: { opacity: 0.6 },
  botonTexto: { color: Colors.white, fontSize: 16, fontWeight: '700' },
  botonArchivo: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.white, borderWidth: 1, borderColor: Colors.primary.light, borderStyle: 'dashed', borderRadius: 8, paddingHorizontal: 14, paddingVertical: Platform.OS === 'ios' ? 12 : 10, gap: 10 },
  textoArchivo: { fontSize: 15, color: Colors.primary.main, flex: 1, fontWeight: '500' },
  pesoArchivo: { fontSize: 12, color: Colors.gray[500], marginTop: 4, fontStyle: 'italic' }
});

================================================
📄 ARCHIVO: src\pages\editar-proyecto\ui\EditarScreen.tsx
================================================

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

================================================
📄 ARCHIVO: src\pages\home\ui\HomeScreen.tsx
================================================

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

================================================
📄 ARCHIVO: src\pages\login\ui\LoginScreen.tsx
================================================

import React, { useState } from 'react';
import { 
  View, Text, TextInput, TouchableOpacity, 
  StyleSheet, Alert, ActivityIndicator, Image 
} from 'react-native';
import { supabase } from '@shared/api/supabase';
import { Colors } from '@shared/ui/Colors';

export function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // =====================================================================
  // 🚨 [AUTH-04] FUNCIÓN PARA PROCESAR EL INICIO DE SESIÓN EN SUPABASE
  // =====================================================================
  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Por favor ingresa correo y contraseña.');
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password: password,
    });
    setLoading(false);

    if (error) {
      Alert.alert('Error de Autenticación', error.message);
    }
  };

  return (
    <View style={styles.contenedor}>
      <View style={styles.formularioContainer}>
        <Text style={styles.titulo}>Acceso Seguro</Text>
        <Text style={styles.subtitulo}>Gestión de Proyectos ESFOT</Text>

        {/* =====================================================================
            🚨 [AUTH-05] CAMPOS DE ENTRADA PARA CREDENCIALES
            ===================================================================== */}
        <View style={styles.campoContenedor}>
          <Text style={styles.etiqueta}>Correo Electrónico</Text>
          <TextInput
            style={styles.input}
            placeholder="estudiante@epn.edu.ec"
            placeholderTextColor={Colors.gray[400]}
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />
        </View>

        <View style={styles.campoContenedor}>
          <Text style={styles.etiqueta}>Contraseña</Text>
          <TextInput
            style={styles.input}
            placeholder="••••••••"
            placeholderTextColor={Colors.gray[400]}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        </View>

        {/* =====================================================================
            🚨 [AUTH-06] BOTÓN DE EJECUCIÓN DE LOGIN
            ===================================================================== */}
        <TouchableOpacity 
          style={[styles.boton, loading && styles.botonDeshabilitado]} 
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color={Colors.white} />
          ) : (
            <Text style={styles.botonTexto}>Iniciar Sesión</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: { flex: 1, backgroundColor: Colors.background, justifyContent: 'center', padding: 20 },
  formularioContainer: { backgroundColor: Colors.white, padding: 24, borderRadius: 16, shadowColor: Colors.navy, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 2 },
  titulo: { fontSize: 24, fontWeight: '800', color: Colors.navy, textAlign: 'center' },
  subtitulo: { fontSize: 14, color: Colors.primary.main, textAlign: 'center', marginBottom: 30, fontWeight: '600' },
  campoContenedor: { marginBottom: 20 },
  etiqueta: { fontSize: 13, fontWeight: '600', color: Colors.gray[700], marginBottom: 8 },
  input: { backgroundColor: Colors.inputBg, borderRadius: 10, paddingHorizontal: 16, paddingVertical: 14, fontSize: 15, color: '#1A1A1A' },
  boton: { backgroundColor: Colors.primary.main, paddingVertical: 16, borderRadius: 10, alignItems: 'center', marginTop: 10 },
  botonDeshabilitado: { opacity: 0.7 },
  botonTexto: { color: Colors.white, fontSize: 16, fontWeight: '700' },
});

================================================
📄 ARCHIVO: src\pages\proyecto-detalle\index.ts
================================================

export * from './ui/ProyectoDetalleScreen'; 
export * from './ui/EditarScreen';

================================================
📄 ARCHIVO: src\pages\proyecto-detalle\ui\ProyectoDetalleScreen.tsx
================================================

import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { useLocalSearchParams, Stack, useRouter } from 'expo-router';
import { proyectoApi } from '@entities/proyecto-tesis/api/proyectoApi';
import type { ProyectoTesis } from '@entities/proyecto-tesis/model/types';
import { Colors, getEstadoColor } from '@shared/ui/Colors';
import { Ionicons } from '@expo/vector-icons';

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

  // =====================================================================
  // 📦 [STORAGE-09] FUNCIÓN PARA ABRIR EL PDF EN EL NAVEGADOR
  // =====================================================================
  const abrirPDF = () => {
    if (proyecto?.documento_url) Linking.openURL(proyecto.documento_url);
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

        {/* =====================================================================
            📦 [STORAGE-10] UI DEL BOTÓN PARA ABRIR EL DOCUMENTO PDF
            ===================================================================== */}
        {proyecto.documento_url && (
          <TouchableOpacity style={styles.botonPdf} onPress={abrirPDF}>
            <Ionicons name="document-text" size={20} color={Colors.white} />
            <Text style={styles.botonGitTexto}>Ver Documento PDF</Text>
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
  botonPdf: { flexDirection: 'row', gap: 8, marginTop: 12, backgroundColor: '#d32f2f', paddingVertical: 14, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
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
📄 ARCHIVO: src\shared\auth\AuthContext.tsx
================================================

import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '../api/supabase';

// =====================================================================
// 🚨 [AUTH-01] DEFINICIÓN DE TIPOS PARA EL CONTEXTO DE AUTENTICACIÓN
// =====================================================================
type AuthContextType = {
  session: Session | null;
  user: User | null;
  isLoading: boolean;
};

const AuthContext = createContext<AuthContextType>({
  session: null,
  user: null,
  isLoading: true,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // =====================================================================
    // 🚨 [AUTH-02] OBTENCIÓN DE SESIÓN INICIAL AL ABRIR LA APP
    // =====================================================================
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setIsLoading(false);
    });

    // =====================================================================
    // 🚨 [AUTH-03] SUSCRIPCIÓN A CAMBIOS DE ESTADO (LOGIN/LOGOUT)
    // =====================================================================
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setIsLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ session, user, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

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
📄 ARCHIVO: src\shared\ui\Colors.ts
================================================

export const Colors = {
  primary: {
    main: '#3c8dbc',
    light: '#80b5d3',
    dark: '#357ca5',
  },
  danger: '#f56954',
  success: '#00a65a',
  warning: '#f39c12',
  info: '#00c0ef',
  navy: '#001F3F',
  background: '#f4f6f9',
  inputBg: '#e2e4e9',
  white: '#ffffff',
  gray: {
    100: '#f5f7fa',
    200: '#e2e4e9',
    300: '#DDE2E8',
    400: '#999',
    500: '#666',
    600: '#555',
    700: '#444',
  },
} as const;

export const getEstadoColor = (estado: string): string => {
  switch (estado) {
    case 'En Progreso':
      return Colors.info;
    case 'Completado':
      return Colors.success;
    case 'Suspendido':
      return Colors.warning;
    default:
      return Colors.primary.main;
  }
};

================================================
📄 ARCHIVO: src\widgets\lista-proyectos\ui\ListaProyectos.tsx
================================================

import { proyectoApi } from "@entities/proyecto-tesis/api/proyectoApi";
import type { ProyectoTesis } from "@entities/proyecto-tesis/model/types";
import { ProyectoCard } from "../../proyecto-card/ProyectoCard";
import { useFocusEffect } from "expo-router";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { ActivityIndicator, StyleSheet, Text } from "react-native";
// =====================================================================
// 🐛 [FIX-02] IMPORTAMOS ANIMATED Y LAS CURVAS DE ACELERACIÓN
// =====================================================================
import Animated, { CurvedTransition, Easing } from 'react-native-reanimated';

interface Props {
  searchQuery?: string;
}

export function ListaProyectos({ searchQuery = "" }: Props) {
  const [proyectos, setProyectos] = useState<ProyectoTesis[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const primeraEntrada = useRef(true);

  // 🐛 [FIX-03] Ajustamos la función para que reciba el query exacto en cada tecla
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

  // Efecto que reacciona limpiamente cada vez que escribes en el buscador
  useEffect(() => {
    cargarProyectos(searchQuery, false);
  }, [searchQuery, cargarProyectos]);

  // Efecto que recarga silenciosamente cuando vuelves a esta pantalla desde otra pestaña
  useFocusEffect(
    useCallback(() => {
      if (primeraEntrada.current) {
        primeraEntrada.current = false;
        return;
      }
      cargarProyectos(searchQuery, true);
    }, [cargarProyectos, searchQuery]),
  );

  // 🐛 [FIX-04] Prevención de parpadeos: Solo mostramos el spinner inicial
  if (cargando && proyectos.length === 0) return <ActivityIndicator size="large" color="#1A3A5C" style={styles.centro} />;
  if (error) return <Text style={styles.error}>Error al cargar proyectos: {error}</Text>;
  
  if (proyectos.length === 0 && !cargando) return <Text style={styles.vacio}>{searchQuery.trim() !== "" ? "No se encontraron proyectos con esa búsqueda." : "No hay proyectos registrados aún."}</Text>;

  return (
    // =====================================================================
    // 🐛 [FIX-05] IMPLEMENTACIÓN DE LA LISTA ANIMADA NATIVA
    // =====================================================================
    <Animated.FlatList
      data={proyectos}
      keyExtractor={(p) => p.id}
      // Esta es la propiedad clave que aplicará la curva a todas las tarjetas filtradas
      itemLayoutAnimation={CurvedTransition.duration(400).easingX(Easing.inOut(Easing.ease)).easingY(Easing.inOut(Easing.ease))}
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

================================================
📄 ARCHIVO: src\widgets\proyecto-card\ProyectoCard.tsx
================================================

import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import type { ProyectoTesis } from '@entities/proyecto-tesis/model/types';
import { useRouter } from 'expo-router';
import { proyectoApi } from '@entities/proyecto-tesis/api/proyectoApi';
import { Colors, getEstadoColor } from '@shared/ui/Colors';

// =====================================================================
// 🎨 [ANIMATION-03] IMPORTACIÓN DE COMPONENTES REANIMADOS
// =====================================================================
// =====================================================================
// 🌟 [EXTRA-08] CAMBIAR LINEARTRANSITION POR CURVEDTRANSITION (O JUMPINGTRANSITION)
// También importamos 'Easing' para darle una curva de aceleración elegante.
// =====================================================================
import Animated, { FadeInDown } from 'react-native-reanimated';



// Se crea una versión animada del TouchableOpacity para no perder la función de botón
const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

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
    // =====================================================================
    // 🎨 [ANIMATION-04] APLICACIÓN DE ENTERING ANIMATION Y UNIWIND
    // Se utiliza FadeInDown con configuración de resortes (springify) para un efecto fluido.
    // También se inyecta className="mb-3" de Uniwind para demostrar su integración.
    // =====================================================================
    <AnimatedTouchableOpacity 
      entering={FadeInDown.duration(400).springify().damping(50)}
      // =====================================================================
      // 🌟 [EXTRA-02] APLICAR TRANSICIÓN DE LAYOUT
      // Cuando la lista cambie (al buscar o eliminar), las tarjetas se
      // reacomodarán con una física de resorte (springify) muy natural.
      // =====================================================================
      className="mb-3"
      style={styles.tarjeta} 
      onPress={irAlDetalle} 
      activeOpacity={0.7} 
      disabled={eliminando}
    >
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
    </AnimatedTouchableOpacity>
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
