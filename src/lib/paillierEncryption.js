import * as paillierBigint from "paillier-bigint"

let publicKey
let privateKey

async function generateKeys() {

    const keys = await paillierBigint.generateRandomKeys(512)

    publicKey = keys.publicKey
    privateKey = keys.privateKey
}

// generate keys when server starts
await generateKeys()

export { publicKey, privateKey }