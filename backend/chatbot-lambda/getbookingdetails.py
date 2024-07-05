import json
import boto3

def lambda_handler(event, context):
    """
    AWS Lambda function to handle Lex bot events, retrieve booking details from DynamoDB,
    and respond with appropriate booking information or error messages.
    """
    
    # Extract slot values from the Lex event
    slots = event['sessionState']['intent']['slots']
    userid = slots['username']['value']['interpretedValue']
    booking_reference = slots['bookingID']['value']['interpretedValue']
    
    # Initialize DynamoDB client
    dynamodb = boto3.client('dynamodb')
    
    try:
        # Retrieve item from DynamoDB table based on user ID
        response = dynamodb.get_item(
            TableName='BookingDetails',
            Key={'userid': {'S': userid}}
        )
        
        # Check if the item exists in the response
        if 'Item' in response:
            item = response['Item']
            # Check if the booking reference matches
            if item['bookingID']['S'] == booking_reference:
                name = item['name']['S']
                room_number = item['roomNumber']['N']
                stay_duration = item['stayDuration']['S']
                message = (f"Booking Details:\n"
                           f"Name: {name}\n"
                           f"Room Number: {room_number}\n"
                           f"Stay Duration: {stay_duration}")
            else:
                message = "No booking details found for the given reference number."
        else:
            message = "No booking details found for the given user ID."
    
    except Exception as e:
        message = f"An error occurred: {str(e)}"
    
    # Construct the response for Lex
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

# # Test cases
# def test_lambda_handler():
#     """
#     Test cases to validate the lambda_handler function.
#     """
#     # Test case 1: Valid user ID and booking reference
#     event = {
#         'sessionState': {
#             'intent': {
#                 'slots': {
#                     'username': {'value': {'interpretedValue': 'user123'}},
#                     'bookingID': {'value': {'interpretedValue': 'ref123'}}
#                 }
#             }
#         }
#     }
#     context = {}
#     response = lambda_handler(event, context)
#     assert 'Booking Details' in response['messages'][0]['content'], "Test case 1 failed"
    
#     # Test case 2: Valid user ID but invalid booking reference
#     event['sessionState']['intent']['slots']['bookingID']['value']['interpretedValue'] = 'invalid_ref'
#     response = lambda_handler(event, context)
#     assert 'No booking details found for the given reference number' in response['messages'][0]['content'], "Test case 2 failed"
    
#     # Test case 3: Invalid user ID
#     event['sessionState']['intent']['slots']['username']['value']['interpretedValue'] = 'invalid_user'
#     response = lambda_handler(event, context)
#     assert 'No booking details found for the given user ID' in response['messages'][0]['content'], "Test case 3 failed"
    
#     # Test case 4: DynamoDB client exception
#     event['sessionState']['intent']['slots']['username']['value']['interpretedValue'] = 'exception_user'
#     response = lambda_handler(event, context)
#     assert 'An error occurred' in response['messages'][0]['content'], "Test case 4 failed"

# # Execute test cases
# test_lambda_handler()
