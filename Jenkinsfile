pipeline {
    agent any

    tools {
        // Requiere el plugin NodeJS instalado y configurado en Jenkins
        nodejs "node-20"
    }

    stages {
        stage('Checkout') {
            steps {
                ansiColor('xterm') {
                    git branch: 'main',
                        url: 'https://github.com/Santiagomunozma/potentes-store-frontend.git'
                }
            }
        }

        stage('Instalar dependencias') {
            steps {
                ansiColor('xterm') {
                    sh 'npm install'
                }
            }
        }

        stage('Build') {
            steps {
                ansiColor('xterm') {
                    sh 'npm run build'
                }
            }
        }

        stage('Test') {
            steps {
                ansiColor('xterm') {
                    sh 'npm test || true'
                }
            }
        }

        stage('Empaquetar artefacto') {
            steps {
                ansiColor('xterm') {
                    sh 'tar -czf build.tar.gz dist/'  // cambia dist/ según tu framework
                    archiveArtifacts artifacts: 'build.tar.gz', fingerprint: true
                }
            }
        }
    }

    post {
        always {
            ansiColor('xterm') {
                echo "Pipeline frontend finalizado. Estado: ${currentBuild.currentResult}"
            }
        }
    }
}
