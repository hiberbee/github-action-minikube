"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const minikube_1 = require("../src/minikube");
test('Minikube download', async () => {
    const version = '1.12.0';
    const url = minikube_1.getDownloadUrl('1.12.0');
    expect(url).toContain(version);
});
//# sourceMappingURL=minikube.test.js.map