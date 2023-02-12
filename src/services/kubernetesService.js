const k8s = require("@kubernetes/client-node");

function initKubeConfig() {
  const kc = new k8s.KubeConfig();
  if (process.env.NODE_ENV === "local") {
    kc.loadFromDefault();
  } else {
    kc.loadFromCluster();
  }
  return kc;
}

async function fetchDeploymentInfo(deploymentName, namespace) {
  const kc = initKubeConfig();
  const appsV1Api = kc.makeApiClient(k8s.AppsV1Api);
  try {
    let deployment = await appsV1Api.readNamespacedDeployment(
      deploymentName,
      namespace
    );
    return deployment;
  } catch (error) {
    return null;
  }
}

async function fetchHelmRelease(deploymentName, namespace) {
  const kc = initKubeConfig();
  const k8sApi = kc.makeApiClient(k8s.CustomObjectsApi);
  try {
    let helmRelease = await k8sApi.getNamespacedCustomObject(
      "helm.toolkit.fluxcd.io",
      "v2beta1",
      namespace,
      "helmreleases",
      deploymentName
    );
    return helmRelease;
  } catch (error) {
    return null;
  }
}

async function deleteHelmRelease(deploymentName, namespace) {
  const kc = initKubeConfig();
  const k8sApi = kc.makeApiClient(k8s.CustomObjectsApi);
  try {
    await k8sApi.deleteNamespacedCustomObject(
      "helm.toolkit.fluxcd.io",
      "v2beta1",
      namespace,
      "helmreleases",
      deploymentName
    );
  } catch (error) {
  }
}

module.exports = {
  fetchDeploymentInfo,
  fetchHelmRelease,
  deleteHelmRelease,
};
