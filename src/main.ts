import * as core from '@actions/core'

import { DownloadMinikube, StartMinikube } from 'src/minikube'

async function run(): Promise<void> {
  try {
    await DownloadMinikube()
    await StartMinikube()
  } catch (error) {
    core.setFailed(error.message)
  }
}

run().then(r => console.log(r))
