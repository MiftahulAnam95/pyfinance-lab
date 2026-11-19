import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {test} from 'node:test';
import {demoSteps,init,step,trace,saldo} from '../src/sim';
const sets=[
 ['demo dan input bertitik',demoSteps.flatMap(s=>s.input)],
 ['kosong, kategori kosong, menu tak dikenal',['3','4','5','03','2','25000','  ','4','6']],
 ['saldo negatif dan kelompok kapital sensitif',['2','25000','Makan','2','10000','Makan','2','5000','makan','5','3','4','6']],
 ['nol, maksimum, Unicode, spasi dan nol awal',['1','0','1','1000000000','1','１',' 1 ',' \t000025000 ','1','999999999','3','5','6']],
] as const;
for(const [name,lines] of sets)test(`Python dan JS: ${name}`,()=>{
 const expected=execFileSync('python3',['-c',`import builtins, json, runpy, sys\nvalues=iter(json.loads(sys.argv[1]))\ndef echo(prompt):\n    v=next(values)\n    print(prompt+v)\n    return v\nbuiltins.input=echo\nrunpy.run_path('main.py',run_name='__main__')`,JSON.stringify(lines)],{cwd:'public/python',encoding:'utf8',env:{...process.env,PYTHONDONTWRITEBYTECODE:'1'}}).trim();
 const result=lines.reduce(step,init()).log.join('\n').trim();
 assert.equal(result,expected);
});
test('jejak demo dan sesi ulang',()=>{
 assert.deepEqual(trace.map(t=>t.after.length),[0,1,1,2,2,2,2,0]);
 assert.equal(trace[4].output,'Saldo: Rp125.000');assert.equal(trace[6].output,'Makan: Rp25.000');
 assert.equal(saldo(trace[3].after),125000n);
 assert.equal(saldo(init().data),0n);
});
