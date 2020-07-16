"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const core = tslib_1.__importStar(require("@actions/core"));
const minikube_1 = require("src/minikube");
async function run() {
    try {
        await minikube_1.DownloadMinikube();
        await minikube_1.StartMinikube();
    }
    catch (error) {
        core.setFailed(error.message);
    }
}
run().then(r => console.log(r));
//# sourceMappingURL=main.js.map