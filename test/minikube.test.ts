import url from '../src/minikube'

test('Minikube url', async () => {
  const version = '1.12.0'
  expect(url(version)).toContain(version)
})
