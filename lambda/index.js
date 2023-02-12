// Example lambda function for notification receiver
var AWS = require('aws-sdk');
// Set the region
AWS.config.update({region: 'ap-southeast-1'});
// Setup the client
const docClient = new AWS.DynamoDB.DocumentClient();
const tableName = 'cluster-info'

exports.handler = async (event) => {
  const eventType = event.type;
  if (eventType) {
    if (eventType === "fetch") {
      // from gitlab runner
      try {
        const appName = event.name;
        const params = {
          TableName: tableName,
          Key: {
            "name": appName
          }
        }

        let result = await docClient.get(params).promise();
        let appTag = result.Item.tag;
        return appTag
      } catch (err) {
        return "App not found."
      }
    } else if (eventType === "insert") {
      // from cluster controller
      try {
        const params = {
          TableName: tableName,
          Item: event.deploymentInfo
        };

        await docClient.put(params).promise();
        return "Updated app into DB."
      } catch (err) {
        return "Error writing to DB."
      }
    }
  } else {
    return "Invalid invoke type"
  }
};
