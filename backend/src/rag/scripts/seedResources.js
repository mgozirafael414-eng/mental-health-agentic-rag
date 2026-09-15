require("dotenv").config();

const prisma = require("../../config/database");

// ========================================
// RESOURCE SEED DATA
// ========================================

const resources = [

  // ======================================
  // 1. MENTAL HEALTH BASICS
  // ======================================

  {
    title: "Understanding Mental Health: A Complete Guide",
    category: "Mental Health",
    shortDescription:
      "Learn what mental health really means, why it matters, and how to protect it every day.",
    content: `## What Is Mental Health?

Mental health covers our emotional, psychological, and social wellbeing. It influences how we think, feel, and act in daily life. It also shapes how we handle stress, relate to others, and make choices.

Mental health is important at every stage of life — from childhood and adolescence through adulthood and old age.

## Why Mental Health Matters

Good mental health is much more than the absence of mental illness. It means feeling generally positive about yourself, being able to form healthy relationships, coping with normal life stress, and contributing to your community.

When mental health is neglected, it can affect your physical health, your relationships, your work, and your quality of life overall. Research consistently shows that mental and physical health are deeply connected.

## Common Mental Health Conditions

**Anxiety disorders** — including generalised anxiety, panic disorder, and phobias — are the most common mental health conditions worldwide.

**Depression** is a leading cause of disability globally, affecting more than 280 million people. It goes beyond ordinary sadness and can disrupt daily functioning.

**Stress-related conditions** emerge when prolonged or intense stress exceeds a person's ability to cope.

**Trauma-related conditions** such as PTSD can develop after exposure to traumatic events.

## The Stigma Problem

Stigma around mental health remains one of the biggest barriers to people seeking help. Many people feel shame or embarrassment about mental health struggles, or fear being judged.

The truth is that mental health conditions are common, are not a sign of weakness, and are treatable. Speaking openly about mental health is one of the most powerful ways to reduce stigma.

## Mental Health Is a Spectrum

Everyone has mental health, just as everyone has physical health. Mental health exists on a spectrum — from thriving and flourishing, through struggling and suffering, to crisis. Most people move along this spectrum at different points in their lives.

## Building and Maintaining Mental Health

Mental health can be actively nurtured. Regular sleep, physical activity, social connection, and purposeful activity all contribute to good mental health. Learning to recognise and manage your emotions, and seeking help when needed, are signs of strength — not weakness.`,
    keyPoints: [
      "Mental health covers emotional, psychological, and social wellbeing",
      "It affects how we think, feel, act, and handle stress",
      "Good mental health is more than just absence of mental illness",
      "Mental health exists on a spectrum and changes over time",
      "Stigma is a major barrier — mental health struggles are common and treatable",
      "Mental and physical health are deeply connected",
    ],
    practicalTips: [
      "Check in with your mental state regularly — notice how you are feeling",
      "Talk openly about mental health with people you trust",
      "Learn the difference between a bad day and a pattern of struggle",
      "Prioritise basic self-care: sleep, movement, nutrition, connection",
      "Seek professional support early — don't wait until things feel unbearable",
      "Challenge negative self-talk when you notice it arising",
    ],
    warningSigns: [
      "Persistent sadness or emptiness lasting more than two weeks",
      "Withdrawing from friends, family, and activities you used to enjoy",
      "Significant changes in sleep, appetite, or energy levels",
      "Difficulty concentrating or making everyday decisions",
      "Feelings of hopelessness or worthlessness",
      "Thoughts of self-harm or suicide",
    ],
    whenToSeekHelp:
      "Seek professional help if symptoms persist for more than two weeks, significantly disrupt daily functioning, or involve thoughts of harming yourself or others. A doctor, counsellor, or mental health professional can provide a proper assessment and guide you toward the right support.",
    source: "World Health Organization (WHO) — Mental Health",
    readTimeMinutes: 7,
    relatedResourceIds: [],
  },

  // ======================================
  // 2. ANXIETY
  // ======================================

  {
    title: "Anxiety: Understanding and Managing Your Worries",
    category: "Anxiety",
    shortDescription:
      "Understand what anxiety is, how it affects your body and mind, and practical strategies to manage it.",
    content: `## What Is Anxiety?

Anxiety is your body's natural response to stress. It is a feeling of fear or worry about what is to come — an exam, a job interview, a difficult conversation. Some anxiety is normal and even helpful, as it prepares us to deal with challenges.

However, anxiety becomes a problem when it is excessive, difficult to control, or interferes with daily life.

## How Anxiety Feels

Anxiety affects both the mind and body. In the mind, it can create racing thoughts, excessive worry, difficulty concentrating, and a sense that something terrible is about to happen. In the body, it can produce a racing heart, shortness of breath, tightness in the chest, sweating, trembling, and stomach upset.

This happens because your brain activates the "fight or flight" response — releasing stress hormones like adrenaline and cortisol to prepare you to face or escape danger.

## Types of Anxiety

**Generalised Anxiety Disorder (GAD)** involves excessive, difficult-to-control worry about many different areas of life — health, finances, work, family — most days for at least six months.

**Panic Disorder** involves recurrent, unexpected panic attacks — intense surges of fear accompanied by physical symptoms like heart palpitations, shortness of breath, and dizziness.

**Social Anxiety Disorder** involves intense fear of social situations and of being judged, embarrassed, or humiliated by others.

**Specific Phobias** are intense fears of particular objects or situations — like heights, flying, spiders, or needles.

## What Causes Anxiety?

Anxiety arises from a combination of factors: genetics, brain chemistry, personality, and life experiences. Stressful or traumatic events, chronic stress, and certain medical conditions or medications can also trigger or worsen anxiety.

## Evidence-Based Approaches

**Cognitive Behavioural Therapy (CBT)** is the most well-researched treatment for anxiety. It helps you identify and challenge unhelpful thought patterns and develop healthier ways of thinking and responding.

**Breathing techniques** — like diaphragmatic breathing or the 4-7-8 technique — activate the parasympathetic nervous system and calm the body's stress response.

**Gradual exposure** involves gently and progressively facing feared situations, which reduces avoidance and weakens anxiety over time.

**Medication** — including SSRIs and certain anti-anxiety medications — can be helpful for moderate to severe anxiety, particularly when combined with therapy.`,
    keyPoints: [
      "Some anxiety is normal — it becomes problematic when excessive or persistent",
      "Anxiety activates the body's fight-or-flight stress response",
      "Common types include GAD, panic disorder, social anxiety, and specific phobias",
      "CBT is the most evidence-supported psychological treatment",
      "Breathing techniques can quickly calm physical anxiety symptoms",
      "Avoidance tends to make anxiety worse over time",
    ],
    practicalTips: [
      "Practice slow diaphragmatic breathing: inhale 4 counts, hold 4, exhale 6",
      "Identify your anxiety triggers by keeping a simple worry journal",
      "Challenge catastrophic thinking: ask 'What is the most likely outcome?'",
      "Limit caffeine and alcohol, which can intensify anxiety symptoms",
      "Exercise regularly — even a 20-minute walk reduces anxiety measurably",
      "Set a worry window: a fixed 15-minute daily slot to process worries, then let them go",
      "Practice grounding: notice 5 things you can see, 4 you can touch, 3 you can hear",
    ],
    warningSigns: [
      "Worrying most days that feels impossible to control",
      "Physical symptoms like racing heart, chest tightness, or dizziness without medical cause",
      "Avoiding situations, places, or activities because of fear",
      "Panic attacks — sudden intense waves of fear with physical symptoms",
      "Difficulty sleeping due to anxious thoughts",
      "Anxiety significantly interfering with work, school, or relationships",
    ],
    whenToSeekHelp:
      "See a doctor or mental health professional if anxiety is persistent, hard to control, or causing you to avoid important areas of life. Effective treatments are available. Early help prevents anxiety from becoming entrenched.",
    source: "American Psychological Association (APA) — Anxiety",
    readTimeMinutes: 8,
    relatedResourceIds: [],
  },

  // ======================================
  // 3. STRESS
  // ======================================

  {
    title: "Stress: How to Recognise and Manage It Effectively",
    category: "Stress",
    shortDescription:
      "Discover what stress does to your body and mind, and learn proven strategies to manage it before it manages you.",
    content: `## Understanding Stress

Stress is your body's response to any demand or challenge placed on it. In short bursts, stress can be positive — it sharpens focus, increases energy, and motivates action. This is known as eustress, or healthy stress.

The problem arises with chronic stress — ongoing stress that the body cannot switch off. Prolonged activation of the stress response takes a significant toll on physical and mental health.

## What Happens in Your Body During Stress

When you perceive a threat or challenge, the hypothalamus in your brain sends a signal to the adrenal glands, which release adrenaline and cortisol. These hormones increase heart rate, raise blood pressure, and boost energy supplies.

Over time, elevated cortisol suppresses the immune system, disrupts sleep, impairs digestion, and increases the risk of conditions like heart disease, diabetes, and depression.

## Common Sources of Stress

Life stressors span a wide range: work pressure, financial worries, relationship problems, health concerns, major life changes (moving, bereavement, divorce), academic pressure, and even daily hassles like traffic or time pressure.

## Types of Stress

**Acute stress** is short-term and tied to a specific event. It resolves when the situation passes.

**Episodic acute stress** involves frequent acute stress — people who always seem rushed or in crisis mode.

**Chronic stress** is long-term stress that persists for weeks or months, often from ongoing situations like financial hardship, a difficult job, or an unhappy relationship.

## Healthy Stress Management

**Problem-focused coping** addresses the stressor directly — making a plan, taking action, seeking information.

**Emotion-focused coping** manages the emotional response to stress when the situation cannot be changed — through relaxation, reframing, or social support.

**Relaxation techniques** — including progressive muscle relaxation, deep breathing, and mindfulness — directly counteract the physiological stress response.

**Physical activity** is one of the most effective stress relievers. Exercise metabolises stress hormones and releases endorphins.

**Social connection** is a powerful buffer against stress. Sharing your feelings with trusted others reduces the psychological burden.`,
    keyPoints: [
      "Short-term stress can be helpful; chronic stress is harmful to health",
      "Stress triggers the release of adrenaline and cortisol",
      "Prolonged stress affects immunity, sleep, digestion, and mental health",
      "Both problem-focused and emotion-focused coping strategies are useful",
      "Regular exercise is one of the most effective stress relievers",
      "Social support significantly buffers the impact of stress",
    ],
    practicalTips: [
      "Identify your top stressors and assess which ones you can change",
      "Build regular relaxation into your day — even 10 minutes matters",
      "Try progressive muscle relaxation before bed to release physical tension",
      "Break large problems into small, manageable steps",
      "Learn to say no to obligations that exceed your capacity",
      "Prioritise sleep — sleep deprivation amplifies stress significantly",
      "Limit news and social media consumption if they increase stress",
      "Connect with friends or family regularly, even briefly",
    ],
    warningSigns: [
      "Persistent headaches, muscle tension, or stomach problems without physical cause",
      "Difficulty sleeping or waking during the night with worrying thoughts",
      "Irritability, short temper, or feeling overwhelmed most of the time",
      "Withdrawing from social activities and responsibilities",
      "Relying on alcohol, food, or other substances to cope",
      "Feeling that you are losing control or cannot cope",
    ],
    whenToSeekHelp:
      "Seek professional support if stress is persistent and overwhelming, is affecting your health or relationships, or if you are using unhealthy coping strategies such as substance use. A doctor or therapist can help you develop a personalised plan.",
    source: "American Institute of Stress",
    readTimeMinutes: 7,
    relatedResourceIds: [],
  },

  // ======================================
  // 4. DEPRESSION
  // ======================================

  {
    title: "Depression: What It Is and How to Find Your Way Through",
    category: "Depression",
    shortDescription:
      "A compassionate and informative guide to understanding depression — its causes, symptoms, and the paths to recovery.",
    content: `## What Depression Really Is

Depression is more than feeling sad. It is a serious medical condition that causes a persistent feeling of sadness and loss of interest, and interferes with daily functioning. Depression affects how you feel, think, sleep, eat, and carry out everyday activities.

Depression is not a personal weakness or character flaw. It is not something you can simply "snap out of." It is a real illness with real causes and real, effective treatments.

## How Common Is Depression?

Depression is one of the most common mental health conditions globally, affecting more than 280 million people of all ages. It is a leading cause of disability worldwide. Despite this, many people never receive treatment — often because of stigma, lack of awareness, or limited access to care.

## Symptoms of Depression

Depression presents differently in different people, but common symptoms include persistent sadness or an empty feeling most of the day, loss of interest or pleasure in activities that used to be enjoyable, significant changes in appetite or weight, sleeping too much or too little, fatigue and loss of energy, feelings of worthlessness or excessive guilt, difficulty thinking or concentrating, and in severe cases, thoughts of death or suicide.

For a clinical diagnosis of major depression, symptoms must persist for at least two weeks and cause significant disruption to daily life.

## What Causes Depression?

Depression is caused by a combination of genetic, biological, environmental, and psychological factors. A family history of depression, brain chemistry imbalances (particularly serotonin and dopamine), chronic stress, trauma, medical conditions, certain medications, and major life events can all contribute.

Depression does not always have an obvious external cause. Sometimes it arises without any clear trigger.

## The Path to Recovery

The encouraging reality is that depression is highly treatable. Most people with depression can achieve significant improvement with appropriate treatment.

**Psychotherapy** — especially Cognitive Behavioural Therapy (CBT) and Interpersonal Therapy (IPT) — is effective for mild to moderate depression.

**Antidepressant medication** (particularly SSRIs) can be effective for moderate to severe depression, especially when combined with therapy.

**Lifestyle changes** — regular exercise, consistent sleep patterns, social connection, and reducing alcohol — support recovery alongside professional treatment.

**Behavioural activation** — gradually re-engaging with meaningful activities — is one of the most effective tools for breaking the withdrawal cycle of depression.`,
    keyPoints: [
      "Depression is a medical condition, not a weakness or personal failure",
      "It affects mood, thinking, sleep, appetite, energy, and daily functioning",
      "It is caused by a combination of genetic, biological, and environmental factors",
      "CBT and antidepressants are both evidence-based treatments",
      "Behavioural activation — resuming enjoyable activities — is a key tool",
      "Depression is highly treatable; most people improve significantly with help",
    ],
    practicalTips: [
      "Keep a daily routine — structure provides stability when mood is low",
      "Practice behavioural activation: do small activities even when you don't feel like it",
      "Reach out to one person each day, even briefly",
      "Avoid alcohol — it is a depressant and worsens mood over time",
      "Take small, manageable steps rather than waiting to feel better before acting",
      "Be compassionate with yourself — recovery is gradual, not linear",
      "Expose yourself to natural light each day, especially in the morning",
      "Write down three small things you did or noticed each day",
    ],
    warningSigns: [
      "Persistent low mood or emptiness for more than two weeks",
      "Loss of interest in activities that previously brought pleasure",
      "Withdrawing from friends, family, and social contact",
      "Significant changes in sleep — sleeping much more or much less than usual",
      "Feelings of hopelessness, worthlessness, or excessive guilt",
      "Thoughts of death, dying, or suicide — seek immediate help",
    ],
    whenToSeekHelp:
      "If you have felt persistently low, hopeless, or unable to function for two weeks or more — please reach out to a doctor, counsellor, or mental health service. If you are having thoughts of suicide or self-harm, seek immediate help from emergency services or a crisis line.",
    source: "World Health Organization (WHO) — Depression",
    readTimeMinutes: 8,
    relatedResourceIds: [],
  },

  // ======================================
  // 5. SLEEP & REST
  // ======================================

  {
    title: "Sleep and Mental Health: Why Rest Is Non-Negotiable",
    category: "Sleep & Rest",
    shortDescription:
      "Understand the powerful link between sleep and mental health, and learn evidence-based strategies for better sleep.",
    content: `## The Sleep-Mental Health Connection

Sleep and mental health are deeply and bidirectionally linked. Poor sleep worsens mental health conditions, and mental health conditions often disrupt sleep. This creates a cycle that can be difficult to break without intentional attention to both.

During sleep, the brain consolidates memories, regulates emotions, clears metabolic waste, and restores neurochemical balance. Without adequate sleep, emotional regulation becomes harder, stress responses amplify, and vulnerability to anxiety and depression increases significantly.

## How Much Sleep Do You Need?

Adults generally need 7–9 hours of sleep per night for optimal functioning. Teenagers need 8–10 hours. Regularly sleeping less than 7 hours is associated with increased risk of depression, anxiety, obesity, heart disease, and impaired cognitive performance.

It is worth noting that sleep quality matters as much as quantity. Fragmented sleep — waking frequently during the night — provides less restoration than consolidated, uninterrupted sleep.

## Sleep Stages

Sleep consists of several cycles, each containing stages of light sleep, deep sleep (slow-wave sleep), and REM (rapid eye movement) sleep. Deep sleep is critical for physical restoration and immune function. REM sleep is particularly important for emotional processing, memory consolidation, and mental health.

Alcohol, late-night screen use, and irregular sleep schedules disrupt these natural cycles.

## Common Sleep Problems

**Insomnia** — difficulty falling or staying asleep — is the most common sleep problem and is often linked to anxiety, stress, and depression.

**Delayed sleep phase syndrome** — naturally falling asleep and waking much later than conventional times — is common in teenagers and young adults.

**Sleep apnoea** — repeated pauses in breathing during sleep — disrupts sleep quality and is linked to depression and cognitive impairment.

## Sleep Hygiene: Building Better Habits

Sleep hygiene refers to the behavioural and environmental practices that support consistently good sleep. Evidence shows that improving sleep hygiene can substantially improve sleep quality, often without medication.

**Cognitive Behavioural Therapy for Insomnia (CBT-I)** is considered the gold standard treatment for chronic insomnia and is more effective than sleep medication in the long term.`,
    keyPoints: [
      "Sleep and mental health have a powerful bidirectional relationship",
      "Adults need 7–9 hours; consistently less increases mental health risk",
      "REM sleep is especially important for emotional regulation",
      "Alcohol disrupts sleep architecture despite feeling sedating",
      "CBT-I is the most effective long-term treatment for insomnia",
      "Sleep quality — not just quantity — determines how restorative sleep is",
    ],
    practicalTips: [
      "Keep a consistent sleep and wake time — even on weekends",
      "Create a 30-minute wind-down routine before bed: dim lights, no screens",
      "Keep your bedroom cool, dark, and quiet",
      "Avoid caffeine after 2pm and alcohol within 3 hours of bedtime",
      "Get natural sunlight in the morning to anchor your circadian rhythm",
      "If you can't sleep after 20 minutes, get up and do a quiet activity",
      "Use your bed only for sleep — not for working, scrolling, or watching TV",
      "Limit daytime naps to 20 minutes, before 3pm",
    ],
    warningSigns: [
      "Regularly taking more than 30 minutes to fall asleep",
      "Waking frequently during the night and struggling to return to sleep",
      "Feeling unrefreshed after a full night's sleep most mornings",
      "Significant daytime fatigue affecting concentration and functioning",
      "Relying on alcohol or sleep aids regularly to fall asleep",
      "Lying awake with anxious or racing thoughts most nights",
    ],
    whenToSeekHelp:
      "Consult a doctor if sleep problems persist for more than four weeks, significantly affect daily functioning, or are accompanied by symptoms of depression or anxiety. Ask about CBT-I as a first-line treatment before considering medication.",
    source: "National Sleep Foundation",
    readTimeMinutes: 7,
    relatedResourceIds: [],
  },

  // ======================================
  // 6. EMOTIONAL WELLBEING
  // ======================================

  {
    title: "Emotional Wellbeing: Understanding and Nurturing Your Inner Life",
    category: "Emotional Wellbeing",
    shortDescription:
      "Learn what emotional wellbeing means, how to understand your emotions, and how to build greater emotional resilience.",
    content: `## What Is Emotional Wellbeing?

Emotional wellbeing refers to your ability to understand, experience, and manage your emotions in a healthy way. It includes being aware of your feelings, expressing them appropriately, coping with difficult emotions, and maintaining a generally positive outlook even during challenging times.

Emotional wellbeing is not about always feeling happy. It is about having the inner resources to navigate the full range of human emotions — including grief, frustration, fear, and disappointment — without being overwhelmed.

## Why Emotional Wellbeing Matters

People with good emotional wellbeing tend to have better physical health, stronger relationships, greater resilience to stress, and a more meaningful and satisfying life. They are also better equipped to recover from setbacks and adversity.

Conversely, poor emotional wellbeing — characterised by difficulty managing emotions, chronic negativity, or emotional suppression — is associated with increased risk of mental health conditions, physical health problems, and relationship difficulties.

## Emotional Intelligence

Emotional intelligence (EI) refers to the ability to recognise, understand, and manage your own emotions, and to recognise and influence the emotions of others. Research by psychologist Daniel Goleman identified five components: self-awareness, self-regulation, motivation, empathy, and social skills.

Emotional intelligence is not fixed — it can be learned and developed throughout life.

## Understanding Your Emotions

Many people struggle to identify and name their emotions precisely. Research by psychologist Lisa Feldman Barrett suggests that the more granular your emotional vocabulary — the more specifically you can name what you feel — the better you are at regulating those emotions.

Instead of "I feel bad," try identifying whether you feel sad, frustrated, disappointed, anxious, ashamed, envious, or something else entirely. Precision in naming emotions is a powerful self-regulation tool.

## Building Emotional Resilience

Resilience is the capacity to adapt well in the face of adversity, trauma, or significant stress. It does not mean avoiding difficult emotions but rather moving through them without being permanently derailed.

Resilience is built through strong relationships, purposeful activity, cognitive flexibility (the ability to reframe situations), and a sense of personal competence developed through overcoming challenges.`,
    keyPoints: [
      "Emotional wellbeing is about managing the full range of emotions, not just being happy",
      "Emotional intelligence — awareness, regulation, empathy — can be developed",
      "Naming emotions precisely improves your ability to regulate them",
      "Resilience is built over time through relationships and overcoming challenges",
      "Suppressing emotions tends to amplify their intensity over time",
      "Good emotional wellbeing positively affects physical health and relationships",
    ],
    practicalTips: [
      "Expand your emotional vocabulary — try naming exactly what you feel each day",
      "Keep a brief emotional journal to notice patterns in your mood",
      "Practice acknowledging emotions without immediately trying to fix or suppress them",
      "Develop self-compassion: speak to yourself as you would a good friend",
      "Notice the physical sensations associated with your emotions",
      "Share your feelings with someone you trust on a regular basis",
      "Practice gratitude daily — it measurably increases positive emotion over time",
    ],
    warningSigns: [
      "Difficulty identifying or describing your own emotions",
      "Frequent emotional outbursts or overreactions to minor events",
      "Feeling emotionally numb or disconnected from your feelings",
      "Using substances, food, or other behaviours to avoid feeling emotions",
      "Persistent negative self-talk or inner criticism",
      "Feeling emotionally overwhelmed by everyday situations",
    ],
    whenToSeekHelp:
      "Consider speaking to a therapist or counsellor if you find emotional regulation consistently difficult, feel emotionally numb or overwhelmed, or if your emotional patterns are damaging your relationships or daily functioning.",
    source: "Greater Good Science Center, UC Berkeley",
    readTimeMinutes: 7,
    relatedResourceIds: [],
  },

  // ======================================
  // 7. SELF-CARE
  // ======================================

  {
    title: "Self-Care: Building a Sustainable Wellbeing Practice",
    category: "Self-Care",
    shortDescription:
      "Learn what evidence-based self-care really looks like and how to build a sustainable personal wellbeing practice.",
    content: `## What Self-Care Actually Means

Self-care has become a buzzword often associated with bubble baths and scented candles. While enjoyable activities certainly have a place, genuine self-care is something more deliberate and foundational.

True self-care refers to the intentional actions you take to maintain and improve your physical, mental, and emotional health. It is the daily practice of attending to your own needs so that you have the capacity to engage fully with your life and the people in it.

## The Dimensions of Self-Care

**Physical self-care** addresses your body's basic needs: adequate sleep, regular movement, balanced nutrition, hydration, and medical care when needed.

**Emotional self-care** involves processing and expressing your feelings, setting boundaries, engaging in activities that bring genuine joy, and nurturing supportive relationships.

**Mental self-care** includes engaging your mind in stimulating ways, managing information overload, practising mindfulness, and taking breaks from cognitive demands.

**Social self-care** means investing time and energy in relationships that nourish you, while reducing time with those that consistently drain you.

**Spiritual self-care** — which need not be religious — involves connecting with a sense of meaning and purpose, spending time in nature, or engaging in reflective practices like journalling or meditation.

## Self-Care Is Not Selfish

A common misconception is that prioritising self-care is selfish. In reality, consistently neglecting your own needs depletes your capacity to care for others, perform well at work, and engage meaningfully with life.

Think of the aircraft safety instruction to put on your own oxygen mask before helping others. The same principle applies to everyday life.

## Building a Sustainable Self-Care Practice

The key word is sustainable. Self-care that is unrealistic, costly, or inconsistent provides little lasting benefit. The most effective self-care practices are small, regular, and deeply personal.

Start by identifying which areas of your wellbeing feel most neglected. Then choose two or three specific, realistic actions — not grand gestures — to address them. Consistency matters far more than intensity.`,
    keyPoints: [
      "Self-care is intentional action to maintain physical, mental, and emotional health",
      "It spans physical, emotional, mental, social, and spiritual dimensions",
      "Sustainable self-care is small, regular, and personally meaningful",
      "Neglecting self-care depletes your capacity to function and care for others",
      "Setting boundaries is a core self-care skill",
      "Self-care is not selfish — it is foundational to resilience",
    ],
    practicalTips: [
      "Audit your current self-care: which areas are neglected?",
      "Choose two or three small, specific daily self-care habits to build",
      "Schedule self-care as you would any important appointment",
      "Learn to recognise your own signs of depletion before they become a crisis",
      "Set clear boundaries around your time, energy, and relationships",
      "Reduce activities and relationships that consistently drain without replenishing",
      "Reconnect with activities you enjoyed before life got busy",
    ],
    warningSigns: [
      "Consistently putting everyone else's needs before your own",
      "Feeling resentful, depleted, or burnt out most of the time",
      "Difficulty saying no, even when you are already overwhelmed",
      "Neglecting basic needs like sleep, meals, or medical care",
      "No time in your week for anything that brings you genuine pleasure",
      "Physical symptoms of stress or burnout: exhaustion, headaches, getting sick often",
    ],
    whenToSeekHelp:
      "If you are experiencing burnout, persistent exhaustion, or chronic inability to meet your own basic needs despite effort, speak to a healthcare professional. Burnout and chronic self-neglect are serious and respond well to professional support.",
    source: "World Health Organization (WHO) — Self-Care",
    readTimeMinutes: 6,
    relatedResourceIds: [],
  },

  // ======================================
  // 8. PHYSICAL ACTIVITY
  // ======================================

  {
    title: "Exercise and Mental Health: Movement as Medicine",
    category: "Physical Activity",
    shortDescription:
      "Discover the powerful evidence for exercise as a mental health intervention — and how to make movement a sustainable habit.",
    content: `## The Exercise-Mental Health Connection

The relationship between physical activity and mental health is one of the most well-researched areas in health science. The evidence is compelling: regular exercise significantly reduces symptoms of depression, anxiety, and stress, and improves mood, sleep, self-esteem, and cognitive function.

A major analysis of 1,039 trials published in the British Journal of Sports Medicine (2023) found that exercise was 1.5 times more effective than leading medications and therapies for depression, anxiety, and psychological distress.

## How Exercise Affects the Brain

Exercise produces a cascade of brain-protective effects:

**Endorphins and endocannabinoids** released during exercise create the well-known "runner's high" — a sense of calm, wellbeing, and mild euphoria.

**Serotonin and dopamine** levels increase with regular exercise, improving mood, motivation, and reward processing — the same neurotransmitters targeted by antidepressants.

**BDNF (Brain-Derived Neurotrophic Factor)** — described as "fertiliser for the brain" — is produced during exercise and promotes the growth of new neurons, particularly in the hippocampus, a brain region critical for memory and mood regulation.

**Stress hormones** (adrenaline and cortisol) are metabolised during physical activity, reducing their chronic accumulation.

## How Much Is Enough?

The WHO recommends that adults engage in at least 150–300 minutes of moderate-intensity aerobic activity per week, plus muscle-strengthening activities on two or more days.

However, even small amounts of movement help. A 10-minute brisk walk measurably improves mood. The most important thing is to start and be consistent.

## Types of Exercise and Their Benefits

**Aerobic exercise** (walking, running, cycling, swimming) is most studied for depression and anxiety.

**Strength training** reduces symptoms of depression and anxiety, and builds confidence and body image.

**Yoga** combines movement with breath and mindfulness, with particularly strong evidence for reducing anxiety and stress.

**Outdoor exercise** in natural settings provides additional benefits through exposure to daylight and nature.`,
    keyPoints: [
      "Exercise is one of the most effective interventions for depression and anxiety",
      "It increases serotonin, dopamine, endorphins, and BDNF in the brain",
      "150–300 minutes of moderate activity per week is the WHO recommendation",
      "Even 10 minutes of walking measurably improves mood",
      "Consistency matters more than intensity — starting small is fine",
      "Exercise also improves sleep, self-esteem, and cognitive function",
    ],
    practicalTips: [
      "Start with 10–15 minutes a day and build gradually — don't start too hard",
      "Choose activities you genuinely enjoy — enjoyment predicts consistency",
      "Schedule exercise as a non-negotiable appointment in your day",
      "Exercise outdoors when possible — nature amplifies the mental benefits",
      "Pair exercise with a friend for accountability and social connection",
      "Use movement as a deliberate stress management tool after difficult moments",
      "Track consistency rather than intensity — show up, even on low-energy days",
    ],
    warningSigns: [
      "Feeling too exhausted to engage in any physical activity for weeks",
      "Complete loss of motivation to move that was previously present",
      "Exercise becoming excessive and compulsive — a sign of a different problem",
      "Physical activity causing increased anxiety rather than reducing it",
    ],
    whenToSeekHelp:
      "If low energy or low mood is preventing any physical activity and this has persisted for weeks, speak to a doctor. It could be a symptom of depression or a medical condition. Exercise is often recommended as part of a broader treatment plan.",
    source: "British Journal of Sports Medicine — Exercise and Mental Health (2023)",
    readTimeMinutes: 7,
    relatedResourceIds: [],
  },

  // ======================================
  // 9. HEALTHY LIFESTYLE
  // ======================================

  {
    title: "Healthy Lifestyle Habits That Support Mental Wellbeing",
    category: "Healthy Lifestyle",
    shortDescription:
      "Explore the lifestyle foundations — nutrition, sleep, movement, social connection — that support long-term mental wellbeing.",
    content: `## The Lifestyle-Mental Health Link

Lifestyle choices have a profound impact on mental health. While they are not a substitute for professional treatment, the way we eat, sleep, move, connect, and use technology forms the biological and psychological foundation on which mental health rests.

Increasingly, mental health professionals incorporate lifestyle medicine into treatment plans — recognising that addressing these foundations alongside therapy or medication produces better outcomes.

## Nutrition and the Gut-Brain Axis

The gut contains over 100 million nerve cells and produces approximately 95% of the body's serotonin. This gut-brain axis means that what you eat has a direct influence on mood, cognition, and mental health.

A Mediterranean-style diet — rich in vegetables, fruits, whole grains, legumes, fish, nuts, and olive oil — is associated with significantly lower rates of depression and cognitive decline. Ultra-processed foods, refined sugars, and trans fats are associated with higher rates of depression and anxiety.

Adequate intake of omega-3 fatty acids, B vitamins (especially B12 and folate), vitamin D, zinc, and magnesium is particularly important for brain function.

## Hydration

Even mild dehydration — as little as 1–2% of body weight — impairs mood, concentration, and cognitive performance. Drinking adequate water throughout the day is one of the simplest and most overlooked mental health supports.

## Reducing Alcohol

Alcohol is a depressant. While it may temporarily reduce anxiety, it disrupts sleep architecture, depletes mood-regulating neurotransmitters, and worsens depression and anxiety over time. Reducing alcohol consumption has measurable positive effects on mental health.

## Screen Time and Digital Wellbeing

Excessive screen time — particularly passive scrolling on social media — is associated with reduced wellbeing, increased comparison and envy, disrupted sleep, and reduced time for more restorative activities. Setting intentional boundaries around digital use supports mental health.

## Social Connection

Human beings are fundamentally social creatures. Strong, meaningful social connections are one of the most consistent predictors of wellbeing and longevity across all cultures and populations. Loneliness, conversely, carries health risks comparable to smoking 15 cigarettes a day.`,
    keyPoints: [
      "Lifestyle forms the biological foundation of mental health",
      "A Mediterranean-style diet is associated with lower rates of depression",
      "The gut produces 95% of serotonin — gut health affects mood directly",
      "Even mild dehydration impairs mood and cognition",
      "Alcohol is a depressant that worsens depression and anxiety over time",
      "Social connection is one of the strongest predictors of mental wellbeing",
    ],
    practicalTips: [
      "Eat a varied, whole-food diet with plenty of vegetables, legumes, and fish",
      "Drink water regularly throughout the day — set a reminder if needed",
      "Limit alcohol, especially when feeling low or anxious",
      "Set screen time limits, particularly around social media",
      "Protect at least one hour before bed from screens",
      "Invest regularly in social relationships — schedule them like appointments",
      "Spend time outdoors in natural light each day",
      "Cook and eat with others when possible — shared meals support connection",
    ],
    warningSigns: [
      "Consistently poor nutrition, skipping meals, or relying heavily on processed food",
      "Heavy or increasing alcohol use to cope with stress or emotions",
      "Social withdrawal and increasing isolation",
      "Multiple hours of passive social media scrolling daily",
      "Complete disruption of daily routine — meals, movement, sleep all erratic",
    ],
    whenToSeekHelp:
      "If you are struggling to maintain basic lifestyle habits due to persistent low mood, anxiety, or low motivation, speak to a doctor or counsellor. These can be symptoms of a treatable condition rather than a personal failing.",
    source: "Lancet Psychiatry — Lifestyle Medicine and Mental Health",
    readTimeMinutes: 8,
    relatedResourceIds: [],
  },

  // ======================================
  // 10. RELATIONSHIPS & SOCIAL WELLBEING
  // ======================================

  {
    title: "Relationships and Social Wellbeing: The Foundation of a Good Life",
    category: "Relationships & Social Wellbeing",
    shortDescription:
      "Understand why relationships are central to mental health and learn how to build and maintain healthier connections.",
    content: `## Why Relationships Matter So Much

The Harvard Study of Adult Development — one of the longest-running studies on human happiness, spanning more than 80 years — reached a clear conclusion: the quality of our relationships is the single most important predictor of happiness, health, and longevity.

Not wealth, not fame, not professional success — but close, warm, and trusting relationships.

This is not merely psychological. Loneliness triggers a stress response in the body similar to physical pain. Chronic loneliness is associated with elevated cortisol, disrupted sleep, weakened immunity, and significantly increased risk of premature death.

## What Makes Relationships Healthy?

Healthy relationships share a number of characteristics: mutual respect, trust, open and honest communication, appropriate boundaries, support during difficult times, and a general sense of feeling valued and safe.

Psychologist John Gottman's decades of research on couples identified that the ratio of positive to negative interactions — what he called the "magic ratio" of 5:1 — is one of the most reliable predictors of relationship health.

## Communication as a Core Skill

Healthy relationships require healthy communication. Active listening — giving full attention, reflecting back what you hear, and seeking to understand before being understood — is a foundational skill.

Assertive communication — expressing your needs, feelings, and boundaries clearly and respectfully — is distinct from both passive communication (suppressing your needs) and aggressive communication (expressing needs in ways that disrespect others).

## The Impact of Toxic Relationships

Relationships that are chronically critical, dismissive, controlling, or abusive cause significant psychological harm. Recognising unhealthy relationship patterns is important for protecting mental wellbeing.

It is possible to love someone and also recognise that the relationship as it currently exists is causing harm. Setting limits on harmful interactions, or seeking professional support for relationship difficulties, are acts of self-care.`,
    keyPoints: [
      "Quality of relationships is the single most powerful predictor of happiness and health",
      "Chronic loneliness carries health risks comparable to smoking",
      "Healthy relationships involve respect, trust, communication, and appropriate boundaries",
      "A 5:1 ratio of positive to negative interactions predicts relationship health",
      "Assertive communication is a skill that can be developed",
      "Toxic relationship patterns cause real psychological harm and should be addressed",
    ],
    practicalTips: [
      "Invest intentional time in your most important relationships",
      "Practice active listening — put away your phone and give full attention",
      "Express appreciation and gratitude to the people in your life",
      "Learn to communicate your needs clearly and respectfully",
      "Address conflicts early rather than letting resentment build",
      "Build and maintain friendships outside of romantic relationships",
      "Join a community group, class, or volunteer organisation to meet people",
      "Recognise and set limits on relationships that consistently drain or harm you",
    ],
    warningSigns: [
      "Feeling consistently unsupported, criticised, or belittled in relationships",
      "Increasing social isolation and withdrawal from people you care about",
      "Conflict patterns that repeat without resolution",
      "Feeling unsafe — emotionally or physically — in a relationship",
      "Loneliness becoming persistent and painful",
      "Relationships that involve control, manipulation, or abuse",
    ],
    whenToSeekHelp:
      "Seek support from a therapist or counsellor if relationship difficulties are causing significant distress, if you are in an abusive or controlling relationship, or if loneliness has become persistent. Couples therapy, group therapy, or individual counselling can all help.",
    source: "Harvard Study of Adult Development; John Gottman Institute",
    readTimeMinutes: 7,
    relatedResourceIds: [],
  },

  // ======================================
  // 11. STUDENT MENTAL HEALTH
  // ======================================

  {
    title: "Student Mental Health: Navigating Academic Life and Wellbeing",
    category: "Student Mental Health",
    shortDescription:
      "A guide for students on managing the unique pressures of academic life while protecting your mental health.",
    content: `## The Mental Health Challenge for Students

Student life brings unique opportunities and unique pressures. Academic demands, social transitions, financial stress, career uncertainty, and often living away from home for the first time all converge during a period of significant personal development.

Surveys consistently find that students experience elevated rates of anxiety, depression, burnout, and loneliness compared to the general population. In many countries, demand for university mental health services has grown substantially over the past decade.

## Common Student Mental Health Struggles

**Academic pressure** — the demand to perform well, fear of failure, and comparison with peers — is one of the most common stressors among students.

**Transition and adjustment** difficulties arise when starting university, moving to a new city, or adapting to a very different social environment.

**Loneliness** is surprisingly common among students, even in busy campus environments. Building genuine social connections takes time and effort.

**Sleep disruption** — irregular schedules, late nights, and early morning classes — is common and significantly impairs mental health and academic performance.

**Financial stress** is a significant and often underacknowledged source of anxiety for many students.

**Imposter syndrome** — the persistent feeling of being a fraud, of not deserving your place, and of being about to be "found out" — affects a significant proportion of high-achieving students.

## Protecting Your Mental Health as a Student

Academic success and mental wellbeing are not opposites — they reinforce each other. Students who invest in sleep, physical activity, social connection, and stress management tend to perform better academically as well as feeling better emotionally.

**Time management and planning** reduce the anxiety of feeling behind and provide a sense of control. Breaking large tasks into small steps makes progress visible and achievable.

**Campus resources** — including counselling services, peer support programmes, and student wellbeing offices — exist precisely to support you. Use them early, not as a last resort.

**Study breaks and recreation** are not indulgences — they are essential for consolidating learning and maintaining the cognitive performance needed for effective study.`,
    keyPoints: [
      "Students face elevated rates of anxiety, depression, and burnout",
      "Academic pressure, loneliness, and sleep disruption are key risk factors",
      "Imposter syndrome is common among high-achieving students",
      "Mental wellbeing and academic performance reinforce each other",
      "Campus counselling and support services exist to help — use them early",
      "Time management and breaking tasks into steps reduces academic anxiety",
    ],
    practicalTips: [
      "Build a consistent daily routine including sleep, meals, and study time",
      "Break large assignments into weekly milestones and start early",
      "Connect with your campus counselling or student wellbeing service",
      "Join clubs, societies, or groups aligned with your interests",
      "Be honest with yourself if you are struggling — asking for help is strength",
      "Take regular breaks during study — the Pomodoro technique (25 min on / 5 min off) helps",
      "Limit social media comparison during exam periods",
      "Talk to your tutor or academic advisor if academic pressure becomes overwhelming",
    ],
    warningSigns: [
      "Persistent anxiety about academic performance that interferes with daily life",
      "Feeling consistently overwhelmed, behind, or unable to cope",
      "Social withdrawal and increasing loneliness",
      "Sleep dramatically disrupted or significantly reduced",
      "Using alcohol or substances to cope with academic pressure",
      "Thoughts of dropping out driven by distress rather than a clear plan",
    ],
    whenToSeekHelp:
      "Contact your university's counselling or student support service if academic pressure or personal difficulties are significantly affecting your wellbeing. Services are confidential and designed to support you. Don't wait until you are in crisis.",
    source: "American College Health Association; Student Minds (UK)",
    readTimeMinutes: 7,
    relatedResourceIds: [],
  },

  // ======================================
  // 12. WORK & STUDY STRESS
  // ======================================

  {
    title: "Work and Study Stress: Preventing and Managing Burnout",
    category: "Work & Study Stress",
    shortDescription:
      "Learn to recognise the signs of burnout and build sustainable habits that protect your performance and mental health.",
    content: `## Understanding Work and Study Stress

A degree of pressure in work and study environments is normal and can motivate peak performance. The problem arises when demands consistently exceed a person's resources — time, energy, skills, support — over an extended period.

Chronic occupational or academic stress, when unaddressed, can lead to burnout: a state of physical and emotional exhaustion characterised by cynicism, detachment, and a profound sense of ineffectiveness.

## What Is Burnout?

Burnout was formally recognised by the World Health Organization as an occupational phenomenon in 2019. It is characterised by three dimensions:

**Exhaustion** — feeling emotionally and physically depleted, with no capacity to recover even after rest.

**Cynicism and detachment** — becoming increasingly negative, detached, or indifferent toward your work or study — losing the meaning and motivation you once had.

**Reduced sense of efficacy** — feeling that nothing you do makes a difference, that you are incompetent, or that your efforts are futile.

## The Path to Burnout

Burnout rarely arrives suddenly. It develops gradually, often driven by a culture of overwork, unclear demands, lack of control, inadequate support, and insufficient recognition. High-achieving, conscientious people are particularly vulnerable — they push through warning signs long after they should have rested.

## Recovery and Prevention

**Recovery from burnout** requires genuine rest and significant reduction in demands. It is rarely resolved by "trying harder" or pushing through. Professional support — therapy, medical assessment, and sometimes time away from work — is often needed.

**Prevention** is more effective than treatment. Building recovery time into each day, week, and year — before you hit empty — is the foundation of sustainable performance. This is not laziness; it is the strategy that underlies long-term high performance.

**Boundaries** between work and rest are essential. In an era of smartphones and remote work, the ability to psychologically disconnect from work during non-working hours is a critical skill.`,
    keyPoints: [
      "Burnout is a WHO-recognised condition from chronic unresolved work stress",
      "Its three dimensions: exhaustion, cynicism/detachment, reduced efficacy",
      "High-achievers are particularly vulnerable to burnout",
      "Recovery requires genuine rest and often professional support",
      "Prevention involves building recovery into every day, week, and year",
      "Psychological disconnection from work during rest periods is a skill worth building",
    ],
    practicalTips: [
      "Identify your top three work stressors and take one concrete action on each",
      "Set clear work hours and protect them — don't answer emails outside those hours",
      "Build a genuine transition ritual between work and personal time",
      "Take all of your annual leave — it is not optional, it is essential",
      "Communicate workload concerns to your manager or supervisor early",
      "Build micro-recovery into each workday: proper breaks, time away from screens",
      "Pursue at least one activity outside work that is genuinely absorbing and enjoyable",
    ],
    warningSigns: [
      "Persistent exhaustion that sleep no longer resolves",
      "Increasing cynicism, negativity, or resentment toward your work or study",
      "Making more mistakes than usual or feeling unable to concentrate",
      "Dreading every workday or study session with no relief",
      "Physical symptoms: frequent illness, headaches, stomach problems",
      "Emotional blunting — feeling nothing about things that used to matter",
    ],
    whenToSeekHelp:
      "If you suspect burnout — particularly if rest is not helping you recover — consult a doctor or mental health professional. In some cases, time away from work or study and a structured recovery plan is needed. This is a medical matter, not a personal failure.",
    source: "World Health Organization (WHO) — Burnout; Maslach Burnout Inventory",
    readTimeMinutes: 7,
    relatedResourceIds: [],
  },

  // ======================================
  // 13. CRISIS & EMERGENCY SUPPORT
  // ======================================

  {
    title: "Crisis Support: What to Do When You or Someone You Know Is in Crisis",
    category: "Crisis & Emergency Support",
    shortDescription:
      "Essential information for recognising a mental health crisis and accessing the right help immediately.",
    content: `## What Is a Mental Health Crisis?

A mental health crisis is any situation in which a person's behaviour or emotional state puts them — or others — at risk, and requires immediate attention. Crisis situations can include suicidal thoughts or attempts, self-harm, severe dissociation or psychosis, acute panic, or any situation in which a person feels unable to keep themselves safe.

A crisis is not a sign of failure. It is a moment when the person's current coping resources are overwhelmed, and when external support is urgently needed.

## Recognising a Crisis

Warning signs that someone may be in crisis include: talking about wanting to die or wishing they were dead, expressing feelings of hopelessness with no reason to live, talking about being a burden to others, giving away prized possessions, saying goodbye as if not expecting to see people again, dramatic changes in mood, increasing isolation, or any direct statement about plans to harm themselves.

If you are unsure whether someone is in crisis, it is always better to ask directly. Research consistently shows that asking someone about suicidal thoughts does not plant the idea — it opens the door to help.

## If You Are in Crisis

**You are not alone, and help is available.** In a crisis, reach out immediately:

- **Call emergency services (999 or 112 in most countries, 911 in the USA)**
- **Go to your nearest emergency department**
- **Call a crisis line** — trained counsellors are available 24 hours a day
- **Tell someone you trust** — a friend, family member, or colleague

If you have made a plan to hurt yourself, treat it as a medical emergency and call emergency services immediately.

Remove access to means if possible — this is one of the most effective crisis interventions.

## Supporting Someone Else in Crisis

Stay calm and stay with them. Listen without judgement — do not minimise what they are feeling. Ask directly: "Are you thinking about suicide?" Involve emergency services if there is immediate danger. Do not leave them alone if you believe they are at imminent risk.

You do not need to have all the answers. Your presence and willingness to listen may be the most important thing you can offer.

## After a Crisis

Following a crisis, it is important to connect the person with professional mental health support for ongoing care. Safety planning — identifying warning signs, coping strategies, people to contact, and reasons for living — is a key tool in preventing future crises.`,
    keyPoints: [
      "A mental health crisis requires immediate, not later, attention",
      "Asking directly about suicide does not increase risk — it opens the door to help",
      "Emergency services, crisis lines, and emergency departments are available",
      "Remove access to means during a crisis — this saves lives",
      "Your calm presence and listening are the most important things you can offer",
      "Follow-up professional support after a crisis is essential",
    ],
    practicalTips: [
      "Save crisis line numbers in your phone before you need them",
      "If supporting someone: stay calm, stay present, listen without judging",
      "Ask directly and plainly if someone seems at risk",
      "Don't leave someone alone if you believe they are in immediate danger",
      "After a crisis passes, help connect the person to ongoing professional support",
      "Learn psychological first aid basics — simple skills that can save lives",
    ],
    warningSigns: [
      "Talking about wanting to die or wishing they were dead",
      "Expressing hopelessness and that there is no reason to live",
      "Giving away important possessions",
      "Saying goodbye as though it is final",
      "Sudden calmness after a period of extreme distress (can indicate decision has been made)",
      "Direct statements about plans to harm themselves",
    ],
    whenToSeekHelp:
      "If you or someone you know is in immediate danger — call emergency services (999, 112, or 911) or go to the nearest emergency department now. Crisis lines are also available around the clock. Don't wait.",
    source: "International Association for Suicide Prevention (IASP); WHO",
    readTimeMinutes: 6,
    relatedResourceIds: [],
  },

  // ======================================
  // 14. PROFESSIONAL HELP
  // ======================================

  {
    title: "When and How to Seek Professional Mental Health Help",
    category: "Professional Help",
    shortDescription:
      "A practical guide to understanding different types of mental health professionals, how therapy works, and how to take the first step.",
    content: `## When to Seek Professional Help

Many people wait far too long before seeking professional mental health support — often because of stigma, uncertainty about whether their struggles are "bad enough," or simply not knowing how to access care.

A useful rule of thumb: if your mental health is consistently interfering with your ability to function, enjoy life, or maintain relationships — for two weeks or more — it is worth seeking a professional assessment. You do not need to be in crisis to deserve support.

Other reasons to seek help include: wanting to understand yourself better, navigating a major life transition, processing a loss or trauma, relationship difficulties, persistent patterns of behaviour you would like to change, or simply wanting support in building greater wellbeing.

## Types of Mental Health Professionals

**Psychiatrists** are medical doctors who specialise in mental health. They can diagnose mental health conditions, prescribe medication, and provide therapy. They are usually involved in more complex or severe cases.

**Psychologists** hold doctoral degrees in psychology and provide psychological assessment and therapy. They cannot typically prescribe medication (though this varies by country).

**Counsellors and psychotherapists** are trained in specific therapeutic approaches and provide talk therapy for a wide range of emotional and psychological difficulties. Qualifications vary by country.

**General practitioners (family doctors)** are often the first point of contact for mental health concerns and can provide assessment, medication, and referrals to specialists.

**Social workers and mental health nurses** provide support, case management, and therapy, particularly within community mental health services.

## What Happens in Therapy?

Therapy is a professional conversation aimed at helping you understand yourself, change unhelpful patterns, develop coping skills, and work toward your goals. It is not advice-giving, nor is the therapist there to solve your problems for you.

Common approaches include:

**Cognitive Behavioural Therapy (CBT)** — identifies and changes unhelpful thoughts and behaviours.

**Acceptance and Commitment Therapy (ACT)** — builds psychological flexibility and helps you live in line with your values.

**Psychodynamic therapy** — explores how past experiences and unconscious patterns influence present behaviour.

**Person-centred therapy** — provides unconditional positive regard and focuses on self-understanding and growth.

## Taking the First Step

The first step is often the hardest. Start by speaking to your doctor or searching for a registered mental health professional in your area. Many services offer an initial consultation to discuss your needs. Online therapy has also significantly increased access to support.`,
    keyPoints: [
      "You don't need to be in crisis to deserve professional support",
      "If mental health is disrupting functioning for 2+ weeks, seek assessment",
      "Psychiatrists, psychologists, counsellors, and GPs serve different roles",
      "Therapy is not advice — it is a collaborative process of understanding and change",
      "CBT, ACT, and psychodynamic therapy are among the evidence-based approaches",
      "Online therapy has significantly increased access to mental health support",
    ],
    practicalTips: [
      "Start by speaking to your doctor (GP) as a first point of access",
      "Research registered and accredited mental health professionals in your area",
      "Prepare for your first appointment: note your main concerns and how long they have lasted",
      "Be honest with your therapist — the more you share, the more they can help",
      "Give therapy time — change rarely happens in one or two sessions",
      "If one therapist doesn't feel right, it is okay to try another",
      "Look into online therapy platforms if in-person access is limited",
    ],
    warningSigns: [
      "Persistent low mood, anxiety, or stress lasting more than two weeks",
      "Mental health significantly interfering with work, study, or relationships",
      "Thoughts of self-harm or suicide — seek immediate professional help",
      "Feeling unable to cope despite trying multiple self-help strategies",
      "Patterns of behaviour that repeatedly cause harm to yourself or others",
    ],
    whenToSeekHelp:
      "Now is always the right time to seek help if you are struggling. You don't need to reach a certain level of suffering before you deserve support. Your wellbeing matters.",
    source: "National Institute for Mental Health (NIMH); Mind UK",
    readTimeMinutes: 8,
    relatedResourceIds: [],
  },
];

