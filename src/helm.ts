import os from 'os'

export default function (version: string): string {
  const osPlat = os.platform()
  const platform = osPlat === 'win32' ? 'windows' : osPlat
  return `https://get.helm.sh/helm-v${version}-${platform}-amd64.tar.gz`
}
