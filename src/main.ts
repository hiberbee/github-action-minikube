import { getInput, setFailed } from '@actions/core'

import minikubeUrl, { start } from 'src/minikube'
import download from 'src/download'
import kubectlUrl from 'src/kubectl'

async function run(): Promise<void> {
  try {
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
    })
  } catch (error) {
    setFailed(error.message)
  }
}

run().then(r => console.log(r))
