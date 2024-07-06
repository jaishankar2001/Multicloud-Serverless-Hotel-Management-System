import json
import boto3

def lambda_handler(event, context):
    """
    AWS Lambda function to handle Lex bot events, retrieve booking details from DynamoDB,
    and respond with appropriate booking information or error messages.
    """
    
    # Extract slot values from the Lex event and convert to lowercase
    slots = event['sessionState']['intent']['slots']
    userid = slots['username']['value']['interpretedValue'].lower()
    booking_reference = slots['bookingID']['value']['interpretedValue'].lower()
    
    # Initialize DynamoDB client
    dynamodb = boto3.client('dynamodb')
    
    try:
        # Scan items from DynamoDB table based on user ID (case insensitive)
        response = dynamodb.scan(
            TableName='BookingDetails',
            FilterExpression='contains(#userid, :userid)',
            ExpressionAttributeNames={'#userid': 'userid'},
            ExpressionAttributeValues={':userid': {'S': userid}}
        )
        
        # Check if any items exist in the response
        if 'Items' in response and response['Items']:
            # Iterate over items to find a matching booking reference (case insensitive)
            for item in response['Items']:
                if item['userid']['S'].lower() == userid and item['bookingID']['S'].lower() == booking_reference:
                    name = item['name']['S']
                    room_number = item['roomNumber']['N']
                    stay_duration = item['stayDuration']['S']
                    message = (f"Booking Details:\n"
                               f"Name: {name}\n"
                               f"Room Number: {room_number}\n"
                               f"Stay Duration: {stay_duration}")
                    break
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
#
