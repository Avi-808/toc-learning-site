const questBank = [
  {prompt:"You need to recognize every binary string whose last two symbols are 01. Which model is enough?", options:["A finite automaton","A pushdown automaton","A Turing machine is required","A context-free grammar only"], answer:0, why:"Only the last two bits matter. A DFA can summarize that finite amount of history in its states."},
  {prompt:"A language contains strings with any number of opening parentheses followed by the same number of closing parentheses. What extra memory helps?", options:["A regular expression only","A stack in a pushdown automaton","A DFA with two states","A Moore output"], answer:1, why:"A stack can push each opening parenthesis and pop one for each closing parenthesis, no matter how deep the nesting is."},
  {prompt:"Which expression describes all binary strings that end in 01?", options:["(0|1)*01","0*1*","(01)*","0|1|01"], answer:0, why:"The prefix (0|1)* can be any binary string, followed by the required final 01."},
  {prompt:"A grammar has E → E + E | id. What is E representing in a parser?", options:["An input alphabet","A grammar variable for an expression","A PDA stack symbol only","A Turing machine state"], answer:1, why:"E is a nonterminal (variable). Production rules describe how expressions can be built from operators and identifiers."},
  {prompt:"A proposed solution to a problem can be checked in polynomial time. Which complexity class is this characteristic associated with?", options:["NP","Undecidable","Regular","Finite"], answer:0, why:"NP consists of decision problems whose yes answers have certificates verifiable in polynomial time."},
  {prompt:"Can one algorithm correctly decide for every program and input whether that program eventually halts?", options:["Yes, with a sufficiently large DFA","Yes, if it uses a stack","No; the general halting problem is undecidable","Only for binary programs"], answer:2, why:"The halting problem has no always-correct decider for all program-input pairs. A simulator can recognize halting cases, but cannot decide every case."},
  {prompt:"You want to check whether a string is in a finite list of allowed words. Which model can do it?", options:["A DFA","Only a Turing machine","No finite machine","A PDA with an unbounded stack"], answer:0, why:"A finite language is regular, so a DFA can recognize the listed strings using a finite state for each relevant prefix."},
  {prompt:"A machine may try several possible paths and accepts when at least one path accepts. What is this model?", options:["DFA","NFA","Moore machine","Decider"], answer:1, why:"An NFA is nondeterministic: acceptance requires at least one accepting path."},
  {prompt:"To prove a language is not regular using the pumping lemma, what must your argument handle?", options:["Only one convenient split","Every split allowed by the lemma","Only strings shorter than the pumping length","Only the empty string"], answer:1, why:"The lemma guarantees that some valid split exists for a regular language. A non-regularity proof must show every split satisfying the conditions fails when pumped."},
  {prompt:"Which model has a read/write tape and a head that can move in both directions?", options:["Finite automaton","Pushdown automaton","Turing machine","Regular expression"], answer:2, why:"A Turing machine uses a tape as general-purpose memory and can read, overwrite, and move its head."},
  {prompt:"A document contains arbitrarily nested opening and closing tags. What is a useful core model for checking the nesting?", options:["A stack-based PDA","A regular expression alone","A two-state DFA","A Mealy machine"], answer:0, why:"A stack stores opening tags so they can be checked in reverse order when closing tags arrive. Full XML/HTML validation has additional rules."},
  {prompt:"A Turing machine description is given as input, together with a string, and a second machine simulates it. What is the second machine called?", options:["Universal Turing machine","Minimal DFA","Greibach grammar","Finite-state transducer"], answer:0, why:"A universal Turing machine interprets an encoded machine description and simulates that machine on the supplied input."},
  {prompt:"When two DFA states cannot be distinguished by any possible future input suffix, what can minimization do?", options:["Merge the states","Turn them into grammar rules","Make the language undecidable","Add a stack"], answer:0, why:"Indistinguishable states represent the same future behavior, so they belong to one state in the minimal DFA."},
  {prompt:"A recognizer accepts every member of its language but may run forever on a nonmember. What property does it have?", options:["It is a decider","It recognizes (semi-decides) the language","It is necessarily finite","It always rejects nonmembers"], answer:1, why:"A recognizer must accept members; it is not required to halt on nonmembers. A decider halts on every input."},
  {prompt:"You want to describe a language with recursive nested structure, such as balanced parentheses. Which formalism is a natural fit?", options:["Context-free grammar","DFA transition table only","Kleene star only","Time complexity class"], answer:0, why:"A context-free grammar can use recursive productions to describe nested structure; its language can also be recognized by a PDA."}
];

