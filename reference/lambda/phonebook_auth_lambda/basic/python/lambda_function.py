secretKeyVal = '2222ABCD1234'    #이값이 헤더에 올경우 후속 Lambda동작하도록 함.  

def lambda_handler(event, context):

    print('#### phonebook_basic_lambda_authorizer  ####')
    
    print(event)
     
    #  secret code 사전 정의됨 
    
    if event['headers']['authorization'] == secretKeyVal :
        
        print('================== A10-A Correct secret code ========================= ')
        
        response = {
           "isAuthorized": True,
           "context": {
                "exampleKey": "Correct"
            }
        }
          
        return response

    else:
        
        print('================== A10-B Non-Correct secret code ========================= ')
        
        response = {
           "isAuthorized": False,
           "context": {
                "exampleKey": "Incorrect"
            }
           
        }

        return response
