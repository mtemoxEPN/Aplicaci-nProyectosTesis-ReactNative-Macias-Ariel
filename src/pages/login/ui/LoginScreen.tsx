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