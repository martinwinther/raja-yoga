export interface YogaWeek {
  week: number; // 1..52
  theme: string;
  coreSutras: string;
  keyIdea: string;
  weeklyPractice: string;
}

export const DAYS_PER_WEEK = 7;
export const TOTAL_WEEKS = 52;
export const TOTAL_DAYS = DAYS_PER_WEEK * TOTAL_WEEKS;

export const YOGA_PROGRAM: YogaWeek[] = [
  {
    week: 1,
    theme: "What is Yoga?",
    coreSutras: "I.1–I.2",
    keyIdea: "Yoga as cessation of mental fluctuations.",
    weeklyPractice:
      "Contemplate yoga as stilling the mind; 1–3 times per day pause for 1 minute to notice and label what the mind is doing; brief evening note on the dominant mental pattern.",
  },
  {
    week: 2,
    theme: "Witnessing the Mind",
    coreSutras: "I.3–I.4",
    keyIdea: "You are the witness of thoughts, not the thoughts themselves.",
    weeklyPractice:
      "Daily 5–10 minute sit observing thoughts as events; use phrases like \"thinking, remembering, judging\"; journal one situation where you remembered or forgot to be the observer.",
  },
  {
    week: 3,
    theme: "Five Types of Thought",
    coreSutras: "I.5–I.11",
    keyIdea: "Thoughts come in clear, distorted, imagined, sleep, and memory forms, and can be painful or painless.",
    weeklyPractice:
      "Choose one recurring thought pattern and classify it (pramāṇa, viparyaya, vikalpa, nidrā, smṛti); keep a simple \"trigger / thought type\" log; review which type dominates by week's end.",
  },
  {
    week: 4,
    theme: "Practice & Dispassion",
    coreSutras: "I.12–I.16",
    keyIdea: "Steady practice and non-attachment are twin supports of yoga.",
    weeklyPractice:
      "Commit to one tiny daily practice (e.g., 5-minute sit); when impulses arise, pause for 10 breaths and watch them; note experiences of letting go vs getting pulled in.",
  },
  {
    week: 5,
    theme: "Higher Orientation",
    coreSutras: "I.23–I.29; II.1–II.2",
    keyIdea: "Orienting the mind toward a higher ideal or value.",
    weeklyPractice:
      "Define your highest value (truth, clarity, compassion, etc.); each morning state it aloud; at night record one action aligned with it and one that wasn't; use the value as tie-breaker in decisions.",
  },
  {
    week: 6,
    theme: "Yoga as Inner Clean-Up (Kriya Yoga)",
    coreSutras: "II.1–II.2",
    keyIdea: "Self-discipline, study, and surrender as tools to reduce mental noise.",
    weeklyPractice:
      "Pick one small austerity (e.g., no phone in bed, no caffeine after 14:00); watch and journal resistance and cravings; end each day noting one way you accepted reality instead of fighting it.",
  },
  {
    week: 7,
    theme: "The Kleshas – Roots of Suffering",
    coreSutras: "II.3–II.9",
    keyIdea: "Ignorance, ego-fixation, craving, aversion, and clinging as deep causes of suffering.",
    weeklyPractice:
      "Each day focus on one klesha and note where it shows up; each evening pick one moment of suffering and identify the main klesha; write a brief alternative response you might try next time.",
  },
  {
    week: 8,
    theme: "Ignorance & Mis-Identification",
    coreSutras: "II.5",
    keyIdea: "Mistaking the changing/painful for permanent/pleasant.",
    weeklyPractice:
      "Identify one behavior that feels good now but hurts later; before doing it, label it as \"pleasant-now/painful-later\"; after acting or abstaining, journal how accurate that label felt.",
  },
  {
    week: 9,
    theme: "Ego & Roles",
    coreSutras: "II.6",
    keyIdea: "Confusing the seer with roles and self-images.",
    weeklyPractice:
      "List 3–5 identities you cling to; choose one situation to consciously loosen a role and act more freely; in meditation repeat a phrase like \"Roles come and go; awareness remains\" and note the felt sense.",
  },
  {
    week: 10,
    theme: "Craving & Aversion",
    coreSutras: "II.7–II.8",
    keyIdea: "Chasing pleasant and avoiding unpleasant binds the mind.",
    weeklyPractice:
      "Make lists of what you strongly crave and avoid; do one small \"opposite action\" for each (do something small you usually avoid, skip something you usually crave once); record internal reactions.",
  },
  {
    week: 11,
    theme: "Fear & Clinging",
    coreSutras: "II.9",
    keyIdea: "Deep clinging to life and the familiar creates subtle fear.",
    weeklyPractice:
      "Introduce one safe micro-change in routine each day (route, seat, order); observe discomfort and journal it; in meditation, briefly visualize releasing a familiar pattern and resting in not-knowing.",
  },
  {
    week: 12,
    theme: "Obstacles on the Path",
    coreSutras: "I.30–I.32",
    keyIdea: "Illness, dullness, doubt, laziness, carelessness, etc. obstruct practice.",
    weeklyPractice:
      "Identify your top 2–3 obstacles; pick the main one and design a tiny counter-move (e.g., minimum 2-minute practice, reading one sutra); track daily whether you applied the counter-move.",
  },
  {
    week: 13,
    theme: "Antidotes to Disturbance",
    coreSutras: "I.33–I.39",
    keyIdea: "Friendliness, compassion, joy, equanimity, and support practices steady the mind.",
    weeklyPractice:
      "Choose one of the four attitudes (friendliness, compassion, joy, equanimity) as your theme; deliberately generate it toward someone daily; use brief breath awareness whenever agitation spikes.",
  },
  {
    week: 14,
    theme: "Ahimsa – Non-Harming (Understanding)",
    coreSutras: "II.30",
    keyIdea: "Non-violence in thought, word, and deed.",
    weeklyPractice:
      "Begin the day asking how non-harming could shape schedule, diet, speech, self-talk; keep a tally of subtle aggression (impatience, harsh self-talk, gossip); rewrite one episode each night in ahimsa form.",
  },
  {
    week: 15,
    theme: "Ahimsa – Non-Harming (Application)",
    coreSutras: "II.35",
    keyIdea: "Non-harming naturally generates peace around you.",
    weeklyPractice:
      "Choose a relationship you want to soften; set one concrete non-harming experiment (no sarcasm, one kind message, etc.); observe and journal changes in your inner state and the relationship dynamics.",
  },
  {
    week: 16,
    theme: "Satya – Truthfulness (Understanding)",
    coreSutras: "II.30",
    keyIdea: "Aligning speech, thought, and action with reality.",
    weeklyPractice:
      "Notice where you exaggerate, omit, or pretend; for one week avoid \"white lies\" about your state and avoid exaggerations; when you slip, note what you feared would happen if you told the fuller truth.",
  },
  {
    week: 17,
    theme: "Satya – Truthfulness (Application)",
    coreSutras: "II.36",
    keyIdea: "Truth aligned with non-harm has power.",
    weeklyPractice:
      "Choose one conversation where honesty is missing; script it on paper with both truth and kindness; either have the conversation or role-play it; debrief in writing how it felt and what you learned.",
  },
  {
    week: 18,
    theme: "Asteya – Non-Stealing (Understanding)",
    coreSutras: "II.30",
    keyIdea: "Not taking what is not freely given, including time, attention, and credit.",
    weeklyPractice:
      "List subtle stealing habits (interrupting, pirated content, emotional dumping); for one day act as if everyone's time and attention are precious; note shifts in your sense of respect and presence.",
  },
  {
    week: 19,
    theme: "Asteya – Non-Stealing (Application)",
    coreSutras: "II.37",
    keyIdea: "Letting go of stealing grows inner wealth.",
    weeklyPractice:
      "Pick one area (piracy, emotional labor, etc.) to stop \"taking\" from this week; replace it with giving or creating (buy, thank, contribute); journal effects on your sense of lack vs abundance.",
  },
  {
    week: 20,
    theme: "Brahmacharya – Wise Use of Energy (Understanding)",
    coreSutras: "II.30",
    keyIdea: "Conserving and directing life-force skillfully, not just about sex.",
    weeklyPractice:
      "Map your main energy leaks (screens, overwork, substances); create a \"prāṇa budget\" by halving one drain and reallocating that time to a nourishing practice; track changes in energy and clarity.",
  },
  {
    week: 21,
    theme: "Brahmacharya – Wise Use of Energy (Application)",
    coreSutras: "II.38",
    keyIdea: "Conserved energy supports clarity and steadiness.",
    weeklyPractice:
      "Choose a form of stimulation (porn, binge shows, energy drinks) and practice delayed gratification: when urge hits, breathe 10–20 counts, ask what you really want underneath, then decide; journal discoveries.",
  },
  {
    week: 22,
    theme: "Aparigraha – Non-Grasping (Understanding)",
    coreSutras: "II.30",
    keyIdea: "Not hoarding or clinging to possessions, control, or experiences.",
    weeklyPractice:
      "List what you cling to (objects, roles, routines); each day let go of one small thing (object, tab, note, unnecessary obligation) while mentally affirming \"I have enough\"; note anxiety or relief.",
  },
  {
    week: 23,
    theme: "Aparigraha – Non-Grasping (Application)",
    coreSutras: "II.39",
    keyIdea: "Non-grasping brings insight into what is truly needed.",
    weeklyPractice:
      "Declare a \"no new acquisitions week\" in one area (shopping, apps, projects); deepen what you already have instead; write at week's end about real needs vs socially conditioned wants.",
  },
  {
    week: 24,
    theme: "Śauca – Purity (Body & Environment)",
    coreSutras: "II.32",
    keyIdea: "Outer cleanliness and order support inner clarity.",
    weeklyPractice:
      "Choose one small space (desk, nightstand, phone home screen) to simplify; remove what doesn't support clarity; make one gentle dietary clean-up (add one whole food, remove one junk item); observe mental effects.",
  },
  {
    week: 25,
    theme: "Śauca – Purity (Mind)",
    coreSutras: "II.40–II.41",
    keyIdea: "Reducing mental pollution makes the mind more contemplative.",
    weeklyPractice:
      "Identify your top mental pollutants (certain news, subs, feeds); pause or strictly limit at least one; replace with reading or practice aligned with Yoga; track mood and attention changes through the week.",
  },
  {
    week: 26,
    theme: "Santoṣa – Contentment (Understanding)",
    coreSutras: "II.32",
    keyIdea: "Quiet happiness with what is, without passivity.",
    weeklyPractice:
      "Write down the conditions you think must be met before you can relax; each night list three \"enough\" moments from the day and one thing you're restless about; watch how these lists evolve.",
  },
  {
    week: 27,
    theme: "Santoṣa – Contentment (Application)",
    coreSutras: "II.42",
    keyIdea: "Contentment is a direct source of happiness.",
    weeklyPractice:
      "Whenever you catch an \"I'll be happy when…\" thought, pause and name something you can appreciate right now; tally how often you remember; journal one clear experience of contentment without outer change.",
  },
  {
    week: 28,
    theme: "Tapas – Disciplined Effort (Understanding)",
    coreSutras: "II.1; II.43",
    keyIdea: "Heat and effort that burn impurities and build strength.",
    weeklyPractice:
      "Choose one tiny physical tapas (cold shower finish, daily walk, brief exercises) and do it daily; journal resistance, excuses, and the feeling after doing it; notice emerging sense of inner strength.",
  },
  {
    week: 29,
    theme: "Tapas – Disciplined Effort (Application)",
    coreSutras: "II.43",
    keyIdea: "Sustainable effort transforms the body-mind instrument.",
    weeklyPractice:
      "Design a realistic daily routine (e.g., 10 min asana, 5 min breath, 5 min sit); test it every day and adjust until it's challenging but doable; record your final version as a \"practice contract.\"",
  },
  {
    week: 30,
    theme: "Svādhyāya – Study of Texts",
    coreSutras: "II.44",
    keyIdea: "Studying wisdom texts as a mirror for the mind.",
    weeklyPractice:
      "Pick a primary text (Yoga Sūtras, Gita, etc.); each day read a small portion and write three bullets: what it says, how it applies to your day, and one question it raises; review notes once this week.",
  },
  {
    week: 31,
    theme: "Svādhyāya – Self-Inquiry",
    coreSutras: "II.44",
    keyIdea: "Examining your own patterns and beliefs.",
    weeklyPractice:
      "Choose one recurring belief about yourself (e.g., \"I never finish things\"); do a daily 5-minute inquiry sit bringing up a situation where it arises and asking what else might be true; journal alternative views.",
  },
  {
    week: 32,
    theme: "Ishvara-Praṇidhāna – Surrender (Understanding)",
    coreSutras: "II.1; II.45",
    keyIdea: "Letting go of the illusion of total control.",
    weeklyPractice:
      "Define what \"larger than me\" means for you (life, reality, dharma, truth); each morning affirm doing your best while releasing what you can't control; each night list 2–3 events you consciously release.",
  },
  {
    week: 33,
    theme: "Ishvara-Praṇidhāna – Surrender (Application)",
    coreSutras: "II.45",
    keyIdea: "Surrender supports depth in meditation and life.",
    weeklyPractice:
      "Identify where your control habit is strongest; experiment with relaxing your grip by 10–20% in that area; when anxiety rises, place a hand on your heart and repeat \"I'm responsible for actions, not outcomes,\" then journal.",
  },
  {
    week: 34,
    theme: "Asana – Stable & Comfortable Posture",
    coreSutras: "II.46",
    keyIdea: "Postures should be steady and easeful.",
    weeklyPractice:
      "Create a simple 10–15 minute asana mini-sequence; practice daily with the intention of balance rather than performance; after each session sit 2 minutes simply feeling bodily sensations.",
  },
  {
    week: 35,
    theme: "Asana – Letting Effort Melt",
    coreSutras: "II.47–II.48",
    keyIdea: "Allowing effort to give way to ease while maintaining awareness.",
    weeklyPractice:
      "During asana, notice unnecessary tension; in final posture consciously soften with each exhale repeating \"Nothing to achieve right now\"; note moments when effort drops but awareness stays clear.",
  },
  {
    week: 36,
    theme: "Pranayama – Awareness of Breath",
    coreSutras: "II.49",
    keyIdea: "Breath as a bridge between body and mind.",
    weeklyPractice:
      "2–3 times per day, do 5 minutes of breath observation; then gently extend exhalation (e.g., inhale 4, exhale 6); track pre/post state on a 1–10 calmness scale.",
  },
  {
    week: 37,
    theme: "Pranayama – Refining the Breath",
    coreSutras: "II.50–II.51",
    keyIdea: "Regulating length and pattern of breath to quiet the mind.",
    weeklyPractice:
      "Choose one basic pranayama (box breathing, 4-7-8, etc.) and practice daily 5–10 minutes; log which technique and how you felt before and after; adjust to find what steadies you best.",
  },
  {
    week: 38,
    theme: "Pratyahara – Withdrawing the Senses",
    coreSutras: "II.54–II.55",
    keyIdea: "Turning attention inward from sensory objects.",
    weeklyPractice:
      "Pick one routine activity (eating, walking, showering) to do without external input; once this week do a 10-minute body-and-senses scan, gently turning attention from sights/sounds to inner sensations.",
  },
  {
    week: 39,
    theme: "Digital Pratyahara",
    coreSutras: "II.54 (modern application)",
    keyIdea: "Limiting digital inputs to protect attention.",
    weeklyPractice:
      "Map when you use phone/feeds; set 2–3 no-input windows (e.g., first 30 minutes after waking, all meals); if you slip, just note it; use freed time for breath, asana, or simple being.",
  },
  {
    week: 40,
    theme: "Building a Short Daily Sequence",
    coreSutras: "II.29",
    keyIdea: "Integrating posture, breath, and stillness into one routine.",
    weeklyPractice:
      "Design a 10–15 minute personal sequence (e.g., 5 min asana, 5 min breath, 5 min sitting); test it daily and refine; write the final version as a clear checklist you can follow automatically.",
  },
  {
    week: 41,
    theme: "Dharana – One-Pointed Focus (Introduction)",
    coreSutras: "III.1",
    keyIdea: "Fixing attention on a single point.",
    weeklyPractice:
      "Choose one meditation object (breath, mantra, visual point); sit daily 5–10 minutes and keep returning to it when distracted; optionally note how many times you catch mind-wandering.",
  },
  {
    week: 42,
    theme: "Dharana – Focus in Daily Tasks",
    coreSutras: "III.1",
    keyIdea: "Bringing one-pointedness into ordinary activities.",
    weeklyPractice:
      "Pick one daily activity (eating, brushing teeth, email) to do in \"single-task mode\" with no multitasking; if interrupted, gently resume focus; journal changes in quality and satisfaction.",
  },
  {
    week: 43,
    theme: "Dhyana – Continuous Flow of Attention",
    coreSutras: "III.2",
    keyIdea: "Meditation as unbroken flow toward the object.",
    weeklyPractice:
      "Extend your sit slightly; after some minutes of deliberate focusing, notice if any moments of effortless staying arise; record conditions (time, posture, prior practices) that seem to support them.",
  },
  {
    week: 44,
    theme: "Dhyana – Attitude in Meditation",
    coreSutras: "III.2",
    keyIdea: "Gentle, kind persistence beats harsh striving.",
    weeklyPractice:
      "Observe your inner voice during practice; whenever distraction is noticed, label it kindly (\"thinking\") and return without self-attack; write once about how this affects your willingness to practice.",
  },
  {
    week: 45,
    theme: "Samadhi – Glimpses of Absorption",
    coreSutras: "III.3; I.17–I.18",
    keyIdea: "Merging of observer, observed, and observing.",
    weeklyPractice:
      "Read a brief explanation of samadhi once; during sits, after stabilizing, experiment with resting as awareness itself for a few breaths; note any moments of spaciousness or ego-lightness without clinging to them.",
  },
  {
    week: 46,
    theme: "Bringing Stillness into Action",
    coreSutras: "I.13–I.16; II.28",
    keyIdea: "Carrying yogic awareness into challenging situations.",
    weeklyPractice:
      "Choose one recurring challenging situation as your \"lab\"; before it, pause for 3 breaths and recall a key principle (e.g., ahimsa, satya); after, debrief in writing what you remembered, forgot, and learned.",
  },
  {
    week: 47,
    theme: "Seeing Samskaras – Deep Patterns",
    coreSutras: "I.50–I.51; III.9–III.12",
    keyIdea: "Recognizing repeated mental-emotional grooves.",
    weeklyPractice:
      "Identify one life \"loop\" (procrastination, conflict style, self-sabotage); track it all week; when it starts, label it and insert a tiny interrupt (5 breaths, one micro-action); log episodes and triggers.",
  },
  {
    week: 48,
    theme: "Cultivating Opposite Tendencies",
    coreSutras: "II.33–II.34",
    keyIdea: "Countering disturbing states by invoking their opposites.",
    weeklyPractice:
      "Choose one dominant state (anger, fear, envy, self-pity) and define its opposite; all week, when it appears, deliberately think and act from the opposite; record at least one example per day.",
  },
  {
    week: 49,
    theme: "Living from the Seer's Perspective",
    coreSutras: "I.3; II.20–II.25",
    keyIdea: "Stabilizing in the sense of being the witness.",
    weeklyPractice:
      "Set 3–5 daily reminders; when they chime, ask \"Who is aware of this?\" and briefly rest as awareness of sensations/thoughts; journal how this shift changes your relationship to stress.",
  },
  {
    week: 50,
    theme: "Your Personal Sādhanā Plan",
    coreSutras: "II.28; II.29",
    keyIdea: "Designing a balanced personal practice going forward.",
    weeklyPractice:
      "Review notes so far; choose one practice each for ethics, body/breath, and mind; define them as specific daily/weekly actions; write a 3-month plan and place it somewhere visible.",
  },
  {
    week: 51,
    theme: "Dharma & Daily Life",
    coreSutras: "II.18; II.21–II.23",
    keyIdea: "Using your real life as the yoga laboratory.",
    weeklyPractice:
      "Map your typical week and mark 3 high-leverage moments; assign a primary principle (ahimsa, tapas, etc.) to each; experiment all week and draft a short \"Yogic Life Manifesto\" in 5–10 sentences.",
  },
  {
    week: 52,
    theme: "Review, Gratitude, and Next Step",
    coreSutras: "I.14; IV.30–IV.34",
    keyIdea: "Honest review and recommitment on a long path.",
    weeklyPractice:
      "Write 1–2 pages reflecting on changes in reactivity, clarity, and stability; write a gratitude letter to your past self for starting; choose one clear commitment for the coming year and state it somewhere you'll see daily.",
  },
];

