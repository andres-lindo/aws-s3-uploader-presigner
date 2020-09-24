import boto3
from datetime import datetime
import json
import base64
import os

def lambda_handler(event, context):
    
    access_key = os.environ['access_key']
    secret_key = os.environ['secret_key']
    bucket = os.environ['bucket_name']
    
    contentType = event["headers"]["content-type"]
    fileName = event["headers"]["file-name"]
    method = event["headers"]["method"]
    
    s3 = boto3.client('s3',
        aws_access_key_id=access_key,
        aws_secret_access_key=secret_key,
    )
    
    if method == "GET":
        response = s3.generate_presigned_url(
            ClientMethod='get_object',
            Params={
                'Bucket': bucket,
                'Key': fileName
            },
            ExpiresIn=604800,
        )
        
    if method == "PUT":
        response = s3.generate_presigned_url(
            ClientMethod='put_object',
            Params={
                'Bucket': bucket,
                'Key': fileName,
                'ContentType': contentType
            }
        )

    return {
        "signed_url": response
    }    
