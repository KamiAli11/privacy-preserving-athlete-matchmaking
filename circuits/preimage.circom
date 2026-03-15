pragma circom 2.0.0;

include "node_modules/circomlib/circuits/poseidon.circom";

template Preimage() {
    signal input secret;
    signal output hash;

    component poseidon = Poseidon(1);
    poseidon.inputs[0] <== secret;
    hash <== poseidon.out;
}

component main = Preimage();