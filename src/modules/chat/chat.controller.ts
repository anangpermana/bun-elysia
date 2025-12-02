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
    const userId = req.authUser.id;
    const friendId = Number(req.params.userId);
    console.log('userId', userId);
    console.log('param', req.params);

    const data = await ChatService.getConversation(userId, friendId);

    return { success: true, data };
  }
}
