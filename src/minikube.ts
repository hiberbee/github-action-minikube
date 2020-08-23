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
  let commandLine = args.addons.length > 0 ? args.addons.map(value => `--addons=${value}`) : ['--install-addons=false']
  commandLine = !args.networkPlugin ? commandLine : commandLine.concat(`--network-plugin=${args.networkPlugin}`)
  commandLine = !args.memory ? commandLine : commandLine.concat(`--memory=${args.memory}`)
  commandLine = !args.cpus ? commandLine : commandLine.concat(`--cpus=${args.cpus}`)
  commandLine = !args.nodes ? commandLine : commandLine.concat(`--nodes=${args.nodes}`)
  return commandLine.concat(
    `--kubernetes-version=${args.kubernetesVersion ?? 'stable'}`,
    '--embed-certs',
    '--delete-on-failure=true',
    '--interactive=false',
    '--auto-update-drivers=false',
    '--wait=apiserver',
  )
}

export default async function (args: StartArguments): Promise<void> {
  await exec('minikube', commandLineArgs(args).concat('start'))
}
