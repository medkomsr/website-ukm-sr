import { test, mock, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { randomUUID } from 'node:crypto';
import ts from 'typescript';
import nodemailer from 'nodemailer';

const require = createRequire(import.meta.url);
const code = ts.transpileModule(readFileSync(new URL('./route.ts', import.meta.url), 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true },
}).outputText;
const config = { CONTACT_SMTP_HOST: 'smtp.example.test', CONTACT_SMTP_PORT: '587', CONTACT_SMTP_USER: 'test', CONTACT_SMTP_PASSWORD: 'test-only', CONTACT_FROM: 'website@example.test' };
const previous = Object.fromEntries(Object.keys(config).map(key => [key, process.env[key]]));
afterEach(() => {
  mock.restoreAll();
  for (const [key, value] of Object.entries(previous)) {
    if (value === undefined) delete process.env[key]; else process.env[key] = value;
  }
});
function setup(send = async () => ({ accepted: ['senireligi@ub.ac.id'] })) {
  Object.assign(process.env, config);
  const sendMail = mock.fn(send);
  mock.method(nodemailer, 'createTransport', () => ({ sendMail, close() {} }));
  const exports = {};
  new Function('require', 'exports', code)(name => name === 'nodemailer' ? nodemailer : require(name), exports);
  return { post: exports.POST, sendMail };
}
function request(changes = {}, files = [], id = randomUUID(), origin = 'http://localhost:3000') {
  const form = new FormData();
  for (const [key, value] of Object.entries({ name: 'Pengunjung Uji', email: 'visitor@example.test', organization: 'Komunitas Uji', subject: 'Kerja sama', message: 'Pesan uji lokal, bukan pengiriman nyata.', ...changes })) form.set(key, value);
  for (const file of files) form.append('attachments', file);
  return new Request('http://localhost:3000/api/contact', { method: 'POST', headers: { Origin: origin, 'Idempotency-Key': id }, body: form });
}
test('SMTP acceptance returns success, keeps recipient fixed and preserves attachment bytes', async () => {
  const { post, sendMail } = setup();
  const bytes = new Uint8Array([0, 127, 128, 255]);
  const response = await post(request({ to: 'untrusted@example.test' }, [new File([bytes], 'proposal.pdf')]));
  assert.deepEqual(await response.json(), { ok: true });
  const mail = sendMail.mock.calls[0].arguments[0];
  assert.equal(mail.to, 'senireligi@ub.ac.id');
  assert.equal(mail.replyTo.address, 'visitor@example.test');
  assert.deepEqual(mail.attachments[0].content, Buffer.from(bytes));
});
test('missing configuration and SMTP rejection never report success', async () => {
  const { post, sendMail } = setup(async () => ({ accepted: [] }));
  delete process.env.CONTACT_SMTP_PASSWORD;
  assert.equal((await post(request())).status, 503);
  assert.equal(sendMail.mock.callCount(), 0);
  process.env.CONTACT_SMTP_PASSWORD = 'test-only';
  const rejected = await post(request());
  assert.equal(rejected.status, 502);
  assert.equal((await rejected.json()).ok, false);
});
test('transport errors remain retryable', async () => {
  const { post } = setup(async () => { throw new Error('private SMTP diagnostic'); });
  const response = await post(request());
  assert.equal(response.status, 502);
  assert.doesNotMatch(await response.text(), /private SMTP/);
});
test('invalid fields, cross-origin and oversized or disallowed attachments never reach SMTP', async () => {
  const { post, sendMail } = setup();
  assert.equal((await post(request({ email: 'invalid' }))).status, 400);
  assert.equal((await post(request({ message: '   ' }))).status, 400);
  assert.equal((await post(request({ website: 'bot' }))).status, 400);
  assert.equal((await post(request({}, [], randomUUID(), 'https://other.example'))).status, 403);
  assert.equal((await post(request({}, [new File(['bad'], 'app.exe')]))).status, 400);
  assert.equal((await post(request({}, [new File([new Uint8Array(3 * 1024 * 1024 + 1)], 'large.pdf')]))).status, 413);
  assert.equal((await post(request({}, Array.from({ length: 6 }, () => new File(['a'], 'a.txt'))))).status, 400);
  assert.equal(sendMail.mock.callCount(), 0);
});
test('retries share one in-flight delivery and changed payload cannot reuse a receipt', async () => {
  const { post, sendMail } = setup();
  const id = randomUUID();
  const responses = await Promise.all([post(request({}, [], id)), post(request({}, [], id))]);
  assert.ok(responses.every(response => response.status === 200));
  assert.equal(sendMail.mock.callCount(), 1);
  assert.equal((await post(request({ message: 'Changed' }, [], id))).status, 409);
});
