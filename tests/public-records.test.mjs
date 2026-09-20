import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import ts from 'typescript';
import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');const modules=new Map();
const dataUrl=source=>`data:text/javascript;base64,${Buffer.from(source).toString('base64')}`;
const reactUrl=JSON.stringify(import.meta.resolve('react'));
const linkStub=dataUrl(`import React from ${reactUrl};export default function Link(props){return React.createElement('a',props,props.children);}`);
const imageStub=dataUrl(`import React from ${reactUrl};export default function Image({fill,priority,...props}){return React.createElement('img',props);}`);
function loadUrl(file){if(modules.has(file))return modules.get(file);const compiled=ts.transpileModule(fs.readFileSync(file,'utf8'),{compilerOptions:{module:ts.ModuleKind.ES2022,jsx:ts.JsxEmit.ReactJSX,target:ts.ScriptTarget.ES2022}}).outputText;const resolved=compiled.replace(/import "[^"]+\.css";/g,'').replace(/from "([^"]+)"/g,(_,name)=>{let target;if(name==='next/link')target=linkStub;else if(name==='next/image')target=imageStub;else if(name==='./record-motion')target=dataUrl('export const RecordMotion=()=>null;');else if(name.startsWith('@/')||name.startsWith('.')){const base=name.startsWith('@/')?path.join(root,name.slice(2)):path.resolve(path.dirname(file),name);target=loadUrl([`${base}.tsx`,`${base}.ts`].find(candidate=>fs.existsSync(candidate)));}else target=import.meta.resolve(name);return `from ${JSON.stringify(target)}`;});const url=dataUrl(resolved);modules.set(file,url);return url;}
const pages={};for(const route of ['/evidence','/methodology','/security','/records/seerflow','/records/foundry']){const loadedPage=await import(loadUrl(path.join(root,'app',route,'page.tsx')));pages[route]=renderToStaticMarkup(React.createElement(loadedPage.default));}

test('every page has one primary heading, current navigation and valid local section links',()=>{for(const [route,html] of Object.entries(pages)){assert.equal((html.match(/<h1[ >]/g)||[]).length,1,route);assert.match(html,new RegExp(`href="${route}" aria-current="page"`));const ids=new Set([...html.matchAll(/\bid="([^"]+)"/g)].map(match=>match[1]));for(const match of html.matchAll(/href="#([^"]+)"/g))assert.ok(ids.has(match[1]),`${route}: missing ${match[1]}`);}});

test('the evidence ledger retains all six sources and their concept/product boundaries',()=>{const html=pages['/evidence'];for(const item of ['EV-001','EV-002','EV-003','EV-004','EV-005','EV-006','/models/tetherics-machine.scn','/cinematic/tetherics-machine-4k.mp4','/cinematic/asset-manifest.json','/briefs/tetherics-system-brief.pdf'])assert.ok(html.includes(item),item);assert.equal((html.match(/<details/g)||[]).length,6);assert.match(html,/fictional narrative telemetry/);assert.match(html,/No independently audited customer results/);assert.match(html,/Registration documents are not published/);assert.match(html,/No named leadership profile/);});

test('local public artifact links resolve to existing assets or actual pages',()=>{for(const [route,html] of Object.entries(pages)){for(const [,href] of html.matchAll(/href="(\/[^"]*)"/g)){const pathname=href.split(/[?#]/)[0];assert.ok(pathname==='/'||fs.existsSync(path.join(root,'app',pathname,'page.tsx'))||fs.existsSync(path.join(root,'public',pathname)),`${route}: ${href}`);}}});

test('methodology distinguishes interface illustrations, archives and customer outcomes',()=>{const html=pages['/methodology'];for(const statement of ['fictional narrative telemetry','No independently verified customer performance result','not establish production hosting','no live customer account'])assert.ok(html.includes(statement),statement);assert.equal((html.match(/class="method-step-number"/g)||[]).length,6);});

test('security maps controls without inventing assurance or an incident response promise',()=>{const html=pages['/security'];assert.match(html,/No certification evidence published/);assert.match(html,/No report or attestation published/);assert.match(html,/No incident-response service level/);assert.match(html,/not a claim of certification/);assert.match(html,/source-side deployment and live transfer remain separate/);});

test('Foundry includes implemented build and bridge capabilities with live readiness limits',()=>{const html=pages['/records/foundry'];for(const text of ['Versioned source files','sandboxed browser previews','ZIP downloads','revocable preview sharing','source-side deployment','production database setup','Campaign writeback is not enabled','not verified delivery spend','FastAPI routes','SQLite migrations','Docker Compose starter','backend has not been executed or deployed'])assert.ok(html.toLowerCase().includes(text.toLowerCase()),text);for(const policy of ['privacy.html','deletion.html','terms.html'])assert.ok(html.includes(`https://foundry.tethericsystems.com/${policy}`));assert.match(html,/PRIVATE PILOT/);assert.match(html,/LIVE TRANSFER NOT ESTABLISHED/);assert.doesNotMatch(html,/all accounts connected|guaranteed returns|SOC 2 certified/i);});

test('SeerFlow preserves source and outcome limitations while linking the bridge record',()=>{const html=pages['/records/seerflow'];assert.match(html,/https:\/\/seerflow.tethericsystems.com/);assert.match(html,/No independently audited customer performance dataset/);assert.match(html,/Missing input ≠ zero/);assert.match(html,/does not claim that brands are connected by default/);assert.match(html,/PRODUCT CONTEXT DIAGRAM · NO CUSTOMER DATA/);});
