import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'dark-0': 'rgb(0, 0, 0)',
        'dark-1': 'rgb(5, 5, 5)',
        'dark-2': 'rgb(18, 18, 18)',
        'dark-3': 'rgb(44, 44, 44)',
        'dark-4': 'rgb(56, 56, 56)',
      },
      borderRadius: {
        half: '50%',
      },
      borderColor: ({ theme }) => ({
        ...theme('colors'),
      }),
    },
  },
  plugins: [],
};
export default config;
