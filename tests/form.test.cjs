const {test}=require('node:test'),assert=require('node:assert/strict'),vm=require('node:vm'),fs=require('node:fs');
const code=fs.readFileSync('assets/js/main.js','utf8');
function setup({valid=true,response={ok:true},fail=false,trackingThrows=false}={}) {
 const handlers={},elements={},requests=[],leads=[];let release;
 const cls=()=>({add(){},remove(){},toggle(){}});
 const el=k=>elements[k]||={classList:cls(),addEventListener:(n,cb)=>handlers[k+n]=cb};
 const field={checkValidity:()=>valid,reportValidity:()=>elements.reported=true};
 const steps=Array.from({length:5},()=>({classList:cls(),querySelectorAll:()=>[field]}));
 const form={querySelectorAll:q=>q==='.form-step'?steps:[],querySelector:el,closest:()=>null,addEventListener:(n,cb)=>handlers[n]=cb,reset:()=>elements.reset=true};
 const document={querySelectorAll:q=>q==='[data-quote-form]'?[form]:[],querySelector:()=>null};
 const window={BLINDSFOLD_CONFIG:{formEndpoint:'https://example.test/quotes'},blindsfoldAdvertising:{lead:id=>{if(trackingThrows)throw Error();leads.push(id);}}};
 const fetch=(...args)=>{requests.push(args);return new Promise((res,rej)=>release=()=>fail?rej(Error()):res(response));};
 vm.runInNewContext(code,{window,document,fetch,FormData:class{},CSS:{escape:x=>x},setTimeout(){}});
 return {handlers,elements,requests,leads,release:()=>release(),submit:()=>handlers.submit({preventDefault(){}})};
}
test('invalid form sends no request or Lead',async()=>{const x=setup({valid:false});await x.submit();assert.equal(x.requests.length,0);assert.equal(x.leads.length,0);assert.ok(x.elements.reported);});
test('rapid/repeated submissions send one request and one Lead only after acceptance',async()=>{const x=setup();const p=x.submit();await x.submit();assert.equal(x.requests.length,1);assert.equal(x.leads.length,0);x.release();await p;await x.submit();assert.equal(x.requests.length,1);assert.equal(x.leads.length,1);assert.ok(x.elements.reset);});
test('opening or navigating steps never sends Lead',()=>{const x=setup();x.handlers['[data-next]click']();x.handlers['[data-back]click']();assert.equal(x.requests.length,0);assert.equal(x.leads.length,0);});
test('HTTP error, unexpected redirect and network error do not report success',async()=>{for(const options of [{response:{ok:false}},{response:{ok:true,redirected:true}},{fail:true}]){const x=setup(options);const p=x.submit();x.release();await p;assert.equal(x.leads.length,0);assert.equal(x.elements.reset,undefined);assert.equal(x.elements['[data-submit]'].disabled,false);assert.match(x.elements['[data-form-status]'].textContent,/could not send/);}});
test('tracking failure cannot invalidate accepted quote or allow duplicate',async()=>{const x=setup({trackingThrows:true});const p=x.submit();x.release();await p;await x.submit();assert.equal(x.requests.length,1);assert.ok(x.elements.reset);assert.equal(x.elements['[data-submit]'].textContent,'Sent');});
