const regsEl = document.getElementById("regs32");
const logEl = document.getElementById("log32");
const codeEl = document.getElementById("code32");
const runBtn = document.getElementById("run32");

function updateRegisters32() {
  let html = "";
  Object.entries(cpu32.gpr).forEach(([name,val])=>{
    html += `Register: ${name} = ${val.toNumber()}\n`;
  });
  html += `PC: ${cpu32.pc.toNumber()}  EFLAGS: ${cpu32.eflags}`;
  regsEl.textContent = html;
}

function runCPU32() {
  logEl.textContent = "";
  regsEl.textContent = "";
  
  const memory = new PPC.Memory(1024*1024);
  window.cpu32 = new PPC.CPUx86();
  cpu32.memory = memory;
  cpu32.pc = new PPC.CPUx86.Int32(0x100);

  // load user instructions
  const lines = codeEl.value.split("\n").map(l => l.trim()).filter(l=>l);
  lines.forEach((line,i)=>{
    const addr = 0x100 + i*4;
    memory.write32(addr, parseInt(line,16));
  });

  let cycles32 = 0;
  function step() {
    if(cycles32 < 20){
      cpu32.step();
      logEl.textContent += `Cycle ${cycles32+1}: PC=${cpu32.pc.toNumber().toString(16)}\n`;
      updateRegisters32();
      cycles32++;
      requestAnimationFrame(step);
    } else {
      logEl.textContent += "PPC 32-bit CPU test finished.\n";
    }
  }
  step();
}

runBtn.onclick = runCPU32;
