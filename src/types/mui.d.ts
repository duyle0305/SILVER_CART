import '@mui/material/styles';

declare module '@mui/material/styles' {
  interface Palette {
    red: Palette['primary'];
    yellow: Palette['primary'];
    green: Palette['primary'];
  }

  interface PaletteOptions {
    red?: PaletteOptions['primary'];
    yellow?: PaletteOptions['primary'];
    green?: PaletteOptions['primary'];
  }
}