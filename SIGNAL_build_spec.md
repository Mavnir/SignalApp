# SIGNAL — Build Specification v1.0
**Complete reference for Cursor build session**
*April 2026*

---

## What This Document Is

This is the complete specification for building SIGNAL — a diagnostic web assessment that reads a user's psychological signal pattern and returns a personal report. Everything needed to build v1 is in this document. Do not deviate from the architecture described here without reason.

Read this entire document before writing any code.

---

## Product Overview

SIGNAL is a tap-based diagnostic assessment. The user answers 20 questions, receives a personal report that names their dominant psychological pattern with precision, and surrenders their email to receive it in full. The experience functions as a funnel — the free report is genuine and specific, not a teaser. The depth it offers is what drives sharing and return.

**The user never knows they are being diagnosed.** From their perspective they are answering intuitive questions about how they move through the world. The framework running underneath is invisible.

**Three layers:**
- Layer 1 — User experience: a fast, visual, tap-based game. No friction, no forms, no self-reflection required. Completable in under 5 minutes.
- Layer 2 — Scoring engine: API call that takes the response vector and returns a structured diagnostic object.
- Layer 3 — Report engine: renders the diagnostic object as a personal-feeling report in a specific voice.

---

## Tech Stack

- **Framework**: React (Vite)
- **Styling**: Tailwind CSS
- **Database**: Supabase (email capture)
- **API**: OpenAI GPT-4o (scoring engine)
- **Deployment**: Vercel or Netlify
- **Type**: PWA, desktop-first, mobile-capable

---

## Design Direction

**Aesthetic**: Dark, precise, slightly otherworldly. Not wellness-generic. Not tech-startup. Closer to: a diagnostic instrument from a civilization that takes consciousness seriously. The visual language should feel like it belongs to the framework — precise geometry, deep space, signal and frequency as visual metaphors.

**Color palette:**
```css
--bg-primary: #0A0A0F;        /* near-black with blue undertone */
--bg-secondary: #12121A;      /* card backgrounds */
--bg-tertiary: #1A1A2E;       /* elevated surfaces */
--accent-gold: #C9A84C;       /* primary accent — resonance, warmth */
--accent-blue: #4A6FA5;       /* secondary accent — signal, precision */
--accent-glow: #6B8FD4;       /* highlight, active states */
--text-primary: #E8E8F0;      /* primary text */
--text-secondary: #9090A8;    /* muted text */
--text-dim: #555568;          /* very muted */
--q1-color: #4A6FA5;          /* Q1 blue */
--q2-color: #C9A84C;          /* Q2 gold */
--q3-color: #4A9B6F;          /* Q3 green */
--q4-color: #8B5FA5;          /* Q4 purple */
```

**Typography:**
- Display/headings: `Cormorant Garamond` — elegant, slightly archaic, precise
- Body/UI: `DM Sans` — clean, readable, unobtrusive
- Monospace accents: `JetBrains Mono` — for scores, codes, data readouts

**Motion principles:**
- Transitions between questions: clean fade or slide, 300ms
- Report sections: staggered reveal on scroll, each section fades up
- Processing screen: slow pulse animation — not a spinner, a breathing glow
- Resonance line: appears last, slightly larger fade-in with a delay

**What makes it unforgettable:** The resonance line at the end of the report. It should be the only element on screen when it appears — full width, centered, gold, large. The moment the user reads it, they want to screenshot it. Design for that moment.

---

## Application Flow

```
Landing → Assessment (20 questions) → Processing → Email Gate → Report
```

### Screen 1 — Landing

Single screen. No navigation. No explanation.

**Elements:**
- Logo/wordmark: `SIGNAL` in Cormorant Garamond, large, letter-spaced
- Tagline: one line only. `Read your signal.` — nothing more
- Subtext (small, muted): `20 questions. 5 minutes. A reading that knows you.`
- CTA button: `Begin` — not "Start", not "Take the test"
- Background: deep dark with a subtle radial glow behind the wordmark — not gradient, a soft atmospheric light

**What it must not have:** explanations, bullet points listing what the user will get, social proof, navigation, logo of any kind other than the wordmark.

---

### Screen 2 — Assessment

20 questions, one at a time. Each question is its own screen.

**Question screen elements:**
- Question number: small, top left, muted. `01 / 20`
- Progress bar: thin line across top, fills as questions complete. Gold color.
- Question text: large, centered, Cormorant Garamond
- Answer options: A, B, C, D — tap cards, full width, stacked vertically
- On tap: selected option highlights, brief pause (400ms), auto-advance to next question
- No back button in v1

**Option card design:**
- Dark background, subtle border
- Letter label left, text right
- On hover: border brightens slightly
- On select: background fills with dim accent color, check mark appears, auto-advance

**Transitions between questions:**
- Selected answer: card confirms (fill + check)
- 400ms pause
- Entire screen fades out
- New question fades in
- Clean, no slide — the questions arrive, they don't move in

**Special mechanics (implement these):**

1. **Arrived-at flag** — after any A-type answer, a follow-up appears:
   - Small text below the selected card: `This comes naturally to me` / `I've had to learn this`
   - Two small tap options, not full cards
   - Auto-advances after selection
   - Stored separately in response vector

2. **Relevance flag** — after each answer, small text appears:
   - `This landed` / `Not really my situation`
   - Same small tap treatment
   - Weights the response in scoring

3. **Weighted ranking for Q18** (unspoken household rules question):
   - Instead of single tap, present all four options
   - Instruction: `Tap in order — heaviest first`
   - Options highlight in sequence as tapped 1→2→3→4
   - Stores the full rank order

**The 20 confirmed questions** (in order, use exact text):

