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