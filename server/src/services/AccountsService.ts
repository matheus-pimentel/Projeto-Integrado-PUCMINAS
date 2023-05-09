import { prisma } from "../lib/prisma";

class AccountsService {
  async getUserAccounts(userId: string) {
    const accounts = await prisma.account.findMany({
      where: {
        userId: {
          equals: userId,
        },
      },
      include: {
        institution: {
          select: {
            image: true,
            color: true,
          },
        },
      },
      orderBy: [
        {
          totalValue: "desc",
        },
      ],
    });

    const totalMovements = await prisma.movement.groupBy({
      by: ["accountId"],
      where: {
        AND: [
          {
            userId: {
              equals: userId,
            },
          },
          {
            OR: accounts.map((account) => {
              return {
                AND: [
                  {
                    accountId: {
                      equals: account.id,
                    },
                  },
                  {
                    date: {
                      gt: account.dateTotalValue,
                    },
                  },
                ],
              };
            }),
          },
        ],
      },
      _sum: {
        value: true,
      },
    });

    accounts.forEach((account) => {
      const foundMovement = totalMovements.find(
        (movement) => movement.accountId === account.id
      );

      if (foundMovement) {
        account.totalValue += foundMovement._sum?.value
          ? foundMovement._sum.value
          : 0;
      }
    });

    return accounts;
  }
}

export { AccountsService };