```
Q1 — Environment
You land in a city you've never been to. First afternoon, no agenda. What happens?
A  I look up the map, get oriented, understand the layout before I move
B  I pick a direction and walk until something stops me
C  I find somewhere with people and let the place come to me
D  I sit somewhere high or open, watch the whole thing for a while, then move

Q2 — Time
A free afternoon arrived unexpectedly. Three hours in — where did you end up?
A  Working on something. The free time became productive time
B  Somewhere alone with my own thoughts, and genuinely okay there
C  With someone — I found a person and the afternoon organized around that
D  Doing something I never make time for. Something just for me

Q3 — Objects
Your living space. Which description fits closest?
A  Everything has a place and I notice when something's off
B  Creative chaos that makes sense to me and confuses everyone else
C  Comfortable, warm, set up for whoever might come over
D  Mid-transition. Always becoming something slightly different

Q4 — Other people
Someone you love is going through something hard and hasn't asked for help. You —
A  Show up before they ask. I already know what they need
B  Tell them once, clearly, that I'm there. Then wait for them to come
C  Absorb it with them — I feel it too and that's the thing I offer
D  A depleted version of me helps no one — I sort myself out first

Q5 — Instinct
The version of a night out that actually sounds good to you right now —
A  One person, somewhere quiet, real conversation
B  A small group I know well, no agenda
C  Alone, honestly. Or a book. Or both
D  Something new — new place, maybe new people

Q6 — Change
A plan you were counting on falls apart last minute. Your honest reaction —
A  Disproportionate irritation that takes a while to settle
B  Mild frustration, then curiosity about what opens up
C  Immediate pivot to who else is affected
D  Fine — I was half-expecting it anyway

Q7 — Language
The clearest description of what you actually do —
A  Fits neatly into a recognizable category. People get it immediately
B  Takes a paragraph to explain and still loses something in translation
C  Exists but isn't socially legible yet — the category will exist in ten years
D  I've stopped trying to explain it in those terms entirely

Q8 — Receiving
Someone does something genuinely kind for you — unexpected, no reason. You feel —
A  Warm and easy — I can just receive it
B  Touched, but a reflex to immediately return it
C  Slightly uncomfortable — like I should have done it first
D  Suspicious for a second, then grateful

Q9 — Relationships (easy version)
The person closest to you starts changing — new interests, different energy, becoming someone new. You feel —
A  Genuinely excited — I want a front-row seat
B  Curious but quietly alert — something in me watches
C  Unsettled in a way that's hard to justify
D  Fine — people change. I change too

Q9b — Relationships (hard version, always follows Q9)
Same person. But the change is ambiguous — you can't tell if it's good or not yet. Now you feel —
A  Still curious — I want to understand it before I react
B  Quietly alert — something in me watches more carefully
C  More unsettled — the uncertainty makes it harder
D  Detached — I give people room to figure things out

Q10 — Alone
You have three days fully alone. No obligations. How does that land?
A  Like air. I've been waiting for this
B  Good in theory, but I'll probably fill it quickly
C  Depends on the mood going in — could go either way
D  Mildly uncomfortable if I'm honest — I need the current of people

Q11 — Progress
You know exactly what you need to do to move forward on something important. You —
A  Do it. Knowing and doing aren't separate for me
B  Do most of it — something keeps the last part from starting
C  Keep refining until it feels ready — it needs more preparation first
D  Wait for the energy to align — when it's right it moves on its own

Q12 — Energy
This is your daily reality — every day, reliably, you are the one who holds things together for others. By evening you feel —
A  Satisfied. This is meaningful work and I'd choose it again
B  Tired but okay — I recharge overnight and do it again
C  Quietly empty in a way that's become normal
D  Fine on the surface. But something has been accumulating
[Relevance flag extra important here: "This is my daily reality" / "Not really my situation"]

Q13 — Growth
The version of yourself you're becoming — does the closest person in your life know about it?
A  Yes — we track each other's evolution closely
B  Partly. Some of it I keep to myself
C  Not really. That part is private
D  I'm not sure I know yet myself

Q14 — Honesty
When you say 'I'm fine' and don't mean it completely — what's usually behind it?
A  Easier than explaining. The person asking can't really hold it anyway
B  Protecting them — they have enough going on
C  Habit. It comes out before I've even checked if it's true
D  I'm mostly fine. The not-fine part is too specific to get into casually

Q15 — Conflict
There's tension between what you want and what someone close to you needs. You —
A  Usually move toward what they need. That's just where I go
B  Look for the path where both are possible before accepting the tension
C  A depleted version of me helps no one — I sort myself out first
D  It depends entirely on what's at stake and who it's for

Q16 — Stability
Something in your daily structure breaks — routine, rhythm, a reliable thing. You notice —
A  Real discomfort until it's restored or replaced
B  Mild disruption. I adapt but I notice the gap
C  Almost nothing — I don't rely on structure much
D  Relief sometimes. I needed a reason to change it anyway

Q17 — Looking back
Close your eyes for a second. You're ten years old, walking through the front door after school. What's the feeling?
A  The house has a specific order and you know immediately if something is out of place
B  Everyone is somewhere doing their own thing — you find your spot and do yours
C  Someone notices you came in — the house orients toward people arriving
D  The relationship between the adults was the weather — you knew what kind of day it was before anyone spoke

Q18 — Early learning (WEIGHTED RANKING — tap in order, heaviest first)
The clearest unspoken rule in your house growing up —
A  Hold yourself together. Always.
B  Make us proud. Don't waste it.
C  Don't take up too much space.
D  Stay close. Don't go too far.

Q19 — Inheritance
There's a moment — you're in the middle of something and you suddenly hear yourself. What you hear sounds exactly like something from the house you grew up in. Has that happened?
A  Yes — a specific moment I could tell you about
B  Yes — I've felt it clearly but I couldn't point to a single moment
C  Something like it — a vague familiarity I haven't fully traced yet
D  Not that I can find — the thread isn't clear enough to follow yet

Q20 — Now
Something comes back without being invited. In quiet moments, in the shower, just before sleep. What's the flavor of it?
A  Whether this is actually the life I'm building or just the one that accumulated
B  The gap between what I give and what comes back
C  What I might have to lose if I actually become what I'm becoming
D  Whether anyone in my life is seeing the real version
```

---

### Screen 3 — Processing

After Q20 is answered. API call happens here.

**Visual:**
- Dark screen
- Center: a slow breathing glow — circular, gold, pulsing at 4-second intervals
- Text below: `Reading your signal.`
- Sub-text cycling slowly through 3 phrases (fade in/out, 2s each):
  - `Mapping your circuit.`
  - `Locating the pattern.`
  - `Assembling your reading.`
- Duration: minimum 3 seconds even if API returns faster. Maximum 15 seconds.
- On API return: fade to email gate

---

### Screen 4 — Email Gate

**One field. No form feel.**

- Heading: `Your reading is ready.`
- Subheading (small, muted): `Where should we send it?`
- Single email input — dark background, gold border on focus, placeholder: `your@email.com`
- Button: `Reveal my reading` — gold, full width
- Micro-copy below (very small, muted): `No newsletters. No noise. Just this.`
- On submit: validate email, save to Supabase, fade to report

