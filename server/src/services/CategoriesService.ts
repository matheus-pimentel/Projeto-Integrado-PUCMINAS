import { prisma } from "../lib/prisma";
export const ADMIN_USER_ID = "63a05e5e8d4e3f963e43a290";

class CategoriesService {
  async getAll(userId: string) {
    const categories = await prisma.category.findMany({
      where: {
        OR: [
          {
            userId: {
              in: [userId, ADMIN_USER_ID],
            },
          }
        ],
      },
      include: {
        user: {
          select: {
            email: true
          }
        }
      },
      orderBy: [{
        name: "asc"
      }]
    });

    return categories;
  }
}

export { CategoriesService };
