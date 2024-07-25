import json
import boto3
 
dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('available-agents')  
 
def lambda_handler(event, context):
    try:
        agent_id = event['agentID']
        type = event['type']
        if(type == 'available'):
            new_agent = {
                'agentID': agent_id
            }
            table.put_item(Item=new_agent)
            return {
                'statusCode': 200,
                'body': json.dumps({'message': 'Agent successfully made available.', 'agentID': agent_id})
            }
        else:
            table.delete_item(
                Key={
                    'agentID': agent_id
                }
            )
            return {
                'statusCode': 200,
                'body': json.dumps({'message': 'Agent successfully made unavailable.', 'agentID': agent_id})
            }

 
    except Exception as e:
        print(f"Exception: {e}")
        return {
            'statusCode': 500,
            'body': json.dumps({'message': 'Unexpected error occurred.', 'error': str(e)})
        }