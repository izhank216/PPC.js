const { CPU } = require("./cpu")
const { Memory } = require("./memory")
const { PCI } = require("./pci")
const { FakeBIOS } = require("./fakeBIOS")
const { CPUx86 } = require("./x86")

module.exports = {
  CPU,
  CPUx86,
  Memory,
  PCI,
  FakeBIOS,
  Buffer: require("buffer").Buffer
}
