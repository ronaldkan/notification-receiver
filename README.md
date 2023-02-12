
# Notification-receiver
This service is used to receive generic endpoint request from Flux's notification controller and update image tags of deployments into DynamoDB


### Environment Variables for local
```
NODE_ENV=local
REMOTE_FUNCTION=flux-event
AWS_SDK_LOAD_CONFIG="true"
```

### Environment Variables for non-local
```
NODE_ENV=staging|production
REMOTE_FUNCTION=flux-event
AWS_SDK_LOAD_CONFIG="true"
```

### Sample request by Flux's notification controller
```
{
    "involvedObject": {
        "kind": "Kustomization",
        "namespace": "flux-system",
        "name": "ronald-app-staging",
        "uid": "a2f63dfd-73ca-48bf-97e3-a9873e44d834",
        "apiVersion": "kustomize.toolkit.fluxcd.io/v1beta2",
        "resourceVersion": "194953297"
    },
    "severity": "info",
    "timestamp": "2022-04-12T04:36:08Z",
    "message": "Reconciliation finished in 3.7240058s, next run in 1m0s",
    "reason": "ReconciliationSucceeded",
    "metadata": {
        "commit_status": "update",
        "revision": "master/123456789",
        "summary": "staging,ronald-app" <---
    },
    "reportingController": "kustomize-controller",
    "reportingInstance": "kustomize-controller-12345-12345"
}
```
