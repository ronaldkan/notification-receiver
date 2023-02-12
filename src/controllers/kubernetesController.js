const kubernetesService = require("../services/kubernetesService");
const axios = require("axios");
var aws = require("aws-sdk");
var lambda = new aws.Lambda({
  region: "ap-southeast-1",
});

async function fetchDeploymentInfo(req, res, next) {
  try {
    let { involvedObject, metadata } = req.body;
    let { name } = involvedObject;
    let { summary } = metadata;
    let summaryInfo = summary.replaceAll(" ", "").split(",");
    let namespace = summaryInfo[1];
    let deploymentName = name.replace(`-${summaryInfo[0]}`, "");
    let deploymentInfo = {
      name: name,
    };

    // fetch deployment information
    let deployment = await kubernetesService.fetchDeploymentInfo(
      deploymentName,
      namespace
    );

    let containers = deployment.body.spec.template.spec.containers;
    let annotations = deployment.body.metadata.annotations;

    // default assume container name is same as deployment name
    let containerName = deploymentName;

    // check if it has custom default container name
    if (annotations.hasOwnProperty("kubectl.kubernetes.io/default-container")) {
      containerName = annotations["kubectl.kubernetes.io/default-container"];
      // only fetch tag of default container
      containers.forEach((container) => {
        if (container.name === containerName) {
          deploymentInfo["tag"] = container.image;
        }
      });
    } else {
      return res.status(404).send("Default container not specified");
    }

    var params = {
      FunctionName: process.env.REMOTE_FUNCTION,
      Payload: JSON.stringify({
        type: "insert",
        deploymentInfo: deploymentInfo,
      }),
    };
    await lambda.invoke(params).promise();
    if (process.env.LOGS_ENABLED) {
      console.log(`Pushed information for: ${name}, ${deploymentInfo.tag}`);
    }
    return res.json(deploymentInfo);
  } catch (err) {
    return res.status(404).send("Deployment not found");
  }
}

module.exports = {
  fetchDeploymentInfo,
};
