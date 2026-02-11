# Branding and Customization

This app is a customized Spacebar client for a single private server. You can personalize it with your own branding.

## Quick Branding Changes

### App title and meta
Edit `client/index.html`:
- `<title>` - Browser tab and bookmark name
- `<meta name="title">` - Share preview title
- `<meta name="description">` - Share preview description

### Logo and favicon
Replace these files in `client/public/` (or equivalent assets):
- `favicon.ico` - Browser tab icon
- `logo192.png` - PWA / mobile home screen icon
- `Spacebar.png` - Open Graph / social share image

### Theme colors
Theme variables are defined in `client/src/contexts/Theme.tsx`. You can:
- Adjust `--primary`, `--primaryLight`, `--primaryDark` for accent color
- Edit the light/dark theme palettes
- Use `ThemeStore` and user settings for runtime theme switching

### Login / Register pages
- `client/src/pages/LoginPage.tsx` and `RegistrationPage.tsx` contain the auth UI
- Add your logo or tagline there for a branded login experience

## Server branding
- In Spacebar server config, set `general.serverName` and `general.frontPage` to match your domain
- Customize the default guild name and icon after creating your primary server
