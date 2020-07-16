import { getDownloadUrl } from '../src/minikube'

test('Minikube download', async () => {
  const version = '1.12.0'
  const url = getDownloadUrl(version)
  expect(url).toContain(version)
})
