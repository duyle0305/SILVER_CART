import '@mui/material/styles'

declare module '@mui/material/styles' {
  interface PaletteColor {
    '100'?: string
    '200'?: string
    '300'?: string
    '400'?: string
    '500'?: string
    '600'?: string
    '700'?: string
    '800'?: string
    '900'?: string
  }

  interface Palette {
    red: PaletteColor
    yellow: PaletteColor
    green: PaletteColor
  }

  interface PaletteOptions {
    red?: PaletteColorOptions
    yellow?: PaletteColorOptions
    green?: PaletteColorOptions
  }

  interface PaletteColorOptions {
    '100'?: string
    '200'?: string
    '300'?: string
    '400'?: string
    '500'?: string
    '600'?: string
    '700'?: string
    '800'?: string
    '900'?: string
  }
}
