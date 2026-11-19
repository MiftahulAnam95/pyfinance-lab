import {useEffect,useRef} from 'react';
import {createRoot,hydrateRoot} from 'react-dom/client';
import {App} from './app';
import {pageFromPath,pageTitle} from './catalog';
import '@fontsource-variable/manrope/wght.css';
import '@fontsource-variable/space-grotesk/wght.css';
import '@fontsource-variable/jetbrains-mono/wght.css';
import 'lenis/dist/lenis.css';
import './style.css';
const root=document.getElementById('root')!;
const page=pageFromPath(location.pathname);
document.title=pageTitle(page);
function Client(){const scope=useRef<HTMLDivElement>(null);useEffect(()=>{let stopped=false;let clean:(()=>void)|undefined;import('./motion').then(({motion})=>{if(!stopped&&scope.current)clean=motion(scope.current);});return()=>{stopped=true;clean?.();};},[]);return <div ref={scope}><App page={page}/></div>;}
if(root.dataset.prerender==='true')hydrateRoot(root,<Client/>);else createRoot(root).render(<Client/>);
