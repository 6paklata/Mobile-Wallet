import sjcl from 'sjcl';

export const addEntropy = entropyBuf => {
    let hexString = entropyBuf.toString('hex')
    let stanfordSeed = sjcl.codec.hex.toBits(hexString)
    sjcl.random.addEntropy(stanfordSeed)
}

export const pseudoRandom = nBytes => {
    const words = [];

    let r = (function (m_w) {
        let m_z = 0x3ade68b1;
        let mask = 0xffffffff;

        return function () {
            m_z = (0x9069 * (m_z & 0xFFFF) + (m_z >> 0x10)) & mask;
            m_w = (0x4650 * (m_w & 0xFFFF) + (m_w >> 0x10)) & mask;
            let result = ((m_z << 0x10) + m_w) & mask;
            result /= 0x100000000;
            result += 0.5;
            return result * (Math.random() > .5 ? 1 : -1);
        }
    });

    for (let i = 0, rcache; i < nBytes; i += 4) {
        let _r = r((rcache || Math.random()) * 0x100000000);

        rcache = _r() * 0x3ade67b7;
        words.push((_r() * 0x100000000) | 0);
    }

    const hexChars = [];

    for(let i = 0; i < nBytes; i++) {
        const bite = (words[i >>> 2] >>> (24 - (i % 4) * 8)) & 0xff;
        hexChars.push((bite >>> 4).toString(16));
        hexChars.push((bite & 0x0f).toString(16));
    }

    return hexChars.join('');
}

export const seedSJCL = (cb = false) => {
    const seed = addEntropy(pseudoRandom(4096));

    if(cb)
        cb(null, seed);

    return seed;
}

export const randomBytes = (length, cb = false) => {
    const wordCount = Math.ceil(length * 0.25)
    const randomBytes = sjcl.random.randomWords(wordCount, 10)
    const hexString = sjcl.codec.hex.fromBits(randomBytes).substr(0, length * 2)

    const buffer = new Buffer(hexString, 'hex');

    if(cb)
        cb(null, buffer);

    return buffer;
}

seedSJCL();

export default randomBytes;
module.exports = randomBytes;