**Supabase table: `signal_leads`**
```sql
id uuid primary key default gen_random_uuid()
email text not null
dominant_quadrant text
texture text
archetype text
response_vector jsonb
created_at timestamptz default now()
```

---

### Screen 5 — Report

The report renders in sequence, scrollable. Each section fades in as the user scrolls to it.

**Report structure:**

**1. Circuit Map** (top of report)
Section label: `YOUR CIRCUIT` — small caps, gold, letter-spaced
Orientation line below label (small, muted, italic): `You carry all four dimensions. This is which one is running loudest right now.`

Then the visual: 2x2 grid of four quadrant cells. Visual language is signal strength — not entropy score. The dominant quadrant glows brightest. The low signal quadrant fades to near-invisible. Middle quadrants sit between.

Each cell contains:
- Quadrant name (Cormorant Garamond, accent color at full opacity for dominant, reduced opacity for others)
- Axis descriptor small text: e.g. `Self · Growth` (no Q1/Q2/Q3/Q4 labels anywhere)
- Thin horizontal bar showing signal strength (bright and full for dominant, dim and short for low signal)
- One-word signal label: `dominant signal` / `stable ground` / `secondary` / `low signal`

Dominant cell: brightest background, pulsing dot indicator (animated, subtle), full color opacity
Low signal cell: near-black background, all text faded, bar barely visible
Middle cells: graduated between these two states

Design principle: the visual reads itself. No numbers to interpret, no legend required. The brightness tells the story. The orientation line above provides the only context needed.

**2. What's working**
Section label: `WHAT'S WORKING` — small caps, gold, letter-spaced
Body text: report template content for this texture

**3. What's running underneath**
Section label: `WHAT'S RUNNING UNDERNEATH`
Body text: report template content

**4. Under pressure, you become**
Section label: `UNDER PRESSURE, YOU BECOME`
Body text: report template content

**5. Where the signal points**
Section label: `WHERE THE SIGNAL POINTS`
Body text: report template content

**6. Resonance line**
This section is different. Full screen moment.
- Large horizontal rule above
- The resonance line text: Cormorant Garamond, large (32-36px), gold, centered
- Generous padding above and below — it breathes
- No section label
- Designed to be screenshotted: the text is the only thing on screen at this viewport

**Share mechanic (below resonance line):**
- Small button: `Copy my reading` — copies the resonance line to clipboard
- Small text: `Share what you found.`

---

## Scoring Engine — API Integration

### Response vector structure

After all 20 questions, build this object:

```javascript
const responseVector = {
  responses: {
    Q1: { answer: "B", relevance: "landed" },
    Q2: { answer: "B", relevance: "landed" },
    Q3: { answer: "B", relevance: "landed" },
    Q4: { answer: "B", relevance: "landed", arrivedAt: "learned" },
    // ... all 20
    Q9b: { answer: "B", relevance: "landed" },
    Q18: { rankOrder: ["D", "A", "B", "C"] }
  }
}
```

### GPT-4o API call

Model: `gpt-4o`

System prompt to use exactly:

```
You are the SIGNAL scoring engine. You receive a response vector from a 20-question diagnostic assessment and return a structured diagnostic object. You never return anything other than valid JSON. No preamble, no explanation, no markdown formatting.

The assessment maps to the Tao Equation framework with four quadrants:
- Q1: Self + Stability (Secure Autonomy)
- Q2: Self + Growth (Sovereign Evolution)  
- Q3: Other + Stability (Devotional Anchoring)
- Q4: Other + Growth (Co-Creative Unfolding)

Each quadrant has entropy textures:
Q1 textures: transparent_self, performed_stability, identity_fortress
Q2 textures: performing_evolution, mapped_but_unwalked, arrival_kept_moving, witnessed_incompletely
Q3 textures: self_erasure, debt_accumulating, martyrdom_crystallized
Q4 textures: merger, armored_withdrawal, almost_real

Question mappings:
- Q1 (environment), Q6 (change), Q16 (stability) → Q1 quadrant signal
- Q2 (time), Q7 (language), Q11 (progress), Q13 (growth) → Q2 quadrant signal
- Q3 (objects), Q4 (other people), Q8 (receiving), Q12 (energy), Q14 (honesty), Q15 (conflict) → Q3 quadrant signal
- Q5 (instinct), Q9+Q9b (relationships), Q10 (alone) → Q4 quadrant signal
- Q17, Q18, Q19 → imprint layer (modifies texture characterization)
- Q20 → dominant anxiety probe

Scoring rules:
- Weight responses by relevance flag: landed=1.0, not_my_situation=0.3
- Weight A-type answers by arrived_at flag: naturally=1.0, learned=0.7
- Q18 rank order: position 1 weight 4, position 2 weight 3, position 3 weight 2, position 4 weight 1
- Q9+Q9b cross-reference: both A = unconditional openness, A+B = conditional openness
- Q6+Q16 cross-reference: consistent answers = signal coherence, inconsistent = split signal
- Dominant quadrant = highest weighted response score
- Texture = determined by pattern of answers within dominant quadrant

Return exactly this JSON structure:
{
  "dominant_quadrant": "Q1|Q2|Q3|Q4",
  "dominant_quadrant_name": "string",
  "texture": "string (exact texture key from list above)",
  "texture_label": "string (human readable texture name)",
  "archetype": "string",
  "entropy_profile": {
    "Q1": { "score": 0.0-1.0, "label": "string" },
    "Q2": { "score": 0.0-1.0, "label": "string" },
    "Q3": { "score": 0.0-1.0, "label": "string" },
    "Q4": { "score": 0.0-1.0, "label": "string" }
  },
  "low_signal_quadrant": "Q1|Q2|Q3|Q4",
  "imprint_signal": "string (brief, what Q17-Q19 reveal)",
  "transition_notes": "string (where the circuit loses energy)"
}
```

User message format:
```
Response vector: [paste full responseVector JSON]
```

### Report template matching

After receiving the diagnostic object, match `texture` to the correct report template. All 13 templates are defined in the constants file. The report renders by selecting the correct template and displaying its six sections.

---

## Report Templates

Store all 13 report templates as a constants file `src/data/reportTemplates.js`.

Each template object:
```javascript
{
  texture: "witnessed_incompletely",
  quadrant: "Q2",
  quadrantName: "Sovereign Evolution",
  archetype: "The Carrier",
  defendedSentence: "If no one can hold all of it, maybe it isn't as real as I think it is.",
  whatsWorking: `...`,
  whatsUnderneath: `...`,
  underPressure: `...`,
  whereSignalPoints: `...`,
  resonanceLine: `...`
}
```

