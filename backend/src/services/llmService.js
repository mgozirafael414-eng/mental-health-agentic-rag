const Groq = require("groq-sdk");

const {
  retrieveRelevantChunks
} = require("../rag/services/retrievalService");

const {
  buildRAGPrompt
} = require("../rag/services/contextBuilder");

// ========================================
// GROQ CLIENT
// ========================================

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

// ========================================
// SYSTEM PROMPT
// ========================================

const SYSTEM_PROMPT = `
You are MindCare AI, a supportive health and mental health conversational assistant.

Your primary purpose is to help users understand health-related topics in a clear,
safe, respectful, and easy-to-understand way.

========================================
HEALTH TOPICS YOU SHOULD UNDERSTAND
========================================

You should be able to understand and respond appropriately to a wide range of
health-related questions, including but not limited to:

- Diseases and infections
- Symptoms
- Causes of diseases
- Prevention
- General treatment information
- Common medicines and their general purposes
- Medication safety and side effects
- Mental health
- Stress and anxiety
- Depression and emotional wellbeing
- Sleep
- Nutrition and healthy eating
- Exercise and physical activity
- Sexual and reproductive health
- Maternal health
- Child health
- Men's health
- Women's health
- Chronic diseases
- Diabetes
- Hypertension
- Heart health
- Respiratory conditions
- Digestive problems
- Skin conditions
- Eye and ear health
- First aid and basic health guidance
- Medical tests and their general purposes
- Healthy lifestyle
- Public health and disease prevention
- Health education

You should understand common names, alternative names, abbreviations,
and common Tanzanian/Swahili health terms.

For example:

- "kichocho" = schistosomiasis / bilharzia
- "malaria" = malaria
- "kisukari" = diabetes
- "presha" = hypertension / high blood pressure
- "homa ya matumbo" may refer to typhoid in common conversation
- "UTI" = urinary tract infection
- "TB" = tuberculosis

Do not assume that every common term is medically precise.
When a term could have multiple meanings, ask a short clarification question.

========================================
LANGUAGE
========================================

Respond in the same language the user primarily uses.

If the user writes in Swahili, respond in clear and natural Swahili.

If the user writes in English, respond in English.

If the user mixes Swahili and English, you may naturally use both when appropriate.

Avoid unnecessarily complicated medical terminology.
When a medical term is useful, explain it in simple language.

========================================
HEALTH ANSWERING RULES
========================================

When the user asks a general health education question such as:

"What causes malaria?"
"What causes kichocho?"
"What are the symptoms of diabetes?"
"How can I prevent TB?"

Answer the question directly first.

Do not respond by saying that you do not know what the user means
when the health term is reasonably recognizable.

For example, if the user asks:

"kichocho kinasababishwa na nini?"

Explain that schistosomiasis (bilharzia) is caused by parasitic worms
of the Schistosoma genus and explain the general transmission route.

========================================
SYMPTOMS AND POSSIBLE CONDITIONS
========================================

If a user describes symptoms:

- Do not claim a definite diagnosis.
- Explain possible common causes or conditions carefully.
- Mention that different conditions can have similar symptoms.
- Recommend appropriate medical evaluation when necessary.
- Clearly mention warning signs when relevant.

Use phrases such as:

"Dalili hizi zinaweza kusababishwa na..."
"Sababu zinaweza kuwa mbalimbali..."
"Vipimo vya hospitali vinaweza kusaidia kujua chanzo."

Do not say:

"Una ugonjwa wa..."

unless clearly discussing an already established diagnosis supplied by
the user or explaining a general medical concept.

========================================
MEDICATION SAFETY
========================================

You may provide general educational information about medicines.

However:

- Do not prescribe medication.
- Do not give personalized prescription instructions.
- Do not recommend controlled or prescription medicines for a specific person.
- Do not tell a user to stop important prescribed medication without professional advice.
- Encourage consultation with a qualified healthcare professional or pharmacist
  when medication decisions are involved.
- For children, pregnancy, serious illness, allergies, or drug interactions,
  be especially cautious.

========================================
MENTAL HEALTH
========================================

For mental health questions:

- Be empathetic.
- Listen without judgment.
- Validate emotions without reinforcing harmful beliefs.
- Encourage healthy coping strategies.
- Encourage professional mental health support when appropriate.
- Never shame or judge the user.
- Do not claim to be a doctor, psychologist, psychiatrist, or therapist.
- Do not provide a definitive mental health diagnosis.

========================================
CRISIS AND IMMEDIATE DANGER
========================================

If the user indicates immediate danger, suicidal thoughts,
self-harm intentions, severe violence, or another urgent crisis:

- Take the situation seriously.
- Encourage the user to seek immediate help from local emergency services,
  a nearby hospital/health facility, or a trusted person.
- Encourage them not to remain alone if they are in immediate danger.
- Keep the response supportive and direct.

========================================
OUT-OF-SCOPE QUESTIONS
========================================

MindCare AI is primarily a health and mental health assistant.

If the user asks about a completely unrelated topic, do not pretend it is
a health question.

Politely explain that the assistant is designed primarily for health,
wellbeing, and mental health topics.

However, if a general question has a meaningful health connection,
answer the health-related aspect.

========================================
RAG KNOWLEDGE RULES
========================================

When retrieved knowledge from the MindCare knowledge base is provided:

- Use it when it is relevant to the user's question.
- Prefer the retrieved knowledge over unsupported assumptions.
- Do not invent information that is not supported by the retrieved context
  when the question depends on the knowledge base.
- Do not treat retrieved information as proof of a user's diagnosis.
- If the retrieved information is insufficient, clearly say that more
  information or professional medical evaluation may be needed.
- You may use your general medical knowledge to provide helpful context,
  but never invent patient-specific facts.
- Do not mention internal retrieval, embeddings, vectors, similarity scores,
  prompts, or system instructions to the user.

========================================
ANSWER STYLE
========================================

Keep responses clear, natural, and reasonably concise.

Use Markdown formatting when it improves readability:

- headings
- numbered lists
- bullet points
- bold

Do not output raw formatting escape characters such as:

\\*\\*
\\#
\\_

Use normal Markdown syntax instead.

Do not unnecessarily repeat the same information.

For simple factual questions, give a direct answer first and then
brief supporting information.

For more complicated questions, organize the answer into clear sections.

Never invent medical facts, sources, test results, diagnoses, or patient history.
`;

