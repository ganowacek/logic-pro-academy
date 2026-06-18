"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight, AudioLines, BookOpen, Check, ChevronDown, ChevronRight, CircleHelp,
  Disc3, Flame, Gauge, GraduationCap, Headphones, Home, Keyboard, Library, Lock,
  Menu, Mic2, Music2, Pause, Play, Radio, RotateCcw, Settings2, SlidersHorizontal,
  Sparkles, Trophy, Volume2, WandSparkles, X, Zap
} from "lucide-react";
import { useAcademy } from "@/lib/store";

const modules = [
  { n: "01", title: "Getting comfortable", desc: "Find your way around Logic", icon: Home, lessons: 7, color: "#89a7ff" },
  { n: "02", title: "First sounds", desc: "Turn an empty project into music", icon: Music2, lessons: 6, color: "#a990ff" },
  { n: "03", title: "Beat making", desc: "Build a beat that actually moves", icon: Disc3, lessons: 7, color: "#f08ab6" },
  { n: "04", title: "Emotional sampling", desc: "Find feeling in everyday sound", icon: Mic2, lessons: 7, color: "#ff9a73" },
  { n: "05", title: "Chords & emotion", desc: "Write harmony without the theory fog", icon: Keyboard, lessons: 6, color: "#ffd36b" },
  { n: "06", title: "Building energy", desc: "Make the room hold its breath", icon: Zap, lessons: 7, color: "#8fe1b0" },
  { n: "07", title: "Arrangement", desc: "Turn your loop into a journey", icon: AudioLines, lessons: 6, color: "#70d7d7" },
  { n: "08", title: "Mixing", desc: "Give every sound its place", icon: SlidersHorizontal, lessons: 7, color: "#78baff" },
  { n: "09", title: "Export & share", desc: "Finish the thing. Let it go.", icon: Radio, lessons: 4, color: "#bc99ff" }
];

const steps = [
  { title: "Meet the transport", text: "The transport is your playback command center. It controls when the music starts, stops, and records." },
  { title: "Press Play", text: "Click the Play button in the simulator. Watch the playhead move across your project." },
  { title: "Listen with intention", text: "Notice how every track begins at the same point. The timeline keeps your whole song synchronized." }
];

const drumRows = ["KICK", "CLAP", "HAT", "TEXTURE"];
const defaultPattern = [
  [true,false,false,false,true,false,false,false,true,false,false,false,true,false,false,false],
  [false,false,false,false,true,false,false,false,false,false,false,false,true,false,false,false],
  [false,false,true,false,false,false,true,false,false,false,true,false,false,false,true,false],
  [true,false,false,true,false,false,false,false,false,true,false,false,false,false,false,true]
];

