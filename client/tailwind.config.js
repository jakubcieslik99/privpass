export default {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    container: { center: true },
    extend: {
      colors: {
        'privpass-100': '#9efff7',
        'privpass-200': '#42e8df',

        'privpass-300': '#cbcaf8',
        'privpass-400': '#364392',
        'privpass-500': '#342684',
        'privpass-600': '#231169',
      },
    },
  },
  variants: { opacity: ({ after }) => after(['disabled']) },
  plugins: [],
}
