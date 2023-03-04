
pipeline {
    agent any

    stages {
        stage('Build') {
            steps {
                sh 'docker build -t live-cord-server .'
            }
        }
        stage('Stop old container') {
            steps {
                sh 'docker rm live-cord-server --force'
            }
        }
        stage('Start New Container') {
            steps {
                sh 'docker run -p 5007:5000 -p 5020:5020 -d --restart always --name live-cord-server live-cord-server'
            }
        }
    }
}   