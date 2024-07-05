// import AWS from 'aws-sdk';
// import { LexRuntimeV2 } from 'aws-sdk'; 


// const lexruntime = new LexRuntimeV2({
//   region: 'us-east-1',
//   credentials: new AWS.Credentials({
//     accessKeyId: '',
//     secretAccessKey: '',
//   }),
// });

// export const sendMessageToLex = async (message, sessionId) => {
//   const params = {
//     botAliasId: 'TestBotAlias',
//     botId: '0DAEWDFPQ5', 
//     localeId: 'en_US',
//     sessionId: sessionId,
//     text: message,
//   };

//   try {
//     const data = await lexruntime.recognizeText(params).promise();
//     const responseMessage = data.messages[0].content;
//     return responseMessage;
//   } catch (error) {
//     console.error('Error sending message to Lex v2', error);
//     return error.message;
//   }
// };