export function getYogaWeek(weekNumber: number): YogaWeek | undefined {
  return YOGA_PROGRAM.find((w) => w.week === weekNumber);
}

/**
 * Given a 1-based global dayNumber (1..TOTAL_DAYS),
 * return the corresponding YogaWeek.
 */
export function getWeekForDay(dayNumber: number): YogaWeek | undefined {
  if (dayNumber < 1 || dayNumber > TOTAL_DAYS) return undefined;
  const zeroBased = dayNumber - 1;
  const index = Math.floor(zeroBased / DAYS_PER_WEEK);
  return YOGA_PROGRAM[index];
}

/**
 * Given a 1-based global dayNumber (1..TOTAL_DAYS),
 * return the 1-based day index within its week (1..7).
 */
export function getDayIndexInWeek(dayNumber: number): number | undefined {
  if (dayNumber < 1 || dayNumber > TOTAL_DAYS) return undefined;
  const zeroBased = dayNumber - 1;
  return (zeroBased % DAYS_PER_WEEK) + 1;
}

/**
 * Given a week number (1..TOTAL_WEEKS) and day index within week (1..7),
 * return the corresponding 1-based global day number (1..TOTAL_DAYS),
 * or null if inputs are invalid.
 */
export function getGlobalDayNumberFromWeekAndDay(
  weekNumber: number,
  dayIndex: number
): number | null {
  if (weekNumber < 1 || weekNumber > TOTAL_WEEKS) return null;
  if (dayIndex < 1 || dayIndex > DAYS_PER_WEEK) return null;

  return (weekNumber - 1) * DAYS_PER_WEEK + dayIndex;
}

// Import logger only in non-production (to avoid bundling in production)
if (process.env.NODE_ENV !== "production") {
  // Basic sanity checks for the static program.
  if (YOGA_PROGRAM.length !== TOTAL_WEEKS) {
    console.warn(
      `[YogaProgram] Expected ${TOTAL_WEEKS} weeks, found ${YOGA_PROGRAM.length}.`
    );
  }
  if (YOGA_PROGRAM.length > 0) {
    const weeks = YOGA_PROGRAM.map((w) => w.week);
    const uniqueWeeks = new Set(weeks);
    if (weeks.length !== uniqueWeeks.size) {
      console.warn(
        "[YogaProgram] Duplicate week numbers found in YOGA_PROGRAM."
      );
    }
  }
}

