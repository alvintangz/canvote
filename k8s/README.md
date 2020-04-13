# CanVote: K8s Deployment :shipit:

Deployed CanVote within a Kubernetes cluster on the [GKE (Google Kubernetes Engine)](https://cloud.google.com/kubernetes-engine) Platform. With images built then stored in [GCR (Google Cloud Registry)](https://cloud.google.com/container-registry), we were able to simply provide full image names in the configurations. Learn more [here](https://kubernetes.io/docs/concepts/containers/images/).

### Getting Started

[Learn about getting started with setting up a cluster and setting the credentials for kubectl to use.](https://cloud.google.com/kubernetes-engine/docs/quickstart)

**Keep in mind that some things might need to change in order to make CanVote more secure and workable in production. For example, the Secure cookie needs to be added in the auth service when setting the JWT token. As well, certain CORS origins list must be updated as well to allow for cross origin sharing.**

All configurations are expected to be applied in the `canvote` namespace.
```bash
// Create namespace
$ kubectl apply -f namespace.yml
// Set current context to canvote namespace
$ kubectl config set-context --current --namespace=canvote
```

## Useful commands

```bash
// Apply configuration
$ kubectl apply -f <configuration>
// Restart all deployments
$ kubectl rollout restart deployment
// Restart deployment
$ kubectl rollout restart deployment <deployment-name>
```

Helpful links:
- [Configuring Domain Names with Static IP Addresses
](https://cloud.google.com/kubernetes-engine/docs/tutorials/configuring-domain-name-static-ip)

MongoDB and PostgreSQL are hosted in third party managed services.
