/*
Title : 전화번호부 index.Handler
Desc : 교육목적으로 추가한 참조로그는 실제 운영시 제거 필요 
Author : C.W.Jung 
Version : 1.4 (로그기록추가)
AWS-SDK : V3
Lang/Arch : Node20.x & ARM64 
호출예시 : apigateway-endpoint/items (전체목록보기)
*/ 

// DynamoDB함수선언 SDK V2 
// const {dynamoCreateItem, dynamoReadItem, dynamoDeleteItem, dynamoAllRead} = require("./dynamoDBControl.mjs");

// NEW V3 
import {dynamoCreateItem, dynamoReadItem, dynamoDeleteItem, dynamoAllRead} from "./dynamoDBControl.mjs";
 
// OLD : SDK V2 exports.handler = async (event, context) => { 
  
// 핸들러 함수 (Lambda시작점)   
export const handler = async (event, context) => {

  console.info("Initial Log N16-1 EVENT\n" + JSON.stringify(event, null, 2));
  
  
  let responseBody;    // 응답정보 ( bodyOut값으로 변환되어 출력됨 )
  let bodyOut;         // Body출력 
  let idVal;           // 항목 ID값 (Primary Key)
  let statusCode = 0;  // 상태코드 200:정상,  400:오류 
  let requestJSON;     // 요청 JSON 
  
  // 헤더설정 
  const headers = {
    "Content-Type": "application/json"
 };

 
  // 이벤트 정보출력 
  function showEventLog(event) {
    console.info("EVENT\n" + JSON.stringify(event, null, 2));
  }
  
  try {
    // 정상 상태 
    statusCode = 200;
    
    let currentStage = event.requestContext.stage; 
    
    // 현재 스테이지가 기본상태일 경우 환경변수 출력 
    if ( currentStage === "$default" ) {
        console.log("PhoneBook2 ENVIRONMENT VARIABLES\n" + JSON.stringify(process.env, null, 2));
        console.log("PhoneBook2 CONTEXT\n" + JSON.stringify(context, null, 2));
    }
    else {
        console.log("PhoneBook2 STAGE=" + currentStage); 
    }
    
    console.log("PhoneBook2 T1 event.routeKey=" + event.routeKey); 
 
    switch (event.routeKey) {
      
      case "DELETE /items/{id}":
        // C10. 삭제 
        idVal = event.pathParameters.id; 
        await dynamoDeleteItem(idVal); 
        responseBody = `Delete item ${idVal}`;
        // ------ Record Log ---------- 
        console.log("C10 DELETE idVal=" + idVal);
        showEventLog(event);  // 이벤트 로그 출력  
        break;
        
      case "GET /items/{id}":
         // C20. 읽기 
        idVal = event.pathParameters.id; 
        responseBody= await dynamoReadItem(idVal); 
        // ------ Record Log ---------- 
        console.log("C20 GET idVal=" + idVal);
        showEventLog(event);  // 이벤트 로그 출력  
        break;
        
      case "GET /items":
        // C21. 전체읽기  (GET)
        responseBody = await dynamoAllRead();
        // ------ Record Log ---------- 
        console.log("C21 After GET ALL"); 
        showEventLog(event); 
        break;
        
      case "POST /items":
         // C22. 전체읽기 (POST)
        responseBody = await dynamoAllRead();
        // ------ Record Log ---------- 
        console.log("C22 POSTALL"); 
        showEventLog(event); 
        break;
        
      case "PUT /items":
        // C30. 항목추가 
        requestJSON = JSON.parse(event.body);
        await dynamoCreateItem(requestJSON);  
        responseBody = `Put item ${requestJSON.id}`;
        // ------ Record Log ---------- 
        console.log("C30 PUT idVal=" + requestJSON.id ); 
        showEventLog(event);  // 이벤트 로그 출력 
        break;
        
      default:
        throw new Error(`Unsupported route: "${event.routeKey}"`);
        
    }
  } 
  catch (err) {
    // 오류발생 
    statusCode = 400;
    bodyOut = err.message;
  }
  finally {
    // 최종 결과 출력
    bodyOut = JSON.stringify(responseBody);
  }
  
  // 결과값 API-Gateway전달 
  return {
     statusCode,
     body: bodyOut,
     headers
  };
  
}; 