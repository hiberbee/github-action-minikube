import * as core from '@actions/core'
import * as exec from '@actions/exec'
import * as tc from '@actions/tool-cache'
import * as os from 'os'
import * as io from '@actions/io'
import * as path from 'path'

type StartArguments = {
  cpus?: number
  nodes?: number
  networkPlugin?: string
  kubernetesVersion?: string
}

export async function StartMinikube(args: StartArguments): Promise<void> {
  await exec.exec('minikube', [
    `--nodes=${args.nodes}`,
    `--kubernetes-version=${args.kubernetesVersion}`,
    `--network-plugin=${args.networkPlugin}`,
    `--enable-default-cni=${args.networkPlugin === 'cni' ? 'true' : 'false'}`,
    `--cpus=${args.cpus}`,
    `--wait=all`,
    `--interactive=false`,
    `start`,
  ])
}

export function getDownloadUrl(version: string): string {
  const osPlat = os.platform()
  const platform = osPlat === 'win32' ? 'windows' : osPlat
  const suffix = osPlat === 'win32' ? '.exe' : ''
  return `https://github.com/kubernetes/minikube/releases/download/v${version}/minikube-${platform}-amd64${suffix}`
}

export async function DownloadMinikube(version: string, binPath: string): Promise<void> {
  const downloadPath = await tc.downloadTool(getDownloadUrl(version))
  await io.mkdirP(binPath)
  await exec.exec('chmod', ['+x', downloadPath])
  await io.mv(downloadPath, path.join(binPath, 'minikube'))
  core.addPath(binPath)
}