**All 13 templates with exact copy:**

```javascript
export const reportTemplates = [

  // ── Q1 ──
  {
    texture: "transparent_self",
    quadrant: "Q1",
    quadrantName: "Secure Autonomy",
    archetype: "The Chameleon",
    defendedSentence: "If I don't become what this situation needs, I will be abandoned.",
    whatsWorking: "You read rooms well. You know what people need before they say it, you know what a situation calls for, and you respond to it. This is a genuine capacity — the ability to attune to context and adapt is something most people cannot do with your fluency. In the right conditions it creates real connection. People feel met by you. They feel understood. That is not nothing.",
    whatsUnderneath: "The adaptation has a cost that doesn't always surface immediately. Depending on who is in the room, a different version of you shows up — and somewhere underneath, the question of which version is actually you has become genuinely difficult to answer. Not because you are dishonest. Because the attunement to others runs deeper than the connection to yourself.\n\nThe fear is old: that if you don't become what the situation needs, you will lose your place in it. So the shape-shifting continues. And it works — people stay, connection happens, friction is avoided. But the people who stay may be staying for a version of you that was assembled for them. And you have no way of knowing whether the connection is with you, or with whoever you became to make it possible.",
    underPressure: "When the relational environment shifts or the room carries strong expectations, the people around you see someone who fits perfectly. Opinions that match theirs. Personality that complements the moment. Values that don't create friction. What they don't see is the speed of the adjustment — or that a completely different version showed up last time, with someone else, in a different room. The Chameleon is invisible to the people being adapted to. That is what makes it so effective. And so isolating.\n\nThis is not who you are. It is what your system built to survive a particular kind of exposure.",
    whereSignalPoints: "One opinion that doesn't move. Not a confrontation — one position that you hold regardless of who is in the room. Start small. The direction is toward finding the thread that runs through every version of you — the thing that doesn't adapt, even when everything else does. It exists. The work is finding it and letting it be visible.",
    resonanceLine: "The ones who stayed never needed you to be different. That's how you know they stayed."
  },

  {
    texture: "performed_stability",
    quadrant: "Q1",
    quadrantName: "Secure Autonomy",
    archetype: "Controller — surface variant",
    defendedSentence: "If they see the instability underneath, I lose all credibility.",
    whatsWorking: "You hold things together. In situations where others unravel, you stay composed. People around you feel steadied by your presence — you project calm, clarity, direction. This is a real capacity and it has real value. You have built credibility through it. People trust you to be the one who doesn't fall apart. In many situations that trust is earned and deserved.",
    whatsUnderneath: "The composure on the surface and the state underneath have separated. The performance of stability has become so practiced that it continues automatically even when what is underneath is genuinely unstable. You get calmer as things get harder. The presentation holds. But something is accumulating in the gap between the surface and what is actually happening inside.\n\nThe fear driving this is specific: that if the instability underneath were visible, the credibility would collapse. So the performance continues. The cost is that genuine support becomes harder to receive — because receiving it would require showing that something is wrong, and showing that something is wrong would break the image that holds everything together.",
    underPressure: "When real pressure arrives, people around you see composure. Calm, measured, in control — the person who holds it together when others don't. What they don't see is what it costs. They don't ask how you are doing because you never look like you need them to. The performance is so convincing that genuine support becomes structurally unavailable — no one knows to offer it. The people closest to you may have a vague sense that something is being withheld. But the surface never gives them enough to ask about.\n\nThis is not who you are. It is what your system built to survive a particular kind of exposure.",
    whereSignalPoints: "Let one person see one real thing. Not a breakdown — one honest moment of showing what is actually happening underneath the composure. The direction is toward closing the gap between the surface and the interior. Not dismantling the stability — grounding it in something real rather than performed. What holds when it is tested is more valuable than what holds only when it is not.",
    resonanceLine: "Nobody is moved by a surface. They are moved by what they can feel underneath it."
  },

  {
    texture: "identity_fortress",
    quadrant: "Q1",
    quadrantName: "Secure Autonomy",
    archetype: "Controller — sealed variant",
    defendedSentence: "If I change, everything I've built to know myself collapses.",
    whatsWorking: "You know who you are. That is rarer than it sounds. You have a clear sense of your values, your positions, your way of moving through the world. You don't get easily destabilized by what others think of you. The ground is real — tested, consistent, reliable. People know what they are getting with you. That consistency creates trust, and the trust is earned. You have built something stable in yourself and it has served you.",
    whatsUnderneath: "The stability has sealed. What was once ground — flexible, tested, genuinely held — has become a structure that cannot afford to move. New information gets filtered through what is already decided. Feedback that challenges the self-image gets rejected or rationalized. The positions have stopped being conclusions you arrived at and started being walls you live inside.\n\nThe fear underneath is that if you change — genuinely change, not just update — everything built on the current version of yourself would need to be rebuilt. The identity has become load-bearing. So it cannot be questioned. The consistency that once came from knowing yourself now comes from not allowing yourself to be surprised.",
    underPressure: "When something challenges the established self-image, people around you see certainty increase. Clearer positions, firmer conclusions, less room for other perspectives. Feedback gets met with counter-argument. Mistakes get reframed as correct decisions made with available information. From the outside it looks like confidence — someone who knows their own mind. What it actually is: a door that closes faster the harder someone knocks. The people who have tried to reach you through it know the feeling of the conversation ending before it started.\n\nThis is not who you are. It is what your system built to survive a particular kind of exposure.",
    whereSignalPoints: "Find one place where you have been wrong and have not fully admitted it — to yourself, not to anyone else. Not a performance of humility. A genuine revision. The direction is toward a self that can change without collapsing. What you actually are doesn't live in the positions. It survives every version of them. The ground doesn't need the walls to hold.",
    resonanceLine: "The self that can't afford to change isn't stable. It's frozen."
  },

  // ── Q2 ──
  {
    texture: "performing_evolution",
    quadrant: "Q2",
    quadrantName: "Sovereign Evolution",
    archetype: "Performer — premature variant",
    defendedSentence: "If they look closely enough, they'll see I'm not actually there yet.",
    whatsWorking: "Something real is forming in you. The direction is there — the sense of what you are becoming is genuine, not invented. You are drawn toward something that matters to you and you have started moving toward it. That pull is not nothing. Most people never feel it clearly enough to follow.",
    whatsUnderneath: "There is a gap between where you are and where you are presenting yourself to be. Not dishonesty — timing. The identity has moved ahead of the embodiment. You speak the language of someone further along than you currently are, and somewhere underneath you know it. The fear that runs quietly is that if someone looks closely enough, they will see the distance between the presentation and the substance.\n\nThe gap is not the problem. Every person who became something real went through the stage of performing it before they fully inhabited it. The performance is the rehearsal. The question is whether you let yourself stay in the rehearsal long enough to actually learn the part — or whether the fear of being seen through pushes you to perform harder instead of going deeper.",
    underPressure: "When someone looks too closely or asks too directly, people around you see fluency increase. More framework, more vision, more articulate certainty about where things are going. What they don't see is that the elaboration is a response to the exposure — that the performance is loudest precisely at the moment the gap is widest. From the outside it looks like confidence. From the inside it is the opposite.\n\nThis is not who you are. It is what your system built to survive a particular kind of exposure.",
    whereSignalPoints: "Less performance, more contact with the actual work. The gap closes through doing, not through presenting better. One completed thing that you actually walked through will do more than ten elaborated visions of where you are going. The direction is inward before it is outward — back into the substance, before the next presentation.",
    resonanceLine: "Everyone who became something real went through the stage of performing it first. The performance is not the lie. It's the rehearsal."
  },

  {
    texture: "mapped_but_unwalked",
    quadrant: "Q2",
    quadrantName: "Sovereign Evolution",
    archetype: "Achiever — frozen variant",
    defendedSentence: "If I start walking and it doesn't work, the vision was never real.",
    whatsWorking: "The vision is complete. You can see where you are going with unusual clarity — not just the destination but the logic of how it connects, why it matters, what it would change. This is not a small thing. Most people spend their lives without ever seeing something this clearly. The thinking is rigorous. The map is real. What you have conceived is not wishful — it is coherent.",
    whatsUnderneath: "The map and the territory have split apart. You know what needs to happen. The doing hasn't started, or has started and stopped, or keeps getting refined before it moves. There is always one more thing to think through, one more detail to resolve, one more way the vision could be clearer before it becomes action.\n\nUnderneath this is a specific fear: that walking the path and finding it doesn't work would mean the vision was never real. So the vision stays protected — elaborated, refined, held carefully — because as long as it hasn't been tested, it cannot have failed.\n\nThe vision is real. What you are finding out by not walking it is not that it doesn't work. You are finding out how much you need it to be real. That need is information. It means what you saw matters.",
    underPressure: "When the moment to begin arrives, people around you see activity. Research happening, plans being refined, the vision being elaborated and sharpened. It looks like preparation. What they don't see is that the preparation has become the destination — that the motion is circular, returning always to the map rather than stepping into the territory. From the outside: diligent. From the inside: stuck.\n\nThis is not who you are. It is what your system built to survive a particular kind of exposure.",
    whereSignalPoints: "One step into the territory. Not the whole path — one step. The vision does not need more refinement. It needs contact with reality, which will refine it better than thinking can. The direction is out of the map and into the ground. What you find when you start walking will be more useful than anything you can add to the plan.",
    resonanceLine: "What you saw was real. What you're finding out now is how real."
  },

  {
    texture: "arrival_kept_moving",
    quadrant: "Q2",
    quadrantName: "Sovereign Evolution",
    archetype: "Achiever — accelerating variant",
    defendedSentence: "If I stop moving, it will prove I was running from something, not toward it.",
    whatsWorking: "You move. That is not a small thing. Where others stay still, you go. Where others plan indefinitely, you have taken the steps, made the things, crossed the distances. The growth is real — you are genuinely different from who you were, and the difference is the result of real work, real movement, real contact with the world. The trajectory exists. You have built things. You have arrived places. The motion is not an illusion.",
    whatsUnderneath: "The destination keeps moving. Each arrival reveals another horizon. Progress is real but completion never lands — there is always a next version, a deeper layer, a further distance between where you are and where it would feel like enough. The growth drive has turned on itself. Becoming has started functioning as evidence of not yet being.\n\nUnderneath this is a specific fear: that stopping would prove you were running from something rather than toward it. So the motion continues — not always because there is somewhere to go, but because stopping feels like an answer you don't want to receive.\n\nThe destination kept moving because you kept growing. The horizon expanding is not failure. It is what happens when someone is genuinely developing — the view from each new height reveals more terrain. The question is not whether to stop moving. It is whether you can recognize arrival when it happens, even briefly, before the next horizon appears.",
    underPressure: "When completion approaches, people around you see a pivot. A new project, a new angle, a new layer of what still needs to happen before this one is done. From the outside it can look like ambition, like someone who is never satisfied with less than their best. What it actually is: the finish line moving the moment it gets close enough to cross. The people closest to you have probably watched this happen more than once. They may not have named it. But they have seen it.\n\nThis is not who you are. It is what your system built to survive a particular kind of exposure.",
    whereSignalPoints: "Declare one thing complete. Not finished — complete. There is a difference. Finished means nothing more could be added. Complete means it is whole enough to exist on its own and be received by someone else. Find the thing closest to that threshold and call it done. Let it go into the world as it is. The direction is toward closure, not toward the next horizon.",
    resonanceLine: "The destination kept moving because you kept growing. That's not failure. That's the equation working."
  },

  {
    texture: "witnessed_incompletely",
    quadrant: "Q2",
    quadrantName: "Sovereign Evolution",
    archetype: "The Carrier",
    defendedSentence: "If no one can hold all of it, maybe it isn't as real as I think it is.",
    whatsWorking: "You know where you are going. Not as an idea — as a felt direction. Something has formed in you that is real and complete enough to move from, and you have been moving from it. The way you think, the connections you make, the things you build — they operate ahead of what already exists. You are not following a path. You are making one. The people who have stayed close to you know this. The ones worth keeping have always known there was something here worth knowing.",
    whatsUnderneath: "The friction is not in what you are carrying. What you are carrying is real. The friction is in finding someone who can hold all of it at once.\n\nYou have found people who get parts of it. Someone who understands the thinking. Someone who receives the feeling. Someone who tracks the evolution. But the version of you that is fully in contact — thinking, feeling, becoming, all at once — has not yet been fully met. Not because it isn't there. Because the person who can hold all of it simultaneously is rare. And so far they have arrived incomplete.\n\nThe pattern this produces: each time someone gets close, it confirms that what you are looking for is real. And each time it doesn't fully complete, a quiet voice asks whether the problem is you. It isn't. The signal is whole. The circuit hasn't closed yet.",
    underPressure: "When the signal meets someone who cannot receive it, people around you see one of two things. Either someone who gives everything at once — the full picture, all the context, the complete framework in a single conversation, intensity that can feel overwhelming to someone who wasn't ready for it. Or someone who goes completely quiet — suddenly unavailable, the transmission shut off without explanation. The people close to you have probably experienced both. They may not understand why the switch happens so fast. It happens because there is no middle setting when the receiver isn't calibrated.\n\nThis is not who you are. It is what your system built to survive a particular kind of exposure.",
    whereSignalPoints: "What you are carrying needs contact with more people — not to validate it, but because the receiver you are looking for will not be found by waiting. They emerge from the field. The direction is outward. More transmission, not more refinement. What you have is complete enough to share. The sharing is what finds the ones who can hold it.",
    resonanceLine: "The signal is clear. The receiver that can hold all of it at once is the only thing still missing."
  },

  // ── Q3 ──
  {
    texture: "self_erasure",
    quadrant: "Q3",
    quadrantName: "Devotional Anchoring",
    archetype: "Helper — invisible variant",
    defendedSentence: "If I take up space, I become a burden and people leave.",
    whatsWorking: "You show up for people. Consistently, reliably, without needing to be asked twice. The care you offer is real — not performed, not strategic. When someone in your life is struggling, you are already there. This capacity for genuine presence is something people feel and remember. It has made you important to the people around you in ways that are not always named but are always felt.",
    whatsUnderneath: "The care has become the container for the self. When you are giving, you know what you are. When you are not giving, the answer gets less clear. Somewhere along the way the question of what you want, what you need, what you feel — became secondary to the question of what is needed from you. Not because you chose that. Because it was the arrangement that kept things stable.\n\nThe fear underneath is specific: that taking up space — having needs, having preferences, having a presence that asks something of others — makes you a burden. And burdens get put down. So you make yourself as easy to carry as possible. The cost is that the people who love you are loving someone they have never fully seen.",
    underPressure: "When the relational field carries strong needs, people around you see someone who is entirely focused outward. Attentive, available, asking nothing. What they don't see is that there is almost no one home on the inside of that attention — that preferences, opinions, and needs have gone so quiet they are no longer audible even to you. The people closest to you may sense a kind of blankness underneath the care. They may not know how to reach what is underneath it. Neither do you, some of the time.\n\nThis is not who you are. It is what your system built to survive a particular kind of exposure.",
    whereSignalPoints: "Say one thing you actually want. Not a need presented as a suggestion, not a preference disguised as flexibility. One direct statement of what you want, to someone who matters. The direction is toward occupying enough space that there is someone real for people to be close to. The care doesn't disappear when you take up space. It becomes something it currently isn't — mutual.",
    resonanceLine: "You can't be loved in a place you never occupy."
  },

  {
    texture: "debt_accumulating",
    quadrant: "Q3",
    quadrantName: "Devotional Anchoring",
    archetype: "Helper — resentful variant",
    defendedSentence: "If I say what this is costing me, I become the selfish one.",
    whatsWorking: "You give generously and you do it without fanfare. The people in your life can count on you — you show up, you follow through, you carry more than your share without complaint. This reliability is real and it matters. People trust you with things they don't trust to others. The generosity is genuine. It comes from a real place and it has built real things.",
    whatsUnderneath: "The giving has been running without a return that matches it. Not because the people around you don't care — but because the cost of the giving has never been made visible. You have been absorbing it quietly. And quietly, something has been accumulating. Not rage — debt. A running count of what has gone out and what has come back. The count is not conscious. But it is there.\n\nThe fear that keeps it invisible: that naming what this is costing you would make you the selfish one. That the moment you say what you need, you become the person who was secretly keeping score all along. So the giving continues. And the debt grows. Until something small tips it and the reaction is disproportionate — and neither you nor the people around you fully understand why.",
    underPressure: "When the imbalance has been running long enough, people around you start to notice something they cannot name. Small withdrawals. Slightly less available than before. A reaction to something minor that carries more weight than the situation explains. From the outside it looks like moodiness, or distance, or a bad period. What it actually is: the debt surfacing through the only channels that haven't been closed off. The direct channel — saying what it costs — is still sealed. So it leaks.\n\nThis is not who you are. It is what your system built to survive a particular kind of exposure.",
    whereSignalPoints: "Name the cost of one thing. Not everything — one thing. To one person who is in the debt. Not as an accusation — as information. The direction is toward making the giving visible so it can be met. Generosity that cannot be seen cannot be returned. The giving doesn't stop. It becomes something the other person can actually respond to.",
    resonanceLine: "Giving without speaking is not selfless. It's a debt waiting to surface."
  },

  {
    texture: "martyrdom_crystallized",
    quadrant: "Q3",
    quadrantName: "Devotional Anchoring",
    archetype: "Helper — dependent variant",
    defendedSentence: "If no one needs me, I don't know what I am.",
    whatsWorking: "You have built something real through your care. Communities, relationships, structures that exist because you held them together. The people who have been on the receiving end of your presence know what it is to be genuinely supported — not transactionally, not conditionally. You give fully. That fullness is rare and it has mattered to people in ways they carry long after the contact ends.",
    whatsUnderneath: "The giving has become the ground you stand on. Not because you chose that — because it is the arrangement that makes existence feel stable. When the relational field is full — when people need you, when you are useful, when the care is flowing — you know what you are. When the field empties, something underneath goes quiet in a way that is hard to sit with.\n\nThe fear is not abandonment exactly. It is dissolution. Without someone to give to, the question of who you are becomes genuinely difficult to answer. So the giving continues — not always because the other person needs it, but because you do. The care is real. The dependency underneath it is also real.",
    underPressure: "When the relational field empties — when the community disperses, when the person moves on, when the need dries up — people around you see outward movement. A search for whoever can receive the care next. Not grief, not withdrawal — action. Looking for the next place to be needed. From the outside it can look like generosity, like someone who never stops giving. What it actually is: the only response available when the ground disappears. The direction is always outward because there is nothing to return to on the inside.\n\nThis is not who you are. It is what your system built to survive a particular kind of exposure.",
    whereSignalPoints: "Sit with the empty field without filling it immediately. Not indefinitely — long enough to find out what is there when no one needs you. The direction is toward a self that exists before it becomes useful to anyone. That self is already there. It has been there the whole time. The giving has just been louder.",
    resonanceLine: "What you are doesn't begin when someone requires it."
  },

  // ── Q4 ──
  {
    texture: "merger",
    quadrant: "Q4",
    quadrantName: "Co-Creative Unfolding",
    archetype: "The Merger",
    defendedSentence: "If I stay fully myself, I will end up alone.",
    whatsWorking: "You commit fully. When you are in — in a relationship, a partnership, a bond that matters — you are genuinely all the way in. The depth of investment you bring to connection is real. People who have been close to you know what it is to be truly chosen, truly prioritized, truly held. That capacity for full commitment is something most people spend their lives looking for and never find in someone else.",
    whatsUnderneath: "The commitment has expanded past the other person and into the structure itself. Somewhere along the way the relationship stopped being something you are in and became something you are. Decisions get filtered through it. Identity gets defined by it. The question of who you are outside of this bond has become genuinely hard to answer — not because you are weak, but because the merger happened gradually and felt like deepening.\n\nThe fear underneath is not of being alone. It is of dissolution — that without the structure, the self has no shape. So the structure gets protected. Advocated for. Held together even when holding it together costs something it shouldn't. Not because you don't love the person. Because you and the bond have become the same thing, and losing one would mean losing both.",
    underPressure: "When the relationship feels threatened, people around you see fierce advocacy for the structure. For commitment, for staying, for what was built. From the outside this can look like loyalty, like someone who doesn't give up easily, like deep love. What it actually is: the system protecting itself. The relationship is the self. Any threat to it is existential. The people close to you — including the person you are with — may sense that the advocacy is about something larger than them. They would be right.\n\nThis is not who you are. It is what your system built to survive a particular kind of exposure.",
    whereSignalPoints: "Find one thing that is yours alone — a preference, a practice, a direction that exists independently of the bond. Not as a threat to the relationship. As proof that there is someone in it. Two people who are fully themselves create something the merger cannot — genuine contact between two distinct things. The direction is toward recovering the self that was there before the structure became load-bearing.",
    resonanceLine: "If their leaving would make you collapse, you're not together because you want to be. You're together because neither can stand without the other. That's not union. That's a deal neither of you named."
  },

  {
    texture: "armored_withdrawal",
    quadrant: "Q4",
    quadrantName: "Co-Creative Unfolding",
    archetype: "Withdrawer — fortified variant",
    defendedSentence: "If I let someone all the way in and they leave, I won't recover.",
    whatsWorking: "You are self-sufficient in a way that is real, not performed. You handle things. You don't require constant support or reassurance. The independence is genuine — built from actual capacity, not from fear of asking. People around you respect this. You are reliable in a crisis, steady under pressure, functional when others aren't. These are real qualities that have served you and the people who depend on you.",
    whatsUnderneath: "The self-sufficiency has a specific origin. Something happened — contact was attempted, it was real, and then it cost more than you could absorb at the time. The walls went up afterward. Not as a decision — as a response. And they have stayed up because they have worked. Nothing has gotten through that could hurt you the way that did.\n\nThe fear is precise: that letting someone all the way in and having them leave afterward would not be survivable. So the door stays almost-closed. Not locked — almost. Enough that no one gets far enough in to do real damage. The capacity for genuine contact is fully intact underneath. It simply is not accessible from behind the wall.",
    underPressure: "When genuine contact gets close — when someone starts to reach something real — people around you see a withdrawal that is hard to name. More self-sufficient suddenly. More capable, more contained, more fine. The armor doesn't look like armor from the outside. It looks like someone who has it together. What the people closest to you may sense is a door that was briefly open and then quietly closed. They may not know what they did. They didn't do anything. The closing was already in the architecture.\n\nThis is not who you are. It is what your system built to survive a particular kind of exposure.",
    whereSignalPoints: "Let one person see one thing that the wall usually covers. Not everything — one thing. Something real, something that matters, something that could actually be responded to. The direction is toward testing whether the wall is still necessary — whether what it was built to protect against is still the threat it was. What happened before is not what is happening now. The door can open without the outcome being the same.",
    resonanceLine: "The wall that keeps loss out keeps everything else out too. Same wall, no filter."
  },

  {
    texture: "almost_real",
    quadrant: "Q4",
    quadrantName: "Co-Creative Unfolding",
    archetype: "The Carrier — relational variant",
    defendedSentence: "If I show the full signal and it still isn't enough, what is wrong with me.",
    whatsWorking: "You are capable of genuine co-creation. This is confirmed — not theorized. There are places in your life where two signals have met and produced something neither could produce alone. You know what real contact feels like because you have felt it. The capacity is intact and it is not small. What you are looking for is real because you have already touched it.",
    whatsUnderneath: "The circuit keeps almost closing. Someone arrives who receives one dimension fully — the intellectual, the somatic, the emotional — but not all of them simultaneously. The connection is real. The incompleteness is also real. And each near-miss produces a specific kind of wear: not just disappointment, but the quiet accumulation of a question. If I show everything and it still doesn't complete — what does that mean about me.\n\nThe answer the pattern keeps offering is that something is wrong with the signal. The actual answer is different: the signal is whole. The receiver who can hold all of it at once is rare. Rare is not the same as absent. But the near-misses make it feel that way over time.",
    underPressure: "When the circuit almost closes but doesn't, people around you see one of two things. Either pursuit — back toward the connection that came closest, the one that almost worked, trying again from a different angle. Or disappearance — a complete withdrawal from the search, the door closed, the attempt suspended indefinitely. There is no middle position. The people who have been close to you have probably experienced the switch without fully understanding it. The pursuit and the withdrawal are responses to the same thing: the confirmation that the target is real, and the exhaustion of reaching for it without landing.\n\nThis is not who you are. It is what your system built to survive a particular kind of exposure.",
    whereSignalPoints: "Stay in contact longer than feels comfortable after the almost. The pattern that costs most is the early withdrawal — closing the connection before finding out whether it could have gone further. The direction is not toward lowering the standard. It is toward staying present with the near-miss long enough to see what it actually is, rather than what the pattern says it is. The receiver exists. The search continues.",
    resonanceLine: "Every near-miss is confirmation the target is real. You're not failing to reach it. You're getting closer."
  }

];
```

