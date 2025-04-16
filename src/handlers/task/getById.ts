import type { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { GetCommand } from '@aws-sdk/lib-dynamodb';
import {
  formatJSONResponse,
  formatErrorResponse,
} from '../../utils/apiGateway';
import dynamoDb from '../../utils/dynamodb';
import type { Task } from '../../models/Task';

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    const id = event.pathParameters?.id;

    if (!id) {
      return formatErrorResponse(new Error('Missing task ID'), 400);
    }

    const result = await dynamoDb.send(
      new GetCommand({
        TableName: process.env.TASKS_TABLE,
        Key: { id },
      })
    );

    if (!result.Item) {
      return formatErrorResponse(new Error('Task not found'), 404);
    }

    const task = result.Item as Task;

    return formatJSONResponse({ task });
  } catch (error) {
    console.error('Error getting task by ID:', error);
    return formatErrorResponse(error as Error);
  }
};
