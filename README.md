# Github Action Minikube

Downloads `minikube` and `kubectl` binaries, then set up Minikube cluster for Github Actions.

## Inputs

| Name | Description | Default |
| ---- | ----------- | ------- |
| `minikube-version` | Set minikube version | 1.12.1 |
| `kubernetes-version` | Set Kubernetes version | 1.18.6 |
| `profile` | Set minikube profile name | minikube |
| `network-plugin` | The name of the network plugin (i.e. 'cni') | n/a |
| `addons` | Comma-separated list of addons (i.e. metrics-server,registry,ingress,dashboard) | default-storageclass, storage-provisioner |
| `nodes` | Set number of cluster nodes | 1 |
| `cpus` | Number of CPUs allocated to Kubernetes | 2 |

## Outputs

- `ip`: Minikube IP

```yaml
jobs:
  minikube:
    runs-on: ubuntu-latest
    steps:
      - name: Start Minikube
        id: minikube
        uses: hiberbee/github-action-minikube@master
      - name: Get Minikube IP
        run: echo ${{ steps.minikube.outputs.ip }}
```

## Export environment vars

- `MINIKUBE_PROFILE` - setting to ${{ inputs.profile }}
- `MINIKUBE_HOME` - `/home/runner/`
- `MINIKUBE_ACTIVE_DOCKERD` - setting to `${{ inputs.profile }}`
- `DOCKER_HOST` - pointing to Minikube IP (e.g. tcp://172.17.0.3:2376)
- `DOCKER_TLS_VERIFY` - 1
- `DOCKER_CERT_PATH` - `$MINIKUBE_HOME/certs/`

### Example

```yaml
name: Minikube workflow
on: push
jobs:
  minikube:
    name: Start Kubernetes cluster on Minikube
    runs-on: ubuntu-latest
    steps:
      - name: Start Minikube
        id: minikube
        uses: hiberbee/github-action-minikube@master
        with:
          kubernetes-version: 1.18.3
          network-plugin: cni
          addons: metrics-server,ingress
          nodes: 1
          cpus: 2
      - name: Get Minikube status
        run: minikube status
      - name: Get Kubernetes cluster info
        run: kubectl cluster-info
      - name: Get Kubernetes pods
        run: kubectl get services --all-namespaces
      - name: Get Docker containers
        run: docker ps
      - name: Get Minikube IP
        run: echo ${{ steps.minikube.outputs.ip }}
```
