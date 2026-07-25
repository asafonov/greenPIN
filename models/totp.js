class TOTP {
  constructor() {
  }

  parseUrl (urlString) {
    const url = urlString.replace(/[A-z]*\:\/\/[A-z]+\//g, '').split('?')
    const pathname = url[0].split(':')
    const params = {}
    const parts = url.length > 1 ? url[1].split('&') : []

    for (let i = 0; i < parts.length; ++i) {
      const nv = parts[i].split('=')
      params[nv[0]] = nv[1] || ''
    }

    return {
      secret: params.secret || '',
      issuer: params.issuer?.replace(/[^A-z]/g, '') || '',
      provider: pathname[0],
      username: pathname.length > 1 ? pathname[1] : ''
    }
  }

  base32Decode (base32Str) {
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567'
    const str = base32Str.toUpperCase().replace(/[\s-]/g, '')

    if (str.length % 8 !== 0) throw new Error('Invalid base32 length')

    let bits = ''

    for (const ch of str) {
      const idx = alphabet.indexOf(ch)

      if (idx === -1) throw new Error(`Invalid base32 character: ${ch}`)

      bits += idx.toString(2).padStart(5, '0')
    }

    const bytes = []

    for (let i = 0; i < bits.length; i += 8) {
      if (i + 8 <= bits.length) {
        bytes.push(parseInt(bits.slice(i, i + 8), 2))
      }
    }

    return new Uint8Array(bytes)
  }

  async generateTOTP (base32Secret, timeStep = 30, digits = 6) {
    const secretBytes = this.base32Decode(base32Secret)
    const cryptoKey = await crypto.subtle.importKey('raw', secretBytes, {name: 'HMAC', hash: 'SHA-1'}, false, ['sign'])
    const timestampSec = Math.floor(Date.now() / 1000)
    const counter = Math.floor(timestampSec / timeStep)
    const buffer = new ArrayBuffer(8)
    const view = new DataView(buffer)
    view.setBigUint64(0, BigInt(counter), false)
    const hmacResult = await crypto.subtle.sign('HMAC', cryptoKey, buffer)
    const hmacBytes = new Uint8Array(hmacResult)
    const offset = hmacBytes[hmacBytes.length - 1] & 0x0f
    const binaryCode = ((hmacBytes[offset] & 0x7f) << 24) | ((hmacBytes[offset + 1] & 0xff) << 16) | ((hmacBytes[offset + 2] & 0xff) << 8) | (hmacBytes[offset + 3] & 0xff)
    const otp = binaryCode % Math.pow(10, digits)
    return otp.toString().padStart(digits, '0')
  }

  test() {
    const t = this.parseData("otpauth://totp/Provider:username?secret=SECRET&issuer=ProviderName")
    console.log('parseData test')
    console.log(t)
    let result = t.secret === 'SECRET' && t.issuer === 'ProviderName' && t.provider === 'Provider' && t.username === 'username'
    if (! result) return result

    return result
  }
}
