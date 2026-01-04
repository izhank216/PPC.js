const { Buffer } = require("buffer")
const aesjs = require("aes-js")

class Memory {
  constructor(size) {
    this.buffer = Buffer.alloc(size)
    this.key = aesjs.utils.utf8.toBytes("ppc-emulator-key")
  }

  encrypt(offset, length) {
    const data = this.buffer.slice(offset, offset + length)
    const aes = new aesjs.ModeOfOperation.ctr(this.key)
    const encrypted = aes.encrypt(data)
    encrypted.copy(this.buffer, offset)
  }

  decrypt(offset, length) {
    const data = this.buffer.slice(offset, offset + length)
    const aes = new aesjs.ModeOfOperation.ctr(this.key)
    const decrypted = aes.decrypt(data)
    decrypted.copy(this.buffer, offset)
  }

  read8(addr) {
    return this.buffer.readUInt8(addr)
  }

  read32(addr) {
    return this.buffer.readUInt32BE(addr)
  }

  write8(addr, val) {
    this.buffer.writeUInt8(val, addr)
  }

  write32(addr, val) {
    this.buffer.writeUInt32BE(val, addr)
  }

  load(data, addr = 0) {
    data.copy(this.buffer, addr)
  }
}

module.exports = { Memory }
