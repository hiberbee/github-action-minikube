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
  let commandLine = args.addons
    .map(value => `--addons=${value}`)
    .concat([`--nodes=${args.nodes}`, `--cpus=${args.cpus}`, `--wait=all`, `--interactive=false`, `start`])
  commandLine = !args.kubernetesVersion
    ? commandLine
    : commandLine.concat(`--kubernetes-version=${args.kubernetesVersion}`)
  commandLine = !args.networkPlugin ? commandLine : commandLine.concat(`--network-plugin=${args.networkPlugin}`)
  commandLine = !args.nodes ? commandLine : commandLine.concat(`--nodes=${args.nodes}`)
  return commandLine
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
