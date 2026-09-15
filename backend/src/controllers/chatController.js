const prisma = require("../config/database");

const {
  generateAIResponse
} = require("../services/llmService");

// ========================================
// CHAT CONTROLLER
// ========================================

exports.chat = async (req, res) => {
  try {
    const userId = req.user.userId;
    const conversationId = Number(req.params.conversationId);
    const { message } = req.body;

    // ========================================
    // VALIDATE CONVERSATION ID
    // ========================================

    if (Number.isNaN(conversationId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid conversation ID."
      });
    }

    // ========================================
    // VALIDATE MESSAGE
    // ========================================

    if (!message || !message.trim()) {
      return res.status(400).json({
        success: false,
        message: "Message is required."
      });
    }

    // ========================================
    // CHECK CONVERSATION OWNERSHIP
    // ========================================

    const conversation = await prisma.conversation.findFirst({
      where: {
        id: conversationId,
        userId
      }
    });

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: "Conversation not found."
      });
    }

    // ========================================
    // SAVE USER MESSAGE
    // ========================================

    const userMessage = await prisma.message.create({
      data: {
        conversationId,
        role: "user",
        content: message.trim()
      }
    });

    // ========================================
    // GET CONVERSATION HISTORY
    // ========================================

    const conversationHistory = await prisma.message.findMany({
      where: {
        conversationId
      },
      orderBy: {
        createdAt: "asc"
      },
      select: {
        role: true,
        content: true,
        createdAt: true
      }
    });

    // ========================================
    // GENERATE AI RESPONSE
    // ========================================

    const aiResult = await generateAIResponse(
      message.trim(),
      conversationHistory
    );

    if (!aiResult.success) {
      return res.status(500).json({
        success: false,
        message: "Failed to generate AI response."
      });
    }

    const assistantContent = aiResult.response;

    // ========================================
    // SAVE ASSISTANT MESSAGE
    // ========================================

    const assistantMessage = await prisma.message.create({
      data: {
        conversationId,
        role: "assistant",
        content: assistantContent
      }
    });

    // ========================================
    // UPDATE CONVERSATION
    // ========================================

    await prisma.conversation.update({
      where: {
        id: conversationId
      },
      data: {
        updatedAt: new Date()
      }
    });

    // ========================================
    // RETURN RESPONSE
    // ========================================

    return res.status(200).json({
      success: true,
      message: "Chat processed successfully.",
      data: {
        userMessage,
        assistantMessage
      }
    });

  } catch (error) {
    console.error("Chat error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to process chat."
    });
  }
};