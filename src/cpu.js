const { Memory } = require("./memory")

class CPU {
  constructor(memorySize = 1024 * 1024) {
    this.gpr = new Array(32).fill(null).map(() => new CPU.Int64(0))
    this.fpr = new Array(32).fill(0.0)
    this.pc = new CPU.Int64(0x100)
    this.lr = new CPU.Int64(0)
    this.cr = 0
    this.memory = new Memory(memorySize)
    this.running = true
  }

  static Int64 = class {
    constructor(n = 0) {
      if (typeof n === "number") {
        this.hi = Math.floor(n / 2 ** 32)
        this.lo = n >>> 0
      } else if (n instanceof CPU.Int64) {
        this.hi = n.hi
        this.lo = n.lo
      } else {
        this.hi = 0
        this.lo = 0
      }
    }

    toNumber() {
      return this.hi * 2 ** 32 + this.lo
    }

    add(other) {
      const lo = (this.lo + other.lo) >>> 0
      let hi = this.hi + other.hi
      if (lo < this.lo) hi += 1
      return new CPU.Int64(hi * 2 ** 32 + lo)
    }

    sub(other) {
      let lo = (this.lo - other.lo) >>> 0
      let hi = this.hi - other.hi
      if (this.lo < other.lo) hi -= 1
      return new CPU.Int64(hi * 2 ** 32 + lo)
    }

    and(other) {
      return new CPU.Int64((this.hi & other.hi) * 2 ** 32 + (this.lo & other.lo))
    }

    or(other) {
      return new CPU.Int64((this.hi | other.hi) * 2 ** 32 + (this.lo | other.lo))
    }

    xor(other) {
      return new CPU.Int64((this.hi ^ other.hi) * 2 ** 32 + (this.lo ^ other.lo))
    }
  }

  fetch() {
    const instr = this.memory.read32(this.pc.toNumber())
    this.pc = new CPU.Int64(this.pc.toNumber() + 4)
    return instr
  }

  step() {
    const instr = this.fetch()
    const op = instr >>> 26

    if (op === 31) this.execExtended(instr)
    else if (op === 18) this.branch(instr)
    else if (op === 16) this.branchConditional(instr)
    else if (op === 32) this.lwz(instr)
    else if (op === 36) this.stw(instr)
    else if (op === 34) this.lbz(instr)
  }

  execExtended(instr) {
    const xo = (instr >>> 1) & 0x3ff
    const rD = (instr >>> 21) & 31
    const rA = (instr >>> 16) & 31
    const rB = (instr >>> 11) & 31

    if (xo === 266) this.gpr[rD] = this.gpr[rA].add(this.gpr[rB])
    if (xo === 40) this.gpr[rD] = this.gpr[rB].sub(this.gpr[rA])
    if (xo === 28) this.gpr[rD] = this.gpr[rA].and(this.gpr[rB])
    if (xo === 444) this.gpr[rD] = this.gpr[rA].or(this.gpr[rB])
    if (xo === 316) this.gpr[rD] = this.gpr[rA].xor(this.gpr[rB])
    if (xo === 16) this.pc = new CPU.Int64(this.lr.toNumber())
    if (xo === 21) this.fpr[rD] = this.fpr[rA] + this.fpr[rB]
    if (xo === 20) this.fpr[rD] = this.fpr[rA] - this.fpr[rB]
    if (xo === 25) this.fpr[rD] = this.fpr[rA] * this.fpr[rB]
  }

  branch(instr) {
    const li = ((instr & 0x03fffffc) << 6) >> 6
    this.pc = new CPU.Int64(this.pc.toNumber() + li)
  }

  branchConditional(instr) {
    const bd = ((instr & 0xfffc) << 16) >> 16
    if (this.cr) this.pc = new CPU.Int64(this.pc.toNumber() + bd)
  }

  lwz(instr) {
    const rD = (instr >>> 21) & 31
    const rA = (instr >>> 16) & 31
    const d = (instr << 16) >> 16
    const addr = this.gpr[rA].toNumber() + d
    this.gpr[rD] = new CPU.Int64(this.memory.read32(addr))
  }

  stw(instr) {
    const rS = (instr >>> 21) & 31
    const rA = (instr >>> 16) & 31
    const d = (instr << 16) >> 16
    const addr = this.gpr[rA].toNumber() + d
    this.memory.write32(addr, this.gpr[rS].toNumber())
  }

  lbz(instr) {
    const rD = (instr >>> 21) & 31
    const rA = (instr >>> 16) & 31
    const d = (instr << 16) >> 16
    const addr = this.gpr[rA].toNumber() + d
    this.gpr[rD] = new CPU.Int64(this.memory.read8(addr))
  }

  run(cycles = 1) {
    for (let i = 0; i < cycles && this.running; i++) this.step()
  }
}

module.exports = { CPU }
