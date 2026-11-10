const {test}=require('node:test'), assert=require('node:assert/strict'),vm=require('node:vm'),fs=require('node:fs');
const code=fs.readFileSync('assets/js/advertising.js','utf8');
function setup({id='123456789',saved,blocked=false}={}) {
 const scripts=[],handlers={},buttons={};
 const button=n=>buttons[n]||=( {addEventListener:(_,cb)=>buttons[n].click=cb,focus(){}} );
 const panel={setAttribute(){},querySelector:button};
 const storage={value:saved,getItem(){if(blocked)throw Error();return this.value;},setItem(_,v){if(blocked)throw Error();this.value=v;}};
 const window={BLINDSFOLD_PIXEL_ID:id,addEventListener:(n,cb)=>handlers[n]=cb};
 const document={createElement:t=>t==='section'?panel:{},head:{appendChild:s=>scripts.push(s)},body:{appendChild(){}},querySelectorAll:()=>[button('settings')]};
 const context=vm.createContext({window,document,localStorage:storage,location:{hostname:'blindsfold.com'},Date,Set});
 vm.runInContext(code,context);
 return {window,context,scripts,panel,buttons,storage,handlers,events:()=>Array.from(window.fbq?.queue||[],a=>Array.from(a))};
}
test('default and decline send no events',()=>{const x=setup();assert.equal(x.scripts.length,0);x.buttons['[data-decline]'].click();x.window.blindsfoldAdvertising.lead('a');assert.equal(x.scripts.length,0);});
test('one initialization, PageView and deduplicated Lead; no customer parameters',()=>{const x=setup();x.buttons['[data-accept]'].click();x.buttons['[data-accept]'].click();vm.runInContext(code,x.context);x.window.blindsfoldAdvertising.lead('a');x.window.blindsfoldAdvertising.lead('a');assert.equal(x.scripts.length,1);assert.equal(x.events().filter(a=>a[0]==='init').length,1);assert.deepEqual(x.events().filter(a=>a[0]==='track'),[['track','PageView'],['track','Lead']]);assert.ok(x.events().some(a=>a[1]==='autoConfig'&&a[2]===false));});
test('withdraw clears unsent events and blocks Lead; settings reopen',()=>{const x=setup();x.buttons['[data-accept]'].click();x.buttons.settings.click();assert.equal(x.panel.hidden,false);x.buttons['[data-decline]'].click();x.window.blindsfoldAdvertising.lead('a');assert.equal(x.events().filter(a=>a[0]==='track').length,0);assert.ok(x.events().some(a=>a[1]==='revoke'));});
test('no retroactive Lead after later consent',()=>{const x=setup();x.window.blindsfoldAdvertising.lead('a');x.buttons['[data-accept]'].click();x.window.blindsfoldAdvertising.lead('a');assert.equal(x.events().filter(a=>a[1]==='Lead').length,0);});
test('missing or invalid ID keeps Pixel disabled',()=>{for(const id of ['', 'bad']){const x=setup({id});x.buttons['[data-accept]'].click();assert.equal(x.scripts.length,0);}});
test('persisted, expired, corrupt and unavailable storage',()=>{const saved=JSON.stringify({choice:'accepted',expires:Date.now()+100000});assert.equal(setup({saved}).scripts.length,1);for(const saved of ['bad',JSON.stringify({choice:'accepted',expires:0}),JSON.stringify({choice:'declined',expires:Date.now()+100000})])assert.equal(setup({saved}).scripts.length,0);const x=setup({blocked:true});x.buttons['[data-accept]'].click();assert.equal(x.scripts.length,1);});
test('other-tab withdrawal revokes tracking',()=>{const x=setup();x.buttons['[data-accept]'].click();x.storage.value=JSON.stringify({choice:'declined',expires:Date.now()+100000});x.handlers.storage({key:'blindsfold.advertising.v1'});x.window.blindsfoldAdvertising.lead('a');assert.equal(x.events().filter(a=>a[0]==='track').length,0);});
