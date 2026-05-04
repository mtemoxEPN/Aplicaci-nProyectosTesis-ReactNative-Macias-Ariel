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