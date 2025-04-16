import type { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { v4 as uuidv4 } from 'uuid';
import { PutCommand } from '@aws-sdk/lib-dynamodb';
import {
  type CreateTaskRequest,
  type Task,
  TaskStatus,
} from '../../models/Task';
import {
  formatErrorResponse,
  formatJSONResponse,
} from '../../utils/apiGateway';
import dynamoDb from '../../utils/dynamodb';

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    if (!event.body) {
      return formatErrorResponse(new Error('Missing request body'), 400);
    }

    const requestBody: CreateTaskRequest = JSON.parse(event.body);

    if (!requestBody.title) {
      return formatErrorResponse(new Error('Title is required'), 400);
    }

    const timestamp = new Date().toISOString();
    const task: Task = {
      id: uuidv4(),
      title: requestBody.title,
      description: requestBody.description || '',
      status: requestBody.status || TaskStatus.TODO,
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    await dynamoDb.send(
      new PutCommand({
        TableName: process.env.TASKS_TABLE,
        Item: task,
      })
    );

    return formatJSONResponse({ task });
  } catch (error) {
    console.error('Error creating task:', error);
    return formatErrorResponse(error as Error);
  }
};
