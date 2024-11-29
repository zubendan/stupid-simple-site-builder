import { MantineColorsTuple, MantineThemeOverride } from '@mantine/core';

const skyfall: MantineColorsTuple = [
  '#ecf3ff',
  '#dae2f8',
  '#b5c3e7',
  '#8da1d7',
  '#6b85c9',
  '#5673c1',
  '#4a69bf',
  '#3a59a9',
  '#314f98',
  '#244488',
];

export const mantineTheme: MantineThemeOverride = {
  primaryColor: 'skyfall',
  colors: {
    skyfall,
  },
};
