module.exports = {
  theme: {
    extend: {
      colors: {
        dark: {
          900: '#0f172a', // Fondo principal muy oscuro (Slate 900)
          800: '#1e293b', // Fondo de tarjetas (Slate 800)
        },
        brand: {
          500: '#3b82f6', // Azul eléctrico principal
          600: '#2563eb', // Azul hover
          glow: 'rgba(59, 130, 246, 0.5)' // Para sombras brillantes
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'], // Tipografía moderna
      }
    },
  },
  plugins: [],
}