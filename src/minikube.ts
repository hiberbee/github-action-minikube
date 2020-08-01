import { exec } from '@actions/exec'

export type StartArguments = {
  cpus?: number
  memory?: string
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
  commandLine = !args.memory ? commandLine : commandLine.concat(`--memory=${args.memory}`)
  commandLine = !args.nodes ? commandLine : commandLine.concat(`--nodes=${args.nodes}`)
  commandLine.concat('--install-addons=false', '--interactive=false', '--auto-update-drivers=false', '--wait=apiserver')
  return commandLine
}

export default async function (args: StartArguments): Promise<void> {
  await exec('minikube', commandLineArgs(args))
}
