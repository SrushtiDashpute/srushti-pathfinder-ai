const $=s=>document.querySelector(s);
function setResult(id,text){const el=document.getElementById(id);if(el){el.textContent=text;el.style.display="block"}}

// Optional real backend. Leave empty for GitHub Pages demo mode.
const API_BASE_URL="";

function localAI(message,context=""){
  const q=(message||"").toLowerCase();
  if(q.includes("software")||q.includes("developer")||q.includes("coding"))
    return "For a Software Developer path: start with C/Python/Java, learn data structures, Git, SQL and web development, build 2–3 projects, then apply for internships. Your next step: choose one language and build a small project this week.";
  if(q.includes("data")||q.includes("analyst"))
    return "For Data Analytics: learn Excel, SQL, Python, statistics and data visualization. Build projects using real datasets and create a portfolio. Your next step: complete one SQL + dashboard project.";
  if(q.includes("ui")||q.includes("ux")||q.includes("design"))
    return "For UI/UX: learn user research, wireframing, Figma, prototyping and design systems. Build case studies that explain your design decisions.";
  return `Hi! I’m PathFinder AI. Based on your question${context?" and student context":""}, start by identifying your target career, the skills it requires, and one small project you can build. Use Explore Careers, Skill Gap Analyzer and Career Roadmap to continue.`;
}

async function askAI(message,context="",target="aiResult"){
  setResult(target,"Thinking...");
  if(!API_BASE_URL){setTimeout(()=>setResult(target,localAI(message,context)),250);return;}
  try{
    const r=await fetch(`${API_BASE_URL}/api/ai`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({message,context})});
    const d=await r.json(); setResult(target,d.answer||d.error||"No answer.");
  }catch(e){setResult(target,localAI(message,context));}
}
function saveProfile(){
  const p={name:$("#name")?.value||"",year:$("#year")?.value||"",goal:$("#goal")?.value||"",skills:$("#skills")?.value||""};
  localStorage.setItem("pathfinderProfile",JSON.stringify(p)); alert("Profile saved!");
}
function loadProfile(){
  const p=JSON.parse(localStorage.getItem("pathfinderProfile")||"{}");
  ["name","year","goal","skills"].forEach(k=>{if($("#"+k)&&p[k])$("#"+k).value=p[k])});
}
function runQuiz(){
  let score={Technology:0,Medicine:0,Business:0,Design:0,Law:0};
  document.querySelectorAll("[data-career]:checked").forEach(x=>score[x.dataset.career]+=Number(x.value));
  const best=Object.entries(score).sort((a,b)=>b[1]-a[1]).slice(0,3);
  const text="Top career areas:\n"+best.map((x,i)=>`${i+1}. ${x[0]} — ${x[1]} points`).join("\n")+"\n\nNext step: open Explore Careers and Career Roadmap to compare requirements and build your plan.";
  setResult("quizResult",text); localStorage.setItem("quizResult",JSON.stringify(best));
}
function skillGap(){
  const target=$("#targetCareer").value, skills=($("#currentSkills").value||"").toLowerCase().split(",").map(x=>x.trim()).filter(Boolean);
  const required={"Software Developer":["programming","data structures","git","web development","databases"],"Data Analyst":["python","excel","sql","statistics","data visualization"],"UI/UX Designer":["figma","ui design","ux research","prototyping","design systems"],"Doctor":["biology","chemistry","physics","medical entrance preparation"],"Digital Marketer":["seo","content","analytics","social media","copywriting"]}[target]||["communication","problem solving","domain knowledge","digital skills"];
  const missing=required.filter(x=>!skills.some(s=>s.includes(x)||x.includes(s)));
  setResult("gapResult",`Target: ${target}\n\nSkills to develop:\n${missing.length?missing.map(x=>"• "+x).join("\n"):"Great — your listed skills cover the starter requirements."}\n\nTip: add projects and evidence for each skill.`);
}
function interview(){
  const role=$("#role").value; const level=$("#level").value;
  const qs=[`Tell me about yourself for a ${role} role.`,`Why do you want to work as a ${role}?`,`Describe one project related to ${role}.`,`What is one technical skill you are improving?`,`Tell me about a problem you solved.`,`Why should we select you as a ${level} candidate?`];
  setResult("interviewResult",qs.map((q,i)=>`${i+1}. ${q}`).join("\n\n"));
}
document.addEventListener("DOMContentLoaded",loadProfile);
