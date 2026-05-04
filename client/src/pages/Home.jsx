import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const roles = [
  'Full Stack Developer',
  'React Specialist',
  'Node.js Engineer',
  'MERN Stack Dev',
  'UI/UX Builder'
];

const marqueeItems = [
  'React',
  'Node.js',
  'MongoDB',
  'Express',
  'JavaScript',
  'TypeScript',
  'Git',
  'REST APIs',
  'CSS',
  'MERN Stack',
  'Full Stack',
  'Web Dev'
];

function useTyping(words){
  const [display,setDisplay]=useState('');
  const [wi,setWi]=useState(0);
  const [del,setDel]=useState(false);

  useEffect(()=>{
    const cur=words[wi%words.length];
    let t;

    if(!del && display===cur){
      t=setTimeout(()=>setDel(true),1800);
    }else if(del && display===''){
      setDel(false);
      setWi(i=>i+1);
    }else{
      t=setTimeout(()=>{
        setDisplay(
          del
            ? cur.slice(0,display.length-1)
            : cur.slice(0,display.length+1)
        );
      },del?40:75);
    }

    return ()=>clearTimeout(t);
  },[display,del,wi,words]);

  return display;
}

export default function Home(){

  const typed = useTyping(roles);
  const items = [...marqueeItems,...marqueeItems];

  return(
    <main className="home">

      {/* HERO */}
      <section className="hero">
        <div className="hero-left">
          <div className="hero-eyebrow">
            <span className="hero-eyebrow-dot"/>
            <span className="hero-eyebrow-text">
              Open to Internships · Hyderabad, IN
            </span>
          </div>

          <h1 className="hero-title">
            <span className="hero-title-plain">I Design.</span>
            <span className="hero-title-stroke">I Build.</span>
            <span className="hero-title-grad">I Ship.</span>
          </h1>

          <div className="hero-typed-line">
            Currently a&nbsp;
            <span className="hero-typed">{typed}</span>
            <span className="cursor">|</span>
          </div>

          <p className="hero-sub">
            Crafting pixel-perfect interfaces and bulletproof backends.
            From zero to deployed — fast, clean, and production-ready.
          </p>

          <div className="hero-cta">
            <Link to="/projects" className="btn btn-primary btn-lg">
              See My Work ↗
            </Link>

            <Link to="/contact" className="btn btn-ghost btn-lg">
              Say Hello
            </Link>
          </div>
        </div>
      </section>


      {/* SKILLS BAR SAME AS NAVBAR STYLE */}
      <section className="section skills-section">

        <div className="section-label">Skills</div>
        <h2>What I Work With</h2>

        <div className="skills-bar-wrap">

          <div className="skills-bar">

            <div className="skills-track">

              {items.map((item,i)=>(
                <div key={i} className="skill-nav-item">
                  <span className="skill-star">✦</span>
                  {item}
                </div>
              ))}

            </div>

          </div>

        </div>

      </section>


      {/* CTA */}
      <section className="cta-banner">
        <h2>Ready to build something great?</h2>
        <p>I'm one message away. Let's turn your idea into reality.</p>

        <Link to="/contact" className="btn btn-primary btn-lg">
          Let's Talk →
        </Link>
      </section>

    </main>
  );
}