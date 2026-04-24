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