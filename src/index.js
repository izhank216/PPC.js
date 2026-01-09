const { CPU } = require("./cpu")
const { Memory } = require("./memory")
const { PCI } = require("./pci")
const { FakeBIOS } = require("./fakeBIOS")
const isaConfig = require("./isaconfig")
const { CPUx86 } = require("./x86")

console.log(
  `%c ____  ____  ____       _  ____ 
/  __\\/  __\\/   _\\     / |/ ___\\
|  \\/||  \\/||  /       | ||    \\
|  __/|  __/|  \\____/\\_| |\\___ |
\\_/   \\_/   \\____/\\/\\____/\\____/

%c The PowerPC CPU emulation library for the browser.

%cSee the GitHub repository at https://github.com/izhank216/PPC.js/`,
  "color: red; font-weight: bold;",
  "font-style: italic;",
  ""
);

module.exports = {
  CPU,
  CPUx86,
  Memory,
  PCI,
  FakeBIOS,
  isaConfig,
  Buffer: require("buffer").Buffer
}
