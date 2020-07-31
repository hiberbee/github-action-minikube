import { getInput, setFailed, exportVariable, setOutput, error, info } from '@actions/core'
import minikubeUrl, { start } from 'src/minikube'
import download from 'src/download'
import kubectlUrl from 'src/kubectl'
import { exec } from '@actions/exec'
import { ExecOptions } from '@actions/exec/lib/interfaces'

async function run(): Promise<void> {
  const options: ExecOptions = {}
  const profile = getInput('profile')
  exportVariable('MINIKUBE_PROFILE_NAME', profile)

  try {
    options.listeners = {
      stdout: (data: Buffer) => {
        const ip = data.toString()
        exportVariable("DOCKER_HOST", `tcp://${ip}:2376`)
        exportVariable("DOCKER_TLS_VERIFY", "1")
        exportVariable("DOCKER_CERT_PATH", `${process.env.HOME ?? '~'}/.minikube/certs`)
        exportVariable("MINIKUBE_ACTIVE_DOCKERD", profile)
        setOutput('ip', data.toString())
      },
      stderr: (data: Buffer) => {
        error(data.toString())
      },
    }
    await download({
      url: minikubeUrl(getInput('version')),
      dir: '/home/runner/bin',
      file: 'minikube',
    })
    await download({
      url: kubectlUrl(getInput('kubernetes-version')),
      dir: '/home/runner/bin',
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
