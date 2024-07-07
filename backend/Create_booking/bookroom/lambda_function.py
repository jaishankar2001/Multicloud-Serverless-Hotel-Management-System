import json
import boto3
import uuid
from boto3.dynamodb.conditions import Key  # Import Key from boto3.dynamodb.conditions


dynamodb = boto3.resource('dynamodb')
rooms_table = dynamodb.Table('rooms')
users_table = dynamodb.Table('users')
bookings_table = dynamodb.Table('booking')

def lambda_handler(event, context):
    room_type = event['room_type']
    room_cap = str(event['room_cap'])
    user_id = event['userID']
    booking_date = event['bookingdate']
    print(room_type, type(room_type), room_cap, type(room_cap), user_id, type(user_id), booking_date, type(booking_date))
    available_rooms = 0
    # Check if the room exists
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
        print("room exists", available_rooms)
    except Exception as e:
        return {
            'statusCode': 500,
            'body': json.dumps(f'Error fetching room: {str(e)}')
        }
    try:
        # Perform the query
        response = bookings_table.scan(
            FilterExpression='bookingdate = :bookingdate AND room_type = :room_type AND room_cap = :room_cap',
            ExpressionAttributeValues={
                ':bookingdate': booking_date,
                ':room_type': room_type,
                ':room_cap': room_cap
            }
        )

        # Count the number of items returned in the response
        booking_count = len(response['Items'])
        print(booking_count)
        # Extract the count from the response
        if(booking_count>=int(available_rooms)):
            return {
                'statusCode': 200,
                'body': json.dumps(f'No available rooms of type {room_type} and capacity {room_cap} on date {booking_date}, please choose another type of room or date')
            }
    except Exception as e:
        return {
            'statusCode': 500,
            'body': str(e)
        }

    # Check if the user exists
    user_response = users_table.get_item(Key={'ID': user_id})
    if 'Item' not in user_response:
        return {
            'statusCode': 404,
            'body': json.dumps('User not found')
        }
    print("user exists")

    
    # Create a new booking
    booking_id = str(uuid.uuid4())
    booking_item = {
        'bookingID': booking_id,
        'room_type': room_type,
        'room_cap': room_cap,
        'userID': user_id,
        'bookingdate': booking_date
    }
    
    bookings_table.put_item(Item=booking_item)
    
    return {
        'statusCode': 200,
        'body': json.dumps('Booking created successfully'),
        'bookingID': booking_id
    }
