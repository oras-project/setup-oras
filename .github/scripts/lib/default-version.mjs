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

// Pure helpers for choosing the default ORAS CLI version advertised by
// action.yml. Kept separate from update-releases.mjs so they can be unit
// tested without touching the network or the repository.

export function compareSemver(a, b) {
    const pa = a.split('.').map(Number);
    const pb = b.split('.').map(Number);
    for (let i = 0; i < 3; i++) {
        if (pa[i] !== pb[i]) return pa[i] - pb[i];
    }
    return 0;
}

// Only plain X.Y.Z versions are eligible to become the default. Prereleases
// and build metadata are never auto-selected.
export function isStableVersion(version) {
    return /^\d+\.\d+\.\d+$/.test(version);
}

// Returns the default version to advertise in action.yml: the highest stable
// version present in releases, or currentDefault when no stable version is
// newer. The default never moves backwards, so backfilling an older version
// leaves it untouched.
export function pickDefaultVersion(releases, currentDefault) {
    const stable = Object.keys(releases).filter(isStableVersion);
    if (stable.length === 0) return currentDefault;
    const max = [...stable].sort(compareSemver).pop();
    if (currentDefault && isStableVersion(currentDefault) && compareSemver(max, currentDefault) <= 0) {
        return currentDefault;
    }
    return max;
}
