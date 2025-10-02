pipeline {
    agent any

    tools {
        nodejs "node-20"
    }

    stages {
        stage('Checkout') {
            steps {
                git branch: 'main',
                    url: 'https://github.com/Santiagomunozma/potentes-store-app.git',
                    credentialsId: 'Jenkinsfile'
            }
        }
        stage('Clean Workspace') {
    steps {
        deleteDir() // Limpia todo el workspace
    }
}
        stage('Install Dependencies') {
            steps {
                bat 'npm install'
            }
        }

        stage('Build') {
            steps {
                bat 'npm run build'
            }
        }

        stage('Package Artifact') {
            steps {
                bat 'powershell Compress-Archive -Path dist -DestinationPath dist.zip'
                archiveArtifacts artifacts: 'dist.zip', fingerprint: true
            }
        }
    }
}

