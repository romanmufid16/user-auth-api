module.exports = {
  parser: '@typescript-eslint/parser', // Menentukan parser untuk ESLint
  parserOptions: {
    ecmaVersion: 2020, // Menggunakan ECMAScript terbaru
    sourceType: 'module', // Menggunakan modul ES
  },
  extends: [
    'eslint:recommended', // Menggunakan aturan dasar ESLint
    'plugin:@typescript-eslint/recommended', // Menggunakan aturan yang direkomendasikan untuk TypeScript
  ],
  rules: {
    // Aturan tambahan atau override dapat ditambahkan di sini
    '@typescript-eslint/no-explicit-any': 'off', // Contoh menonaktifkan aturan tertentu
  },
  env: {
    node: true, // Mengatur lingkungan Node.js
    es6: true, // Mengatur lingkungan ECMAScript 6
  },
};