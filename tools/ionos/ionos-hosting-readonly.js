#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const REPO_ROOT = path.resolve(__dirname, '../..');
const DOTENV_PATH = path.join(REPO_ROOT, '.env');
const BASE_URL = process.env.IONOS_API_BASE_URL || 'https://dns.de-fra.ionos.com';
const TOKEN_ENV_NAME = 'IONOS_HOSTING_API_KEY';
const FALLBACK_TOKEN_ENV_NAME = 'IONOS_API_TOKEN';

function loadDotenv(filePath) {
  if (!fs.existsSync(filePath)) {
    return;
  }

  const content = fs.readFileSync(filePath, 'utf8');
  for (const rawLine of content.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith('#')) continue;
    const eqIndex = line.indexOf('=');
    if (eqIndex === -1) continue;

    const key = line.slice(0, eqIndex).trim();
    const value = line.slice(eqIndex + 1).trim();
    if (!(key in process.env)) {
      process.env[key] = value;
    }
  }
}

function maskId(value) {
  if (!value || typeof value !== 'string') return null;
  if (value.length <= 10) return `${value.slice(0, 2)}…`;
  return `${value.slice(0, 5)}…${value.slice(-4)}`;
}

function normalizeCollection(payload) {
  if (Array.isArray(payload)) return payload;
  if (payload && Array.isArray(payload.items)) return payload.items;
  if (payload && Array.isArray(payload.zones)) return payload.zones;
  if (payload && Array.isArray(payload.data)) return payload.data;
  if (payload && Array.isArray(payload.results)) return payload.results;
  return [];
}

async function requestJson(endpoint, token) {
  const url = new URL(endpoint, BASE_URL).toString();
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
    },
  });

  const text = await response.text();
  let json = null;
  if (text) {
    try {
      json = JSON.parse(text);
    } catch {
      json = text;
    }
  }

  return { url, status: response.status, ok: response.ok, payload: json };
}

function summarizeZones(payload) {
  const zones = normalizeCollection(payload);
  return zones.map((zone) => ({
    id: maskId(zone?.id || zone?.zoneId || zone?.properties?.id),
    name: zone?.name ? '[redacted]' : null,
    type: zone?.type || zone?.zoneType || zone?.properties?.type || null,
    recordCount: Number.isFinite(zone?.recordCount) ? zone.recordCount : null,
  }));
}

function summarizeRecords(payload) {
  const records = normalizeCollection(payload);
  const byType = {};
  for (const record of records) {
    const type = record?.type || record?.recordType || 'unknown';
    byType[type] = (byType[type] || 0) + 1;
  }

  return {
    count: records.length,
    byType,
    sampleIds: records.slice(0, 5).map((record) => maskId(record?.id || record?.recordId || record?.properties?.id)),
  };
}

function summarizeError(payload) {
  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
    return null;
  }

  const summary = {};
  if ('httpStatus' in payload) summary.httpStatus = payload.httpStatus;
  if ('messages' in payload) summary.messages = payload.messages;
  if ('message' in payload) summary.message = payload.message;
  return Object.keys(summary).length ? summary : null;
}

async function main() {
  loadDotenv(DOTENV_PATH);

  const token = process.env[TOKEN_ENV_NAME] || process.env[FALLBACK_TOKEN_ENV_NAME];
  const tokenSource = process.env[TOKEN_ENV_NAME]
    ? TOKEN_ENV_NAME
    : process.env[FALLBACK_TOKEN_ENV_NAME]
      ? FALLBACK_TOKEN_ENV_NAME
      : null;

  if (!token) {
    console.error(`Missing IONOS token. Set ${TOKEN_ENV_NAME} or ${FALLBACK_TOKEN_ENV_NAME} in the environment.`);
    process.exitCode = 1;
    return;
  }

  console.log(JSON.stringify({
    baseUrl: BASE_URL,
    tokenSource,
    steps: [
      'GET /zones',
      'GET /zones/{zoneId}/records only if zones are returned',
    ],
  }, null, 2));

  const zonesResponse = await requestJson('/zones', token);
  console.log(JSON.stringify({
    step: 'GET /zones',
    url: zonesResponse.url,
    status: zonesResponse.status,
    ok: zonesResponse.ok,
    summary: Array.isArray(zonesResponse.payload)
      ? { kind: 'array', count: zonesResponse.payload.length }
      : zonesResponse.payload && typeof zonesResponse.payload === 'object'
        ? { kind: 'object', keys: Object.keys(zonesResponse.payload) }
        : { kind: typeof zonesResponse.payload },
    zones: summarizeZones(zonesResponse.payload),
    error: zonesResponse.ok ? null : summarizeError(zonesResponse.payload),
  }, null, 2));

  const zones = normalizeCollection(zonesResponse.payload);
  const firstZone = zones[0];
  const zoneId = firstZone?.id || firstZone?.zoneId || firstZone?.properties?.id;

  if (!zonesResponse.ok || !zoneId) {
    return;
  }

  const recordsResponse = await requestJson(`/zones/${encodeURIComponent(zoneId)}/records`, token);
  console.log(JSON.stringify({
    step: 'GET /zones/{zoneId}/records',
    zoneId: maskId(zoneId),
    url: recordsResponse.url,
    status: recordsResponse.status,
    ok: recordsResponse.ok,
    summary: Array.isArray(recordsResponse.payload)
      ? { kind: 'array', count: recordsResponse.payload.length }
      : recordsResponse.payload && typeof recordsResponse.payload === 'object'
        ? { kind: 'object', keys: Object.keys(recordsResponse.payload) }
        : { kind: typeof recordsResponse.payload },
    records: summarizeRecords(recordsResponse.payload),
    error: recordsResponse.ok ? null : summarizeError(recordsResponse.payload),
  }, null, 2));
}

main().catch((error) => {
  console.error('IONOS read-only audit failed:', error?.message || error);
  process.exitCode = 1;
});
