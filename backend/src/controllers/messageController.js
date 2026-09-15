const prisma = require("../config/database");

// ========================================
// ADD MESSAGE TO CONVERSATION
// ========================================

exports.addMessage = async (req, res) => {
  try {
    const userId = req.user.userId;
    const conversationId = Number(req.params.conversationId);
    const { role, content } = req.body;

    // Validate conversation ID
    if (Number.isNaN(conversationId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid conversation ID."
      });
    }

    // Validate message
    if (!role || !content) {
      return res.status(400).json({
        success: false,
        message: "Role and content are required."
      });
    }

    // Allow only these roles
    const allowedRoles = ["user", "assistant", "system"];

    if (!allowedRoles.includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Invalid message role."
      });
    }

    // Make sure conversation belongs to logged-in user
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

    // Create message
    const message = await prisma.message.create({
      data: {
        conversationId,
        role,
        content
      }
    });

    // Update conversation timestamp
    await prisma.conversation.update({
      where: {
        id: conversationId
      },
      data: {
        updatedAt: new Date()
      }
    });

    return res.status(201).json({
      success: true,
      message: "Message added successfully.",
      data: message
    });

  } catch (error) {
    console.error("Add message error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to add message."
    });
  }
};

// ========================================
// GET CONVERSATION MESSAGES
// ========================================

exports.getMessages = async (req, res) => {
  try {
    const userId = req.user.userId;
    const conversationId = Number(req.params.conversationId);

    if (Number.isNaN(conversationId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid conversation ID."
      });
    }

    // Check ownership
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

    const messages = await prisma.message.findMany({
      where: {
        conversationId
      },
      orderBy: {
        createdAt: "asc"
      }
    });

    return res.status(200).json({
      success: true,
      messages
    });

  } catch (error) {
    console.error("Get messages error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to retrieve messages."
    });
  }
};