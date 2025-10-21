# Configuración de Docker en Jenkins

Este documento describe cómo configurar Jenkins para usar Docker mediante DooD (Docker-outside-of-Docker).

## Prerrequisitos

- Docker instalado en el host
- Acceso al servidor donde corre Jenkins
- Permisos para ejecutar comandos Docker

## Método Recomendado: Sin Borrar el Contenedor

### Paso 1: Verificar el Contenedor Jenkins Actual

```powershell
# En Windows PowerShell
docker ps -a | findstr jenkins

# Ver la configuración actual
docker inspect jenkins
```

### Paso 2: Crear un Script de Commit y Recreación

El contenedor debe recrearse para agregar los montajes del socket Docker, pero SIN perder datos:

```powershell
# 1. Detener el contenedor (los datos permanecen en el volumen)
docker stop jenkins

# 2. Ver los volúmenes y configuración actual
docker inspect jenkins

# 3. Obtener el ID de la imagen actual
docker commit jenkins jenkins-backup

# 4. Eliminar el contenedor (NO elimina los datos del volumen)
docker rm jenkins

# 5. Recrear con el socket Docker montado
docker run -d `
  --name jenkins `
  -p 8080:8080 `
  -p 50000:50000 `
  -v jenkins_home:/var/jenkins_home `
  -v //var/run/docker.sock:/var/run/docker.sock `
  --restart unless-stopped `
  jenkins/jenkins:lts
```

**Nota para Windows:** Usa `//var/run/docker.sock` (doble barra) en lugar de `/var/run/docker.sock`

### Paso 3: Instalar Docker CLI dentro del Contenedor Jenkins

Como en Windows no podemos montar el binario de Docker, lo instalamos dentro del contenedor:

```powershell
# Instalar Docker CLI dentro del contenedor Jenkins
docker exec -u root jenkins sh -c "apt-get update && apt-get install -y docker.io"

# O usar el método más ligero con el binario estático:
docker exec -u root jenkins sh -c "curl -fsSL https://download.docker.com/linux/static/stable/x86_64/docker-20.10.9.tgz | tar xz --strip-components=1 -C /usr/local/bin docker/docker"
```

### Paso 4: Dar Permisos al Socket Docker (SIMPLE)

```powershell
# Método simple para Windows
docker exec -u root jenkins chmod 666 /var/run/docker.sock
```

### Paso 5: Verificar que Docker Funcione

```powershell
docker exec jenkins docker --version
docker exec jenkins docker info
```

## 🚀 Método Rápido: Script Automatizado (Windows)

Hemos creado un script que hace todo automáticamente:

```powershell
# Ejecutar el script
.\configure-jenkins-docker.ps1
```

El script:

- ✅ Crea un backup automático
- ✅ Detiene Jenkins sin perder datos
- ✅ Recrea el contenedor con Docker
- ✅ Instala Docker CLI
- ✅ Configura permisos
- ✅ Verifica que todo funcione

## Método Manual: Comandos para Windows (PowerShell)

Si prefieres hacerlo manualmente, copia y pega estos comandos uno por uno:

```powershell
# 1. Detener Jenkins (NO se pierden datos)
docker stop jenkins

# 2. Crear backup de la imagen actual (opcional pero recomendado)
docker commit jenkins jenkins-backup

# 3. Eliminar el contenedor (los datos persisten en el volumen)
docker rm jenkins

# 4. Recrear con socket Docker
docker run -d `
  --name jenkins `
  -p 8080:8080 `
  -p 50000:50000 `
  -v jenkins_home:/var/jenkins_home `
  -v //var/run/docker.sock:/var/run/docker.sock `
  --restart unless-stopped `
  jenkins/jenkins:lts

# 5. Esperar a que Jenkins inicie (30 segundos)
Start-Sleep -Seconds 30

# 6. Instalar Docker CLI en el contenedor
docker exec -u root jenkins sh -c "curl -fsSL https://download.docker.com/linux/static/stable/x86_64/docker-20.10.9.tgz | tar xz --strip-components=1 -C /usr/local/bin docker/docker"

# 7. Dar permisos al socket
docker exec -u root jenkins chmod 666 /var/run/docker.sock

# 8. Verificar que funcione
docker exec jenkins docker --version
docker exec jenkins docker info
```

## Alternativa: Usando Docker Compose (Recomendado)

#### Opción B: Docker Compose

Si usas docker-compose, actualiza tu archivo `docker-compose.yml`:

```yaml
version: "3.8"

services:
  jenkins:
    image: jenkins/jenkins:lts
    container_name: jenkins
    ports:
      - "8080:8080"
      - "50000:50000"
    volumes:
      - jenkins_home:/var/jenkins_home
      - /var/run/docker.sock:/var/run/docker.sock
      - /usr/bin/docker:/usr/bin/docker
    restart: unless-stopped

volumes:
  jenkins_home:
```

Luego ejecuta:

```bash
docker-compose up -d
```

### 5. Dar Permisos al Socket Docker

Después de iniciar el contenedor, ejecuta:

```bash
# Opción 1: Dar permisos directamente al socket
docker exec -u root jenkins chmod 666 /var/run/docker.sock

# Opción 2: Agregar el usuario jenkins al grupo docker (más seguro)
docker exec -u root jenkins sh -c "groupadd -g $(stat -c '%g' /var/run/docker.sock) docker && usermod -aG docker jenkins"
```

### 6. Verificar la Configuración

```bash
# Verificar que Docker esté accesible desde Jenkins
docker exec jenkins docker --version
docker exec jenkins docker info
```

## En Windows con Docker Desktop

Si estás usando Windows con Docker Desktop, el socket está en una ubicación diferente:

```bash
docker run -d \
  --name jenkins \
  -p 8080:8080 \
  -p 50000:50000 \
  -v jenkins_home:/var/jenkins_home \
  -v //var/run/docker.sock:/var/run/docker.sock \
  --restart unless-stopped \
  jenkins/jenkins:lts
```

## Verificación en Jenkins

Después de reconfigurar Jenkins:

1. Accede a Jenkins (http://localhost:8080)
2. Verifica que tus jobs y configuraciones estén intactos
3. Ejecuta el pipeline para verificar que Docker funcione

## Solución de Problemas

### Error: Permission denied al acceder a docker.sock

```bash
docker exec -u root jenkins chmod 666 /var/run/docker.sock
```

### Error: docker: command not found

Verifica que el binario de Docker esté montado correctamente:

```bash
docker exec jenkins which docker
```

Si no está disponible, puedes instalar Docker dentro del contenedor:

```bash
docker exec -u root jenkins sh -c "apt-get update && apt-get install -y docker.io"
```

### El contenedor no arranca

Revisa los logs:

```bash
docker logs jenkins
```

## Notas Importantes

- **Seguridad**: Montar el socket de Docker da acceso completo al Docker del host. Asegúrate de que solo usuarios confiables tengan acceso a Jenkins.
- **Permisos**: Es posible que necesites ajustar los permisos del socket después de cada reinicio del host.
- **Backup**: Siempre haz backup del volumen `jenkins_home` antes de realizar cambios importantes.

## Comandos Útiles

```bash
# Ver logs de Jenkins
docker logs -f jenkins

# Acceder al contenedor
docker exec -it jenkins bash

# Reiniciar Jenkins
docker restart jenkins

# Ver uso de recursos
docker stats jenkins
```
