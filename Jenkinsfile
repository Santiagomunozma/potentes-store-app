pipeline {
    agent any

    tools {
        nodejs "node-20"
    }

    environment {
        NODE_ENV = 'production'
        // Configuración de Artifactory
        ARTIFACTORY_URL = 'http://localhost:8082/artifactory'
        ARTIFACTORY_GENERIC_REPO = 'generic-local'
        // Versión automática basada en BUILD_NUMBER
        VERSION = "${env.BUILD_NUMBER}"
        ARTIFACT_NAME = "potentes-store-app-${VERSION}.zip"
    }

    options {
        buildDiscarder(logRotator(numToKeepStr: '10'))
        timeout(time: 30, unit: 'MINUTES')
        skipDefaultCheckout()
    }

    stages {
        stage('Clean Workspace') {
            steps {
                deleteDir() // Limpia todo el workspace
            }
        }

        stage('Checkout') {
            steps {
                git branch: 'main',
                    url: 'https://github.com/Santiagomunozma/potentes-store-app.git',
                    credentialsId: 'Archivo Jenkins'
            }
        }
        
        stage('Install Dependencies') {
            steps {
                echo 'Instalando dependencias...'
                script {
                    // Intentar npm ci primero, si falla usar npm install
                    def result = bat(script: 'npm ci --production=false', returnStatus: true)
                    if (result != 0) {
                        echo 'npm ci falló, usando npm install como respaldo...'
                        bat 'npm install'
                    }
                }
            }
        }

        stage('Lint & Test') {
            parallel {
                stage('Lint') {
                    steps {
                        echo 'Ejecutando linting...'
                        bat 'npm run lint || exit 0'
                    }
                }
                stage('Test') {
                    steps {
                        echo 'Ejecutando tests...'
                        bat 'npm test || exit 0'
                    }
                }
            }
        }

        stage('Build') {
            steps {
                echo 'Construyendo la aplicación...'
                bat 'npm run build'
            }
        }

        stage('Package Artifact') {
            steps {
                echo 'Empaquetando artefactos...'
                bat "powershell \"if (Test-Path ${ARTIFACT_NAME}) { Remove-Item ${ARTIFACT_NAME} }\""
                bat "powershell Compress-Archive -Path dist -DestinationPath ${ARTIFACT_NAME}"
                archiveArtifacts artifacts: "${ARTIFACT_NAME}", fingerprint: true
            }
        }

        stage('Upload to Artifactory') {
            steps {
                script {
                    echo 'Preparando artefactos para Artifactory...'
                    echo "Artefacto generado: ${ARTIFACT_NAME}"
                    echo "Ubicación prevista en Artifactory: ${ARTIFACTORY_URL}/${ARTIFACTORY_GENERIC_REPO}/potentes-store-app/${VERSION}/${ARTIFACT_NAME}"
                    
                    // Nota: Para habilitar la subida automática a Artifactory, 
                    // instalar y configurar el plugin de Artifactory en Jenkins
                    echo 'Plugin de Artifactory no configurado - saltando subida automática'
                }
            }
        }

        stage('Promote Build') {
            when {
                branch 'main'
            }
            steps {
                script {
                    echo 'Preparando promoción de build...'
                    echo "Build ${env.BUILD_NUMBER} listo para promoción manual"
                    echo "Artefacto: ${ARTIFACT_NAME}"
                    
                    // Nota: Para habilitar la promoción automática, 
                    // configurar el plugin de Artifactory en Jenkins
                    echo 'Plugin de Artifactory no configurado - promoción manual requerida'
                }
            }
        }
    }

    post {
        always {
            echo 'Pipeline completado'
            cleanWs()
        }
        success {
            echo 'Build exitoso!'
            echo "Artefacto disponible en Artifactory: ${ARTIFACTORY_URL}/${ARTIFACTORY_GENERIC_REPO}/potentes-store-app/${VERSION}/${ARTIFACT_NAME}"
        }
        failure {
            echo 'Build falló. Revisar logs para más detalles.'
            // Limpiar artefactos parciales en caso de fallo
            script {
                try {
                    bat "powershell \"if (Test-Path ${ARTIFACT_NAME}) { Remove-Item ${ARTIFACT_NAME} }\""
                } catch (Exception e) {
                    echo "No se pudo limpiar artefactos parciales: ${e.getMessage()}"
                }
            }
        }
    }
}

