# NeutralToken Sandbox Issuer

A development-only credential issuer used to simulate NeutralToken badge issuance in local and testing environments. Produces JWTs (or other credentials) for verifying in demo or staging environments.

## Goals
- Provide `/issue` endpoint for NeutralToken badge generation
- Host `.well-known/jwks.json` for public key discovery
- Help devs integrate the full NeutralToken flow

## Folder Overview
- `api/`: Issuer logic and credential signing
- `public/.well-known/`: Static keys for verification

---

## Getting Started

1. **Install dependencies**
   ```sh
   npm install
   ```

2. **Generate your own keys and JWKS**
   ```sh
   node generate-jwks.js
   ```
   This will create `keys/private.pem`, `keys/private-pkcs8.pem`, and `keys/jwks.json`.

3. **Run the issuer server**

   - **If using Node.js v20 or later:**
     ```sh
     node api/issue.mjs
     ```
   - **If using Node.js v18:**
     ```sh
     node --experimental-global-webcrypto api/issue.mjs
     ```

4. **Test the endpoints**
   - Issue a token:
     ```sh
     curl http://localhost:8080/issue
     ```
   - Get the JWKS:
     ```sh
     curl http://localhost:8080/.well-known/jwks.json
     ```

---

**Note:**
- Private keys are not included in the repository. Each developer must generate their own using the provided script.
- The `keys/` directory is gitignored for security.

---

**NeutralToken public package:** [@neutraltoken/core on npm](https://www.npmjs.com/package/@neutraltoken/core)

**NeutralToken repo:** [NeutralToken-Foundation/neutraltoken](https://github.com/NeutralToken-Foundation/neutraltoken)