// ========================================
// SEED FUNCTION
// ========================================

const seedResources = async () => {
  try {
    console.log("");
    console.log("========================================");
    console.log("SEEDING RESOURCES");
    console.log("========================================");
    console.log("");

    // ======================================
    // CLEAR EXISTING RESOURCES
    // ======================================

    const existing = await prisma.resource.count();

    if (existing > 0) {
      console.log(`Found ${existing} existing resources. Deleting...`);

      await prisma.resourceBookmark.deleteMany({});
      await prisma.resource.deleteMany({});

      console.log("Cleared existing resources.");
      console.log("");
    }

    // ======================================
    // INSERT RESOURCES (WITHOUT relatedResourceIds first)
    // ======================================

    console.log(`Inserting ${resources.length} resources...`);
    console.log("");

    const insertedIds = [];

    for (let i = 0; i < resources.length; i++) {
      const { relatedResourceIds, ...resourceData } = resources[i];

      const created = await prisma.resource.create({
        data: {
          ...resourceData,
          relatedResourceIds: [],
        },
      });

      insertedIds.push(created.id);

      console.log(
        `[${i + 1}/${resources.length}] "${created.title}" (${created.category}) — ID: ${created.id}`
      );
    }

    // ======================================
    // BUILD RELATED RESOURCE LINKS
    // Relate each resource to 2-3 nearby resources
    // ======================================

    console.log("");
    console.log("Building related resource links...");

    for (let i = 0; i < insertedIds.length; i++) {
      const id = insertedIds[i];

      // Link to next 2 and previous 1 resource (circular)
      const relatedIds = [
        insertedIds[(i + 1) % insertedIds.length],
        insertedIds[(i + 2) % insertedIds.length],
        insertedIds[(i - 1 + insertedIds.length) % insertedIds.length],
      ];

      await prisma.resource.update({
        where: { id },
        data: { relatedResourceIds: relatedIds },
      });
    }

    console.log("Related resource links built.");

    // ======================================
    // SUMMARY
    // ======================================

    console.log("");
    console.log("========================================");
    console.log(`SUCCESS: ${insertedIds.length} resources seeded.`);
    console.log("========================================");
    console.log("");

  } catch (error) {
    console.error("Seed error:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
};

seedResources();
