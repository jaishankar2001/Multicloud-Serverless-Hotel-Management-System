import requests

LAMBDA_URL = "https://agepdyzr72sqj2tpjfimf6xhui0huwze.lambda-url.us-east-1.on.aws/"

def get_booking_details(booking_id, name):
    """
    Calls the AWS Lambda function to get booking details based on bookingID and name.
    """
    # Payload to send to the Lambda function
    payload = {
        "bookingID": booking_id,
        "name": name
    }

    try:
        # Make the POST request to the Lambda function
        response = requests.post(LAMBDA_URL, json=payload)

        # Check if the request was successful
        if response.status_code == 200:
            # Parse the JSON response
            data = response.json()
            return data
        else:
            # Handle errors
            print(f"Error: Received status code {response.status_code}")
            print(response.text)
            return None
    except Exception as e:
        print(f"An error occurred: {e}")
        return None

def lambda_handler(event, context):
    """
    AWS Lambda function to handle Lex events and call another Lambda function.
    """
    # Extract slot values from the Lex event
    print(event)
    if(event['sessionState']['intent']['name']=='TalkToAgent'):
        LAMBDA_URL = "https://jqj55ayxhs2ynukvhh2jt4sgem0pmuos.lambda-url.us-east-1.on.aws/"
        
        slots = event['sessionState']['intent']['slots']
        booking_id = slots['BookingReferenceNumber']['value']['interpretedValue']
        payload = {
        "bookingID": booking_id}
        
        response = requests.post(LAMBDA_URL, json=payload)
        
        response = response.json()
        
        print(response)
        url = response['messages'][0]['content']
        
        
        url_ext = {
            "sessionState": {
                "dialogAction": {
                    "type": "Close"
                },
                "intent": {
                    "name": event['sessionState']['intent']['name'],
                    "state": "Fulfilled"
                }
            },
            "messages": [
                {
                    "contentType": "PlainText",
                    "content": f"Please use the following URL to talk with an agent: {url}"
                }
            ]
        }
        
        return url_ext
            
    slots = event['sessionState']['intent']['slots']
    name = slots['username']['value']['interpretedValue']
    booking_reference = slots['bookingID']['value']['interpretedValue']
    
    # Call the target Lambda function
    booking_details = get_booking_details(booking_reference, name)
    
    
    if booking_details:
        # Construct the response for Lex
        message_content = ""
        
        if 'messages' in booking_details and booking_details['messages']:
            message_content = booking_details['messages'][0]['content']
        else:
            message_content = "No booking details found."

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
                    'content': message_content
                }
            ]
        }
    else:
        # Handle the case where booking details are not retrieved
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
                    'content': "Unable to retrieve booking details."
                }
            ]
        }

    return response
