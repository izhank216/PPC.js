const regsEl = document.getElementById("regs64");
const logEl = document.getElementById("log64");
const codeEl = document.getElementById("code64");
const runBtn = document.getElementById("run64");

function updateRegisters() {
  let html = "";
  cpu.gpr.forEach((r,i)=>{
    html += `Register: R${i} = ${r.toNumber()}\n`;
  });
  html += `PC: ${cpu.pc.toNumber()}  LR: ${cpu.lr.toNumber()}  CR: ${cpu.cr}`;
  regsEl.textContent = html;
}

function runCPU() {
  logEl.textContent = "";
  regsEl.textContent = "";
  
  const memory = new PPC.Memory(1024*1024);
  window.cpu = new PPC.CPU();
  cpu.memory = memory;
  cpu.pc = new PPC.CPU.Int64(0x100);

  // load user instructions
  const lines = codeEl.value.split("\n").map(l => l.trim()).filter(l=>l);
  lines.forEach((line,i)=>{
    const addr = 0x100 + i*4;
    memory.write32(addr, parseInt(line,16));
  });

  let cycles = 0;
  function step() {
    if(cycles < 20){
      cpu.step();
      logEl.textContent += `Cycle ${cycles+1}: PC=${cpu.pc.toNumber().toString(16)}\n`;
      updateRegisters();
      cycles++;
      requestAnimationFrame(step);
    } else {
      logEl.textContent += "PPC 64-bit CPU test finished.\n";
    }
  }
  step();
}

runBtn.onclick = runCPU;
