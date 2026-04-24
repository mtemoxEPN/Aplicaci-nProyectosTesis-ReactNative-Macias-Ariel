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