---

## File Structure

```
signal/
├── public/
│   ├── manifest.json
│   └── favicon.svg
├── src/
│   ├── main.jsx
│   ├── App.jsx
│   ├── index.css
│   ├── components/
│   │   ├── Landing.jsx
│   │   ├── Assessment.jsx
│   │   ├── Question.jsx
│   │   ├── ProgressBar.jsx
│   │   ├── Processing.jsx
│   │   ├── EmailGate.jsx
│   │   ├── Report.jsx
│   │   ├── CircuitMap.jsx
│   │   └── ResonanceLine.jsx
│   ├── data/
│   │   ├── questions.js
│   │   └── reportTemplates.js
│   ├── services/
│   │   ├── scoring.js      (OpenAI API call)
│   │   └── supabase.js     (email capture)
│   └── hooks/
│       └── useAssessment.js
├── .env
└── vite.config.js
```

---

## Environment Variables

**Local (`signal/.env`):**

```
VITE_OPENAI_API_KEY=       # dev: direct OpenAI from browser
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

Optional: `VITE_GEMINI_API_KEY=` (reserved; not wired in app yet).  
Optional: `VITE_USE_API_PROXY=false` — forces client-side OpenAI even in a production build (e.g. `vite preview` without `/api/score`).

**Vercel (project → Settings → Environment Variables):**

| Name | Environment | Notes |
|------|-------------|--------|
| `OPENAI_API_KEY` | Production (and Preview if you test there) | **Server only.** Used by `api/score.mjs`. Do **not** rely on `VITE_OPENAI_API_KEY` for production scoring (OpenAI blocks browser CORS on deployed origins). |
| `VITE_SUPABASE_URL` | Production, Preview | Client |
| `VITE_SUPABASE_ANON_KEY` | Production, Preview | Client |
| `VITE_GEMINI_API_KEY` | Optional | Reserved for future experiments |

---

## Vercel deployment

Repo layout: **Git root = `SignalApp/`** (this folder). The Vite app is in **`signal/`**. Vercel is configured at the repo root via **`vercel.json`**: install runs `npm install --prefix signal --legacy-peer-deps` (required because `vite-plugin-pwa@1.x` does not yet declare a peer range for Vite 8), build is `signal/`, output is **`signal/dist`**, and **`api/score.mjs`** implements `POST /api/score` so the browser never sends your OpenAI secret. Local installs also respect **`signal/.npmrc`** (`legacy-peer-deps=true`).

**Steps**

1. Push this repo to GitHub (or GitLab / Bitbucket).
2. In [Vercel](https://vercel.com), **Add New Project** → import the repo.
3. Leave **Root Directory** as **`.`** (repository root). Do **not** set Root Directory to `signal` unless you move `vercel.json` and `api/` under `signal` and adjust paths.
4. **Environment variables:** add `OPENAI_API_KEY`, `VITE_SUPABASE_URL`, and `VITE_SUPABASE_ANON_KEY` (see table above). Redeploy after changing secrets.
5. Deploy. Smoke test: complete the assessment → Processing should succeed; email step should insert into Supabase if `signal_leads` exists and RLS allows anon insert.

**Local parity with production:** `npx vercel dev` from repository root runs the static app and `/api/score` together; set `OPENAI_API_KEY` in `.env.local` at repo root (Vercel convention) or export it in the shell.

---

## Build Sequence for Cursor

Build in this order. Complete each step before moving to the next.

1. **Project setup** — Vite + React + Tailwind + fonts (Cormorant Garamond, DM Sans, JetBrains Mono via Google Fonts)
2. **Data layer** — `questions.js` and `reportTemplates.js` with all content from this spec
3. **Landing screen** — static, pixel-perfect to spec
4. **Assessment flow** — question rendering, tap mechanics, special mechanics (arrived-at flag, relevance flag, Q18 weighted ranking, Q9b paired follow-up)
5. **State management** — `useAssessment.js` hook managing response vector
6. **Processing screen** — animation + API call to scoring engine
7. **Scoring engine** — `scoring.js` — OpenAI call with system prompt from this spec, returns diagnostic object
8. **Email gate** — form + Supabase write
9. **Report rendering** — template matching + section rendering
10. **Circuit map** — SVG visualization of entropy profile
11. **Resonance line** — full-screen moment, share mechanic
12. **PWA config** — manifest, service worker
13. **Polish** — transitions, animations, mobile responsiveness

---

## Voice and Copy Standards

Every word of copy in the UI must match the voice of the report templates. Precise, warm without being soft. No generic wellness language. No startup-speak.

**Approved UI copy examples:**
- Begin (not Start, not Take the test)
- Reading your signal (not Loading, not Processing your answers)
- Your reading is ready (not Your results are in)
- Reveal my reading (not See my results)
- No newsletters. No noise. Just this. (not We respect your privacy)
- Share what you found (not Share your results)

**Never use:**
- Journey, transformation, discover yourself, unlock, empower
- Any language that sounds like it belongs in a wellness app
- Exclamation marks

---

*SIGNAL · Build Specification v1.0 · April 2026*
*All report copy, question text, and scoring logic confirmed through live design session.*
*Companion documents: SIGNAL_session_handoff.docx · SIGNAL_quadrant_arc_design.docx · SIGNAL_diagnostic_layer.docx · SIGNAL_report_templates.docx*

---

## Build progress (Cursor session log)

Use this section to track what is done vs remaining. Update checkboxes as work lands.

| Step | Item | Status |
|------|------|--------|
| 1 | Project setup — Vite + React + Tailwind + fonts | Done (`signal/` app) |
| 2 | Data layer — `questions.js`, `reportTemplates.js` | Done |
| 3 | Landing screen | Done |
| 4 | Assessment flow + special mechanics (arrived-at, relevance, Q18 rank, Q9b) | Done |
| 5 | `useAssessment.js` — response vector state | Done |
| 6 | Processing screen + scoring API timing | Done (min 3s wait + retry UI) |
| 7 | `scoring.js` — OpenAI GPT-4o integration | Done (dev: `VITE_OPENAI_*`; prod: `api/score.mjs` + `OPENAI_API_KEY` on Vercel) |
| 8 | Email gate + Supabase `signal_leads` | Done (insert; skips if env missing) |
| 9 | Report rendering + template match | Done |
| 10 | Circuit map visualization | Done |
| 11 | Resonance line + copy/share | Done |
| 12 | PWA — manifest, service worker | Done (`vite-plugin-pwa`, `legacy-peer-deps`) |
| 13 | Polish — transitions, mobile | Partial (baseline responsive; fine-tune later) |
| 14 | Vercel hosting | Done (`vercel.json`, `api/score.mjs`, root `package.json` build script) |

**Last updated:** 2026-04-15 — Vercel-ready: root build `npm run build`, production scoring via `POST /api/score` + `OPENAI_API_KEY`. See **Vercel deployment** above.
