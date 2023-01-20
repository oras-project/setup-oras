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

const os = require('os');
const core = require('@actions/core');
const tc = require('@actions/tool-cache');

// Map arch to go releaser arch
// Reference: https://nodejs.org/api/os.html#os_os_arch
function mapArch(arch) {
  const mappings = {
    arm: 'armv7',
    x64: 'amd64'
  };
  return mappings[arch] || arch;
}

// Map os to go releaser os
// Reference: https://nodejs.org/api/os.html#os_os_platform
function mapOS(os) {
  const mappings = {
    win32: 'windows'
  };
  return mappings[os] || os;
}

// Get the URL to download asset
function getDownloadURL(version) {
  const platform = os.platform();
  const filename = `oras_${version}_${mapOS(platform)}_${mapArch(os.arch())}`;
  const extension = platform === 'win32' ? 'zip' : 'tar.gz';
  return `https://github.com/oras-project/oras/releases/download/v${version}/${filename}.${extension}`;
}

// Download and install ORAS CLI of the specified version
async function setup() {
  try {
    // Download ORAS CLI of the specified version
    const version = core.getInput('version');
    const donwloadURL = getDownloadURL(version)
    const assetPath = await tc.downloadTool(donwloadURL);

    // Extract the tarball/zipball onto host runner
    const extract = donwloadURL.endsWith('.zip') ? tc.extractZip : tc.extractTar;
    const pathToCLI = await extract(assetPath);

    // Expose the tool by adding it to the PATH
    core.addPath(pathToCLI);
  } catch (e) {
    core.setFailed(e);
  }
}

module.exports = setup

if (require.main === module) {
  setup();
}
