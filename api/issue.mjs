import { SignJWT, importPKCS8 } from 'jose';
import fs from 'fs';
import http from 'http';
import url from 'url';
import path from 'path';

const pem = fs.readFileSync(path.join(process.cwd(), 'keys', 'private-pkcs8.pem'), 'utf8');
const alg = 'RS256';
const privateKey = await importPKCS8(pem, alg);

const server = http.createServer(async (req, res) => {
  const { pathname } = url.parse(req.url);

  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    });
    return res.end();
  }

  if (pathname === '/issue') {
    const jwt = await new SignJWT({ age_verified: true })
      .setProtectedHeader({ alg, kid: 'test-key-1' })
      .setIssuedAt()
      .setExpirationTime('2h')
      .setIssuer('http://localhost:8080')
      .sign(privateKey);

    res.writeHead(200, {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    });
    return res.end(JSON.stringify({ token: jwt }));
  }

  if (pathname === '/.well-known/jwks.json') {
    const jwks = fs.readFileSync(path.join(process.cwd(), 'keys', 'jwks.json'), 'utf8');
    res.writeHead(200, {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    });
    return res.end(jwks);
  }

  res.writeHead(404, {
    'Access-Control-Allow-Origin': '*'
  });
  res.end('Not found');
});

server.listen(8080, () => {
  console.log('✅ NeutralToken Demo Issuer running at http://localhost:8080');
});