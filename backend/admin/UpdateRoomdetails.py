import json
import boto3
import logging

logger = logging.getLogger()
logger.setLevel(logging.INFO)

dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('rooms')

def lambda_handler(event, context):
    logger.info('Received event: %s', json.dumps(event))
    
    try:
        # Parse the event body
        body = json.loads(event['body'])
        room_data = body.get('room_data', {})
        
        # Validate required fields
        required_fields = ['Type', 'Capacity', 'Features', 'Available Rooms', 'Cost']
        for field in required_fields:
            if field not in room_data:
                error_message = f"{field} must be provided"
                logger.error(error_message)
                return {
                    'statusCode': 400,
                    'body': json.dumps(error_message)
                }
        
        # Update the item in DynamoDB
        response = table.update_item(
            Key={
                'Type': room_data['Type'],
                'Capacity': room_data['Capacity']
            },
            UpdateExpression="SET Features = :f, #AR = :ar, Cost = :c",
            ExpressionAttributeValues={
                ':f': room_data['Features'],
                ':ar': room_data['Available Rooms'],
                ':c': room_data['Cost']
            },
            ExpressionAttributeNames={
                "#AR": "Available Rooms"
            },
            ReturnValues="UPDATED_NEW"
        )
        
        logger.info('Update response: %s', response)
        
        return {
            'statusCode': 200,
            'body': json.dumps(f"Room updated successfully: {response['Attributes']}")
        }
    
    except Exception as e:
        logger.error('Error updating room: %s', str(e))
        return {
            'statusCode': 500,
            'body': json.dumps(f"Error updating room: {str(e)}")
        }
