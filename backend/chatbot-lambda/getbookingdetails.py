import json
import boto3

def lambda_handler(event, context):
    
    slots = event['sessionState']['intent']['slots']
    userid = slots['username']['value']['interpretedValue']
    bookingReference = slots['bookingID']['value']['interpretedValue']
    
    dynamodb = boto3.client('dynamodb')
    
    try:
        response = dynamodb.get_item(
            TableName='BookingDetails',
            Key={
                'userid': {'S': userid}
            }
        )
        
        if 'Item' in response:
            item = response['Item']
            if item['bookingID']['S'] == bookingReference:
                name = item['name']['S']
                roomNumber = item['roomNumber']['N']
                stayDuration = item['stayDuration']['S']
                print(roomNumber)
                message = (f"Booking Details:\n"
                           f"Name: {name}\n"
                           f"Room Number: {roomNumber}\n"
                           f"Stay Duration: {stayDuration}")
            else:
                message = "No booking details found for the given reference number."
        else:
            message = "No booking details found for the given user ID."
    
    except Exception as e:
        message = f"An error occurred: {str(e)}"
    
    response = {
                'sessionState': {
                    'dialogAction': {
                        'type': 'Close'
                    },
                    'intent': {
                        'name': 'bookRoom',
                        'state': 'Fulfilled'
                    }
                },
                'messages': [
                    {
                        'contentType': 'PlainText',
                        'content': message
                    }
                ]
            }
    return response