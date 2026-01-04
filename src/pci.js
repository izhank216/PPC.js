class PCI {
  constructor() {
    this.devices = {}
  }

  register(id, device) {
    this.devices[id] = device
  }

  read(id, offset) {
    if (!this.devices[id]) return 0
    return this.devices[id].read(offset)
  }

  write(id, offset, value) {
    if (!this.devices[id]) return
    this.devices[id].write(offset, value)
  }
}

module.exports = { PCI }
