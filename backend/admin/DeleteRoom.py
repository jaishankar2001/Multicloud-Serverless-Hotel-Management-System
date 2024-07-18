import boto3
import json
import logging

logger = logging.getLogger()
logger.setLevel(logging.INFO)

dynamodb = boto3.resource('dynamodb')
table_name = 'Bookings' 
table = dynamodb.Table(table_name)

def lambda_handler(event, context):
    try:
        logger.info('Received event: %s', json.dumps(event))
        
        body = json.loads(event['body'])
        room_type = body['room_data']['Type']
        capacity = body['room_data']['Capacity']
        
        logger.info('Deleting item with Type: %s, Capacity: %s', room_type, capacity)

        response = table.delete_item(
            Key={
                'Type': room_type,
                'Capacity': capacity
            }
        )
        logger.info('Delete item response: %s', response)

        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json'
            },
            'body': json.dumps({
                'message': 'Room deleted successfully'
            })
        }
    except Exception as e:
        logger.error('Error deleting room: %s', str(e))
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json'
            },
            'body': json.dumps({
                'message': 'Error deleting room',
                'error': str(e)
            })
        }
