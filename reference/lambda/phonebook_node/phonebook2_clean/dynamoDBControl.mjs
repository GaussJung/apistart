/*
Program : dynamoDB관리자 
Author : C.W.Jung 
Lang & SDK : Node22.x / SDK V3 
Version : 1.3
참조Document 
https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB/DocumentClient.html 
https://docs.aws.amazon.com/sdk-for-javascript/v3/developer-guide/dynamodb-example-dynamodb-utilities.html
SDK V3 : 
https://docs.aws.amazon.com/ko_kr/amazondynamodb/latest/developerguide/example_dynamodb_Scenario_GettingStartedMovies_section.html 
*/ 
 

//  AWS SDK호출 V3
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";

import {
  DynamoDBDocumentClient,
  ScanCommand,
  GetCommand,
  DeleteCommand,
  PutCommand,
  UpdateCommand,
  BatchExecuteStatementCommand,
} from "@aws-sdk/lib-dynamodb";

// AWS SDK호출 SKD V3  
const client = new DynamoDBClient({});
const dynamo = DynamoDBDocumentClient.from(client);
 
// AWS SDK호출 SKD V2 
// const AWS = require('aws-sdk');

// AWS DynamoDB DocumentClient 호출 SDK V2 
// const dynamo = new AWS.DynamoDB.DocumentClient();  
 
// Dynamo DB 테이블명
const dynamoTableName = "phonebook"; 
 
// TR-All. 테이블 전체 스캔 (모두 자료 )
const dynamoAllRead = async () => {
    
    const command = new ScanCommand({
        TableName: dynamoTableName
    });
  
    const response = await dynamo.send(command);
  
    return response;
};


// TC. 테이블 데이터 Item 생성(Crerate)  
const dynamoCreateItem = async (requestJSON) => {
 	  // 조건 표현식 사용 : 동일한 키가 없는 경우에 쓰기 진행 
	  // Item : 항목추가내용 
    const putCommand = new PutCommand({
        TableName: dynamoTableName,
        // 기존항목 있는 것은 추가되지 않도록 함.  ConditionExpression: "attribute_not_exists(id)",
        Item: {
            id: requestJSON.id,
            name: requestJSON.name,
            phonenum: requestJSON.phonenum
        }
    });
	  
    const response = await dynamo.send(putCommand);
      
    return response;
};

// TR. 테이블 데이터 Item 읽기(Read) : id에 해당하는 단항목 읽기 
const dynamoReadItem = async (id) => {
    
    const getCommand = new GetCommand({
        TableName: dynamoTableName,
        Key:{
           id
        }
    });
	  
    const response = await dynamo.send(getCommand);
      
    return response;
};

// TU. 테이블 데이터 Item 갱신(Update)  
const dynamoUpdateItem = async (requestJSON) => {
 
    const updateCommand = new UpdateCommand({
        TableName:  dynamoTableName,
        Item: {
            id: requestJSON.id,
            name: requestJSON.name,
            phonenum: requestJSON.phonenum
        }
    });
  
    const response = await dynamo.send(updateCommand);

    return response;
};


// TD. 테이블 데이터 Item 삭제 (Delete)
const dynamoDeleteItem = async (id) => {
    
    const deleteCommand = new DeleteCommand({
        TableName: dynamoTableName,
        Key:{
            id
        }
    });
    
    const response = await dynamo.send(deleteCommand);

    return response;
};

// 모듈전달 SDK V2 
// module.exports = {dynamoCreateItem, dynamoReadItem, dynamoDeleteItem, dynamoAllRead};
// 모듈전달 SDK V3 
export {dynamoCreateItem, dynamoReadItem, dynamoDeleteItem, dynamoAllRead};
 