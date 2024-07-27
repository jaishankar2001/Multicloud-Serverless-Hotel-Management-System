import json
import boto3
import urllib

dynamodb = boto3.resource('dynamodb')

def lambda_handler(event, context):
    # Iterate over each record in the DynamoDB stream
    for record in event['Records']:
        if record['eventName'] == 'INSERT':
            # Get the new image (the new item)
            new_image = record['dynamodb']['NewImage']
            
            # Extract the userId and Timestamp
            user_id = new_image['user_id']['S']
            timestamp = new_image['loginTimestamp']['S']
            
            table_name = 'UserSecurityQuestion'
            users_table = dynamodb.Table(table_name)
            
            user_response = users_table.get_item(Key={'userId': user_id})
            if 'Item' not in user_response:
                return {
                    'statusCode': 404,
                    'body': json.dumps('User not found')
                }

            user_item = user_response['Item']
            topic_arn = user_item['TopicArn']
            email = user_item['email']
            subject = "signin notification"
            message = f"You have successfully signed in at time {timestamp} on DalVacationHome"
            notification_data = {
                'email': email,
                'topic_arn': topic_arn,
                'subject': subject,
                'message': message
            }

            notification_data_encoded = json.dumps(notification_data).encode('utf-8')

            # Sending second POST request to Send notification URL using urllib
            notification_url = 'https://foiiqhsc96.execute-api.us-east-1.amazonaws.com/development/send-notification'
            notification_req = urllib.request.Request(notification_url, data=notification_data_encoded, headers={'Content-Type': 'application/json'})

            with urllib.request.urlopen(notification_req) as notification_response:
                notification_response_data = notification_response.read().decode('utf-8')
                print(f"Response from notification server: {notification_response_data}")

    return {
        'statusCode': 200,
        'body': json.dumps({'message': 'Processing complete'})
    }
