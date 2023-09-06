"use strict";
// Copyright The ORAS Authors.
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
// http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBinaryExtension = exports.mapArch = exports.mapPlatform = exports.getReleaseInfo = void 0;
const os = __importStar(require("os"));
const releases_json_1 = __importDefault(require("./data/releases.json"));
// Get release info of a certain verion of ORAS CLI
function getReleaseInfo(version) {
    const releases = releases_json_1.default;
    if (!(version in releases)) {
        console.log(`official ORAS CLI releases does not contain version ${version}`);
        throw new Error(`official ORAS CLI releases does not contain version ${version}`);
    }
    const platform = mapPlatform();
    const arch = mapArch();
    const download = releases[version][platform][arch];
    if (!download) {
        throw new Error(`official ORAS CLI releases does not contain version ${version}, platform ${platform}, arch ${arch} is not supported`);
    }
    return download;
}
exports.getReleaseInfo = getReleaseInfo;
// getPlatform maps os.platform() to ORAS supported platforms.
function mapPlatform() {
    const platform = os.platform();
    switch (platform) {
        case 'linux':
            return 'linux';
        case 'darwin':
            return 'darwin';
        case 'win32':
            return 'windows';
        default:
            throw new Error(`unsupported platform: ${platform}`);
    }
}
exports.mapPlatform = mapPlatform;
// mapArch maps os.arch() to ORAS supported architectures.
function mapArch() {
    const architecture = os.arch();
    switch (architecture) {
        case 'x64':
            return 'amd64';
        case 'arm64':
            return 'arm64';
        case 'arm64':
            return 'arm64';
        case 's390':
            return 's390x';
        case 'arm':
            return 'armv7';
        default:
            throw new Error(`unsupported architecture: ${architecture}`);
    }
}
exports.mapArch = mapArch;
function getBinaryExtension() {
    const platform = mapPlatform();
    return platform === 'windows' ? '.exe' : '';
}
exports.getBinaryExtension = getBinaryExtension;
//# sourceMappingURL=release.js.map