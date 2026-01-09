const { Memory } = require("./memory")
const isaConfig = require("./isaconfig")

class PCI {
  constructor() {
    this.devices = {}

    const isa = {
      builtin: true,
      config: new Memory(0x100),
      memory: new Memory(0x1000)
    }

    isa.config.write32(0x00, (isaConfig.deviceId << 16) | isaConfig.vendorId)
    isa.config.write32(0x04, (isaConfig.status << 16) | isaConfig.command)
    isa.config.write8(0x08, isaConfig.revisionId)
    isa.config.write8(0x09, isaConfig.progIf)
    isa.config.write8(0x0a, isaConfig.subclass)
    isa.config.write8(0x0b, isaConfig.classCode)
    isa.config.write8(0x0e, isaConfig.headerType)
    isa.config.write8(0x0f, isaConfig.bist)

    this.devices["isa-bridge"] = isa
  }

  register(id, options = {}) {
    if (this.devices[id]) return
    this.devices[id] = {
      builtin: false,
      config: new Memory(options.configSize || 0x100),
      memory: new Memory(options.memSize || 0x1000)
    }
  }

  readConfig(id, offset) {
    const d = this.devices[id]
    if (!d) return 0
    return d.config.read32(offset)
  }

  writeConfig(id, offset, value) {
    const d = this.devices[id]
    if (!d) return
    d.config.write32(offset, value)
  }

  read(id, offset) {
    const d = this.devices[id]
    if (!d) return 0
    return d.memory.read32(offset)
  }

  write(id, offset, value) {
    const d = this.devices[id]
    if (!d) return
    d.memory.write32(offset, value)
  }
}

module.exports = { PCI }
