

// 2022. 07. 21  ID Token Custom Authorizer for Google Login /  by C.W.Jung 

const atobUTF8 = function(b64Encoded) {return Buffer.from(b64Encoded, 'base64').toString('utf8');}


// const secretKeyVal = '1111ABCD1234' - Simple Code / not for this source 
let id_token_decoded_json = {}; 

function getTokenPayload(id_tokenValue) {
 
        let id_tokenArray = id_tokenValue.split('.'); // Header, Payload, Signature 
        let id_tokenHeaderDecoded = atobUTF8(id_tokenArray[0]);  // Header 
        let id_tokenPayloadDecoded  = atobUTF8(id_tokenArray[1]);  // Payload 
        let id_tokenSignature = id_tokenArray[2]; // Signature 

        console.log("IDT-1. id_tokenHeaderDecoded=" + id_tokenHeaderDecoded );
        console.log("IDT-2. id_tokenPayloadDecoded=" + id_tokenPayloadDecoded );
        console.log("JDT-3. id_token_Signature=" + id_tokenSignature  );
 
        id_token_decoded_json.header = id_tokenHeaderDecoded; 
        id_token_decoded_json.payload = id_tokenPayloadDecoded;
 
        // JSON형태의 Payload 
        return id_tokenPayloadDecoded;
}

 
exports.handler = async(event) => {

    console.log('### phonebook_simple_lambda_authorizer v1.9 ###');
    console.log(event);

    let id_token_input = event.headers.authorization;   // 토큰값 입력받음 
    let payloadJson; // 토큰페이로드객체 JSON 
    let errorDesc = "";  // 오류설명 
    let errorCode = 0;  // 오류코드 
    let currentTimeInSeconds = 0; // 현재일자시간 밀리초 

    // STEP10. 답변 선언 
    let response = {};
    
    // STEP10. 토큰검증 
    if  ( id_token_input === undefined || id_token_input.length === 0 ) {
        errorCode = 100; 
        errorDesc = "No value for id_token"; 
    }
    else {

        // 페이로드 객체값 확인 
        payloadJson = getTokenPayload(id_token_input); 
        
        let  payloadObj = JSON.parse(payloadJson);
        
        console.log('T1. payload=' + payloadJson);
        
        console.log('T2. payloadJson.aud=' + payloadObj.aud);
        console.log('T3. payloadObj.iss=' + payloadObj.iss);
        console.log('T4. payloadObj.exp=' + payloadObj.exp);
        console.log('T5. payloadObj.email=' + payloadObj.email);
        
        console.log('T6.  process.env.AUD_VALUE =' + process.env.AUD_VALUE );

        currentTimeInSeconds = Math.floor(Date.now()/1000); //초로 구성된 타임스탬프 
        
        console.log('T5. currentTimeInSeconds=' + currentTimeInSeconds);
        
        // STEP20. 페이로드 값 검증 
        if ( payloadObj.iss !==  process.env.ISS_VALUE ) {
            
            console.log(' ====================== 110. UNMATCH ISS ==================== ');
            errorCode = 110; 
            errorDesc = "Unmatch ISS"; 
        }
        else if ( payloadObj.aud !==  process.env.AUD_VALUE ) {
            
            console.log(' ====================== 120. UNMATCH AUD ==================== ');
            
            errorCode = 120; 
            errorDesc = "Unmatch AUD";
        }
        else if ( parseInt(payloadObj.exp) < parseInt(currentTimeInSeconds) ) {
            
            console.log(' ====================== 130. Expired Token ==================== ');
            
            errorCode = 130; 
            errorDesc = "Expired Token"; 
        }
        else {
            
             console.log(' ====================== 000. VALID TOKEN ==================== ');
            // do nothing 
        }

    }
    
    // EOF. STEP10. 토큰검증 
 
    // 적합성 검증여부 확인 
    if ( errorCode > 0 ) {
        // 적합하지 않은 상태 
        response = {
            "isAuthorized": false,
            "context": {
                "result": errorDesc,
                "errorNum": errorCode
            }
        };
    }
    else {
        // 적합한 상태 
        response = {
            "isAuthorized": true,
            "context": {
                    "result": "Correct",
                    "errorNum": -1
             }
        };
    }
 
    return response;

}
