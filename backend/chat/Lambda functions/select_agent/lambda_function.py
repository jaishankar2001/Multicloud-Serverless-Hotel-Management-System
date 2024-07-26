import json
import boto3
import random
import urllib.request
import urllib.parse

dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('available-agents')  
bookings_table = dynamodb.Table('BookingDetails')
user_table = dynamodb.Table('UserSecurityQuestion')

def lambda_handler(event, context):
    try:
        userid = event["userid"]
        print(userid)
        booking_id = event["booking_id"]
        agents = table.scan()['Items']
        if not agents:
            return {
                'statusCode': 404,
                'body': json.dumps({'message': 'No agents available.'})
            }
        print("checking if booking exists")
        bookings_response = bookings_table.get_item(Key={'bookingID': booking_id})
        if 'Item' not in bookings_response:
            return {
                'statusCode': 404,
                'body': json.dumps('booking not found')
            }
        print("booking exists")
        user_response = user_table.get_item(Key={'userId': userid})
        if 'Item' not in user_response:
            return {
                'statusCode': 404,
                'body': json.dumps('User not found')
            }
        user_item = user_response['Item']
        email = user_item.get('Email')
        topic_arn = user_item.get('TopicArn')
        subject = "link to chat with agent"
        message = "Please use the link http://localhost:3000/chat/" + booking_id + "/user"
        
        print("booking exists")
        selected_agent = random.choice(agents)
        print("selected_agent", selected_agent['agentID'])
        agent_id = selected_agent['agentID']
        print(agent_id)
        table.delete_item(Key={'agentID': agent_id})
        
        post_data = {
            'booking_id': booking_id,
            'user_id':userid,
            'agent_id':agent_id,
            'content': event["content"]
        }
        print(post_data)
        
        data = json.dumps(post_data).encode('utf-8')
        
        url = 'https://us-central1-dalvacationhome-427921.cloudfunctions.net/initiate-convo'
        req = urllib.request.Request(url, data=data, headers={'Content-Type': 'application/json'})
        
        with urllib.request.urlopen(req) as response:
            response_data = response.read().decode('utf-8')
            print(f"Response from server: {response_data}")
        
        print(f"Agent {agent_id} removed and data sent to another URL.")
        
        notification_data = {
            'email': email,
            'topic_arn': topic_arn,
            'subject': subject,
            'message': message
        }
        
        notification_data_encoded = json.dumps(notification_data).encode('utf-8')
        
        notification_url = 'https://foiiqhsc96.execute-api.us-east-1.amazonaws.com/development/send-notification'
        notification_req = urllib.request.Request(notification_url, data=notification_data_encoded, headers={'Content-Type': 'application/json'})
        
        with urllib.request.urlopen(notification_req) as notification_response:
            notification_response_data = notification_response.read().decode('utf-8')
            print(f"Response from notification server: {notification_response_data}")
        
        print(f"Agent {agent_id} removed and data sent to another URL.")
        
        return {
            'statusCode': 200,
            'body': json.dumps({'message': 'Agent removed successfully and data sent.'})
        }
    except Exception as e:
        print(f"Error: {e}")
        return {
            'statusCode': 500,
            'body': json.dumps({'message': 'Error processing request.'})
        }
