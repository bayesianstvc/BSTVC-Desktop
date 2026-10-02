(() => {
'use strict';
const toggle=document.querySelector('.contents-button'), sidebar=document.querySelector('.sidebar');
const narrow=matchMedia('(max-width:900px)');
const syncSidebar=()=>{const hidden=narrow.matches&&!sidebar.classList.contains('is-open');sidebar.inert=hidden;sidebar.setAttribute('aria-hidden',String(hidden));};
const setOpen=open=>{sidebar.classList.toggle('is-open',open);toggle.setAttribute('aria-expanded',String(open));syncSidebar();};
syncSidebar();narrow.addEventListener('change',syncSidebar);
toggle.addEventListener('click',()=>{const open=toggle.getAttribute('aria-expanded')!=='true';setOpen(open);if(open) sidebar.querySelector('input').focus();});
document.addEventListener('click',e=>{if(sidebar.classList.contains('is-open')&&!sidebar.contains(e.target)&&!toggle.contains(e.target))setOpen(false);});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&sidebar.classList.contains('is-open')){setOpen(false);toggle.focus();}});
document.querySelectorAll('.on-page a').forEach(a=>a.addEventListener('click',()=>setOpen(false)));
const field=document.querySelector('#guide-search'), results=document.querySelector('#search-results'),status=document.querySelector('#search-status');
let searchIndex,loading,timer;
const normalize=text=>text.toLowerCase().normalize('NFKC');
async function loadIndex(){if(searchIndex)return searchIndex;if(!loading)loading=fetch('search-index.json').then(r=>{if(!r.ok)throw Error('Search unavailable');return r.json();}).then(data=>searchIndex=data).catch(e=>{loading=null;throw e;});return loading;}
async function search(){const query=field.value.trim();results.replaceChildren();results.hidden=!query;status.textContent='';if(!query)return;try{const data=await loadIndex();if(query!==field.value.trim())return;const words=normalize(query).split(/\s+/);const found=data.filter(item=>words.every(w=>normalize(item.title+' '+item.text).includes(w))).slice(0,18);status.textContent=found.length?`${found.length} matching sections`:'No matches. Try a field name, response type, or module.';found.forEach(item=>{const a=document.createElement('a');a.href=item.url;a.textContent=item.page+' · '+item.title;const snippet=document.createElement('span');const pos=Math.max(0,normalize(item.text).indexOf(words[0])-40);snippet.textContent=item.text.slice(pos,pos+145)+'…';a.append(snippet);results.append(a);});}catch(e){status.textContent='Search could not load. Use the chapter links below.';}}
field.addEventListener('input',()=>{clearTimeout(timer);timer=setTimeout(search,140);});
document.querySelectorAll('.copy-code').forEach(button=>button.addEventListener('click',async()=>{try{await navigator.clipboard.writeText(button.nextElementSibling.innerText);button.textContent='Copied';}catch(e){button.textContent='Select code to copy';}setTimeout(()=>button.textContent='Copy code',2200);}));
const dialog=document.querySelector('.image-dialog'),image=dialog.querySelector('img');let opener;
document.querySelectorAll('[data-zoom]').forEach(a=>a.addEventListener('click',e=>{if(!dialog.showModal)return;e.preventDefault();opener=a;image.src=a.href;image.alt=a.querySelector('img').alt;dialog.showModal();}));
dialog.querySelector('button').addEventListener('click',()=>dialog.close());dialog.addEventListener('click',e=>{if(e.target===dialog)dialog.close();});dialog.addEventListener('close',()=>opener?.focus());
})();