function playTone(freq = 110, duration = .08, type: OscillatorType = "sine") {
  const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
  const ctx = new AudioCtx();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type; osc.frequency.value = freq;
  gain.gain.setValueAtTime(.18, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(.001, ctx.currentTime + duration);
  osc.connect(gain).connect(ctx.destination); osc.start(); osc.stop(ctx.currentTime + duration);
}

export default function Page() {
  const { completedLessons, projectParts, xp, completeLesson, reset } = useAcademy();
  const [view, setView] = useState<"home" | "lesson" | "lab">("home");
  const [mobile, setMobile] = useState(false);
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [pattern, setPattern] = useState(defaultPattern);
  const [beat, setBeat] = useState(-1);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);
  const overall = Math.round((completedLessons.length / 53) * 100);

  useEffect(() => {
    if (!playing) { if (timer.current) clearInterval(timer.current); setBeat(-1); return; }
    let b = -1;
    timer.current = setInterval(() => {
      b = (b + 1) % 16; setBeat(b);
      pattern.forEach((row, r) => { if (row[b]) playTone([70,170,480,250][r], r === 0 ? .14 : .05, r === 3 ? "sawtooth" : "sine"); });
    }, 150);
    return () => { if (timer.current) clearInterval(timer.current); };
  }, [playing, pattern]);

  const togglePad = (r: number, c: number) => {
    setPattern(p => p.map((row, ri) => row.map((v, ci) => ri === r && ci === c ? !v : v)));
    playTone([70,170,480,250][r], .07);
  };

  const startLesson = () => { setView("lesson"); setStep(0); setPlaying(false); window.scrollTo(0,0); };
  const finish = () => { completeLesson("transport", "Drums"); setStep(2); };

  return (
    <div className="app-shell">
      <header className="topbar">
        <button className="mobile-menu" onClick={() => setMobile(true)}><Menu size={20}/></button>
        <button className="brand" onClick={() => setView("home")}><span className="brand-mark"><AudioLines size={18}/></span><span>LOGIC PRO <b>ACADEMY</b></span></button>
        <div className="top-actions">
          <span className="streak"><Flame size={16}/> 3 day streak</span>
          <span className="xp"><Sparkles size={15}/> {xp} XP</span>
          <button className="avatar">G</button>
        </div>
      </header>

      <aside className={`sidebar ${mobile ? "open" : ""}`}>
        <button className="close-mobile" onClick={() => setMobile(false)}><X/></button>
        <nav>
          <Nav icon={Home} label="Learn" active={view === "home"} onClick={() => {setView("home");setMobile(false)}}/>
          <Nav icon={WandSparkles} label="Production lab" active={view === "lab"} onClick={() => {setView("lab");setMobile(false)}}/>
          <Nav icon={Headphones} label="Listening lab"/>
          <Nav icon={SlidersHorizontal} label="Mixing lab"/>
          <Nav icon={Library} label="Toolbox"/>
        </nav>
        <div className="side-project">
          <div className="side-label">YOUR TRACK <span>{Math.max(14, overall)}%</span></div>
          <div className="mini-wave"><i/><i/><i/><i/><i/><i/><i/><i/><i/><i/><i/><i/></div>
          <b>My First Life Track</b>
          <small>{projectParts.length || 1} of 7 parts built</small>
          <div className="progress"><span style={{width:`${Math.max(14, overall)}%`}}/></div>
        </div>
        <button className="settings"><Settings2 size={17}/> Settings</button>
      </aside>

      <main>
        <AnimatePresence mode="wait">
          {view === "home" && <HomeView key="home" overall={overall} completed={completedLessons} startLesson={startLesson} reset={reset}/>} 
          {view === "lesson" && <LessonView key="lesson" step={step} setStep={setStep} playing={playing} setPlaying={setPlaying} finish={finish} done={completedLessons.includes("transport")}/>} 
          {view === "lab" && <LabView key="lab" pattern={pattern} togglePad={togglePad} playing={playing} setPlaying={setPlaying} beat={beat}/>} 
        </AnimatePresence>
      </main>
    </div>
  );
}

function Nav({icon: Icon,label,active,onClick}:{icon:any,label:string,active?:boolean,onClick?:()=>void}) {
  return <button className={active ? "nav-item active" : "nav-item"} onClick={onClick}><Icon size={18}/>{label}{label === "Learn" && <span className="nav-dot"/>}</button>
}

