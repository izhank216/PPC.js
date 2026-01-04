const { Buffer } = require("buffer")

class FakeBIOS {
  constructor() {
    this.entryPoint = 0x100
    this.signature = Buffer.from("PPCBIOS")
    this.versionString = Buffer.from("FakeBIOS for PPC ver 1.0")
  }

  load(memory) {
    this.signature.copy(memory.buffer, 0x0)
    this.versionString.copy(memory.buffer, this.signature.length)
    const boot = Buffer.alloc(256)
    memory.load(boot, this.entryPoint)
  }
}

module.exports = { FakeBIOS }
