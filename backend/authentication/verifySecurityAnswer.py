import json
import boto3
from boto3.dynamodb.conditions import Key

def lambda_handler(event, context):
    dynamodb = boto3.resource('dynamodb')
    table = dynamodb.Table('UserSecurityQuestion')
    
    body = json.loads(event['body'])
    user_id = body['userId']
    provided_answer = body['securityAnswer']
    
    # Fetch user attributes from DynamoDB
    try:
        response = table.get_item(
            Key={
                'userId': user_id
            }
        )
        if 'Item' in response:
            stored_answer = response['Item'].get('securityAnswer')
            
            if stored_answer is None:
                return {
                    'statusCode': 404,
                    'body': json.dumps({'error': 'Security answer not set for the user'})
                }
            
            # Verify the provided answer with the stored answer
            if provided_answer == stored_answer:
                return {
                    'statusCode': 200,
                    'body': json.dumps({'verified': True, 'message': 'Security answer verified successfully'})
                }
            else:
                return {
                    'statusCode': 401,
                    'body': json.dumps({'verified': False, 'message': 'Security answer is incorrect'})
                }
        else:
            return {
                'statusCode': 404,
                'body': json.dumps({'error': 'User not found'})
            }
    except Exception as e:
        return {
            'statusCode': 500,
            'body': json.dumps({'error': str(e)})
        }
