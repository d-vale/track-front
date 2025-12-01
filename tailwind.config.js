/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        noir: 'var(--noir)',
        orange: 'var(--orange)',
        base: 'var(--base)',
        'gris-clair': 'var(--gris-clair)',
        'gris-fonce': 'var(--gris-fonce)',
        'separation-grise': 'var(--separation-grise)',
      },
      borderColor: {
        separation: 'var(--separation-grise-opacity)',
      },
      fontFamily: {
        inter: 'var(--font-family)',
      },
    },
  },
  plugins: [],
}
