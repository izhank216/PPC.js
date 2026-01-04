const { Memory } = require("./memory")

class CPUx86 {
  constructor(memorySize = 1024*1024){
    this.gpr = {
      eax: new CPUx86.Int32(0),
      ebx: new CPUx86.Int32(0),
      ecx: new CPUx86.Int32(0),
      edx: new CPUx86.Int32(0),
      esi: new CPUx86.Int32(0),
      edi: new CPUx86.Int32(0),
      esp: new CPUx86.Int32(0),
      ebp: new CPUx86.Int32(0)
    }
    this.eip = new CPUx86.Int32(0)
    this.eflags = 0
    this.memory = new Memory(memorySize)
    this.running = true
  }

  static Int32 = class {
    constructor(n = 0){
      this.value = n|0
    }
    toNumber(){ return this.value|0 }
    add(other){ return new CPUx86.Int32((this.value + other.value)|0) }
    sub(other){ return new CPUx86.Int32((this.value - other.value)|0) }
    and(other){ return new CPUx86.Int32(this.value & other.value) }
    or(other){ return new CPUx86.Int32(this.value | other.value) }
    xor(other){ return new CPUx86.Int32(this.value ^ other.value) }
  }

  fetch(){
    const instr = this.memory.read32(this.eip.toNumber())
    this.eip = new CPUx86.Int32(this.eip.toNumber() + 4)
    return instr
  }

  step(){
    const instr = this.fetch()
    const opcode = (instr>>>24)&0xFF
    if(opcode===0x01) this.add(instr)
    else if(opcode===0x29) this.sub(instr)
    else if(opcode===0x21) this.and(instr)
    else if(opcode===0x09) this.or(instr)
    else if(opcode===0x31) this.xor(instr)
    else if(opcode===0x89) this.mov(instr)
    else if(opcode===0xE9) this.jmp(instr)
    else if(opcode===0x74) this.jz(instr)
    else if(opcode===0x75) this.jnz(instr)
    else if(opcode===0xE8) this.call(instr)
    else if(opcode===0xC3) this.ret(instr)
  }

  add(instr){
    const reg = (instr>>>16)&0xFF
    const val = new CPUx86.Int32(instr&0xFFFF)
    this.gpr[CPUx86.regIndex(reg)] = this.gpr[CPUx86.regIndex(reg)].add(val)
  }

  sub(instr){
    const reg = (instr>>>16)&0xFF
    const val = new CPUx86.Int32(instr&0xFFFF)
    this.gpr[CPUx86.regIndex(reg)] = this.gpr[CPUx86.regIndex(reg)].sub(val)
  }

  and(instr){
    const reg = (instr>>>16)&0xFF
    const val = new CPUx86.Int32(instr&0xFFFF)
    this.gpr[CPUx86.regIndex(reg)] = this.gpr[CPUx86.regIndex(reg)].and(val)
  }

  or(instr){
    const reg = (instr>>>16)&0xFF
    const val = new CPUx86.Int32(instr&0xFFFF)
    this.gpr[CPUx86.regIndex(reg)] = this.gpr[CPUx86.regIndex(reg)].or(val)
  }

  xor(instr){
    const reg = (instr>>>16)&0xFF
    const val = new CPUx86.Int32(instr&0xFFFF)
    this.gpr[CPUx86.regIndex(reg)] = this.gpr[CPUx86.regIndex(reg)].xor(val)
  }

  mov(instr){
    const reg = (instr>>>16)&0xFF
    const val = new CPUx86.Int32(instr&0xFFFF)
    this.gpr[CPUx86.regIndex(reg)] = val
  }

  jmp(instr){
    const rel = CPUx86.signExtend24(instr&0xFFFFFF)
    this.eip = new CPUx86.Int32(this.eip.toNumber() + rel)
  }

  jz(instr){
    if(this.eflags & 1) this.jmp(instr)
  }

  jnz(instr){
    if(!(this.eflags & 1)) this.jmp(instr)
  }

  call(instr){
    const rel = CPUx86.signExtend24(instr&0xFFFFFF)
    this.gpr.esp = this.gpr.esp.sub(new CPUx86.Int32(4))
    this.memory.write32(this.gpr.esp.toNumber(), this.eip.toNumber())
    this.eip = new CPUx86.Int32(this.eip.toNumber() + rel)
  }

  ret(instr){
    this.eip = new CPUx86.Int32(this.memory.read32(this.gpr.esp.toNumber()))
    this.gpr.esp = this.gpr.esp.add(new CPUx86.Int32(4))
  }

  run(cycles=1){
    for(let i=0;i<cycles&&this.running;i++) this.step()
  }

  static regIndex(n){
    switch(n){
      case 0: return "eax"
      case 1: return "ebx"
      case 2: return "ecx"
      case 3: return "edx"
      case 4: return "esi"
      case 5: return "edi"
      case 6: return "esp"
      case 7: return "ebp"
      default: return "eax"
    }
  }

  static signExtend24(n){
    if(n & 0x800000) return n | 0xFF000000
    return n
  }
}

module.exports = { CPUx86 }
