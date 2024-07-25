import json
import boto3
from datetime import datetime, timedelta
import urllib.request
import urllib.parse

dynamodb = boto3.resource('dynamodb')
bookings_table = dynamodb.Table('BookingDetails')
sqs = boto3.client('sqs')

sqs_queue_url = 'https://sqs.us-east-1.amazonaws.com/683277040625/booking-confirmation'

def get_dates_between(from_date, to_date):
    start_date = datetime.strptime(from_date, '%Y-%m-%d')
    end_date = datetime.strptime(to_date, '%Y-%m-%d')
    
    date_list = []
    
    current_date = start_date
    while current_date <= end_date:
        date_list.append(current_date.strftime('%Y-%m-%d'))
        current_date += timedelta(days=1)
    print(date_list)
    return date_list

def lambda_handler(event, context):
    print("event", type(event['Records'][0]['body']))
    event_body = json.loads(event['Records'][0]['body'])
    try:
        print("extracting from", event_body)
        room_type = event_body['room_type']
        room_cap = event_body['room_cap']
        bookingdate_from = event_body['bookingdate_from']
        bookingdate_to = event_body['bookingdate_to']
        available_rooms = int(event_body['available_rooms'])
        userID = event_body['userID']
        email = event_body['email']
        topic_arn = event_body['topic_arn']
        print("successful extraction", email)
        booking_dates = get_dates_between(bookingdate_from, bookingdate_to)
        stay_duration = len(booking_dates)
        response = bookings_table.scan(
            FilterExpression='room_type = :room_type AND room_cap = :room_cap',
            ExpressionAttributeValues={
                ':room_type': room_type,
                ':room_cap': room_cap
            }
        )

        booking_count = 0
        for item in response['Items']:
            booked_dates = get_dates_between(item.get('startDate'), item.get('endDate'))
            if any(date in booking_dates for date in booked_dates):
                booking_count += 1
        
        print(f'Found {booking_count} bookings with overlapping dates.')

        if booking_count >= available_rooms:
            subject = "booking update"
            message = f"Booking for room type:{room_type} and capacity: {room_cap} is not available for the requested timeframe, please select some other date"
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
                'body': json.dumps(f'No available rooms of type {room_type} and capacity {room_cap} for the requested dates, please choose another type of room or date')
            }

        availability_message = {
            'room_type': room_type,
            'room_cap': room_cap,
            'userID': userID,
            'bookingdate_from': bookingdate_from,
            'bookingdate_to': bookingdate_to,
            'email': email,
            'topic_arn': topic_arn,
            'name': event_body['name'],
            'stay_duration': stay_duration
        }
        print(availability_message)

        response = sqs.send_message(
            QueueUrl=sqs_queue_url,
            MessageBody=json.dumps(availability_message),
            #MessageGroupId='availabilityGroup',
            #MessageDeduplicationId=userID
        )
        print(response)

        return {
            'statusCode': 200,
            'body': json.dumps({'message': 'Date availability check successful'})
        }

    except Exception as e:
        print("error", e)
        return {
            'statusCode': 500,
            'body': json.dumps(f'Error: {str(e)}')
        }
