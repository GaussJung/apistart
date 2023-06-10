import boto3;

# DynamoDB 테이블명 
dynamoTableName = "phonebook"  

client = boto3.resource('dynamodb')  # dynamoDb 연결
dynamoTable = client.Table(dynamoTableName)  # dynamoTable에 연결
 
    
# 데이터 전체 읽기 
def dynamoAllRead() :
    return dynamoTable.scan()

# 데이터 생성
def dynamoCreateItem(bodyData) :
   # return dynamoTable.put_item(Item=bodyData)
   return dynamoTable.put_item(Item=bodyData)
   # return client.put_item(TableName=dynamoTableName, Item=bodyData) 

# 데이터 읽기
def dynamoItemRead(paramId):
    return dynamoTable.get_item(Key = {'id' : paramId})['Item']

# 데이터 수정 ( 쿼리 실행 )
def dynamoUpdateItem(bodyData):
    updateQuery = "SET #phonenum = :phonenum, #name = :name"
    return dynamoTable.update_item(
        Key={'id' : bodyData['id']},
        UpdateExpression= updateQuery,
         ExpressionAttributeValues={
            ':phonenum': bodyData['phonenum'],
            ':name' : bodyData['name']
        },
        ExpressionAttributeNames={
            '#phonenum': "phonenum",
            '#name': "name"
        },
        ReturnValues="UPDATED_NEW"
    )

# 데이터 삭제
def dynamoDeleteItem(paramId):
    return dynamoTable.delete_item(Key={'id' : paramId})
