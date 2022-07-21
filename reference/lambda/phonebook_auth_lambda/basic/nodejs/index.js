const secretKeyVal = '1111ABCD1234'

exports.handler = async(event) => {

    console.log('### phonebook_simple_lambda_authorizer ###');
    console.log(event);

    let response = {
        "isAuthorized": false,
        "context": {
                "exampleKey": "Incorrect"
            }
    };
    

    if (event.headers.authorization === secretKeyVal ) {
        response = {
            "isAuthorized": true,
            "context": {
                "exampleKey": "Correct"
            }
        };
    }

    return response;

};
