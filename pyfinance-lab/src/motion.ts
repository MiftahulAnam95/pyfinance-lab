import gsap from 'gsap';
import {ScrollTrigger} from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
export function motion(root:HTMLElement){
 gsap.registerPlugin(ScrollTrigger);
 const mm=gsap.matchMedia();
 mm.add('(prefers-reduced-motion: no-preference)',()=>{
  const lenis=new Lenis({smoothWheel:true,anchors:false,autoRaf:false});
  const tick=(t:number)=>lenis.raf(t*1000);
  lenis.on('scroll',ScrollTrigger.update);gsap.ticker.add(tick);
  if(root.querySelector('.hero-terminal'))gsap.fromTo('.hero-terminal',{y:9},{y:0,duration:.75,ease:'power2.out',clearProps:'transform'});
  if(root.querySelector('.learning-head'))gsap.fromTo('.learning-head .kicker',{x:-5},{x:0,duration:.4,clearProps:'transform',scrollTrigger:{trigger:'.learning-head',start:'top 92%',once:true}});
  return()=>{gsap.ticker.remove(tick);lenis.off('scroll',ScrollTrigger.update);lenis.destroy();};
 },root);
 return()=>mm.revert();
}
