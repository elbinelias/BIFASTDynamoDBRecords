//bifast primary lambda
const AWS = require('aws-sdk');
const docClient = new AWS.DynamoDB.DocumentClient();
const lambda = new AWS.Lambda();
console.log('Loading function');

async function insertBIFASTdetails(gcpid,userId,bifastid,status,amount,endtoendid,transactionid,name,id_key,id_user){
  // params to send to lambda
  const params = {
    FunctionName: 'UpdateDynamoDBRecords',
    InvocationType: 'RequestResponse',
    LogType: 'None',
    Payload: JSON.stringify({"item": endtoendid,"endtoendid": endtoendid, "SystemRef": gcpid, "showstatus": status, "transactionid": transactionid, "bifastid": bifastid, "amt": amount, "id_key": id_key, "id_user": id_user}) 
  };
  const response = await lambda.invoke(params).promise();
  if(response.StatusCode !== 200){
    throw new Error('Failed to get response from lambda function')
  }
  return JSON.parse(response.Payload);
}


exports.handler = function(event, context, callback) {
    console.log(JSON.stringify(event, null, 2));
	var params = {
	TableName : 'bif-table-dev',
	FilterExpression : 'userId = :search_param',
	ExpressionAttributeValues : {':search_param' :event.bifastid.toString()}
	};
	
	var documentClient = new AWS.DynamoDB.DocumentClient();
	
	documentClient.scan(params, function(err, data) {
	   if (err) console.log(err);
	   else{
	   	data.Items.forEach(function(element, index, array) {
                    	console.log('bifast is %j',element.bifastid);
                    	console.log(element.userId);
						console.log(element.bifastid);
					   	console.log(element.status);
					   	console.log(element.amount);
					   	console.log(element.endtoendid);
					   	console.log(element.transactionid);
					   	console.log(element.name);
					   	console.log(event.id_key.toString());
					   	console.log(event.id_user.toString());
					   	insertBIFASTdetails(element.gcpid,element.userId,element.bifastid,element.status,element.amount,element.endtoendid,element.transactionid,element.name,event.id_key.toString(),event.id_user.toString());
                      });
	 
	   	
	   } 
	});
   callback(null, "message");
};
