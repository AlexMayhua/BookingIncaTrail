#!/usr/bin/env node
import { createHash } from 'node:crypto';
import { createRequire } from 'node:module';
import { once } from 'node:events';
import fs from 'node:fs/promises';
import net from 'node:net';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawn, execFile as execFileCallback } from 'node:child_process';
import { promisify } from 'node:util';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

const execFile = promisify(execFileCallback);
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SNAPSHOT = 'src/data/navbarSnapshot.json';
const require = createRequire(import.meta.url);
const LIMITS = { mongo: 180_000, build: 600_000, ready: 90_000, request: 10_000 };
const children = new Set();
let reservation;
let mongo;
let connection;
let cleaned = false;
let baseline;
const cleanupReceipts = [];
const lifecycleReceipts = [];

function fail(message, code = 1) {
  const error = new Error(message);
  error.exitCode = code;
  throw error;
}

function redact(value = '') {
  return String(value)
    .replace(/mongodb(?:\+srv)?:\/\/[^\s'"`]+/gi, '[redacted mongodb URI]')
    .replace(/(password|token|secret|key)=([^\s&]+)/gi, '$1=[redacted]');
}

function tail(child, label) {
  let output = '';
  for (const stream of [child.stdout, child.stderr]) stream?.on('data', (chunk) => {
    output = (output + chunk).slice(-65_536);
  });
  child.output = () => `${label}: ${redact(output)}`;
}

async function trackedFingerprint() {
  const { stdout } = await execFile('git', ['ls-files', '-z'], { cwd: ROOT, maxBuffer: 8 * 1024 * 1024 });
  const files = stdout.split('\0').filter(Boolean).sort();
  const entries = await Promise.all(files.map(async (file) => {
    const stat = await fs.lstat(path.join(ROOT, file));
    const bytes = stat.isFile() ? await fs.readFile(path.join(ROOT, file)) : Buffer.alloc(0);
    return `${file}\0${stat.mode}\0${stat.isSymbolicLink() ? 'link' : 'file'}\0${createHash('sha256').update(bytes).digest('hex')}`;
  }));
  return new Map(entries.map((entry) => [entry.split('\0')[0], entry]));
}

async function assertTrackedUnchanged() {
  const after = await trackedFingerprint();
  const changed = changedPaths(baseline, after);
  if (changed.length) fail(`tracked file mutation detected: ${changed.join(', ')}`, 2);
  if (baseline.get(SNAPSHOT) !== after.get(SNAPSHOT)) fail('navbar snapshot mutation detected', 2);
}

function changedPaths(before, after) {
  return [...new Set([...before.keys(), ...after.keys()])]
    .filter((file) => before.get(file) !== after.get(file));
}

function expectStatus(actual, expected, phase) {
  if (actual !== expected) fail(`${phase}: expected ${expected}, received ${actual}`);
}

function assertSafeUri(uri) {
  let parsed;
  try { parsed = new URL(uri); } catch { fail('MongoMemoryServer returned an invalid URI', 2); }
  const host = parsed.hostname.toLowerCase();
  if (parsed.protocol !== 'mongodb:' || !['127.0.0.1', '::1', 'localhost'].includes(host) || parsed.pathname !== '/missing_locale_fixture' || parsed.username || parsed.password) {
    fail('refusing a non-loopback or non-fixture MongoDB URI', 2);
  }
  return uri;
}

async function reservePort() {
  reservation = net.createServer();
  reservation.listen(0, '127.0.0.1');
  await once(reservation, 'listening');
  return reservation.address().port;
}

function uniqueFixtureIdentities(docs) {
  const identities = new Set(docs.map(({ category, slug, lang }) => `${category}/${slug}/${lang}`));
  if (identities.size !== docs.length) fail('duplicate fixture identity', 2);
  return identities;
}

function fixtureDocuments() {
  const common = { gallery: [{ url: '/img/hero/hero-machu-picchu.webp', alt: 'Fixture image' }], price: 1, duration: '1 day', quickstats: [{ content: 'Fixture' }], meta_description: 'Fixture verification record' };
  return [
    { ...common, title: 'Untranslated fixture', category: 'fixture-untranslated', slug: 'missing-translation-fixture-tour', lang: 'en' },
    { ...common, title: 'Paired fixture EN', category: 'fixture-paired', slug: 'paired-translation-fixture-tour', lang: 'en' },
    { ...common, title: 'Paired fixture ES', category: 'fixture-paired', slug: 'paired-translation-fixture-tour', lang: 'es' },
  ];
}

async function seed(uri) {
  connection = await mongoose.createConnection(uri, { bufferCommands: false }).asPromise();
  const docs = fixtureDocuments();
  uniqueFixtureIdentities(docs);
  const trips = connection.collection('trips');
  if (await trips.countDocuments({ $or: docs.map(({ category, slug, lang }) => ({ category, slug, lang })) })) fail('fixture identity already exists', 2);
  await trips.insertMany(docs);
  if ((await trips.countDocuments({ category: { $in: ['fixture-untranslated', 'fixture-paired'] } })) !== 3) fail('fixture seed count was not exactly three', 2);
}

function childEnv(uri, port) {
  return { ...process.env, MONGODB_URI: uri, NEXT_PUBLIC_SITE_URL: `http://127.0.0.1:${port}` };
}

async function stopChild(child, reason = 'cleanup') {
  if (!child || child.exitCode !== null || child.signalCode) { children.delete(child); return; }
  try {
    if (process.platform === 'win32') spawn('taskkill.exe', ['/pid', String(child.pid), '/T', '/F'], { shell: false });
    else process.kill(-child.pid, 'SIGTERM');
    await Promise.race([once(child, 'exit'), new Promise((resolve) => setTimeout(resolve, 10_000))]);
    if (child.exitCode === null && child.signalCode === null && process.platform !== 'win32') process.kill(-child.pid, 'SIGKILL');
    lifecycleReceipts.push(`${reason}: child ${child.pid} terminated`);
  } catch (error) {
    lifecycleReceipts.push(`${reason}: child termination error ${redact(error.message)}`);
  } finally {
    children.delete(child);
  }
}

async function runNext(next, args, env, timeout, { keepAlive = false, command = process.execPath } = {}) {
  let child;
  try {
    child = spawn(command, [next, ...args], { cwd: ROOT, env, shell: false, detached: process.platform !== 'win32', stdio: ['ignore', 'pipe', 'pipe'] });
  } catch (error) {
    throw Object.assign(new Error(`next spawn failed: ${redact(error.message)}`), { exitCode: 1 });
  }
  children.add(child); tail(child, `next ${args[0] || next}`);
  return new Promise((resolve, reject) => {
    let settled = false;
    let launched = false;
    let rejectStartup;
    if (keepAlive) {
      child.startupFailure = new Promise((_, rejectFailure) => { rejectStartup = rejectFailure; });
      child.startupFailure.catch(() => {});
    }
    const settle = async (error, terminate = false) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      child.off('exit', onExit); child.off('error', onError);
      if (terminate) await stopChild(child, 'timeout');
      else if (!keepAlive || error) children.delete(child);
      if (error) {
        const failure = Object.assign(new Error(redact(error.message)), { exitCode: error.exitCode || 1, startupFailure: launched });
        if (launched) rejectStartup(failure); else reject(failure);
      }
      else resolve(child);
    };
    const onExit = (code, signal) => settle(!keepAlive && code === 0 && !signal ? null : Object.assign(new Error(`${child.output()} exited ${code ?? signal}`), { exitCode: 1 }));
    const onError = (error) => settle(Object.assign(new Error(`next spawn error: ${redact(error.message)}`), { exitCode: 1 }), true);
    const timer = setTimeout(() => {
      if (keepAlive) { launched = true; resolve(child); }
      else settle(Object.assign(new Error(`${child.output()} timed out after ${timeout}ms`), { exitCode: 1 }), true);
    }, timeout);
    child.once('exit', onExit);
    child.once('error', onError);
  });
}

async function request(url, expected, phase) {
  const response = await fetch(url, { signal: AbortSignal.timeout(LIMITS.request) });
  expectStatus(response.status, expected, phase);
  return response;
}

function xmlBlock(xml, loc) {
  const escaped = loc.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const blocks = xml.match(new RegExp(`<url>[\\s\\S]*?<loc>${escaped}</loc>[\\s\\S]*?</url>`, 'g')) || [];
  if (blocks.length !== 1) fail(`sitemap expected one entry for ${loc}, found ${blocks.length}`);
  return blocks[0];
}

function expectLinks(block, links) {
  for (const [lang, href] of Object.entries(links)) {
    if (!block.includes(`hreflang="${lang}" href="${href}"`)) fail(`missing ${lang} alternate ${href}`);
  }
}

async function assertRuntime(base) {
  const untranslated = 'fixture-untranslated';
  const paired = 'fixture-paired';
  const tour = 'missing-translation-fixture-tour';
  const pairedTour = 'paired-translation-fixture-tour';
  for (const [route, status] of [[`/${untranslated}`, 200], [`/${untranslated}/${tour}`, 200], [`/es/${untranslated}`, 404], [`/es/${untranslated}/${tour}`, 404], [`/${paired}`, 200], [`/${paired}/${pairedTour}`, 200], [`/es/${paired}`, 200], [`/es/${paired}/${pairedTour}`, 200]]) await request(`${base}${route}`, status, route);
  const en = await request(`${base}/sitemap-en.xml`, 200, 'English sitemap');
  const es = await request(`${base}/sitemap-es.xml`, 200, 'Spanish sitemap');
  if (!en.headers.get('content-type')?.includes('xml') || !es.headers.get('content-type')?.includes('xml')) fail('sitemaps did not return XML content', 1);
  const [enXml, esXml] = await Promise.all([en.text(), es.text()]);
  for (const route of [`/${untranslated}`, `/${untranslated}/${tour}`]) {
    const loc = `${base}${route}`;
    expectLinks(xmlBlock(enXml, loc), { en: loc, 'x-default': loc });
    if (enXml.includes(`hreflang="es" href="${base}/es${route}"`) || esXml.includes(`<loc>${loc}</loc>`)) fail(`untranslated sitemap leakage for ${route}`);
  }
  for (const route of [`/${paired}`, `/${paired}/${pairedTour}`]) {
    const enLoc = `${base}${route}`, esLoc = `${base}/es${route}`;
    expectLinks(xmlBlock(enXml, enLoc), { en: enLoc, es: esLoc, 'x-default': enLoc });
    expectLinks(xmlBlock(esXml, esLoc), { en: enLoc, es: esLoc, 'x-default': enLoc });
  }
}

async function cleanup() {
  if (cleaned) return;
  cleaned = true;
  await Promise.allSettled([...children].map(stopChild));
  cleanupReceipts.push('Next children stopped');
  if (reservation) { await new Promise((resolve) => reservation.close(resolve)); cleanupReceipts.push('port reservation closed'); }
  if (connection) { await connection.close(); cleanupReceipts.push('Mongoose disconnected'); }
  if (mongo) { await mongo.stop(); cleanupReceipts.push('MongoMemoryServer stopped'); }
  if (baseline) await assertTrackedUnchanged();
  if (baseline) console.log(`cleanup: ${cleanupReceipts.join('; ')}; tracked bytes unchanged`);
}

async function startMongo(factory = () => MongoMemoryServer.create({ instance: { dbName: 'missing_locale_fixture' } })) {
  return new Promise((resolve, reject) => {
    let settled = false;
    const timer = setTimeout(() => settle(Object.assign(new Error('MongoDB startup exceeded 180 seconds; check the local binary cache, network, and platform support'), { exitCode: 2 })), LIMITS.mongo);
    const settle = (error, instance) => {
      if (settled) { instance?.stop?.(); return; }
      settled = true; clearTimeout(timer);
      if (error) reject(Object.assign(new Error(redact(error.message)), { exitCode: error.exitCode || 2 }));
      else resolve(instance);
    };
    Promise.resolve().then(factory).then((instance) => settle(null, instance), (error) => settle(Object.assign(new Error(`MongoMemoryServer startup failed: ${redact(error.message)}`), { exitCode: 2 })));
  });
}

async function selfTest(mode = 'all') {
  baseline = await trackedFingerprint();
  if (mode === 'keepalive') {
    const server = await runNext('-e', ['setTimeout(() => process.exit(17), 100)'], process.env, 25, { keepAlive: true });
    try { await server.startupFailure; fail('keepAlive early-exit probe was accepted', 2); }
    catch (error) { if (!error.message.includes('exited 17')) throw error; }
    await cleanup(); console.log(`keepAlive probe passed; ${lifecycleReceipts.join('; ')}`); return;
  }
  if (mode === 'enoent') {
    try { await runNext('ignored', [], process.env, 2_000, { command: '/definitely-missing-node' }); fail('ENOENT probe was accepted', 2); }
    catch (error) { if (!error.message.includes('spawn error')) throw error; }
    if (children.size) fail('ENOENT probe left an owned child', 2);
    await cleanup(); console.log(`ENOENT probe passed; cleanup: ${cleanupReceipts.join('; ')}`); return;
  }
  assertSafeUri('mongodb://127.0.0.1:27017/missing_locale_fixture');
  try { assertSafeUri('mongodb+srv://atlas.example/missing_locale_fixture'); fail('live URI probe was accepted', 2); } catch (error) { if (error.message === 'live URI probe was accepted') throw error; }
  const docs = fixtureDocuments(); docs.push({ ...docs[0] });
  try { uniqueFixtureIdentities(docs); fail('duplicate fixture probe was accepted', 2); } catch (error) { if (error.message === 'duplicate fixture probe was accepted') throw error; }
  try { expectStatus(404, 200, 'false assertion probe'); fail('false assertion probe was accepted', 2); } catch (error) { if (error.message === 'false assertion probe was accepted') throw error; }
  if (!changedPaths(new Map([['tracked', 'before']]), new Map([['tracked', 'after']])).includes('tracked')) fail('tracked mutation probe failed', 2);
  const port = await reservePort();
  const contender = net.createServer();
  const occupied = await new Promise((resolve) => { contender.once('error', (error) => resolve(error.code === 'EADDRINUSE')); contender.listen(port, '127.0.0.1'); });
  if (!occupied) fail('occupied-port probe failed', 2);
  contender.close();
  for (const [next, args, timeout, options, expected] of [
    ['-e', ['process.exit(17)'], 2_000, {}, 'exited 17'],
    ['-e', ['setInterval(() => {}, 1000)'], 100, {}, 'timed out'],
    ['ignored', [], 2_000, { command: '/definitely-missing-node' }, 'spawn error'],
  ]) {
    try { await runNext(next, args, process.env, timeout, options); fail(`failure probe was accepted: ${expected}`, 2); }
    catch (error) { if (!error.message.includes(expected)) throw error; }
  }
  if (children.size) fail('failure probes left owned children', 2);
  try { await startMongo(() => Promise.reject(new Error('cold binary unavailable mongodb://user:password@host'))); fail('cold Mongo probe was accepted', 2); }
  catch (error) { if (!error.message.includes('MongoMemoryServer startup failed') || error.message.includes('password')) throw error; }
  try { await execFile(process.execPath, [fileURLToPath(import.meta.url), '--self-test-signal-target'], { cwd: ROOT }); fail('signal cleanup probe was accepted', 2); }
  catch (error) { if (error.message === 'signal cleanup probe was accepted' || error.code !== 143 || !error.stdout.includes('cleanup:')) throw error; }
  await cleanup();
  console.log(`self-test passed: URI guard, occupied port, duplicate fixture, cold Mongo, startup failure, timeout termination, spawn error, false assertion, signal cleanup, tracked mutation; ${lifecycleReceipts.join('; ')}`);
}

async function signalTarget() {
  baseline = await trackedFingerprint();
  await runNext('-e', ['setInterval(() => {}, 1000)'], process.env, 25, { keepAlive: true });
  console.log('signal target ready');
  process.kill(process.pid, 'SIGTERM');
  await new Promise(() => {});
}

async function main() {
  if (process.argv.includes('--help')) return console.log('Usage: node scripts/verify-missing-locale-fixture.mjs [--self-test all]');
  if (process.argv.includes('--self-test-signal-target')) return signalTarget();
  if (process.argv.includes('--self-test')) return selfTest(process.argv[process.argv.indexOf('--self-test') + 1]);
  const { stdout } = await execFile('git', ['rev-parse', '--show-toplevel'], { cwd: ROOT });
  if (stdout.trim() !== ROOT) fail('script root does not match git repository root', 2);
  baseline = await trackedFingerprint();
  const port = await reservePort();
  mongo = await startMongo();
  const uri = assertSafeUri(mongo.getUri('missing_locale_fixture'));
  await seed(uri);
  const next = require.resolve('next/dist/bin/next');
  await runNext(next, ['build'], childEnv(uri, port), LIMITS.build);
  await new Promise((resolve) => reservation.close(resolve)); reservation = undefined;
  const server = await runNext(next, ['start', '-H', '127.0.0.1', '-p', String(port)], childEnv(uri, port), 250, { keepAlive: true });
  const base = `http://127.0.0.1:${port}`;
  const deadline = Date.now() + LIMITS.ready;
  while (Date.now() < deadline) {
    try { if ((await Promise.race([fetch(base, { signal: AbortSignal.timeout(2_000) }), server.startupFailure])).ok) break; }
    catch (error) { if (error.startupFailure) throw error; }
    await new Promise((resolve) => setTimeout(resolve, 500));
  }
  if (Date.now() >= deadline) fail(`server readiness timeout: ${server.output()}`);
  await assertRuntime(base);
  console.log('verification passed: locale routes and sitemap alternates');
}

for (const [signal, code] of [['SIGINT', 130], ['SIGTERM', 143], ['SIGHUP', 129]]) process.on(signal, () => cleanup().finally(() => process.exit(code)));
main().then(() => { process.exitCode = 0; }).catch((error) => { process.exitCode = error.exitCode || 1; console.error(`verification failed: ${redact(error.message)}`); }).finally(async () => { await cleanup().catch((error) => { process.exitCode = 2; console.error(`cleanup failed: ${redact(error.message)}`); }); });
