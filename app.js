const lessons = [
  {title:"The big question",tag:"01 · START HERE",intro:"Theory of Computation asks a wonderfully simple question: what problems can a machine solve, and what resources does it need? We study tiny, precise machines so we can reason about all computers.",points:[["A language is a set of strings","For example, {0, 01, 11} is a language over the alphabet {0, 1}. A machine can decide whether a string belongs."],["A machine follows rules","Give it an input and a finite set of instructions. Its answer is accept or reject—or, for some machines, it may never stop."],["More power means more patterns","Different machine models recognize different families of languages. The course builds those models one at a time."],["Why learn this?","It gives you tools to reason about compilers, algorithms, security, and the hard limits of computation."]],example:"A language can be a rule, too: L = { binary strings ending in 01 }. The string 1101 is in L; 1110 is not.",quiz:{q:"What is a language in TOC?",options:["A set of strings","A programming language only","A computer processor"],answer:0,why:"Exactly—a language is any set of strings over an alphabet."}},
  {title:"Finite automata",tag:"02 · RECOGNIZERS",intro:"A finite automaton is a machine with a finite number of states. It reads one symbol at a time and changes state. When the input ends, its state determines whether it accepts.",points:[["State = a tiny memory","A state records just enough of the past to decide what to do next. It cannot count forever."],["Transitions read one symbol","For each state and input symbol, follow exactly one arrow in a deterministic finite automaton (DFA)."],["Accepting states mark success","After the final symbol, accept if the machine is in an accepting state; otherwise reject."],["Finite memory has limits","A DFA cannot recognize every pattern. For example, it cannot remember an arbitrarily large count of matching symbols."]],example:"The playground machine remembers whether the latest symbols could end in 01. Its three states are three possible summaries of what it has seen.",quiz:{q:"When does a DFA accept an input?",options:["Whenever it visits any state","If it ends in an accepting state","If it reads a 1"],answer:1,why:"Acceptance is decided by the state after the entire input has been read."}},
  {title:"Regular expressions",tag:"03 · PATTERN LANGUAGE",intro:"Regular expressions describe regular languages with compact patterns. They use union (choice), concatenation (sequence), and star (repeat zero or more times). DFAs and regular expressions describe exactly the same languages.",points:[["Choice: a | b","Means either a or b. For example, 0|1 describes one binary symbol."],["Sequence: ab","Means first a, then b. So (0|1)01 is any one-bit prefix followed by 01."],["Repeat: a*","Means zero or more repetitions. The expression (0|1)* describes every binary string."],["Same power as a DFA","A regular expression can be converted to an automaton and an automaton to a regular expression."]],example:"The language of binary strings ending in 01 can be written (0|1)*01. The star allows any prefix; the final 01 is required.",quiz:{q:"What does the star mean in a regular expression?",options:["Exactly one repetition","Zero or more repetitions","Any single symbol"],answer:1,why:"The Kleene star includes the empty string and any number of repetitions."}},
  {title:"Grammars & pushdown automata",tag:"04 · A STACK OF MEMORY",intro:"Some patterns need more memory than a finite set of states can provide. A pushdown automaton adds a stack: last in, first out memory. Context-free grammars describe the same family of languages.",points:[["A stack can grow","Push symbols as you read input, then pop them later. This supports unbounded but structured memory."],["Matching parentheses","Push for each opening parenthesis and pop for each closing one. A DFA cannot match arbitrary nesting depth."],["Grammars generate strings","Rules such as S → (S)S | ε describe how to build every balanced-parentheses string."],["Context-free languages","These are exactly the languages recognized by nondeterministic pushdown automata."]],example:"To check 3 opening parentheses followed by 3 closing ones, a stack can remember the three opens. A DFA has no unbounded counter for larger inputs.",quiz:{q:"What extra ability does a pushdown automaton have?",options:["A stack","Infinite control states","A faster processor"],answer:0,why:"The stack provides unbounded last-in, first-out memory."}},
  {title:"Turing machines",tag:"05 · GENERAL COMPUTATION",intro:"A Turing machine is a mathematical model of a general-purpose computer. It has a finite program, an unbounded tape for memory, and a head that reads, writes, and moves.",points:[["Tape acts as memory","Unlike a stack, the tape head can move back and forth and overwrite symbols."],["A precise model","A finite transition table specifies each step, making computation mathematically analyzable."],["Recognize vs decide","A recognizer accepts members but might loop on nonmembers. A decider halts on every input."],["Church–Turing thesis","The thesis says anything effectively computable can be computed by a Turing machine. It is a foundational thesis, not a proved theorem."]],example:"A real computer has finite hardware, but a Turing machine idealizes memory as unbounded so we can focus on what is computable in principle.",quiz:{q:"What distinguishes a decider from a recognizer?",options:["A decider always halts","A decider uses a stack","A decider only accepts"],answer:0,why:"A decider halts with an answer for every input."}},
  {title:"Decidability & complexity",tag:"06 · LIMITS & COST",intro:"Two natural questions remain: can any algorithm solve this problem, and if so, how much time or memory does it need? Decidability studies existence; complexity studies resource cost.",points:[["Undecidable problems exist","The halting problem has no algorithm that correctly decides for every program and input whether the program halts."],["Reduction transfers difficulty","To show a new problem is hard, transform a known hard problem into it while preserving the answer."],["Complexity measures resources","Time and space classes group problems by how resource use grows with input size."],["P vs NP is open","Whether every efficiently checkable problem can also be solved efficiently is one of computer science's central open questions."]],example:"A problem can be decidable but impractical: an algorithm may always finish, yet take more time than the age of the universe on large inputs.",quiz:{q:"What does decidability ask?",options:["How attractive is the user interface?","Whether an algorithm exists that always gives the correct answer","How fast is the computer?"],answer:1,why:"Decidability asks whether there is an algorithm that solves the problem for every input."}}
];

