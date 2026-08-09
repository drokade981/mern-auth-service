import crypto from "node:crypto";
import fs from "node:fs";

const { publicKey, privateKey } = crypto.generateKeyPairSync("rsa", {
    modulusLength: 2048,
    publicKeyEncoding: {
        type: "pkcs1",
        format: "pem",
    },
    privateKeyEncoding: {
        type: "pkcs1",
        format: "pem",
    }
});

fs.writeFileSync('certs/public.pem', publicKey);
fs.writeFileSync('certs/private.pem', privateKey);