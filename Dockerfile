# Etapa de construcción
FROM node:22-slim AS build

# Instalar dependencias del sistema necesarias
RUN apt-get update && apt-get install -y git && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copiar archivos de dependencias
COPY package.json package-lock.json ./

# Instalar dependencias
RUN npm ci

# Copiar código fuente
COPY . .

# Construir la aplicación
RUN npm run build

# Etapa de producción
FROM nginx:1.25-alpine AS runtime

# Instalar bash para el script de entrada
RUN apk add --no-cache bash

# Copiar archivos construidos
COPY --from=build /app/dist /usr/share/nginx/html

# Copiar configuración personalizada de Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copiar script de entrada
COPY entrypoint.sh /entrypoint.sh

# Hacer el script ejecutable
RUN chmod +x /entrypoint.sh

# Exponer puerto
EXPOSE 80

# Variables de entorno por defecto
ENV VITE_API_URL=http://localhost:3000/api
ENV VITE_APP_TITLE=Potentes
ENV VITE_APP_VERSION=1.0.0
ENV VITE_DEBUG=false

# Usar script de entrada personalizado
ENTRYPOINT ["/entrypoint.sh"]
