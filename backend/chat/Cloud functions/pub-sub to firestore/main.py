from google.cloud import firestore
from google.cloud import pubsub_v1
import base64
import json
import logging
from datetime import datetime

# Initialize Firestore
db = firestore.Client()

def firestore_update_or_create(event, context):
    """
    Triggered from a message on a Pub/Sub topic.
    Args:
         event (dict): Event payload.
         context (google.cloud.functions.Context): Metadata for the event.
    """
    # Decode the Pub/Sub message
    try:
        if 'data' in event:
            message = base64.b64decode(event['data']).decode('utf-8')
            data = json.loads(message)
            
            doc_id = data.get('booking_id')
            user_id = data.get('user_id')
            agent_id = data.get('agent_id')
            content = data.get('content')
            print(doc_id, content)
            if not doc_id:
                print("Document ID not provided in the message.")
                return

            # Reference to the document
            doc_ref = db.collection('convo').document(doc_id)

            # Check if the document exists
            doc = doc_ref.get()
            print("doc",doc)
            current_time = int(datetime.utcnow().timestamp())

            if doc.exists:
                # Update the existing document
                print("doc exists")
                doc_ref.update({str(current_time): content})
                print(f"Document {doc_id} updated with content: {content}")
            else:
                # Create a new document
                doc_ref.set({'agent_id': agent_id, 'user_id': user_id, str(current_time): content})
                print(f"New document {doc_id} created with content: {content}")
        else:
            print("No data found in the Pub/Sub message.")
    except Exception as e:
        logging.exception("Error processing Pub/Sub message: %s", e)