const questStart = document.querySelector("#quest-start");
const questPlay = document.querySelector("#quest-play");
const questEnd = document.querySelector("#quest-end");
const questOptions = document.querySelector("#quest-options");
let questQuestions = [];
let questIndex = 0;
let questScore = 0;
let questStreak = 0;
let questLocked = false;

function updateBest() {
  let best = 0;
  try { best = Number(localStorage.getItem("toc-quest-best") || 0); } catch (_) { /* storage may be disabled */ }
  document.querySelector("#quest-best").textContent = String(best);
  return best;
}
function startQuest() {
  questQuestions = [...questBank].sort(() => Math.random() - 0.5).slice(0, 10);
  questIndex = 0; questScore = 0; questStreak = 0; questLocked = false;
  questStart.hidden = true; questEnd.hidden = true; questPlay.hidden = false;
  showQuestQuestion();
}
function showQuestQuestion() {
  const question = questQuestions[questIndex];
  questLocked = false;
  document.querySelector("#quest-progress").textContent = `QUESTION ${questIndex + 1} OF ${questQuestions.length}`;
  document.querySelector("#quest-progress-bar").style.width = `${questIndex / questQuestions.length * 100}%`;
  document.querySelector("#quest-score").textContent = String(questScore);
  document.querySelector("#quest-streak").textContent = String(questStreak);
  document.querySelector("#quest-prompt").textContent = question.prompt;
  document.querySelector("#quest-feedback").textContent = "Choose your answer to reveal the explanation.";
  document.querySelector("#quest-next").hidden = true;
  questOptions.innerHTML = question.options.map((option, index) => `<button class="quest-option" type="button" data-answer="${index}"><span>${String.fromCharCode(65 + index)}</span>${option}</button>`).join("");
}
function answerQuest(choice) {
  if (questLocked) return;
  questLocked = true;
  const question = questQuestions[questIndex];
  const correct = choice === question.answer;
  questOptions.querySelectorAll("button").forEach((button, index) => {
    button.disabled = true;
    if (index === question.answer) button.classList.add("correct");
    else if (index === choice) button.classList.add("incorrect");
  });
  if (correct) { questStreak += 1; questScore += 10 + (questStreak % 3 === 0 ? 5 : 0); }
  else questStreak = 0;
  document.querySelector("#quest-score").textContent = String(questScore);
  document.querySelector("#quest-streak").textContent = String(questStreak);
  const feedback = document.querySelector("#quest-feedback");
  feedback.className = `quest-feedback ${correct ? "is-correct" : "is-incorrect"}`;
  feedback.innerHTML = `<b>${correct ? "Nice!" : "Not quite."}</b> ${question.why}`;
  document.querySelector("#quest-next").hidden = false;
  document.querySelector("#quest-next").textContent = questIndex === questQuestions.length - 1 ? "See your result ✦" : "Next question →";
}
function finishQuest() {
  questPlay.hidden = true; questEnd.hidden = false;
  document.querySelector("#quest-progress-bar").style.width = "100%";
  const best = Math.max(updateBest(), questScore);
  try { localStorage.setItem("toc-quest-best", String(best)); } catch (_) { /* score still works for this round */ }
  updateBest();
  document.querySelector("#quest-summary").textContent = `You scored ${questScore} points. Your best on this device is ${best}. Every answer is a chance to strengthen the model in your head.`;
}

document.querySelector("#quest-begin").addEventListener("click", startQuest);
document.querySelector("#quest-again").addEventListener("click", startQuest);
document.querySelector("#quest-next").addEventListener("click", () => {
  if (questIndex === questQuestions.length - 1) finishQuest();
  else { questIndex += 1; showQuestQuestion(); }
});
questOptions.addEventListener("click", event => {
  const button = event.target.closest("button[data-answer]");
  if (button) answerQuest(Number(button.dataset.answer));
});
updateBest();

