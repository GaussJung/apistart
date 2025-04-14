'''
Title : 전화번호부 CRUD (using python)
Description : Api-Gateway를 통한 dynamoDB연동 (RDB등 기타자원과 연동가능) 
Author : C.W.Jung 
Version : 1.5 (로그기록추가)
Lang/Arch : Python3.13 & ARM64 
호출예시 : apigateway-endpoint/items (전체목록보기)
'''

import json
import hashlib
import base64
import os
from dynamo_control import dynamoAllRead, dynamoCreateItem, dynamoItemRead, dynamoUpdateItem,dynamoDeleteItem
 
# 헤더 설정
header =  {
     "Content-Type" : "application/json"
}
 
# 람다 핸들러
def lambda_handler(event, context):
  
    # CloudWatch LogGroup에서 확인하기 위한 환경 및 이벤트내용 출력 (실제운영시에는 제외) 
    print('## ENVIRONMENT VARIABLES for v1.5')
    print(os.environ)
    print('## EVENT')
    print(event)
    
    # 라우터 키값 
    routeKeyVal = event['routeKey']; 
 
    # 상태코드값  
    statusCodeVal = 0
    
    # ID값 
    idVal = 0 
   
    try:
        # 상태코드 
        statusCodeVal = 200 
        # event데이터 호출 
        bodyData = ''   # body데이터 들어감
        
        # 라우터 키값에 따라 실행
        if routeKeyVal == 'GET /items' : 
            # id가 존재할때는 id에 해당하는 아이템만 검색 아니면 전체 검색
            bodyData = dynamoAllRead()
        elif routeKeyVal == 'GET /items/{id}' : 
            # 아이템 단항목정보 
            idVal = event['pathParameters']['id']
            print('============ GET Single Item idVal ===============')
            print("GET ITEM idVal=" + idVal )
            bodyData = dynamoItemRead(idVal)
        elif routeKeyVal  == 'PUT /items' :
            # PUT일 경우에만 body데이터 넘어옴 
            # Dictionary to JSON - json.dumps()
            # JSON to Dictionary - json.loads()
            # event['body']는 JSON자료임 --> PUT은 Dictionary형태로 진행 
            clientData = json.loads(event['body']);
            # 아이템 생성
            bodyData = dynamoCreateItem(clientData)
        elif routeKeyVal == 'DELETE /items/{id}' : 
            # 아이템 삭제
            idVal = event['pathParameters']['id']
            bodyData = dynamoDeleteItem(idVal)
        else:
            print('========== UNSUPPORTED ROUTE ========== ')
            print(routeKeyVal)
            bodyData = '' 
     
    except ValueError as m:
        statusCodeVal = 400 
        print('============ ERROR ===============')
        print(m)
    else:
        statusCodeVal = 201 
    finally:
        # 전달자료 변환 
        # OLD  jsonData = json.dumps(bodyData) # json형태 한글깨짐 
        jsonData = json.dumps(bodyData, ensure_ascii=False).encode('utf8') # 한글깨짐문제 해결 
         
    # client로 전송
    return{
            'headers': header,
            'statusCode':statusCodeVal,
            'body': jsonData
    }