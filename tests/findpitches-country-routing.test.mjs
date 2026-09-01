import test from 'node:test';
import assert from 'node:assert/strict';
import {
  countryCodeFromPath,
  countryPublicPath,
  isFindPitchesHost,
  legacyCountryForHost,
  resolveCountryRequest
} from '../platform/routing.mjs';

test('FindPitches hosts are recognized without changing legacy host behavior', () => {
  for (const hostname of [
    'findpitches.com',
    'www.findpitches.com',
    'findpitches-web.pages.dev',
    '82d99783.findpitches-web.pages.dev',
    'fix-routing.findpitches-web.pages.dev'
  ]) {
    assert.equal(isFindPitchesHost(hostname), true, hostname);
  }

  for (const hostname of [
    'pitchlist.uk',
    'unrelated-project.pages.dev',
    'findpitches-web.pages.dev.example.com',
    'evilfindpitches-web.pages.dev',
    'findpitches-web.pages.dev.evil.com'
  ]) {
    assert.equal(isFindPitchesHost(hostname), false, hostname);
  }
});

test('legacy domains resolve to their existing country context', () => {
  const us = resolveCountryRequest({ hostname: 'findpitches.com', pathname: '/' });
  const uk = resolveCountryRequest({ hostname: 'pitchlist.uk', pathname: '/' });

  assert.equal(us.country.code, 'us');
  assert.equal(us.source, 'legacy-findpitches-default');
  assert.equal(uk.country.code, 'uk');
  assert.equal(uk.source, 'legacy-host');
  assert.equal(legacyCountryForHost('www.pitchlist.uk').code, 'uk');
});

test('country-prefixed FindPitches paths resolve through the registry in shadow mode', () => {
  assert.equal(countryCodeFromPath('/us/'), 'us');
  assert.equal(countryCodeFromPath('/uk/find-pitches'), 'uk');
  assert.equal(countryCodeFromPath('/ca/'), 'ca');
  assert.equal(countryCodeFromPath('/zz/'), null);

  const uk = resolveCountryRequest({ hostname: 'findpitches.com', pathname: '/uk/find-pitches' });
  assert.equal(uk.country.code, 'uk');
  assert.equal(uk.source, 'path');
});

test('future country paths can be generated without hard-coded URL concatenation', () => {
  assert.equal(countryPublicPath('us'), '/us/');
  assert.equal(countryPublicPath('uk', '/find-pitches'), '/uk/find-pitches');
  assert.equal(countryPublicPath('ca', 'find-pitches'), '/ca/find-pitches');
  assert.equal(countryPublicPath('zz', '/'), null);
});

test('unknown hosts are not claimed by the global resolver', () => {
  assert.equal(resolveCountryRequest({ hostname: 'example.com', pathname: '/us/' }), null);
});
