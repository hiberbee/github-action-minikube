import { addPath } from '@actions/core'
import { exec } from '@actions/exec'
import { downloadTool } from '@actions/tool-cache'
import { mkdirP, mv } from '@actions/io'
import path from 'path'

type DownloadArgs = {
  url: string
  file: string
  dir: string
}

export default async function (args: DownloadArgs): Promise<void> {
  const downloadPath = await downloadTool(args.url)
  await mkdirP(args.dir)
  await exec('chmod', ['+x', downloadPath])
  await mv(downloadPath, path.join(args.dir, args.file))
  addPath(args.dir)
}
