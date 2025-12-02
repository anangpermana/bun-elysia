import { db } from "../../config/db";
import { chatMessages } from "../../drizzle/schema";
import { eq, or, and } from "drizzle-orm";

export class ChatService {
  static async sendMessage(senderId: number, receiverId: number, message: string) {
    const [row] = await db.insert(chatMessages).values({
      senderId,
      receiverId,
      message,
    }).returning();
    return row;
  }

  static async getConversation(userId: number, friendId: number) {
    return db.select()
      .from(chatMessages)
      .where(
        or(
          and(eq(chatMessages.senderId, userId), eq(chatMessages.receiverId, friendId)),
          and(eq(chatMessages.senderId, friendId), eq(chatMessages.receiverId, userId))
        )
      )
      .orderBy(chatMessages.createdAt);
  }
}
