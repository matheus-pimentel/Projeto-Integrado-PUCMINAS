import moment from "moment";
import { prisma } from "../lib/prisma";
import { ADMIN_USER_ID } from "./CategoriesService";

interface getMovementsInterface {
  userId: string;
  skip?: number;
}

interface createMovementsInterface {
  userId: string;
  value: number;
  accountId: string;
  categoryId: string;
  observation?: string;
  date: string;
}

interface updateMovementsInterface {
  userId: string;
  id: string;
  value: number;
  accountId: string;
  categoryId: string;
  observation?: string;
  date: string;
}

interface deleteMovementsInterface {
  id: string;
  userId: string;
}

class MovementsService {
  async getMovementsAgg(userId: string) {
    const accounts = await prisma.account.findMany({
      where: {
        userId: {
          equals: userId
        }
      }
    });

    const movementAggregate = await prisma.movement.aggregate({
      where: {
        OR: accounts.map(account => ({
          AND: [{
            accountId: {
              equals: account.id
            }
          }, {
            date: {
              gt: account.dateTotalValue
            }
          }]
        }))
      },
      _sum: {
        value: true
      }
    });

    const categorySum = await prisma.movement.groupBy({
      by: ["categoryId"],
      _sum: {
        value: true
      },
      where: {
        AND: [{
          date: {
            gt: moment.utc().subtract(1, "month").toISOString()
          }
        }, {
          userId: {
            equals: userId
          }
        }]

      }
    });

    const categories = await prisma.category.findMany({
      where: {
        id: {
          in: categorySum.map(e => e.categoryId)
        }
      }
    })
    
    return {
      patrimonyValue: accounts.reduce((acc, cur) => acc + cur.totalValue, 0) + (movementAggregate?._sum?.value ? movementAggregate._sum.value : 0),
      sumByCategory: (categorySum || []).sort((a, b) => (a._sum?.value || 0) >= (b._sum?.value || 0) ? 1 : -1).map(e => {
        const foundCategory = categories.find(category => category.id === e.categoryId);
        return {
          id: e.categoryId,
          sum: e._sum || 0,
          name: foundCategory?.name,
          color: foundCategory?.color,
          userId: foundCategory?.userId
        };
      })
    };
  }

  async getUserMovements({ userId, skip }: getMovementsInterface) {
    const movements = await prisma.movement.findMany({
      where: {
        userId: {
          equals: userId,
        },
      },
      orderBy: [
        {
          date: "desc",
        },
      ],
      include: {
        account: {
          select: {
            institutionId: true,
            name: true,
            institution: {
              select: {
                image: true,
              },
            },
          },
        },
        category: {
          select: {
            name: true
          }
        }
      },
      take: 20,
      skip: skip,
    });

    return movements;
  }

  async createMovement(movementData: createMovementsInterface) {
    const account = await prisma.account.findUnique({
      where: {
        id: movementData.accountId,
      },
    });

    if (!account) {
      throw new Error("Conta não encontrada!");
    }

    if (account.userId !== movementData.userId) {
      throw new Error("Conta não pertence ao usuário!");
    }

    if (
      moment
        .utc(movementData.date)
        .isBefore(moment.utc().subtract(6, "months"), "day")
    ) {
      throw new Error("Não é permitido lançar um extrato antes de 6 meses!");
    }

    if (moment.utc(movementData.date).isAfter(moment.utc())) {
      throw new Error("Não é permitido lançar um extrato com data futura!");
    }

    const oldMovements = await prisma.movement.aggregate({
      where: {
        AND: [
          {
            date: {
              lt: moment.utc().subtract(6, "months").toISOString(),
            },
          },
          {
            date: {
              gt: account.dateTotalValue,
            },
          },
          {
            userId: {
              equals: movementData.userId,
            },
          },
          {
            accountId: {
              equals: movementData.accountId,
            },
          },
        ],
      },
      _sum: {
        value: true,
      },
    });

    await prisma.account.update({
      where: {
        id: movementData.accountId,
      },
      data: {
        totalValue:
          account.totalValue +
          (oldMovements?._sum?.value ? oldMovements._sum.value : 0),
        dateTotalValue: moment.utc().subtract(6, "months").toISOString(),
      },
    });

    const categoryIds = [movementData.categoryId];
    const categories = await prisma.category.findMany({
      where: {
        id: {
          in: categoryIds,
        },
      },
    });

    if (categories?.length !== categoryIds.length) {
      throw new Error("Categoria não encontrada!");
    }

    if (
      categories?.some(
        (category) =>
          category.userId !== movementData.userId &&
          category.userId !== ADMIN_USER_ID
      )
    ) {
      throw new Error("Usuário tem tem a categoria informada!");
    }

    const movement = await prisma.movement.create({
      data: {
        value: movementData.value,
        accountId: movementData.accountId,
        categoryId: movementData.categoryId,
        observation: movementData.observation,
        date: movementData.date,
        month: moment.utc(movementData.date).format("YYYYMM"),
        userId: movementData.userId,
      },
    });

    return movement;
  }

