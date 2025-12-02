import { ChatService } from "./chat.service";

export class ChatController {
  static async send(req: any) {
    const { receiverId, message } = req.body;
    const senderId = req.user.id;

    const saved = await ChatService.sendMessage(senderId, receiverId, message);

    return {
      success: true,
      data: saved
    };
  }

  static async conversation(req: any) {
    console.log('kesini', req.user)
    const userId = req.user.id;
    const friendId = Number(req.params.userId);

    const data = await ChatService.getConversation(userId, friendId);

    return { success: true, data };
  }
}
