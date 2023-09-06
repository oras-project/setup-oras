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

import * as core from '@actions/core';
import * as tc from '@actions/tool-cache';
import { getReleaseInfo } from './lib/release';
import { hash } from './lib/checksum';

// run sets up the ORAS CLI
export async function setup(): Promise<void> {
  try {
    // inputs from user
    const version: string = core.getInput('version');

    // download ORAS CLI and validate checksum
    const info = getReleaseInfo(version);
    const url = info.url;
    console.log(`downloading ORAS CLI from ${url}`);
    const pathToTarball: string = await tc.downloadTool(url);
    console.log("downloading ORAS CLI completed");
    const checksum = await hash(pathToTarball);
    if (checksum !== info.checksum) {
      throw new Error(`checksum of downloaded ORAS CLI ${checksum} does not match expected checksum ${info.checksum}`);
    }
    console.log("successfully verified downloaded release checksum");

    // extract the tarball/zipball onto host runner
    const extract = url.endsWith('.zip') ? tc.extractZip : tc.extractTar;
    const pathToCLI: string = await extract(pathToTarball);

    // add `ORAS` to PATH
    core.addPath(pathToCLI);
  } catch (e) {
    if (e instanceof Error) {
      core.setFailed(e);
    } else {
      core.setFailed('unknown error during ORAS setup');
    }
  }
}

setup();