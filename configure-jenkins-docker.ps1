# Script para configurar Docker en Jenkins sin perder datos
# Para Windows PowerShell

Write-Host "=== Configuracion de Docker en Jenkins ===" -ForegroundColor Green
Write-Host ""

# Verificar que Docker esté corriendo
Write-Host "Verificando Docker..." -ForegroundColor Yellow
$dockerCheck = docker version 2>&1
if ($LASTEXITCODE -eq 0) {
    Write-Host "[OK] Docker esta disponible" -ForegroundColor Green
} else {
    Write-Host "[ERROR] Docker no esta disponible. Instala Docker Desktop primero." -ForegroundColor Red
    exit 1
}

# Verificar si Jenkins existe
Write-Host ""
Write-Host "Verificando contenedor Jenkins..." -ForegroundColor Yellow
$jenkinsExists = docker ps -a --format "{{.Names}}" | Select-String -Pattern "^jenkins$"

if (-not $jenkinsExists) {
    Write-Host "[ERROR] No se encontro un contenedor llamado 'jenkins'" -ForegroundColor Red
    Write-Host "  Verifica el nombre con: docker ps -a" -ForegroundColor Yellow
    exit 1
}

Write-Host "[OK] Contenedor Jenkins encontrado" -ForegroundColor Green

# Preguntar confirmación
Write-Host ""
Write-Host "IMPORTANTE:" -ForegroundColor Yellow
Write-Host "- Se detendra y recreara el contenedor Jenkins" -ForegroundColor Yellow
Write-Host "- Los datos y configuraciones NO se perderan (estan en el volumen)" -ForegroundColor Yellow
Write-Host "- Se creara un backup de la imagen actual" -ForegroundColor Yellow
Write-Host ""
$confirmation = Read-Host "Deseas continuar? (S/N)"

if ($confirmation -ne "S" -and $confirmation -ne "s") {
    Write-Host "Operacion cancelada" -ForegroundColor Yellow
    exit 0
}

Write-Host ""
Write-Host "Iniciando configuracion..." -ForegroundColor Green
Write-Host ""

# Paso 1: Crear backup
Write-Host "[1/8] Creando backup de la imagen actual..." -ForegroundColor Cyan
docker commit jenkins jenkins-backup
if ($LASTEXITCODE -eq 0) {
    Write-Host "[OK] Backup creado: jenkins-backup" -ForegroundColor Green
} else {
    Write-Host "[ERROR] Error al crear backup" -ForegroundColor Red
}

# Paso 2: Detener Jenkins
Write-Host ""
Write-Host "[2/8] Deteniendo contenedor Jenkins..." -ForegroundColor Cyan
docker stop jenkins
if ($LASTEXITCODE -eq 0) {
    Write-Host "[OK] Jenkins detenido" -ForegroundColor Green
} else {
    Write-Host "[ERROR] Error al detener Jenkins" -ForegroundColor Red
    exit 1
}

# Paso 3: Eliminar contenedor
Write-Host ""
Write-Host "[3/8] Eliminando contenedor (los datos persisten)..." -ForegroundColor Cyan
docker rm jenkins
if ($LASTEXITCODE -eq 0) {
    Write-Host "[OK] Contenedor eliminado" -ForegroundColor Green
} else {
    Write-Host "[ERROR] Error al eliminar contenedor" -ForegroundColor Red
    exit 1
}

# Paso 4: Recrear con socket Docker
Write-Host ""
Write-Host "[4/8] Recreando Jenkins con socket Docker..." -ForegroundColor Cyan
docker run -d `
  --name jenkins `
  -p 8080:8080 `
  -p 50000:50000 `
  -v jenkins_home:/var/jenkins_home `
  -v //var/run/docker.sock:/var/run/docker.sock `
  --restart unless-stopped `
  jenkins/jenkins:lts

if ($LASTEXITCODE -eq 0) {
    Write-Host "[OK] Jenkins recreado con socket Docker" -ForegroundColor Green
} else {
    Write-Host "[ERROR] Error al recrear Jenkins" -ForegroundColor Red
    Write-Host "  Restaurando desde backup..." -ForegroundColor Yellow
    docker run -d --name jenkins jenkins-backup
    exit 1
}

# Paso 5: Esperar a que Jenkins inicie
Write-Host ""
Write-Host "[5/8] Esperando a que Jenkins inicie (30 segundos)..." -ForegroundColor Cyan
Start-Sleep -Seconds 30
Write-Host "[OK] Espera completada" -ForegroundColor Green

# Paso 6: Instalar Docker CLI
Write-Host ""
Write-Host "[6/8] Instalando Docker CLI en el contenedor..." -ForegroundColor Cyan
docker exec -u root jenkins sh -c "curl -fsSL https://download.docker.com/linux/static/stable/x86_64/docker-20.10.9.tgz | tar xz --strip-components=1 -C /usr/local/bin docker/docker"

if ($LASTEXITCODE -eq 0) {
    Write-Host "[OK] Docker CLI instalado" -ForegroundColor Green
} else {
    Write-Host "[WARN] Error al instalar Docker CLI" -ForegroundColor Yellow
    Write-Host "  Intentando metodo alternativo..." -ForegroundColor Yellow
    docker exec -u root jenkins sh -c "apt-get update"
    docker exec -u root jenkins sh -c "apt-get install -y docker.io"
}

# Paso 7: Dar permisos al socket
Write-Host ""
Write-Host "[7/8] Configurando permisos del socket Docker..." -ForegroundColor Cyan
docker exec -u root jenkins chmod 666 /var/run/docker.sock

if ($LASTEXITCODE -eq 0) {
    Write-Host "[OK] Permisos configurados" -ForegroundColor Green
} else {
    Write-Host "[WARN] Error al configurar permisos" -ForegroundColor Yellow
}

# Verificación final
Write-Host ""
Write-Host "[8/8] Verificacion Final..." -ForegroundColor Cyan
Write-Host ""
Write-Host "Verificando Docker version..." -ForegroundColor Cyan
docker exec jenkins docker --version

Write-Host ""
Write-Host "Verificando Docker info..." -ForegroundColor Cyan
docker exec jenkins docker info

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "=== [OK] Configuracion Completada Exitosamente ===" -ForegroundColor Green
    Write-Host ""
    Write-Host "Jenkins esta disponible en: http://localhost:8080" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Proximos pasos:" -ForegroundColor Yellow
    Write-Host "1. Accede a Jenkins y verifica que todo funcione" -ForegroundColor White
    Write-Host "2. Haz commit del Jenkinsfile actualizado" -ForegroundColor White
    Write-Host "3. Ejecuta el pipeline nuevamente" -ForegroundColor White
    Write-Host ""
} else {
    Write-Host ""
    Write-Host "=== [WARN] Configuracion Completada con Advertencias ===" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Jenkins esta corriendo pero puede haber problemas con Docker" -ForegroundColor Yellow
    Write-Host "Revisa los logs: docker logs jenkins" -ForegroundColor Yellow
    Write-Host ""
}

Write-Host "Para restaurar el backup si hay problemas:" -ForegroundColor Gray
Write-Host "  docker stop jenkins" -ForegroundColor Gray
Write-Host "  docker rm jenkins" -ForegroundColor Gray  
Write-Host "  docker run -d --name jenkins jenkins-backup" -ForegroundColor Gray
Write-Host ""
