#!/bin/sh

# Script de entrada para inyectar variables de entorno en tiempo de ejecución
# Esto permite configurar la aplicación sin reconstruir la imagen

echo "Iniciando aplicación con variables de entorno..."

# Crear el archivo de configuración de entorno
cat > /usr/share/nginx/html/env-config.js << EOF
window._env_ = {
  VITE_API_URL: "${VITE_API_URL:-http://localhost:3000/api}",
  VITE_APP_TITLE: "${VITE_APP_TITLE:-Potentes Store}",
  VITE_APP_VERSION: "${VITE_APP_VERSION:-1.0.0}",
  VITE_DEBUG: "${VITE_DEBUG:-false}"
};
EOF

echo "Variables de entorno configuradas:"
echo "VITE_API_URL: ${VITE_API_URL:-http://localhost:3000/api}"
echo "VITE_APP_TITLE: ${VITE_APP_TITLE:-Potentes Store}"
echo "VITE_APP_VERSION: ${VITE_APP_VERSION:-1.0.0}"
echo "VITE_DEBUG: ${VITE_DEBUG:-false}"

# Iniciar Nginx
echo "Iniciando servidor Nginx..."
exec nginx -g "daemon off;"
