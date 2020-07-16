import url from '../src/kubectl'

test('Kubectl url', async () => {
  const version = '1.18.0'
  expect(url(version)).toContain(version)
})