const list = document.querySelector("#course-list");
const panel = document.querySelector("#lesson-panel");
let current = 0;
let completed = new Set(JSON.parse(localStorage.getItem("toc-learning-completed") || "[]"));

function renderList(){
  list.innerHTML = "";
  lessons.forEach((lesson,index)=>{
    const button=document.createElement("button");
    button.className=`lesson-nav${index===current?" active":""}${completed.has(index)?" completed":""}`;
    button.type="button"; button.setAttribute("role","tab"); button.setAttribute("aria-selected",index===current?"true":"false");
    button.innerHTML=`<span class="lesson-number">${completed.has(index)?"✓":String(index+1).padStart(2,"0")}</span><span>${lesson.title}</span>`;
    button.addEventListener("click",()=>{current=index;render();}); list.append(button);
  });
  document.querySelector("#progress-label").textContent=`${completed.size} of ${lessons.length} complete`;
  document.querySelector("#progress-bar").style.width=`${completed.size/lessons.length*100}%`;
}
function render(){
  const l=lessons[current];
  panel.innerHTML=`<div class="lesson-kicker">${l.tag}</div><h3>${l.title}</h3><p class="lesson-intro">${l.intro}</p><div class="lesson-points">${l.points.map(([title,body])=>`<div class="lesson-point"><b>${title}</b><span>${body}</span></div>`).join("")}</div><div class="lesson-example"><strong>Make it concrete →</strong> ${l.example}</div><div class="quiz"><h4>Quick check · ${l.quiz.q}</h4><div class="quiz-options">${l.quiz.options.map((option,index)=>`<button class="quiz-option" data-option="${index}">${option}</button>`).join("")}</div><div class="quiz-feedback" aria-live="polite"></div></div><div class="lesson-actions"><button id="previous" ${current===0?"disabled":""}>← Previous</button><button class="complete-button${completed.has(current)?" done":""}" id="complete">${completed.has(current)?"✓ Completed":"Mark complete ✓"}</button><button id="next" ${current===lessons.length-1?"disabled":""}>Next →</button></div>`;
  panel.querySelectorAll(".quiz-option").forEach(btn=>btn.addEventListener("click",()=>{
    panel.querySelectorAll(".quiz-option").forEach(b=>b.classList.remove("correct","wrong"));
    const correct=Number(btn.dataset.option)===l.quiz.answer; btn.classList.add(correct?"correct":"wrong");
    panel.querySelector(".quiz-feedback").textContent=correct?l.quiz.why:"Not quite—take another look at the lesson and try again.";
  }));
  panel.querySelector("#previous").addEventListener("click",()=>{current--;render();});
  panel.querySelector("#next").addEventListener("click",()=>{current++;render();});
  panel.querySelector("#complete").addEventListener("click",()=>{if(completed.has(current))completed.delete(current);else completed.add(current);localStorage.setItem("toc-learning-completed",JSON.stringify([...completed]));render();});
  renderList();
}

const transitions={q0:{"0":"q1","1":"q0"},q1:{"0":"q1","1":"q2"},q2:{"0":"q1","1":"q0"}};
const names={q0:"q₀",q1:"q₁",q2:"q₂"};
function runDfa(){
  const input=document.querySelector("#binary-input"), result=document.querySelector("#run-result"), trace=document.querySelector("#trace"), value=input.value.trim();
  if(!/^[01]*$/.test(value)){
    input.setAttribute("aria-invalid","true");result.className="run-result reject";result.innerHTML='<span class="result-icon">!</span><span>Please use only 0 and 1. The empty string is allowed too.</span>';trace.textContent="";return;
  }
  input.removeAttribute("aria-invalid");
  let state="q0", path=[state];
  for(const symbol of value){state=transitions[state][symbol];path.push(state);}
  document.querySelectorAll(".sim-state").forEach(el=>el.classList.toggle("active",el.dataset.state===state));
  const accepted=state==="q2";
  result.className=`run-result ${accepted?"accept":"reject"}`;
  result.innerHTML=`<span class="result-icon">${accepted?"✓":"×"}</span><span><b>${accepted?"Accepted":"Rejected"}</b> — ${value?`“${value}”`:"ε (empty string)"} ${accepted?"ends in 01":"does not end in 01"}.</span>`;
  trace.textContent=`Path: ${path.map(s=>names[s]).join("  →  ")}   ·   Final state: ${names[state]}`;
}
document.querySelector("#run-button").addEventListener("click",runDfa);
document.querySelector("#binary-input").addEventListener("keydown",e=>{if(e.key==="Enter")runDfa();});
document.querySelector("#binary-input").addEventListener("input",e=>e.target.removeAttribute("aria-invalid"));
render();

