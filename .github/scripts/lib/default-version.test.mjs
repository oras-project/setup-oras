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

import test from 'node:test';
import assert from 'node:assert/strict';

import {
    compareSemver,
    isStableVersion,
    pickDefaultVersion,
} from './default-version.mjs';

test('compareSemver orders versions numerically', () => {
    assert.equal(compareSemver('1.3.6', '1.3.5'), 1);
    assert.equal(compareSemver('1.3.5', '1.3.6'), -1);
    assert.equal(compareSemver('1.3.6', '1.3.6'), 0);
    assert.equal(compareSemver('1.4.0', '1.3.9'), 1);
    assert.equal(compareSemver('2.0.0', '1.9.9'), 1);
    assert.equal(compareSemver('1.10.0', '1.9.0'), 1);
});

test('isStableVersion accepts only plain X.Y.Z versions', () => {
    assert.equal(isStableVersion('1.3.6'), true);
    assert.equal(isStableVersion('0.0.0'), true);
    assert.equal(isStableVersion('1.3'), false);
    assert.equal(isStableVersion('1.3.6-rc.1'), false);
    assert.equal(isStableVersion('1.3.6+build'), false);
    assert.equal(isStableVersion('v1.3.6'), false);
    assert.equal(isStableVersion(''), false);
});

test('pickDefaultVersion returns the highest stable version', () => {
    const releases = { '1.3.5': {}, '1.3.6': {}, '1.3.4': {} };
    assert.equal(pickDefaultVersion(releases, '1.3.1'), '1.3.6');
});

test('pickDefaultVersion never moves the default backwards', () => {
    const releases = { '1.3.5': {}, '1.3.4': {} };
    assert.equal(pickDefaultVersion(releases, '1.3.6'), '1.3.6');
});

test('pickDefaultVersion ignores prereleases', () => {
    const releases = { '1.3.7-rc.1': {}, '1.3.6': {} };
    assert.equal(pickDefaultVersion(releases, '1.3.6'), '1.3.6');
});

test('pickDefaultVersion keeps the current default when no stable version exists', () => {
    const releases = { '1.3.7-rc.1': {} };
    assert.equal(pickDefaultVersion(releases, '1.3.6'), '1.3.6');
});

test('pickDefaultVersion picks the max when there is no current default', () => {
    const releases = { '1.3.6': {}, '1.3.5': {} };
    assert.equal(pickDefaultVersion(releases, undefined), '1.3.6');
});

test('pickDefaultVersion keeps an equal default', () => {
    const releases = { '1.3.6': {} };
    assert.equal(pickDefaultVersion(releases, '1.3.6'), '1.3.6');
});
