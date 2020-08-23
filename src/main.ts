import { getInput, setFailed, exportVariable, setOutput, error } from '@actions/core'
import minikube from 'src/minikube'
import download from 'src/download'
import { exec } from '@actions/exec'
import { ExecOptions } from '@actions/exec/lib/interfaces'
import { cacheDir } from '@actions/tool-cache'
import os from 'os'
import path from 'path'

async function run(): Promise<void> {
  const osPlat = os.platform()
  const platform = osPlat === 'win32' ? 'windows' : osPlat
  const suffix = osPlat === 'win32' ? '.exe' : ''
  const minikubeVersion = getInput('minikube-version')
  const kubernetesVersion = getInput('kubernetes-version')
  const minikubeUrl = `https://github.com/kubernetes/minikube/releases/download/v${minikubeVersion}/minikube-${platform}-amd64${suffix}`
  const kubectlUrl = `https://storage.googleapis.com/kubernetes-release/release/v${kubernetesVersion}/bin/${platform}/amd64/kubectl${suffix}`

  const options: ExecOptions = {}
  const profile = getInput('profile')
  const binDir = `${process.env.HOME}/bin`
  exportVariable('MINIKUBE_PROFILE_NAME', profile)
  exportVariable('MINIKUBE_HOME', path.join(process.env.HOME ?? '/home/runner', '.minikube'))

  try {
    options.listeners = {
      stdout: data => {
        const ip = data.toString().trim()
        exportVariable('DOCKER_HOST', `tcp://${ip}:2376`)
        exportVariable('DOCKER_TLS_VERIFY', '1')
        exportVariable('DOCKER_CERT_PATH', `${process.env.MINIKUBE_HOME}/.minikube/certs`)
        exportVariable('MINIKUBE_ACTIVE_DOCKERD', profile)
        setOutput('ip', ip)
      },
      stderr: (data: Buffer) => {
        error(data.toString())
      },
    }
    await download(minikubeUrl, `${binDir}/minikube`)
    await download(kubectlUrl, `${binDir}/kubectl`)
    await minikube({
      nodes: Number.parseInt(getInput('nodes')),
      memory: getInput('memory'),
      addons: getInput('addons').split(','),
      cpus: Number.parseInt(getInput('cpus')),
      kubernetesVersion: getInput('kubernetes-version'),
      networkPlugin: getInput('network-plugin'),
    }).then(() => exec('minikube', ['ip'], options))
    await cacheDir(`${process.env.MINIKUBE_HOME}/cache`, 'minikube', minikubeVersion)
  } catch (error) {
    setFailed(error.message)
  }
}

// noinspection JSIgnoredPromiseFromCall
run()
