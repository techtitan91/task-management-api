import type { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { ScanCommand } from '@aws-sdk/lib-dynamodb';
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
    const result = await dynamoDb.send(
      new ScanCommand({
        TableName: process.env.TASKS_TABLE,
      })
    );

    const tasks = result.Items as Task[];

    return formatJSONResponse({ tasks });
  } catch (error) {
    console.error('Error getting tasks:', error);
    return formatErrorResponse(error as Error);
  }
};
