import json

def lambda_handler(event, context):
    # Extract the slot value
    slots = event['sessionState']['intent']['slots']
    print(slots)
    booking_reference_number = slots['BookingReferenceNumber']['value']['interpretedValue']
    
    # Construct the URL
    base_url = "http://localhost:3000/chat/"
    user = "user"
    url = f"{base_url}{booking_reference_number}/{user}"
    
    # Prepare the response
    response = {
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
    
    return response
