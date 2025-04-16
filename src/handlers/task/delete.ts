import type { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { DeleteCommand, GetCommand } from '@aws-sdk/lib-dynamodb';
import {
  formatJSONResponse,
  formatErrorResponse,
} from '../../utils/apiGateway';
import dynamoDb from '../../utils/dynamodb';

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    const id = event.pathParameters?.id;

    if (!id) {
      return formatErrorResponse(new Error('Missing task ID'), 400);
    }

    const getResult = await dynamoDb.send(
      new GetCommand({
        TableName: process.env.TASKS_TABLE,
        Key: { id },
      })
    );

    if (!getResult.Item) {
      return formatErrorResponse(new Error('Task not found'), 404);
    }

    await dynamoDb.send(
      new DeleteCommand({
        TableName: process.env.TASKS_TABLE,
        Key: { id },
      })
    );

    return formatJSONResponse({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error('Error deleting task:', error);
    return formatErrorResponse(error as Error);
  }
};
