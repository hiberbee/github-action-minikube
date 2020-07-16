import os from 'os'

export default function (version: string): string {
  const osPlat = os.platform()
  const platform = osPlat === 'win32' ? 'windows' : osPlat
  const suffix = osPlat === 'win32' ? '.exe' : ''
  return `https://storage.googleapis.com/kubernetes-release/release/v${version}/bin/${platform}/amd64/kubectl${suffix}`
}
