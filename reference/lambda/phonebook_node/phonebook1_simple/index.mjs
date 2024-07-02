// Author : C.W.Jung 
// Title : func_phonebook_node 

// AWS SDK호출 V3
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";

import {
  DynamoDBDocumentClient,
  BatchExecuteStatementCommand,
} from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});
const dynamo = DynamoDBDocumentClient.from(client);
 
// AWS SDK호출 OLD V2 
// const AWS = require('aws-sdk');

// AWS DynamoDB DocumentClient 호출 OLD V2 
// const dynamo = new AWS.DynamoDB.DocumentClient();  

const dynamoTableName = "phonebook"; 

export const handler = async (event, context) => {
  let body;
  let statusCode = 200;
 
 
  // 핸들러 헤더 설정
  const headers = {
        "Content-Type": "application/json",
  };
 
  
  console.info("PhoneBook 777 EVENT\n" + JSON.stringify(event, null, 2))
 
  try {
    switch (event.routeKey) {
      case "DELETE /items/{id}":
        await dynamo
          .delete({
            TableName: dynamoTableName,
            Key: {
              id: event.pathParameters.id
            }
          })
          .promise();
        body = `Deleted item ${event.pathParameters.id}`;
        break;
      case "GET /items/{id}":
        body = await dynamo
          .get({
            TableName: dynamoTableName,
            Key: {
              id: event.pathParameters.id
            }
          })
          .promise();
        break;
      case "GET /items":
        body = await dynamo.scan({ TableName: dynamoTableName }).promise();
        break;
      case "POST /items":
        body = await dynamo.scan({ TableName: dynamoTableName }).promise();
        break;
      case "PUT /items":
        let requestJSON = JSON.parse(event.body);
        await dynamo
          .put({
            TableName: dynamoTableName,
            Item: {
              id: requestJSON.id,
              phonenum: requestJSON.phonenum,
              name: requestJSON.name
            }
          })
          .promise();
        body = `Put item ${requestJSON.id}`;
        break;
      default:
        throw new Error(`Unsupported route: "${event.routeKey}"`);
    }
  } catch (err) {
    statusCode = 400;
    body = err.message;
  } finally {
    body = JSON.stringify(body);
  }

  return {
    statusCode,
    body,
    headers
  };
};
