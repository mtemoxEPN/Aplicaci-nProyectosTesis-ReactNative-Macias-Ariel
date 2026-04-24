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

// 1. Reescribimos nuestro <Campo> para que use el <Controller> de React Hook Form
const CampoRHF = ({ control, name, label, placeholder, rules, multiline = false, keyboardType = 'default' }: any) => (
  <Controller
    control={control}
    name={name}
    rules={rules}
    render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
      <View style={styles.campoContenedor}>
        <Text style={styles.etiqueta}>{label}</Text>
        <TextInput
          style={[
            styles.input,
            multiline && styles.inputMultiline,
            error ? styles.inputError : null,
          ]}
          placeholder={placeholder}
          placeholderTextColor="#999"
          onBlur={onBlur}
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

export function RegistroProyectoForm({ onSuccess, proyectoEditar }: Props) {
  const esEdicion = !!proyectoEditar;
  const [cargando, setCargando] = useState(false);

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
      if (esEdicion) {
        await proyectoApi.update(proyectoEditar.id, data);
        Alert.alert('¡Éxito!', 'Proyecto actualizado correctamente.', [
          { text: 'OK', onPress: () => onSuccess?.() }
        ]);
      } else {
        await createProyecto(data);
        Alert.alert('¡Éxito!', 'Proyecto registrado correctamente.', [
          { text: 'OK', onPress: () => { reset(FORM_INICIAL); onSuccess?.(); } }
        ]);
      }
    } catch {
      Alert.alert('Error', 'No se pudo guardar la información. Verifica tu conexión.');
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
          validate: { soloLetras: (v: string) => {
            const nombres = v.split(',').map(n => n.trim());
            return nombres.every(n => SOLO_LETRAS_REGEX.test(n) && n.length > 0) || 'Solo letras en nombres';
          }}
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

      <TouchableOpacity 
        style={[styles.botonGuardar, cargando && styles.botonDeshabilitado]} 
        onPress={handleSubmit(onSubmit)} // <-- RHF intercepta y valida antes de llamar a onSubmit
        disabled={cargando}
      >
        {cargando ? <ActivityIndicator color="#fff" /> : <Text style={styles.botonTexto}>{esEdicion ? "Guardar Cambios" : "Registrar Proyecto"}</Text>}
      </TouchableOpacity>
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
});