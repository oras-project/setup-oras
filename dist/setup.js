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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setup = void 0;
const core = __importStar(require("@actions/core"));
const tc = __importStar(require("@actions/tool-cache"));
const release_1 = require("./lib/release");
const checksum_1 = require("./lib/checksum");
// setup sets up the ORAS CLI
function setup() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // inputs from user
            const version = core.getInput('version');
            // download ORAS CLI and validate checksum
            const info = (0, release_1.getReleaseInfo)(version);
            const url = info.url;
            console.log(`downloading ORAS CLI from ${url}`);
            const pathToTarball = yield tc.downloadTool(url);
            console.log("downloading ORAS CLI completed");
            const checksum = yield (0, checksum_1.hash)(pathToTarball);
            if (checksum !== info.checksum) {
                throw new Error(`checksum of downloaded ORAS CLI ${checksum} does not match expected checksum ${info.checksum}`);
            }
            console.log("successfully verified downloaded release checksum");
            // extract the tarball/zipball onto host runner
            const extract = url.endsWith('.zip') ? tc.extractZip : tc.extractTar;
            const pathToCLI = yield extract(pathToTarball);
            // add `ORAS` to PATH
            core.addPath(pathToCLI);
        }
        catch (e) {
            if (e instanceof Error) {
                core.setFailed(e);
            }
            else {
                core.setFailed('unknown error during ORAS setup');
            }
        }
    });
}
exports.setup = setup;
if (require.main === module) {
    setup();
}
//# sourceMappingURL=setup.js.map