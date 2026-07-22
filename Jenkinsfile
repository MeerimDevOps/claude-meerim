pipeline {
    agent any

    environment {
        AWS_REGION = 'us-east-1'
        AWS_ACCOUNT_ID = '658140043880'
        ECR_REPOSITORY = 'claude-meerim'
        IMAGE_NAME = 'claude-meerim'
        IMAGE_TAG = 'latest'

        PATH = "/usr/local/bin:/opt/homebrew/bin:/usr/bin:/bin:${env.PATH}"
    }

    stages {

        stage('Checkout Source Code') {
            steps {
                checkout scm
            }
        }

        stage('Verify Tools') {
            steps {
                sh '''
                    echo "Node Version"
                    node -v

                    echo "NPM Version"
                    npm -v

                    echo "Docker Version"
                    docker --version

                    echo "AWS CLI Version"
                    aws --version
                '''
            }
        }

        stage('Install Dependencies') {
            steps {
                dir('backend_service') {
                    sh 'npm install'
                }
            }
        }
stage('SonarQube Analysis') {
    steps {
        script {
            def scannerHome = tool 'SonarScanner'

            withSonarQubeEnv('SonarQube') {
                dir('backend_service') {
                    sh """
                        ${scannerHome}/bin/sonar-scanner \
                        -Dsonar.projectKey=claude-meerim \
                        -Dsonar.projectName=claude-meerim \
                        -Dsonar.sources=. \
                        -Dsonar.exclusions=node_modules/**
                    """
                }
            }
        }
    }
}
        stage('Build Docker Image') {
            steps {
                sh '''
                    docker build \
                    -t ${IMAGE_NAME}:${IMAGE_TAG} \
                    ./backend_service
                '''
            }
        }

        stage('Login to Amazon ECR') {
            steps {
                withCredentials([[
                    $class: 'AmazonWebServicesCredentialsBinding',
                    credentialsId: 'aws-ecr'
                ]]) {
                    sh '''
                        aws ecr get-login-password --region ${AWS_REGION} \
                        | docker login \
                          --username AWS \
                          --password-stdin \
                          ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com
                    '''
                }
            }
        }

        stage('Tag Docker Image') {
            steps {
                sh '''
                    docker tag ${IMAGE_NAME}:${IMAGE_TAG} \
                    ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/${ECR_REPOSITORY}:${IMAGE_TAG}
                '''
            }
        }

        stage('Push Image to Amazon ECR') {
            steps {
                sh '''
                    docker push \
                    ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/${ECR_REPOSITORY}:${IMAGE_TAG}
                '''
            }
        }
    }

    post {
        success {
            echo "======================================"
            echo "Image successfully pushed to Amazon ECR"
            echo "======================================"
        }

        failure {
            echo "======================================"
            echo "Pipeline Failed"
            echo "======================================"
        }

        always {
            cleanWs()
        }
    }
}
