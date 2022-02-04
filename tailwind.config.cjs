module.exports = {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      colors: {
        'rxdb-midnight-blue': '#1A202C',
        'rxdb-midnight-dark': '#171923',
        'rxdb-pink': '#E6008D',
        'rxdb-fuchsia': '#8D2089',
        'rxdb-purple': '#5F2688',

      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}
