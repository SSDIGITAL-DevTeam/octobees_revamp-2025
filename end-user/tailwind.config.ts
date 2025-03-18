import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/pages/**/*.{js,ts,jsx,tsx,mdx}', './src/components/**/*.{js,ts,jsx,tsx,mdx}', './src/app/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      fontFamily: {
        heading: ['Lora', 'serif'],
        body: ['Lato', 'sans-serif'],
        openSans: ['Open Sans', 'sans-serif'],
        Josefin: ['Josefin Sans', 'sans-serif'],
        jakartaSans: ['Plus Jakarta Sans', 'sans-serif'],
      },
      colors: {
        merah: {
					'200' : "#dc8a8f",
					'300' : "#cc545c",
					'500' : "#b3000b",
					'700' : "#7f0008"
				},
        primary: '#B3000B',
        secondary: '#6E6E6E',
        tertiary: '#F2EDE6',
        light: '#FFFDFA',
        dark: '#1D1D1D',
      },
      container: {
        center: true,
        padding: '1.5rem',
        screens: {
          sm: '640px',
          md: '768px',
          lg: '1024px',
          xl: '1240px',
          '2xl': '1400px',
        },
      },
      keyframes: {
        'slide-up': {
          '0%': { transform: 'translateY(100%)' },
          '100%': { transform: 'translateY(0)' },
        },
        'slide-down': {
          '0%': { transform: 'translateY(0)' },
          '100%': { transform: 'translateY(100%)' },
        },
      },
      animation: {
        'slide-up': 'slide-up 0.3s ease-out',
        'slide-down': 'slide-down 0.3s ease-out',
      },
      screens: {
        '2sm': '425px',
        '2xl': '1920px',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};
export default config;
