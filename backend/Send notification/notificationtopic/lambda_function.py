import json
import boto3

def lambda_handler(event, context):
    sns_client = boto3.client('sns')
    dynamodb_client = boto3.client('dynamodb')
    topic_arn = ""
    for record in event['Records']:
        if record['eventName'] == 'INSERT':
            new_image = record['dynamodb']['NewImage']
            
            user_id = new_image['userId']['S']
            email = new_image['email']['S']
            
            response = sns_client.create_topic(Name=user_id)
            topic_arn = response['TopicArn']
            
            sns_client.subscribe(
                TopicArn=topic_arn,
                Protocol='email',
                Endpoint=email
            )
            
            dynamodb_client.update_item(
                TableName='UserSecurityQuestion',
                Key={
                    'userId': {'S': user_id}
                },
                UpdateExpression='SET TopicArn = :topicArn',
                ExpressionAttributeValues={
                    ':topicArn': {'S': topic_arn}
                }
            )
    
    return {
        'statusCode': 200,
        'body': json.dumps({
            'message': 'Subscription successful!',
            'topicArn': topic_arn
        })
    }
