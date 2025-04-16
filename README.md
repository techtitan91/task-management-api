# Serverless Task Management API

A serverless REST API built with AWS API Gateway, Lambda, and DynamoDB that supports CRUD operations for task management.

## Architecture

This project implements a serverless architecture using:

- **AWS API Gateway**: Handles HTTP requests
- **AWS Lambda**: Processes business logic
- **DynamoDB**: Stores task data
- **Serverless Framework**: Infrastructure as code
- **GitHub Actions**: CI/CD pipeline

## Features

- Create, Read, Update, and Delete tasks
- Multi-stage deployment (dev, prod)
- Automated CI/CD pipeline
- Serverless Framework Dashboard integration

## API Endpoints

| Method | Endpoint    | Description       |
| ------ | ----------- | ----------------- |
| POST   | /tasks      | Create a new task |
| GET    | /tasks      | Get all tasks     |
| GET    | /tasks/{id} | Get a task by ID  |
| PUT    | /tasks/{id} | Update a task     |
| DELETE | /tasks/{id} | Delete a task     |

## Task Model

```
{
"id": "uuid",
"title": "string",
"description": "string",
"status": "TODO | IN_PROGRESS | COMPLETED",
"createdAt": "ISO date string",
"updatedAt": "ISO date string"
}
```

## Project Structure

```
task-management-api/
├── .github/
│ └── workflows/
│ └── deploy.yml # CI/CD workflow
├── src/
│ ├── handlers/
│ │ └── task/
│ │ ├── create.ts # Create task handler
│ │ ├── delete.ts # Delete task handler
│ │ ├── getById.ts # Get task by ID handler
│ │ ├── list.ts # List tasks handler
│ │ └── update.ts # Update task handler
│ ├── libs/
│ │ ├── apiGateway.ts # API Gateway response helpers
│ │ └── dynamodb.ts # DynamoDB client
│ └── models/
│ └── Task.ts # Task model and interfaces
├── package.json # Project dependencies
├── serverless.yml # Serverless Framework configuration
└── tsconfig.json # TypeScript configuration
```

## Prerequisites

- Node.js (v14+)
- AWS CLI configured with appropriate credentials
- Serverless Framework installed globally (`npm install -g serverless`)

## Deployment

### Manual Deployment

Deploy to dev environment:

```
npm run deploy:dev
```

Deploy to production:

```
npm run deploy:prod
```

### CI/CD Pipeline

The project uses GitHub Actions for CI/CD. When code is pushed to the master branch, it automatically deploys to the dev environment.

To deploy to production, you can manually trigger the workflow and select 'prod' as the deployment stage.

## CI/CD Pipeline Setup

The CI/CD pipeline is configured in `.github/workflows/deploy.yml` and handles:

1. Installing dependencies
2. Deploying to the specified environment
3. Supporting multi-stage deployments (dev/prod)

### Required GitHub Secrets

For the CI/CD pipeline to work, you need to set up these GitHub repository secrets:

- `SERVERLESS_ACCESS_KEY`: Your Serverless access key

## Using the API

After deployment, you can test the API using curl or Postman:

### Create a task

```bash
curl -X POST https://your-api-id.execute-api.us-east-1.amazonaws.com/dev/tasks \
 -H "Content-Type: application/json" \
 -d '{"title": "Complete project", "description": "Finish the serverless API project"}'
```

### Get tasks list

```bash
curl https://your-api-id.execute-api.us-east-1.amazonaws.com/dev/tasks
```

### Get a specific task

```bash
curl https://your-api-id.execute-api.us-east-1.amazonaws.com/dev/tasks/{task-id}
```

### Update a task

```bash
curl -X PUT https://your-api-id.execute-api.us-east-1.amazonaws.com/dev/tasks/{task-id} \
 -H "Content-Type: application/json" \
 -d '{"status": "IN_PROGRESS"}'
```

### Delete a task

```bash
curl -X DELETE https://your-api-id.execute-api.us-east-1.amazonaws.com/dev/tasks/{task-id}
```

## Security

- IAM roles are configured with least privilege
- API Gateway endpoints can be secured with API keys or Cognito (not implemented in this demo)
- Sensitive information is stored in GitHub Secrets
