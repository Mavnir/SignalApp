/** Ordered assessment steps: Q1–Q9, Q9b, Q10–Q20 (21 screens). */

const opt = (letter, text) => ({ letter, text })

export const assessmentSteps = [
  {
    id: 'Q1',
    theme: 'Environment',
    text: "You land in a city you've never been to. First afternoon, no agenda. What happens?",
    mode: 'choice',
    options: [
      opt('A', 'I look up the map, get oriented, understand the layout before I move'),
      opt('B', 'I pick a direction and walk until something stops me'),
      opt('C', 'I find somewhere with people and let the place come to me'),
      opt('D', 'I sit somewhere high or open, watch the whole thing for a while, then move'),
    ],
  },
  {
    id: 'Q2',
    theme: 'Time',
    text: 'A free afternoon arrived unexpectedly. Three hours in — where did you end up?',
    mode: 'choice',
    options: [
      opt('A', 'Working on something. The free time became productive time'),
      opt('B', 'Somewhere alone with my own thoughts, and genuinely okay there'),
      opt('C', 'With someone — I found a person and the afternoon organized around that'),
      opt('D', 'Doing something I never make time for. Something just for me'),
    ],
  },
  {
    id: 'Q3',
    theme: 'Objects',
    text: 'Your living space. Which description fits closest?',
    mode: 'choice',
    options: [
      opt('A', "Everything has a place and I notice when something's off"),
      opt('B', 'Creative chaos that makes sense to me and confuses everyone else'),
      opt('C', 'Comfortable, warm, set up for whoever might come over'),
      opt('D', 'Mid-transition. Always becoming something slightly different'),
    ],
  },
  {
    id: 'Q4',
    theme: 'Other people',
    text: "Someone you love is going through something hard and hasn't asked for help. You —",
    mode: 'choice',
    options: [
      opt('A', 'Show up before they ask. I already know what they need'),
      opt('B', "Tell them once, clearly, that I'm there. Then wait for them to come"),
      opt('C', "Absorb it with them — I feel it too and that's the thing I offer"),
      opt('D', 'A depleted version of me helps no one — I sort myself out first'),
    ],
  },
  {
    id: 'Q5',
    theme: 'Instinct',
    text: 'The version of a night out that actually sounds good to you right now —',
    mode: 'choice',
    options: [
      opt('A', 'One person, somewhere quiet, real conversation'),
      opt('B', 'A small group I know well, no agenda'),
      opt('C', 'Alone, honestly. Or a book. Or both'),
      opt('D', 'Something new — new place, maybe new people'),
    ],
  },
  {
    id: 'Q6',
    theme: 'Change',
    text: 'A plan you were counting on falls apart last minute. Your honest reaction —',
    mode: 'choice',
    options: [
      opt('A', 'Disproportionate irritation that takes a while to settle'),
      opt('B', 'Mild frustration, then curiosity about what opens up'),
      opt('C', 'Immediate pivot to who else is affected'),
      opt('D', 'Fine — I was half-expecting it anyway'),
    ],
  },
  {
    id: 'Q7',
    theme: 'Language',
    text: 'The clearest description of what you actually do —',
    mode: 'choice',
    options: [
      opt('A', 'Fits neatly into a recognizable category. People get it immediately'),
      opt('B', 'Takes a paragraph to explain and still loses something in translation'),
      opt(
        'C',
        "Exists but isn't socially legible yet — the category will exist in ten years",
      ),
      opt('D', "I've stopped trying to explain it in those terms entirely"),
    ],
  },
  {
    id: 'Q8',
    theme: 'Receiving',
    text: 'Someone does something genuinely kind for you — unexpected, no reason. You feel —',
    mode: 'choice',
    options: [
      opt('A', 'Warm and easy — I can just receive it'),
      opt('B', 'Touched, but a reflex to immediately return it'),
      opt('C', 'Slightly uncomfortable — like I should have done it first'),
      opt('D', 'Suspicious for a second, then grateful'),
    ],
  },
  {
    id: 'Q9',
    theme: 'Relationships',
    text: 'The person closest to you starts changing — new interests, different energy, becoming someone new. You feel —',
    mode: 'choice',
    options: [
      opt('A', 'Genuinely excited — I want a front-row seat'),
      opt('B', 'Curious but quietly alert — something in me watches'),
      opt('C', "Unsettled in a way that's hard to justify"),
      opt('D', 'Fine — people change. I change too'),
    ],
  },
  {
    id: 'Q9b',
    theme: 'Relationships',
    text: "Same person. But the change is ambiguous — you can't tell if it's good or not yet. Now you feel —",
    mode: 'choice',
    options: [
      opt('A', 'Still curious — I want to understand it before I react'),
      opt('B', 'Quietly alert — something in me watches more carefully'),
      opt('C', 'More unsettled — the uncertainty makes it harder'),
      opt('D', 'Detached — I give people room to figure things out'),
    ],
  },
  {
    id: 'Q10',
    theme: 'Alone',
    text: 'You have three days fully alone. No obligations. How does that land?',
    mode: 'choice',
    options: [
      opt('A', "Like air. I've been waiting for this"),
      opt('B', "Good in theory, but I'll probably fill it quickly"),
      opt('C', "Depends on the mood going in — could go either way"),
      opt('D', "Mildly uncomfortable if I'm honest — I need the current of people"),
    ],
  },
  {
    id: 'Q11',
    theme: 'Progress',
    text: 'You know exactly what you need to do to move forward on something important. You —',
    mode: 'choice',
    options: [
      opt('A', "Do it. Knowing and doing aren't separate for me"),
      opt('B', 'Do most of it — something keeps the last part from starting'),
      opt('C', 'Keep refining until it feels ready — it needs more preparation first'),
      opt('D', "Wait for the energy to align — when it's right it moves on its own"),
    ],
  },
  {
    id: 'Q12',
    theme: 'Energy',
    text: 'This is your daily reality — every day, reliably, you are the one who holds things together for others. By evening you feel —',
    mode: 'choice',
    relevanceLabels: {
      landed: 'This is my daily reality',
      not_my_situation: 'Not really my situation',
    },
    options: [
      opt('A', "Satisfied. This is meaningful work and I'd choose it again"),
      opt('B', 'Tired but okay — I recharge overnight and do it again'),
      opt('C', "Quietly empty in a way that's become normal"),
      opt('D', 'Fine on the surface. But something has been accumulating'),
    ],
  },
  {
    id: 'Q13',
    theme: 'Growth',
    text: "The version of yourself you're becoming — does the closest person in your life know about it?",
    mode: 'choice',
    options: [
      opt('A', "Yes — we track each other's evolution closely"),
      opt('B', 'Partly. Some of it I keep to myself'),
      opt('C', 'Not really. That part is private'),
      opt("D", "I'm not sure I know yet myself"),
    ],
  },
  {
    id: 'Q14',
    theme: 'Honesty',
    text: "When you say 'I'm fine' and don't mean it completely — what's usually behind it?",
    mode: 'choice',
    options: [
      opt('A', "Easier than explaining. The person asking can't really hold it anyway"),
      opt('B', 'Protecting them — they have enough going on'),
      opt("C", "Habit. It comes out before I've even checked if it's true"),
      opt('D', "I'm mostly fine. The not-fine part is too specific to get into casually"),
    ],
  },
  {
    id: 'Q15',
    theme: 'Conflict',
    text: "There's tension between what you want and what someone close to you needs. You —",
    mode: 'choice',
    options: [
      opt('A', "Usually move toward what they need. That's just where I go"),
      opt('B', 'Look for the path where both are possible before accepting the tension'),
      opt('C', 'A depleted version of me helps no one — I sort myself out first'),
      opt("D", "It depends entirely on what's at stake and who it's for"),
    ],
  },
  {
    id: 'Q16',
    theme: 'Stability',
    text: "Something in your daily structure breaks — routine, rhythm, a reliable thing. You notice —",
    mode: 'choice',
    options: [
      opt('A', "Real discomfort until it's restored or replaced"),
      opt('B', 'Mild disruption. I adapt but I notice the gap'),
      opt('C', "Almost nothing — I don't rely on structure much"),
      opt('D', 'Relief sometimes. I needed a reason to change it anyway'),
    ],
  },
  {
    id: 'Q17',
    theme: 'Looking back',
    text: "Close your eyes for a second. You're ten years old, walking through the front door after school. What's the feeling?",
    mode: 'choice',
    options: [
      opt(
        'A',
        'The house has a specific order and you know immediately if something is out of place',
      ),
      opt(
        'B',
        'Everyone is somewhere doing their own thing — you find your spot and do yours',
      ),
      opt('C', 'Someone notices you came in — the house orients toward people arriving'),
      opt(
        'D',
        'The relationship between the adults was the weather — you knew what kind of day it was before anyone spoke',
      ),
    ],
  },
  {
    id: 'Q18',
    theme: 'Early learning',
    text: 'The clearest unspoken rule in your house growing up —',
    mode: 'rank',
    rankPrompt: 'Tap in order — heaviest first',
    options: [
      opt('A', 'Hold yourself together. Always.'),
      opt('B', "Make us proud. Don't waste it."),
      opt("C", "Don't take up too much space."),
      opt("D", "Stay close. Don't go too far."),
    ],
  },
  {
    id: 'Q19',
    theme: 'Inheritance',
    text: "There's a moment — you're in the middle of something and you suddenly hear yourself. What you hear sounds exactly like something from the house you grew up in. Has that happened?",
    mode: 'choice',
    options: [
      opt('A', 'Yes — a specific moment I could tell you about'),
      opt("B", "Yes — I've felt it clearly but I couldn't point to a single moment"),
      opt('C', "Something like it — a vague familiarity I haven't fully traced yet"),
      opt("D", "Not that I can find — the thread isn't clear enough to follow yet"),
    ],
  },
  {
    id: 'Q20',
    theme: 'Now',
    text: "Something comes back without being invited. In quiet moments, in the shower, just before sleep. What's the flavor of it?",
    mode: 'choice',
    options: [
      opt(
        'A',
        "Whether this is actually the life I'm building or just the one that accumulated",
      ),
      opt('B', 'The gap between what I give and what comes back'),
      opt("C", "What I might have to lose if I actually become what I'm becoming"),
      opt('D', 'Whether anyone in my life is seeing the real version'),
    ],
  },
]

export const TOTAL_STEPS = assessmentSteps.length

/** Display label per spec: Q9 and Q9b both show 09 / 20; others map to 1–20. */
export function stepDisplayIndex(stepIndex) {
  const step = assessmentSteps[stepIndex]
  if (!step) return { current: 1, total: 20 }
  if (step.id === 'Q9' || step.id === 'Q9b') return { current: 9, total: 20 }
  const idNum = step.id.replace(/^Q/, '').replace('b', '')
  const n = Number(idNum)
  return { current: Number.isFinite(n) ? n : stepIndex + 1, total: 20 }
}
