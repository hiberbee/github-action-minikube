"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DownloadMinikube = exports.getDownloadUrl = exports.StartMinikube = void 0;
const tslib_1 = require("tslib");
const core = tslib_1.__importStar(require("@actions/core"));
const exec = tslib_1.__importStar(require("@actions/exec"));
const tc = tslib_1.__importStar(require("@actions/tool-cache"));
const os = tslib_1.__importStar(require("os"));
const io = tslib_1.__importStar(require("@actions/io"));
const path = tslib_1.__importStar(require("path"));
async function StartMinikube() {
    await exec.exec('minikube', ['start', '--wait=all']);
}
exports.StartMinikube = StartMinikube;
function getDownloadUrl(version) {
    const osPlat = os.platform();
    const platform = osPlat === 'win32' ? 'windows' : osPlat;
    const suffix = osPlat === 'win32' ? '.exe' : '';
    return `https://github.com/kubernetes/minikube/releases/download/v${version}/minikube-${platform}-amd64${suffix}`;
}
exports.getDownloadUrl = getDownloadUrl;
async function DownloadMinikube() {
    const version = process.env.MINIKUBE_VERSION ?? '1.12.0';
    const url = getDownloadUrl(version);
    const downloadPath = await tc.downloadTool(url);
    const binPath = process.env.BIN_DIR ?? '/usr/local/bin';
    await io.mkdirP(binPath);
    await exec.exec('chmod', ['+x', downloadPath]);
    await io.mv(downloadPath, path.join(binPath, 'minikube'));
    core.addPath(binPath);
}
exports.DownloadMinikube = DownloadMinikube;
//# sourceMappingURL=minikube.js.map