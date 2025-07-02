const fs = require('fs');
const jwkToPem = require('jwk-to-pem');
const { generateKeyPairSync } = require('crypto');
const { pem2jwk } = require('pem-jwk');
const { execSync } = require('child_process');

// Generate an RSA key pair (PKCS1)
const { privateKey, publicKey } = generateKeyPairSync('rsa', {
  modulusLength: 2048,
  publicKeyEncoding: { type: 'pkcs1', format: 'pem' },
  privateKeyEncoding: { type: 'pkcs1', format: 'pem' }
});

// Save PKCS1 private key
fs.mkdirSync('keys', { recursive: true });
fs.writeFileSync('./keys/private.pem', privateKey);

// Convert PKCS1 private key to PKCS8 and save
try {
  execSync('openssl pkcs8 -topk8 -inform PEM -outform PEM -in ./keys/private.pem -out ./keys/private-pkcs8.pem -nocrypt');
  console.log('✅ Generated private-pkcs8.pem (PKCS8)');
} catch (err) {
  console.error('❌ Error generating PKCS8 private key. Make sure OpenSSL is installed.');
  process.exit(1);
}

// Convert public key to JWK
const jwk = pem2jwk(publicKey);
jwk.alg = 'RS256';
jwk.use = 'sig';
jwk.kid = 'test-key-1';

// Save JWKS
fs.writeFileSync('./keys/jwks.json', JSON.stringify({ keys: [jwk] }, null, 2));
console.log('✅ Generated private.pem, private-pkcs8.pem, and jwks.json');