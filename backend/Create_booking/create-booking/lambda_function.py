import json
import boto3
import uuid
import urllib.request
import urllib.parse

dynamodb = boto3.resource('dynamodb')
bookings_table = dynamodb.Table('BookingDetails')
sqs = boto3.client('sqs')


def lambda_handler(event, context):
    print(event)
    event_body = json.loads(event['Records'][0]['body'])
    try:
        booking_id = str(uuid.uuid4())
        booking_item = {
            'bookingID': booking_id,
            'room_type': event_body['room_type'],
            'capacity': event_body['room_cap'],
            'userID': event_body['userID'],
            'startDate': event_body['bookingdate_from'],
            'endDate': event_body['bookingdate_to'],
            'name': event_body['name'],
            'stayDuration': str(event_body['stay_duration'])
        }

        bookings_table.put_item(Item=booking_item)
        
        subject = "booking confirmation"
        message = f"The {event_body['room_type']} with capacity: {event_body['room_cap']} has been booked for you from {event_body['bookingdate_from']} to {event_body['bookingdate_to']}. Your booking id is {booking_id} please keep this id safe as it will be needed during check in and if you have any queries regarding the booking"
        notification_data = {
                'email': event_body['email'],
                'topic_arn': event_body['topic_arn'],
                'subject': subject,
                'message': message
            }
            
        notification_data_encoded = json.dumps(notification_data).encode('utf-8')
        
        notification_url = 'https://foiiqhsc96.execute-api.us-east-1.amazonaws.com/development/send-notification'
        notification_req = urllib.request.Request(notification_url, data=notification_data_encoded, headers={'Content-Type': 'application/json'})
        
        with urllib.request.urlopen(notification_req) as notification_response:
            notification_response_data = notification_response.read().decode('utf-8')
            print(f"Response from notification server: {notification_response_data}")

        return {
            'statusCode': 200,
            'body': json.dumps({'message': 'Booking created successfully'})
        }

    except Exception as e:
        return {
            'statusCode': 500,
            'body': json.dumps(f'Error: {str(e)}')
        }
