import json
import boto3

dynamodb = boto3.resource('dynamodb')
cognito = boto3.client('cognito-idp')

TABLE_NAME = 'UserSecurityQuestion'

def lambda_handler(event, context):
    try:
        body = json.loads(event['body'])
        security_question = body['securityQuestion']
        security_answer = body['securityAnswer']
        user_id = body['userId']
        user_role = body['userRole']

        user_attributes = get_user_attributes(user_id)

        store_security_details(user_id, security_question, security_answer, user_attributes, user_role)
        assign_user_role(user_id, user_role)
        add_user_to_group(user_id, user_role)

        response = {
            'statusCode': 200,
            'body': json.dumps({
                'message': 'Security details and user attributes stored successfully',
                'userAttributes': user_attributes
            })
        }

    except Exception as e:
        response = {
            'statusCode': 500,
            'body': json.dumps({
                'message': 'Error storing security details or fetching user attributes',
                'error': str(e)
            })
        }

    return response

def get_user_attributes(user_id):
    try:
        response = cognito.admin_get_user(
            UserPoolId='us-east-1_uBDCBcAXG',
            Username=user_id
        )
        user_attributes = {attr['Name']: attr['Value'] for attr in response['UserAttributes']}
        return user_attributes
    except Exception as e:
        print(f'Error fetching user attributes from Cognito: {str(e)}')
        raise

def store_security_details(user_id, security_question, security_answer, user_attributes, user_role):
    try:
        table = dynamodb.Table(TABLE_NAME)
        item = {
            'userId': user_id,
            'securityQuestion': security_question,
            'securityAnswer': security_answer,
            'hasSecurityQuestion' : 'true',
            'userRole' : user_role
            
        }
        for attr_name, attr_value in user_attributes.items():
            item[attr_name] = attr_value
        
        
        table.put_item(Item=item)
        print('Security details and user attributes stored in DynamoDB')
    except Exception as e:
        print(f'Error storing security details and user attributes in DynamoDB: {str(e)}')
        raise



def assign_user_role(user_id, user_role):
    try:
        response = cognito.admin_update_user_attributes(
            UserPoolId='us-east-1_uBDCBcAXG',
            Username=user_id,
            UserAttributes=[
                {
                    'Name': 'custom:userRole',
                    'Value': user_role
                }
            ]
        )
        print(f'User role updated to {user_role} in Cognito User Pool')
    except Exception as e:
        print(f'Error assigning user role in Cognito User Pool: {str(e)}')
        raise
    
    

def add_user_to_group(user_id, user_role):
    try:
        group_name = 'RegisteredUsers' if user_role == 'RegisteredUser' else 'PropertyAgents'
            
        response = cognito.admin_add_user_to_group(
            UserPoolId='us-east-1_uBDCBcAXG',
            Username=user_id,
            GroupName=group_name
        )
        print(f'User added to group {group_name} in Cognito User Pool')
    except Exception as e:
        print(f'Error adding user to group in Cognito User Pool: {str(e)}')
        raise

