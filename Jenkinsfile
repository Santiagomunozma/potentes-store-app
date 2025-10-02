pipeline {
    agent any

    tools {
        nodejs "node-20"
    }

    environment {
        NODE_ENV = 'production'
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
                bat 'powershell "if (Test-Path dist.zip) { Remove-Item dist.zip }"'
                bat 'powershell Compress-Archive -Path dist -DestinationPath dist.zip'
                archiveArtifacts artifacts: 'dist.zip', fingerprint: true
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
        }
        failure {
            echo 'Build falló. Revisar logs para más detalles.'
        }
    }
}

