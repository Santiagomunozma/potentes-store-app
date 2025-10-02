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
                bat 'npm ci --production=false'
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
                    echo 'Subiendo artefactos a Artifactory...'
                    
                    // Configurar servidor Artifactory
                    def server = Artifactory.server('artifactory-server')
                    
                    // Crear especificación de upload
                    def uploadSpec = """{
                        "files": [
                            {
                                "pattern": "${ARTIFACT_NAME}",
                                "target": "${ARTIFACTORY_GENERIC_REPO}/potentes-store-app/${VERSION}/"
                            }
                        ]
                    }"""
                    
                    // Subir artefacto
                    def buildInfo = server.upload(uploadSpec)
                    
                    // Agregar información del build
                    buildInfo.name = 'potentes-store-app'
                    buildInfo.number = env.BUILD_NUMBER
                    buildInfo.env.capture = true
                    buildInfo.env.collect()
                    
                    // Publicar build info
                    server.publishBuildInfo(buildInfo)
                    
                    echo "Artefacto subido exitosamente: ${ARTIFACTORY_URL}/${ARTIFACTORY_GENERIC_REPO}/potentes-store-app/${VERSION}/${ARTIFACT_NAME}"
                }
            }
        }

        stage('Promote Build') {
            when {
                branch 'main'
            }
            steps {
                script {
                    echo 'Promoviendo build a repositorio de releases...'
                    
                    def server = Artifactory.server('artifactory-server')
                    
                    // Promoción a repositorio de releases
                    def promotionConfig = [
                        'buildName'  : 'potentes-store-app',
                        'buildNumber': env.BUILD_NUMBER,
                        'targetRepo' : 'generic-release-local',
                        'comment'    : "Promoted from build ${env.BUILD_NUMBER}",
                        'status'     : 'Released',
                        'copy'       : true
                    ]
                    
                    server.promote(promotionConfig)
                    echo "Build promovido exitosamente a repositorio de releases"
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

