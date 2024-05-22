def COLOR_MAP = [
    'SUCCESS' : 'good',
    'FAILURE' : 'danger'
]
pipeline {
    agent any
    tools {
        nodejs 'node-18.12.1'
    }
    stages {
        stage ('git checkout') {
            steps {
              git branch: 'dev', credentialsId: 'git_token', url: 'https://github.com/Humantech-solutions/topaz-frontend.git'
            }
        }    
        stage ('npm install') {
            steps {
                sh 'npm --version'  
                sh 'npm install --legacy-peer-deps'
            }    
        }
        stage ('npm install fix') {
            steps {
                sh 'export NODE_OPTIONS=--openssl-legacy-provider'
            }
        }    
        stage ('npm run build') {
            steps {
                sh 'npm run build'
            }
        }
        stage ('Deploying to dev server') {
            steps {
                sh 'ansible-playbook /var/lib/jenkins/workspace/Topaz_Frontend_Dev/topaz-frontend-dev.yml'
            }
        }
    }
    post {
        success {
            echo 'topaz-jenkins'
            slackSend channel: '#topaz-jenkins',
                color: COLOR_MAP[currentBuild.currentResult],
                message: "*${currentBuild.currentResult}:* Job ${env.JOB_NAME} build ${env.BUILD_NUMBER} \n More info at: ${env.BUILD_URL}"
        }
        failure {
            echo 'topaz-jenkins'
            slackSend channel: '#topaz-jenkins',
                color: COLOR_MAP[currentBuild.currentResult],
                message: "*${currentBuild.currentResult}:* Job ${env.JOB_NAME} build ${env.BUILD_NUMBER} \n More info at: ${env.BUILD_URL}"
        }
    }
}
