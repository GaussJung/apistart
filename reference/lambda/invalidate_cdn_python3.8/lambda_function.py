
from __future__ import print_function

# 배포 무효화(invalidation) 처리  
# 2022. 06. 25 C.W.Jung 

import boto3
import time

def lambda_handler(event, context):
    
    for items in event["Records"]:
        path = "/" + items["s3"]["object"]["key"]
    print(path)
    
    client = boto3.client('cloudfront')
    
    # CloudFront ID :  EDTWAAAXXABIM 
    # S3 Web Origin : ex) data.mydomain.com  ( 용도 : Front Web )
    # CloudFront CNAME : ex) cdn.mydomain.com  
    
    invalidation = client.create_invalidation(DistributionId='EDTWAAAXXABIM',
        InvalidationBatch={
            'Paths': {
                'Quantity': 1,
                'Items': [path]
        },
    'CallerReference': str(time.time())
})
