import { getInput, setFailed, exportVariable, setOutput, error, info } from '@actions/core'
import minikubeUrl, { start } from 'src/minikube'
import download from 'src/download'
import kubectlUrl from 'src/kubectl'
import helmUrl from 'src/helm'
import { exec } from '@actions/exec'
import { ExecOptions } from '@actions/exec/lib/interfaces'
import { extractTar } from '@actions/tool-cache'

async function run(): Promise<void> {
  const options: ExecOptions = {}
  const profile = getInput('profile')
  const binDir = '/home/runner/bin'
  exportVariable('MINIKUBE_PROFILE_NAME', profile)
  exportVariable('MINIKUBE_HOME', '/home/runner')

  try {
    options.listeners = {
      stdout: (data) => {
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
    await download({
      url: minikubeUrl(getInput('version')),
      dir: binDir,
      file: 'minikube',
    })
    await download({
      url: helmUrl(getInput('helm-version')),
      dir: '/tmp',
      file: 'helm.tar.gz',
    }).then(() => extractTar('/tmp/helm.tar.gz', binDir, '--strip=1').then(() => exec('chmod', ['+x', `${binDir}/helm`])))
    await download({
      url: kubectlUrl(getInput('kubernetes-version')),
      dir: binDir,
      file: 'kubectl',
    })
    await start({
      nodes: Number.parseInt(getInput('nodes')),
      addons: getInput('addons').split(','),
      cpus: Number.parseInt(getInput('cpus')),
      kubernetesVersion: getInput('kubernetes-version'),
      networkPlugin: getInput('network-plugin'),
    }).then(() => exec('minikube', ['ip'], options))

  } catch (error) {
    setFailed(error.message)
  }
}

run().then(() => {
  info('Minikube cluster is ready')
})
