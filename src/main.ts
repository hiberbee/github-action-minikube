import * as core from '@actions/core'

import { DownloadMinikube, StartMinikube } from './minikube'

async function run(): Promise<void> {
  try {
    await DownloadMinikube(core.getInput('version'), '/home/runner/bin')
    await StartMinikube({
      nodes: Number.parseInt(core.getInput('nodes')),
      cpus: Number.parseInt(core.getInput('cpus')),
      kubernetesVersion: core.getInput('kubernetes-version'),
      networkPlugin: core.getInput('network-plugin'),
    })
  } catch (error) {
    core.setFailed(error.message)
  }
}

run().then(r => console.log(r))