function HomeView({overall,completed,startLesson,reset}:{overall:number,completed:string[],startLesson:()=>void,reset:()=>void}) {
  return <motion.div className="page" initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} exit={{opacity:0}}>
    <section className="welcome">
      <div><div className="eyebrow"><span/> YOUR LEARNING PATH</div><h1>Good evening, George.</h1><p>Every finished track starts with one small sound. Let’s make yours.</p></div>
      <div className="overall-ring" style={{"--p":`${Math.max(14,overall)*3.6}deg`} as any}><div><b>{Math.max(14,overall)}%</b><small>TRACK BUILT</small></div></div>
    </section>

    <section className="continue-card">
      <div className="lesson-art"><div className="logic-window"><span/><span/><span/><div className="logic-tracks"><i/><i/><i/></div><div className="play-symbol"><Play fill="currentColor"/></div></div></div>
      <div className="continue-copy">
        <div className="eyebrow blue"><Play size={12} fill="currentColor"/> CONTINUE LEARNING</div>
        <small>MODULE 1 · LESSON 4 OF 7</small>
        <h2>The transport: play, stop & navigate</h2>
        <p>Learn the controls that keep every session moving—and make Logic feel less like a cockpit.</p>
        <div className="lesson-meta"><span><Gauge size={15}/> 6 min</span><span><Zap size={15}/> Interactive</span><span><Trophy size={15}/> +40 XP</span></div>
        <button className="primary" onClick={startLesson}>{completed.includes("transport") ? "Practice again" : "Continue lesson"}<ArrowRight size={17}/></button>
      </div>
    </section>

    <div className="section-title"><div><h2>Your path to a finished track</h2><p>One project. Nine stages. Zero filler.</p></div><button className="text-button" onClick={reset}><RotateCcw size={14}/> Reset progress</button></div>
    <section className="roadmap">
      {modules.map((m,i) => {
        const open = i === 0; const Icon = m.icon; const progress = open ? (completed.includes("transport") ? 57 : 43) : 0;
        return <motion.button whileHover={open ? {y:-3} : {}} className={`module-card ${open ? "unlocked" : "locked"}`} key={m.n} onClick={open ? startLesson : undefined}>
          <div className="module-top"><span className="module-no">{m.n}</span><span className="module-icon" style={{color:m.color,background:`${m.color}18`}}><Icon size={19}/></span>{!open && <Lock size={14}/>}</div>
          <h3>{m.title}</h3><p>{m.desc}</p>
          <div className="module-bottom"><span>{open ? `${progress}% complete` : `${m.lessons} lessons`}</span>{open ? <div className="tiny-progress"><i style={{width:`${progress}%`}}/></div> : <ChevronRight size={15}/>}</div>
        </motion.button>
      })}
    </section>

    <section className="quote-card"><Sparkles/><div><p>“The best way to learn production is to finish music. Tiny, imperfect, honest pieces of music.”</p><span>YOUR PRODUCER NOTE · WEEK 1</span></div></section>
  </motion.div>
}

function LessonView({step,setStep,playing,setPlaying,finish,done}:{step:number,setStep:(n:number)=>void,playing:boolean,setPlaying:(v:boolean)=>void,finish:()=>void,done:boolean}) {
  return <motion.div className="lesson-page" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}>
    <div className="lesson-header"><div><span>MODULE 1 · LESSON 4</span><h1>The transport: play, stop & navigate</h1></div><div className="lesson-progress"><b>{step+1} / 3</b><div><i style={{width:`${((step+1)/3)*100}%`}}/></div></div></div>
    <div className="lesson-layout">
      <section className="lesson-copy">
        <div className="lesson-step-label">0{step+1} <span>{step === 0 ? "CONCEPT" : step === 1 ? "INTERACTIVE EXERCISE" : "REAL PRODUCER CONTEXT"}</span></div>
        <AnimatePresence mode="wait"><motion.div key={step} initial={{opacity:0,x:12}} animate={{opacity:1,x:0}} exit={{opacity:0,x:-12}}>
          <h2>{steps[step].title}</h2><p>{steps[step].text}</p>
          {step === 0 && <div className="tip"><CircleHelp/><p><b>Why this matters</b>Every recording, edit and arrangement decision depends on moving through time confidently.</p></div>}
          {step === 1 && <div className={`task ${playing ? "success" : ""}`}><span>{playing ? <Check/> : <Play/>}</span><div><b>{playing ? "Nice—you started the session." : "Your turn"}</b><p>{playing ? "That vertical line is the playhead. It shows the exact moment you’re hearing." : "Press Play in the transport below."}</p></div></div>}
          {step === 2 && <><div className="producer-note"><Mic2/><p>Producers replay tiny sections constantly while choosing sounds. Play and stop should become muscle memory, not a decision.</p></div><div className="sandbox-check"><b>Now do this in the real Logic Pro</b><label><input type="checkbox"/> Open an empty project</label><label><input type="checkbox"/> Press Spacebar to start playback</label><label><input type="checkbox"/> Press Spacebar again to stop</label></div></>}
        </motion.div></AnimatePresence>
        <div className="lesson-nav"><button disabled={step===0} onClick={() => setStep(step-1)}>Back</button>{step < 2 ? <button className="primary" disabled={step===1 && !playing} onClick={() => setStep(step+1)}>Continue <ArrowRight size={17}/></button> : <button className="primary" onClick={finish}>{done ? "Completed" : "Complete lesson"} <Check size={17}/></button>}</div>
      </section>
      <LogicSimulator playing={playing} setPlaying={setPlaying} highlight={step===1}/>
    </div>
  </motion.div>
}

