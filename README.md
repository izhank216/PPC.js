# PPC.js

<img src="./logo.svg"></img>

This library provides **PowerPC CPU emulation in the browser**:

- **PPC CPU (64-bit)** — executes 64-bit PowerPC instructions
- **PPC x86/32 CPU** — executes 32-bit x86 instructions

## Download

Download the minified library from ``dist/ppc.min.js``


## Usage

### PPC 64-bit Example

```html
<div id="regs" style="white-space: pre"></div>
<div id="log" style="white-space: pre"></div>

<script src="dist/ppc.min.js"></script>
<script>
const regsEl = document.getElementById("regs")
const logEl = document.getElementById("log")

const memory = new PPC.Memory(1024*1024)
const cpu = new PPC.CPU()
cpu.memory = memory
cpu.pc = new PPC.CPU.Int64(0x100)

cpu.memory.write32(0x100, 0x7C000214)
cpu.memory.write32(0x104, 0x4E800020)

function updateRegisters() {
  let html = ""
  cpu.gpr.forEach((r,i)=> html += `R${i}: ${r.toNumber()}  `)
  html += `\nPC: ${cpu.pc.toNumber()}  LR: ${cpu.lr.toNumber()}  CR: ${cpu.cr}`
  regsEl.textContent = html
}

let cycles = 0
function stepCPU() {
  if(cycles < 5){
    cpu.step()
    logEl.textContent += `Cycle ${cycles+1}: PC=${cpu.pc.toNumber().toString(16)}\n`
    updateRegisters()
    cycles++
    requestAnimationFrame(stepCPU)
  } else {
    logEl.textContent += "PPC CPU example finished.\n"
  }
}

stepCPU()
</script>
```

### PPC x86/32 Example
```html
<div id="regs32" style="white-space: pre"></div>
<div id="log32" style="white-space: pre"></div>

<script src="dist/ppc.min.js"></script>
<script>
const regsEl = document.getElementById("regs32")
const logEl = document.getElementById("log32")

const memory = new PPC.Memory(1024*1024)
const cpu32 = new PPC.CPUx86()
cpu32.memory = memory
cpu32.pc = new PPC.CPUx86.Int32(0x100)

cpu32.memory.write32(0x100, 0x00000000)
cpu32.memory.write32(0x104, 0xC3)

function updateRegisters32() {
  let html = ""
  Object.entries(cpu32.gpr).forEach(([name,val])=> html += `${name}: ${val.toNumber()}  `)
  html += `\nPC: ${cpu32.pc.toNumber()}  EFLAGS: ${cpu32.eflags}`
  regsEl.textContent = html
}

let cycles32 = 0
function stepCPU32() {
  if(cycles32 < 5){
    cpu32.step()
    logEl.textContent += `Cycle ${cycles32+1}: PC=${cpu32.pc.toNumber().toString(16)}\n`
    updateRegisters32()
    cycles32++
    requestAnimationFrame(stepCPU32)
  } else {
    logEl.textContent += "PPC x86/32 CPU example finished.\n"
  }
}

stepCPU32()
</script>
```
