import {renderToString} from 'react-dom/server';
import {App} from './app';
import {routes,pageTitle,type Page} from './catalog';
export {routes,pageTitle};
export function render(page:Page){return renderToString(<div><App page={page}/></div>);}
