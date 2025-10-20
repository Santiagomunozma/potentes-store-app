# Docker Setup - Potentes Store Frontend

## Problemas Solucionados

### 1. Enrutamiento de Páginas

- **Problema**: Las páginas no cargaban correctamente al navegar directamente a URLs
- **Solución**: Configuración de Nginx para SPA (Single Page Application) que redirige todas las rutas a `index.html`

### 2. Variables de Entorno

- **Problema**: Las variables de entorno no se tomaban en tiempo de ejecución
- **Solución**: Script de entrada que inyecta variables de entorno dinámicamente sin reconstruir la imagen

## Archivos Creados/Modificados

- `Dockerfile` - Dockerfile mejorado con soporte para SPA y variables de entorno
- `nginx.conf` - Configuración personalizada de Nginx para SPA
- `entrypoint.sh` - Script de entrada para inyectar variables de entorno
- `docker-compose.yml` - Archivo de composición para facilitar el uso
- `src/.dockerignore` - Archivo de exclusión optimizado
- `index.html` - Modificado para cargar variables de entorno dinámicamente
- `src/utils/api.ts` - Modificado para usar variables de entorno dinámicas

## Uso

### Construcción y Ejecución Básica

```bash
# Construir la imagen
docker build -t potentes-frontend .

# Ejecutar el contenedor
docker run -p 3000:80 \
  -e VITE_API_URL=http://tu-backend:8000/api \
  -e VITE_APP_TITLE="Mi Tienda" \
  potentes-frontend
```

### Usando Docker Compose

```bash
# Ejecutar con docker-compose
docker-compose up -d

# Ver logs
docker-compose logs -f

# Detener
docker-compose down
```

### Variables de Entorno Disponibles

- `VITE_API_URL` - URL del backend API (default: http://localhost:3000/api)
- `VITE_APP_TITLE` - Título de la aplicación (default: Potentes Store)
- `VITE_APP_VERSION` - Versión de la aplicación (default: 1.0.0)
- `VITE_DEBUG` - Modo debug (default: false)

## Características

### ✅ Enrutamiento SPA

- Todas las rutas se redirigen correctamente a `index.html`
- Navegación directa a URLs funciona correctamente
- Soporte para React Router

### ✅ Variables de Entorno Dinámicas

- Configuración en tiempo de ejecución sin reconstruir
- Fallback a variables de construcción si no están disponibles
- Soporte para múltiples entornos

### ✅ Optimizaciones

- Compresión gzip habilitada
- Cache headers para archivos estáticos
- Headers de seguridad configurados
- Imagen multi-stage para tamaño optimizado

### ✅ Configuración de Nginx

- Configuración personalizada para SPA
- Headers CORS configurados
- Compresión y cache optimizados
- Headers de seguridad

## Troubleshooting

### Si las páginas no cargan

1. Verifica que estés usando la configuración de Nginx personalizada
2. Asegúrate de que el script de entrada se ejecute correctamente
3. Revisa los logs del contenedor: `docker logs <container_id>`

### Si las variables de entorno no funcionan

1. Verifica que estén definidas en el comando `docker run` o `docker-compose.yml`
2. Revisa que el script `entrypoint.sh` se ejecute correctamente
3. Verifica en el navegador que `window._env_` esté disponible

### Para desarrollo local

```bash
# Ejecutar en modo desarrollo
npm run dev

# Construir para producción
npm run build
npm run preview
```
