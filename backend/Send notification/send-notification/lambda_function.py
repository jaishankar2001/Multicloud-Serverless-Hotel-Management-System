import json
import boto3
from datetime import datetime

def lambda_handler(event, context):
    sns_client = boto3.client('sns', region_name='us-east-1') 

    topic_arn = event['topic_arn']
    print(topic_arn)
    email = event['email']
    print(email)
    subject = event['subject']
    print(subject)
    message = event['message']
    print(message)
    current_time = datetime.utcnow().strftime('%Y-%m-%d %H:%M:%S')

    #subject = 'New Login Notification'
    #message = f"Hello,\n\nNew login for user {email} on {current_time}\n\nBest regards,\nDal Vacation Home"

    response = sns_client.publish(
        TopicArn=topic_arn,
        Message=message,
        Subject=subject
    )
    
    return {
        'statusCode': 200,
        'body': json.dumps({
            'message': 'Notification sent successfully!',
            'response': response
        })
    }
