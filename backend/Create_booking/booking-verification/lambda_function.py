import json
import boto3
import logging
logger = logging.getLogger()
logger.setLevel(logging.INFO)

dynamodb = boto3.resource('dynamodb')
rooms_table = dynamodb.Table('rooms')
users_table = dynamodb.Table('UserSecurityQuestion')
sqs = boto3.client('sqs')

sqs_queue_url = 'https://sqs.us-east-1.amazonaws.com/683277040625/booking-verification'

def lambda_handler(event, context):
    room_type = event['room_type']
    room_cap = str(event['room_cap'])
    user_id = event['userID']

    try:
        room_response = rooms_table.get_item(
            Key={
                'Type': room_type,
                'Capacity': room_cap
            }
        )
        if 'Item' not in room_response:
            return {
                'statusCode': 404,
                'body': json.dumps('Room not found')
            }

        available_rooms = room_response['Item'].get('Available Rooms', None)
        print("Room exists", available_rooms)

        user_response = users_table.get_item(Key={'userId': user_id})
        if 'Item' not in user_response:
            return {
                'statusCode': 404,
                'body': json.dumps('User not found')
            }

        user_item = user_response['Item']
        topic_arn = user_item['TopicArn']
        email = user_item['email']
        name = user_item['given_name']
        print("User exists")

        verification_message = {
            'room_type': room_type,
            'room_cap': room_cap,
            'userID': user_id,
            'bookingdate_from': event['bookingdate_from'],
            'bookingdate_to': event['bookingdate_to'],
            'available_rooms': available_rooms,
            'email': email,
            'topic_arn': topic_arn,
            'name': name
        }

        response = sqs.send_message(
            QueueUrl=sqs_queue_url,
            MessageBody=json.dumps(verification_message),
            #MessageGroupId='verificationGroup',
            #MessageDeduplicationId=user_id
        )
        logger.info(f'Verification message sent successfully {response}')

        return {
            'statusCode': 200,
            'body': json.dumps({'message': 'Booking initiated, check your email for further updates'})
        }

    except Exception as e:
        return {
            'statusCode': 500,
            'body': json.dumps(f'Error: {str(e)}')
        }
