/*
Program : dynamoDB관리자 
Author : C.W.Jung 
Date : 2023.05.16 
Version : 1.01
참조Document 
https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB/DocumentClient.html 
https://docs.aws.amazon.com/sdk-for-javascript/v3/developer-guide/dynamodb-example-dynamodb-utilities.html
*/ 
 
 
// AWS SDK호출 
const AWS = require('aws-sdk');

// AWS DynamoDB DocumentClient 호출
const dynamo = new AWS.DynamoDB.DocumentClient();  
 
// Dynamo DB 테이블명
const dynamoTableName = "phonebook"; 
 
// TR-All. 테이블 전체 스캔 (모두 자료 )
const dynamoAllRead = async () => {
    return await dynamo.scan({ TableName: dynamoTableName }).promise();
};


// TC. 테이블 데이터 Item 생성(Crerate)  
const dynamoCreateItem = async (requestJSON) => {
 	  // 조건 표현식 사용 : 동일한 키가 없는 경우에 쓰기 진행 
	  // Item : 항목추가내용 
	  return await dynamo
      .put({
        TableName: dynamoTableName,
        // 기존항목 있는 것은 추가되지 않도록 함.  ConditionExpression: "attribute_not_exists(id)",
        Item: {
            id: requestJSON.id,
            name: requestJSON.name,
            phonenum: requestJSON.phonenum
        }
     }).promise();
};

// TR. 테이블 데이터 Item 읽기(Read) : id에 해당하는 단항목 읽기 
const dynamoReadItem = async (id) => {
    return await dynamo.get({
        TableName: dynamoTableName,
        Key:{
           id
        }
    }).promise();
};

// TU. 테이블 데이터 Item 갱신(Update)  
const dynamoUpdateItem = async (requestJSON) => {
	  // Item : 항목갱신내용 
	  return await dynamo
      .put({
        TableName: dynamoTableName,
        Item: {
            id: requestJSON.id,
            name: requestJSON.name,
            phonenum: requestJSON.phonenum
        }
     }).promise();
};


// TD. 테이블 데이터 Item 삭제 (Delete)
const dynamoDeleteItem = async (id) => {
    return await dynamo.delete({
        TableName: dynamoTableName,
        Key:{
            id
        }
    }).promise();
};

// 모듈 전달 
module.exports = {dynamoCreateItem, dynamoReadItem, dynamoDeleteItem, dynamoAllRead};