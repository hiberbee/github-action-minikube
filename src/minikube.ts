import { exec } from '@actions/exec'
import os from 'os'

type StartArguments = {
  cpus?: number
  nodes?: number
  addons: string[]
  networkPlugin?: string
  kubernetesVersion?: string
}

export async function start(args: StartArguments): Promise<void> {
  await exec('minikube', [
    `--nodes=${args.nodes}`,
    `--addons=${args.addons.join(',')}`,
    `--kubernetes-version=${args.kubernetesVersion}`,
    `--network-plugin=${args.networkPlugin}`,
    `--cpus=${args.cpus}`,
    `--wait=all`,
    `--interactive=false`,
    `start`,
  ])
}

export default function (version: string): string {
  const osPlat = os.platform()
  const platform = osPlat === 'win32' ? 'windows' : osPlat
  const suffix = osPlat === 'win32' ? '.exe' : ''
  return `https://github.com/kubernetes/minikube/releases/download/v${version}/minikube-${platform}-amd64${suffix}`
}
