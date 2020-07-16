import * as core from '@actions/core'
import * as exec from '@actions/exec'
import * as tc from '@actions/tool-cache'
import * as os from 'os'
import * as io from '@actions/io'
import * as path from 'path'

export async function StartMinikube(): Promise<void> {
  await exec.exec('minikube', ['start', '--wait=all'])
}

export function getDownloadUrl(version: string): string {
  const osPlat = os.platform()
  const platform = osPlat === 'win32' ? 'windows' : osPlat
  const suffix = osPlat === 'win32' ? '.exe' : ''
  return `https://github.com/kubernetes/minikube/releases/download/v${version}/minikube-${platform}-amd64${suffix}`
}

export async function DownloadMinikube(): Promise<void> {
  const version = process.env.MINIKUBE_VERSION ?? '1.12.0'
  const url = getDownloadUrl(version)
  const downloadPath = await tc.downloadTool(url)
  const binPath = process.env.BIN_DIR ?? '/usr/local/bin'
  await io.mkdirP(binPath)
  await exec.exec('chmod', ['+x', downloadPath])
  await io.mv(downloadPath, path.join(binPath, 'minikube'))
  core.addPath(binPath)
}
