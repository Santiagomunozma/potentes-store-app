pipeline {
    agent any

    tools {
        nodejs "node-20"
    }

    stage('Checkout') {
    steps {
        git branch: 'main',
            url: 'https://github.com/Santiagomunozma/potentes-store-frontend.git',
            credentialsId: 'github-token'
    }
}


        stage('Instalar dependencias') {
            steps {
                bat 'npm install'
            }
        }

        stage('Build') {
            steps {
                bat 'npm run build'
            }
        }

        stage('Empaquetar artefacto') {
            steps {
                bat 'powershell Compress-Archive -Path dist -DestinationPath dist.zip'
                archiveArtifacts artifacts: 'dist.zip', fingerprint: true
            }
        }
 }

