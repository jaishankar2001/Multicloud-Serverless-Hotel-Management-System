import boto3
import json
import logging

logger = logging.getLogger()
logger.setLevel(logging.INFO)

dynamodb = boto3.resource('dynamodb')
table_name = 'rooms'
table = dynamodb.Table(table_name)

def lambda_handler(event, context):
    try:
        logger.info('Received event: %s', json.dumps(event))
        
        body = json.loads(event['body'])
        room_data = body['room_data']
        
        logger.info('Adding new room with data: %s', room_data)

        response = table.put_item(
            Item=room_data
        )
        
        logger.info('Put item response: %s', response)

        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json'
            },
            'body': json.dumps({
                'message': 'Room added successfully'
            })
        }
    except Exception as e:
        logger.error('Error adding room: %s', str(e))
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json'
            },
            'body': json.dumps({
                'message': 'Error adding room',
                'error': str(e)
            })
        }
