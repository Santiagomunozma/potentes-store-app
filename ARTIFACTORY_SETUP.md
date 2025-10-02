# Configuración de Artifactory para Jenkins

## Requisitos Previos

1. **Plugin de Artifactory**: Asegúrate de tener instalado el plugin "Artifactory" en Jenkins
2. **Servidor Artifactory**: Acceso a una instancia de JFrog Artifactory
3. **Credenciales**: Usuario y contraseña o API Key para Artifactory

## Configuración en Jenkins

### 1. Configurar Servidor Artifactory

1. Ve a **Manage Jenkins** → **Configure System**
2. Busca la sección **JFrog**
3. Haz clic en **Add JFrog Platform Instance**
4. Configura los siguientes campos:
   - **Instance ID**: `artifactory-server` (debe coincidir con el Jenkinsfile)
   - **JFrog Platform URL**: Tu URL de Artifactory (ej: `https://tu-empresa.jfrog.io`)
   - **Default Deployer Credentials**: Selecciona las credenciales configuradas

### 2. Configurar Credenciales

1. Ve a **Manage Jenkins** → **Manage Credentials**
2. Selecciona el dominio apropiado (Global)
3. Haz clic en **Add Credentials**
4. Configura:
   - **Kind**: Username with password
   - **Username**: Tu usuario de Artifactory
   - **Password**: Tu contraseña o API Key
   - **ID**: Un identificador único (ej: `artifactory-credentials`)

### 3. Crear Repositorios en Artifactory

Necesitas crear los siguientes repositorios en tu instancia de Artifactory:

1. **npm-local**: Repositorio local para paquetes npm
2. **generic-local**: Repositorio local para artefactos genéricos
3. **generic-release-local**: Repositorio para releases (opcional)

## Configuración del Jenkinsfile

### Variables de Entorno a Personalizar

Actualiza las siguientes variables en el Jenkinsfile según tu configuración:

```groovy
environment {
    // Cambia esta URL por la de tu Artifactory
    ARTIFACTORY_URL = 'https://tu-artifactory-url.com/artifactory'

    // Nombres de tus repositorios
    ARTIFACTORY_REPO = 'npm-local'
    ARTIFACTORY_GENERIC_REPO = 'generic-local'
}
```

### Estructura de Artefactos

Los artefactos se subirán con la siguiente estructura:

```
generic-local/
└── potentes-store-app/
    └── [BUILD_NUMBER]/
        └── potentes-store-app-[BUILD_NUMBER].zip
```

## Funcionalidades Implementadas

### 1. Versionado Automático

- Utiliza el `BUILD_NUMBER` de Jenkins como versión
- Cada build genera un artefacto único

### 2. Subida de Artefactos

- Comprime la carpeta `dist` en un archivo ZIP
- Sube el artefacto a Artifactory con metadatos del build

### 3. Promoción de Builds

- Los builds de la rama `main` se promueven automáticamente al repositorio de releases
- Incluye metadatos adicionales como comentarios y estado

### 4. Build Info

- Captura información del entorno y build
- Permite trazabilidad completa de los artefactos

## Verificación

Después de ejecutar el pipeline, puedes verificar:

1. **En Jenkins**: Los artefactos aparecerán en la sección "Build Artifacts"
2. **En Artifactory**: Los artefactos estarán disponibles en la ruta especificada
3. **Build Info**: Información detallada del build en la sección "Builds" de Artifactory

## Troubleshooting

### Error: "No Artifactory server configured"

- Verifica que el servidor esté configurado con el ID correcto
- Asegúrate de que las credenciales sean válidas

### Error: "Repository not found"

- Verifica que los repositorios existan en Artifactory
- Confirma los nombres de los repositorios en las variables de entorno

### Error de permisos

- Verifica que el usuario tenga permisos de escritura en los repositorios
- Confirma que las credenciales sean correctas

## Comandos Útiles

### Descargar artefacto manualmente

```bash
curl -u username:password -O "https://tu-artifactory-url.com/artifactory/generic-local/potentes-store-app/[BUILD_NUMBER]/potentes-store-app-[BUILD_NUMBER].zip"
```

### Listar artefactos

```bash
curl -u username:password "https://tu-artifactory-url.com/artifactory/api/storage/generic-local/potentes-store-app"
```
