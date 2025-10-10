/**
 * Configuración de Jest para Pruebas
 * UAPA Smartphones - Proyecto Final Software Libre
 */

module.exports = {
    // Entorno de pruebas
    testEnvironment: 'node',

    // Patrón de archivos de prueba
    testMatch: [
        '**/tests/**/*.test.js',
        '**/__tests__/**/*.js'
    ],

    // Archivos a ignorar
    testPathIgnorePatterns: [
        '/node_modules/',
        '/public/',
        '/scripts/'
    ],

    // Cobertura de código
    collectCoverageFrom: [
        'src/**/*.js',
        '!src/public/**',
        '!src/database/**'
    ],

    // Directorio de cobertura
    coverageDirectory: 'coverage',

    // Reportes de cobertura
    coverageReporters: [
        'text',
        'lcov',
        'html'
    ],

    // Timeout para pruebas (10 segundos)
    testTimeout: 10000,

    // Verbose output
    verbose: true,

    // Configuración de módulos
    moduleFileExtensions: ['js', 'json', 'node'],

    // Variables de entorno para pruebas
    testEnvironmentOptions: {
        NODE_ENV: 'test'
    }
};

