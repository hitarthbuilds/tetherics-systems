import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import ts from 'typescript';
process.env.VERCEL='1';delete process.env.BLOB_READ_WRITE_TOKEN;delete process.env.ADMIN_PASSWORD;
import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');const modules=new Map();
const dataUrl=source=>`data:text/javascript;base64,${Buffer.from(source).toString('base64')}`;
const reactUrl=JSON.stringify(import.meta.resolve('react'));
const linkStub=dataUrl(`import React from ${reactUrl};export default function Link(props){return React.createElement('a',props,props.children);}`);
const imageStub=dataUrl(`import React from ${reactUrl};export default function Image({fill,priority,...props}){return React.createElement('img',props);}`);
const navigationStub=dataUrl(`export const usePathname=()=>'/';export function notFound(){throw new Error('NEXT_NOT_FOUND');}export function redirect(to){throw new Error('NEXT_REDIRECT '+to);}`);
const cacheStub=dataUrl(`export const unstable_cache=(fn)=>fn;export const updateTag=()=>{};export const revalidateTag=()=>{};export const revalidatePath=()=>{};`);
const headersStub=dataUrl(`export async function cookies(){return {get:()=>undefined,set:()=>{},delete:()=>{}};}`);
function loadUrl(file){if(modules.has(file))return modules.get(file);const compiled=ts.transpileModule(fs.readFileSync(file,'utf8'),{compilerOptions:{module:ts.ModuleKind.ES2022,jsx:ts.JsxEmit.ReactJSX,target:ts.ScriptTarget.ES2022}}).outputText;const resolved=compiled.replace(/import "[^"]+\.css";/g,'').replace(/^(\s*(?:import|export)\b[^\n]*?\bfrom )"([^"]+)"/gm,(_,head,name)=>{let target;if(name==='next/link')target=linkStub;else if(name==='next/image')target=imageStub;else if(name==='next/navigation')target=navigationStub;else if(name==='next/cache')target=cacheStub;else if(name==='next/headers')target=headersStub;else if(name==='./record-motion')target=dataUrl('export const RecordMotion=()=>null;');else if(name.startsWith('@/')||name.startsWith('.')){const base=name.startsWith('@/')?path.join(root,name.slice(2)):path.resolve(path.dirname(file),name);target=loadUrl([`${base}.tsx`,`${base}.ts`].find(candidate=>fs.existsSync(candidate)));}else target=import.meta.resolve(name);return `${head}${JSON.stringify(target)}`;});const url=dataUrl(resolved);modules.set(file,url);return url;}
const pages={};for(const route of ['/methodology','/security','/records/seerflow','/records/auctra']){const loadedPage=await import(loadUrl(path.join(root,'app',route,'page.tsx')));pages[route]=renderToStaticMarkup(React.createElement(loadedPage.default));}

test('every page has one primary heading, current navigation and valid local section links',()=>{for(const [route,html] of Object.entries(pages)){assert.equal((html.match(/<h1[ >]/g)||[]).length,1,route);assert.match(html,new RegExp(`href="${route}" aria-current="page"`));const ids=new Set([...html.matchAll(/\bid="([^"]+)"/g)].map(match=>match[1]));for(const match of html.matchAll(/href="#([^"]+)"/g))assert.ok(ids.has(match[1]),`${route}: missing ${match[1]}`);}});

test('local public artifact links resolve to existing assets or actual pages',()=>{for(const [route,html] of Object.entries(pages)){for(const [,href] of html.matchAll(/href="(\/[^"]*)"/g)){const pathname=href.split(/[?#]/)[0];assert.ok(pathname==='/'||fs.existsSync(path.join(root,'app',pathname,'page.tsx'))||fs.existsSync(path.join(root,'public',pathname)),`${route}: ${href}`);}}});

test('methodology distinguishes interface illustrations, archives and customer outcomes',()=>{const html=pages['/methodology'];for(const statement of ['fictional narrative telemetry','No independently verified customer performance result','not establish production hosting','no live customer account'])assert.ok(html.includes(statement),statement);assert.equal((html.match(/class="method-step-number"/g)||[]).length,6);});

test('security maps controls without inventing assurance or an incident response promise',()=>{const html=pages['/security'];assert.match(html,/No certification evidence published/);assert.match(html,/No report or attestation published/);assert.match(html,/No incident-response service level/);assert.match(html,/not a claim of certification/);assert.match(html,/source-side deployment and live transfer remain separate/);});

test('Auctra includes implemented build and bridge capabilities with live readiness limits',()=>{const html=pages['/records/auctra'];for(const text of ['Versioned source files','sandboxed browser previews','ZIP downloads','revocable preview sharing','source-side deployment','production database setup','Campaign writeback is not enabled','not verified delivery spend','FastAPI routes','SQLite migrations','Docker Compose starter','backend has not been executed or deployed'])assert.ok(html.toLowerCase().includes(text.toLowerCase()),text);for(const policy of ['privacy.html','deletion.html','terms.html'])assert.ok(html.includes(`https://auctra.tethericsystems.com/${policy}`));assert.match(html,/PRIVATE PILOT/);assert.match(html,/LIVE TRANSFER NOT ESTABLISHED/);assert.doesNotMatch(html,/all accounts connected|guaranteed returns|SOC 2 certified/i);});

test('SeerFlow preserves source and outcome limitations while linking the bridge record',()=>{const html=pages['/records/seerflow'];assert.match(html,/https:\/\/seerflow.tethericsystems.com/);assert.match(html,/No independently audited customer performance dataset/);assert.match(html,/Missing input ≠ zero/);assert.match(html,/does not claim that brands are connected by default/);assert.match(html,/PRODUCT CONTEXT DIAGRAM · NO CUSTOMER DATA/);});

const {posts}=await import(loadUrl(path.join(root,'lib','blog.ts')));
const companyPages={};for(const route of ['/about','/philosophy','/blog']){const loadedPage=await import(loadUrl(path.join(root,'app',route,'page.tsx')));companyPages[route]=renderToStaticMarkup(await loadedPage.default({}));}
const article=await import(loadUrl(path.join(root,'app','blog','[slug]','page.tsx')));
for(const post of posts)companyPages[`/blog/${post.slug}`]=renderToStaticMarkup(await article.default({params:Promise.resolve({slug:post.slug})}));
const resolves=pathname=>pathname==='/'||fs.existsSync(path.join(root,'app',pathname,'page.tsx'))||fs.existsSync(path.join(root,'public',pathname))||(pathname.startsWith('/blog/')&&posts.some(post=>`/blog/${post.slug}`===pathname));

test('the evidence register is retired and redirected to the company page',()=>{assert.ok(!fs.existsSync(path.join(root,'app','evidence','page.tsx')));assert.match(fs.readFileSync(path.join(root,'next.config.ts'),'utf8'),/source: "\/evidence", destination: "\/about"/);for(const html of [...Object.values(pages),...Object.values(companyPages)])assert.doesNotMatch(html,/href="\/evidence"/);});

test('company pages and every article render one heading with resolvable internal links',()=>{assert.ok(posts.length>=5);for(const [route,html] of Object.entries(companyPages)){assert.equal((html.match(/<h1[ >]/g)||[]).length,1,route);for(const [,href] of html.matchAll(/href="(\/[^"]*)"/g))assert.ok(resolves(href.split(/[?#]/)[0]),`${route}: ${href}`);}});

test('the about page states company facts without inventing people, dates or customers',()=>{const html=companyPages['/about'];assert.match(html,/Tetheric Systems Private Limited/);assert.match(html,/Live product: SeerFlow/);assert.match(html,/Private pilot: Auctra/);assert.match(html,/Live data transfer remains a separate step/);assert.doesNotMatch(html,/founded in|customers trust|SOC 2 certified/i);});

const content=await import(loadUrl(path.join(root,'lib','cms','content.ts')));
const auth=await import(loadUrl(path.join(root,'lib','cms','auth.ts')));
const draft=(overrides={})=>({title:'A studio story',slug:'',dek:'Short dek',category:'Company',date:'2026-09-25',author:'',cover:'bars',featured:false,body:[{type:'p',text:'Hello world.'}],...overrides});

test('studio content: slugs, pasted markdown and validation',()=>{
  assert.equal(content.slugify('Clarity inside — Possibility outside!'),'clarity-inside-possibility-outside');
  assert.deepEqual(content.textToBlocks('## Heading\n\n> A quote\n\n- one\n- two\n\nPlain text\nwraps.').map(block=>block.type),['h2','quote','list','p']);
  const post=content.normalizeInput(draft(),new Set());
  assert.equal(post.slug,'a-studio-story');assert.equal(post.author,'Tetheric Systems');
  assert.throws(()=>content.normalizeInput(draft({title:''}),new Set()),/title/);
  assert.throws(()=>content.normalizeInput(draft(),new Set(['a-studio-story'])),/already uses/);
  assert.throws(()=>content.normalizeInput(draft({body:[]}),new Set()),/paragraph/);
  const images=content.normalizeInput(draft({body:[{type:'p',text:'x'},{type:'image',url:'https://evil.example.com/a.png',alt:''},{type:'image',url:'https://abc.public.blob.vercel-storage.com/journal/a.png',alt:'ok',width:1200,height:800}]}),new Set());
  assert.equal(images.body.filter(block=>block.type==='image').length,1,'only Blob or local studio images are accepted');
});

test('studio auth stays locked without a password outside local development',async()=>{
  assert.equal(auth.devUnlocked(),false);
  assert.equal(auth.adminConfigured(),false);
  assert.equal(await auth.isAdmin(),false);
  assert.equal(auth.passwordMatches('anything'),false);
  process.env.ADMIN_PASSWORD='correct horse battery staple';
  try{assert.equal(auth.passwordMatches('correct horse battery staple'),true);assert.equal(auth.passwordMatches('wrong'),false);}
  finally{delete process.env.ADMIN_PASSWORD;}
});
