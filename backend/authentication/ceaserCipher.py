import json
import boto3

client = boto3.client('cognito-idp')
def lambda_handler(event, context):
    body = json.loads(event['body'])
    # Input Provided by the user
    input_text = body.get('input').upper()
    # cipher text random generated
    cipher_text = body.get('cipherText')
    key = body.get('key')
    user_id = body.get('userId')
    
    if input_text is None or cipher_text is None or key is None or user_id is None:
        return {
            'statusCode': 400,
            'body': json.dumps({'success': False, 'message': 'Missing input, cipherText or key'})
        }
    
    user_attributes = get_user_attributes(user_id)

    # Extract user role from attributes
    for attr in user_attributes:
        if attr['Name'] == 'custom:userRole':
            user_role = attr['Value']
            break

    expected_plain_text = caesar_decrypt(input_text, key)
    
    return {
        'statusCode': 200,
        'body': json.dumps({'success': cipher_text.upper() == expected_plain_text,'userRole': user_role})
    }


def get_user_attributes(user_id):
    try:
        response = client.admin_get_user(
            UserPoolId='us-east-1_uBDCBcAXG',
            Username=user_id
        )

        return response['UserAttributes']

    except client.exceptions.UserNotFoundException as e:
        raise Exception(f'User not found: {user_id}')
    except Exception as e:
        raise Exception(f'Failed to fetch user attributes: {str(e)}')


def caesar_decrypt(cipher_text, shift):
    decrypted_text = []
    for char in cipher_text:
        if char.isalpha():
            base = ord('A') if char.isupper() else ord('a')
            decrypted_text.append(chr((ord(char) - base - shift) % 26 + base))
        else:
            decrypted_text.append(char)
    return ''.join(decrypted_text)
