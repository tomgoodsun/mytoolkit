# mytoolkit

> Developer tools collection built with Vue 3 + Vite

A collection of convenient web development tools including beautifiers, generators, and utilities.

## Features

- 🎨 Code Beautifiers (HTML, CSS, JavaScript, JSON, SQL)
- 🔐 Password & Htpasswd Generator
- 📊 QR Code Reader
- 🖼️ Image Data URI Scheme Generator
- 🗄️ Database Initial SQL Creator
- 🌍 World Clock
- ⚡ Fast development with Vite
- 🎯 Vue 3 Composition API

## Tech Stack

- Vue 3
- Vite
- Vue Router
- Bootstrap 5 + bootstrap-vue-next
- Luxon (DateTime)
- js-beautify
- secure-random-password
- And more...

## Development Setup

```bash
# Install dependencies
npm install

# Start development server at localhost:8080
npm run dev

# Build for production
npm run build

# Build for development (with sourcemap)
npm run build:dev

# Preview production build
npm run preview

# Lint code
npm run lint
```

## Environment Variables

Create `.env.local` or `.env.production.local` files to override default settings:

```bash
VITE_APP_HTPASSWD_API=https://your-api-endpoint.com/htpasswd.php
VITE_APP_FEED_API=https://your-api-endpoint.com/feed.php
```

## Deployment

1. Build for production:
   ```bash
   npm run build:prod
   ```

2. Upload the `dist/` folder contents to your server

3. Configure your web server for SPA routing (see below)

### Apache (.htaccess)

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>
```

### Nginx

```nginx
location / {
  try_files $uri $uri/ /index.html;
}
```

## Project Structure

```
mytoolkit/
├── src/
│   ├── components/     # Vue components
│   ├── libraries/      # Utility libraries
│   ├── router/         # Vue Router configuration
│   ├── App.vue         # Root component
│   └── main.js         # Entry point
├── public/             # Static assets
├── dist/               # Production build output
├── .env.development    # Development environment variables
├── .env.production     # Production environment variables
├── vite.config.js      # Vite configuration
└── package.json        # Dependencies and scripts
```

## Browser Support

- Modern browsers (ES2015+)
- Chrome, Firefox, Safari, Edge

## License

Private

## Author

Tom Goodsun