  async updateMovement(movementData: updateMovementsInterface) {
    const movementCreated = await prisma.movement.findUnique({
      where: {
        id: movementData.id,
      },
    });

    if (!movementCreated) {
      throw new Error("Extrato não encontrado!");
    }

    if (movementCreated.userId !== movementData.userId) {
      throw new Error("Usuário não tem permissão para alterar o extrato!");
    }

    const account = await prisma.account.findUnique({
      where: {
        id: movementData.accountId,
      },
    });

    if (!account) {
      throw new Error("Conta não encontrada!");
    }

    if (account.userId !== movementData.userId) {
      throw new Error("Conta não pertence ao usuário!");
    }

    if (
      moment
        .utc(movementData.date)
        .isBefore(moment.utc().subtract(6, "months"), "day")
    ) {
      throw new Error("Não é permitido alterar um extrato antes de 6 meses!");
    }

    if (moment.utc(movementData.date).isAfter(moment.utc())) {
      throw new Error("Não é permitido lançar um extrato com data futura!");
    }

    if (
      moment
        .utc(movementCreated.date)
        .isBefore(moment.utc().subtract(6, "months"), "day")
    ) {
      throw new Error("Não é permitido alterar um extrato antes de 6 meses!");
    }

    const categoryIds = [movementData.categoryId];
    const categories = await prisma.category.findMany({
      where: {
        id: {
          in: categoryIds,
        },
      },
    });

    if (categories?.length !== categoryIds.length) {
      throw new Error("Categoria não encontrada!");
    }

    if (
      categories?.some(
        (category) =>
          category.userId !== movementData.userId &&
          category.userId !== ADMIN_USER_ID
      )
    ) {
      throw new Error("Usuário tem tem a categoria informada!");
    }

    const movement = await prisma.movement.update({
      where: {
        id: movementData.id,
      },
      data: {
        value: movementData.value,
        accountId: movementData.accountId,
        categoryId: movementData.categoryId,
        observation: movementData.observation,
        date: movementData.date,
        month: moment.utc(movementData.date).format("YYYYMM")
      },
    });

    return movement;
  }

  async deleteMovement({ id, userId }: deleteMovementsInterface) {
    const movement = await prisma.movement.findUnique({
      where: {
        id,
      },
    });

    if (!movement) {
      throw new Error("Extrato não encontrado!");
    }

    if (movement.userId !== userId) {
      throw new Error("Usuário não tem permissão para excluir este extrato!");
    }

    if (
      moment
        .utc(movement.date)
        .isBefore(moment.utc().subtract(6, "months"), "day")
    ) {
      throw new Error("Não é permitido excluir um extrado antes de 6 meses!");
    }

    await prisma.movement.delete({
      where: {
        id,
      },
    });
  }
}

export { MovementsService };