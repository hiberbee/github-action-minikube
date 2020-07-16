import { exec } from '@actions/exec'
import os from 'os'

export type StartArguments = {
  cpus?: number
  nodes?: number
  addons: string[]
  networkPlugin?: string
  kubernetesVersion?: string
}

export function commandLineArgs(args: StartArguments): string[] {
  return args.addons
    .map(value => `--addons=${value}`)
    .concat([
      `--nodes=${args.nodes}`,
      `--kubernetes-version=${args.kubernetesVersion}`,
      `--network-plugin=${args.networkPlugin}`,
      `--cpus=${args.cpus}`,
      `--wait=all`,
      `--interactive=false`,
      `start`,
    ])
}

export async function start(args: StartArguments): Promise<void> {
  await exec('minikube', commandLineArgs(args))
}

export default function (version: string): string {
  const osPlat = os.platform()
  const platform = osPlat === 'win32' ? 'windows' : osPlat
  const suffix = osPlat === 'win32' ? '.exe' : ''
  return `https://github.com/kubernetes/minikube/releases/download/v${version}/minikube-${platform}-amd64${suffix}`
}