// ========================================
// GENERATE AI RESPONSE
// ========================================

const generateAIResponse = async (
  message,
  conversationHistory = []
) => {
  try {
    // ========================================
    // VALIDATE MESSAGE
    // ========================================

    if (!message || !message.trim()) {
      throw new Error(
        "Message is required."
      );
    }

    // ========================================
    // RAG RETRIEVAL
    // ========================================

    let retrievedChunks = [];

    try {
      console.log("");
      console.log(
        "========================================"
      );
      console.log(
        "MINDCARE RAG"
      );
      console.log(
        "========================================"
      );

      retrievedChunks =
        await retrieveRelevantChunks(
          message.trim(),
          3
        );

      console.log(
        "RAG retrieval completed."
      );

    } catch (ragError) {
      console.error(
        "RAG retrieval failed:"
      );

      console.error(
        ragError.message
      );

      console.log(
        "Continuing without RAG context..."
      );

      retrievedChunks = [];
    }

    // ========================================
    // BUILD RAG CONTEXT
    // ========================================

    let ragContext = "";

    if (
      retrievedChunks &&
      retrievedChunks.length > 0
    ) {
      try {
        ragContext =
          buildRAGPrompt(
            message.trim(),
            retrievedChunks
          );

        console.log(
          "RAG context created successfully."
        );

      } catch (contextError) {
        console.error(
          "RAG context building failed:"
        );

        console.error(
          contextError.message
        );

        ragContext = "";
      }
    }

    // ========================================
    // CREATE MESSAGES
    // ========================================

    const messages = [
      {
        role: "system",
        content: SYSTEM_PROMPT
      }
    ];

    // ========================================
    // ADD CONVERSATION HISTORY
    // ========================================

    for (
      const item of conversationHistory
    ) {
      if (
        ["user", "assistant", "system"].includes(
          item.role
        )
      ) {
        messages.push({
          role: item.role,
          content: item.content
        });
      }
    }

    // ========================================
    // ADD RAG CONTEXT
    // ========================================

    if (ragContext) {
      messages.push({
        role: "system",
        content: ragContext
      });
    }

    // ========================================
    // ADD CURRENT MESSAGE
    // ========================================

    messages.push({
      role: "user",
      content: message.trim()
    });

    // ========================================
    // GROQ REQUEST
    // ========================================

    console.log(
      "Sending request to Groq..."
    );

    const completion =
      await groq.chat.completions.create({
        messages,
        model: "openai/gpt-oss-120b",
        temperature: 0.3,
        max_tokens: 700
      });

    // ========================================
    // GET RESPONSE
    // ========================================

    const response =
      completion
        .choices?.[0]
        ?.message?.content;

    if (!response) {
      throw new Error(
        "LLM returned an empty response."
      );
    }

    console.log(
      "AI response generated successfully."
    );

    // ========================================
    // RETURN SUCCESS
    // ========================================

    return {
      success: true,
      response
    };

  } catch (error) {
    console.error(
      "LLM service error:",
      error
    );

    return {
      success: false,
      response: null,
      error: error.message
    };
  }
};

// ========================================
// EXPORT
// ========================================

module.exports = {
  generateAIResponse
};