function LogicSimulator({playing,setPlaying,highlight}:{playing:boolean,setPlaying:(v:boolean)=>void,highlight:boolean}) {
  return <section className="simulator">
    <div className="sim-titlebar"><div><i/><i/><i/></div><span>My First Life Track — Tracks</span><span>⌘ K</span></div>
    <div className="transport"><button><RotateCcw size={14}/></button><button className={highlight ? "play-highlight" : ""} onClick={() => setPlaying(!playing)}>{playing ? <Pause size={16} fill="currentColor"/> : <Play size={16} fill="currentColor"/>}</button><b>1&nbsp; 1&nbsp; 1&nbsp; 1</b><span>120.000</span><span>4/4</span></div>
    <div className="daw"><div className="track-heads"><div className="daw-tools">TRACKS</div>{["Drums","Soft Piano","Voice Note","Atmosphere"].map((t,i)=><div className="track-name" key={t}><i style={{background:["#7899ff","#b58dff","#ff8e9e","#61cabc"][i]}}/>{t}<small>M&nbsp; S</small></div>)}</div><div className="timeline"><div className="ruler"><span>1</span><span>2</span><span>3</span><span>4</span><span>5</span></div><motion.div className="playhead" animate={{left:playing ? ["3%","95%"] : "3%"}} transition={{duration:4,repeat:playing?Infinity:0,ease:"linear"}}/><div className="track-lane"><div className="region blue-region">BEAT 01</div></div><div className="track-lane"><div className="region purple-region">PIANO IDEA</div></div><div className="track-lane"><div className="region coral-region short">VOICE 01</div></div><div className="track-lane"><div className="region green-region long">ROOM TONE</div></div></div></div>
    <div className="sim-hint">{highlight ? "Click the highlighted Play button" : "A simplified Logic-inspired workspace — built for practice"}</div>
  </section>
}

function LabView({pattern,togglePad,playing,setPlaying,beat}:{pattern:boolean[][],togglePad:(r:number,c:number)=>void,playing:boolean,setPlaying:(v:boolean)=>void,beat:number}) {
  return <motion.div className="page lab-page" initial={{opacity:0,y:8}} animate={{opacity:1,y:0}}>
    <div className="eyebrow"><span/> PRODUCTION LAB</div><h1>Build a beat that breathes.</h1><p className="lede">Tap the grid, trust your ears, and discover how a few small shifts create momentum.</p>
    <section className="sequencer-card">
      <div className="seq-head"><div><span className="status-dot"/> BEAT SKETCH 01</div><div><span>120 BPM</span><button onClick={() => setPlaying(!playing)}>{playing ? <Pause fill="currentColor"/> : <Play fill="currentColor"/>}</button></div></div>
      <div className="sequencer">
        {drumRows.map((name,r)=><div className="seq-row" key={name}><b>{name}</b><div className="pads">{pattern[r].map((on,c)=><button aria-label={`${name} beat ${c+1}`} key={c} onClick={()=>togglePad(r,c)} className={`${on?"on":""} ${beat===c?"current":""} ${c%4===0?"bar":""}`}/>)}</div></div>)}
      </div>
      <div className="seq-footer"><span>1</span><span>2</span><span>3</span><span>4</span></div>
    </section>
    <div className="lab-grid"><div className="insight-card"><span><Volume2/></span><div><small>LISTEN FOR</small><h3>The space between hits</h3><p>Groove isn’t only where sounds land. The silence gives each hit its shape.</p></div></div><div className="challenge-card"><small>QUICK CHALLENGE</small><h3>Make the hi-hat feel less perfect</h3><p>Remove one hat and add another somewhere unexpected.</p><button>Mark as tried <Check/></button></div></div>
  </motion.div>
}
