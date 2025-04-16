import type { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { GetCommand, UpdateCommand } from '@aws-sdk/lib-dynamodb';
import {
  formatJSONResponse,
  formatErrorResponse,
} from '../../utils/apiGateway';
import dynamoDb from '../../utils/dynamodb';
import type { Task, UpdateTaskRequest } from '../../models/Task';

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    const id = event.pathParameters?.id;

    if (!id) {
      return formatErrorResponse(new Error('Missing task ID'), 400);
    }

    if (!event.body) {
      return formatErrorResponse(new Error('Missing request body'), 400);
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

    const requestBody: UpdateTaskRequest = JSON.parse(event.body);
    const timestamp = new Date().toISOString();

    let updateExpression = 'SET updatedAt = :updatedAt';
    const expressionAttributeValues: Record<string, any> = {
      ':updatedAt': timestamp,
    };

    if (requestBody.title !== undefined) {
      updateExpression += ', title = :title';
      expressionAttributeValues[':title'] = requestBody.title;
    }

    if (requestBody.description !== undefined) {
      updateExpression += ', description = :description';
      expressionAttributeValues[':description'] = requestBody.description;
    }

    if (requestBody.status !== undefined) {
      updateExpression += ', #status = :status';
      expressionAttributeValues[':status'] = requestBody.status;
    }

    const updateResult = await dynamoDb.send(
      new UpdateCommand({
        TableName: process.env.TASKS_TABLE,
        Key: { id },
        UpdateExpression: updateExpression,
        ExpressionAttributeValues: expressionAttributeValues,
        ExpressionAttributeNames:
          requestBody.status !== undefined
            ? { '#status': 'status' }
            : undefined,
        ReturnValues: 'ALL_NEW',
      })
    );

    const updatedTask = updateResult.Attributes as Task;

    return formatJSONResponse({ task: updatedTask });
  } catch (error) {
    console.error('Error updating task:', error);
    return formatErrorResponse(error as Error);
  }
};
