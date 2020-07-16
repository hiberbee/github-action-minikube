import url, { commandLineArgs, StartArguments } from '../src/minikube'

test('Minikube url', async () => {
  const version = '1.12.0'
  expect(url(version)).toContain(version)
})

test('Minikube command line', async () => {
  const args: StartArguments = { addons: ['metric-server', 'dashboard'], cpus: 2, nodes: 1 }
  const commandLine = commandLineArgs(args).join(' ')
  expect(commandLine).toContain('--addons=metric-server')
  expect(commandLine).toContain('--addons=dashboard')
  expect(commandLine).toContain('--nodes=1')
  expect(commandLine).toContain('--cpus=2')
})
