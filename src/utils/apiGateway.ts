export const formatJSONResponse = (
  response: Record<string, unknown>,
  statusCode = 200
) => {
  return {
    statusCode,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
    },
    body: JSON.stringify(response),
  };
};

export const formatErrorResponse = (error: Error, statusCode = 500) => {
  return formatJSONResponse(
    {
      message: error.message || 'Internal server error',
      error: error.name || 'Error',
    },
    statusCode
  );
};
