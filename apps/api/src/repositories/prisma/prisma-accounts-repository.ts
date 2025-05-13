import type { Account, AccountProvider, Prisma } from '@prisma/client'

import { prisma } from '@/lib/prisma'

import type { AccountsRepository } from '../interfaces/accounts-repository'

export class PrismaAccountsRepository implements AccountsRepository {
  async findByUserIdAndProvider({
    userId,
    provider,
  }: {
    userId: string
    provider: AccountProvider
  }): Promise<Account | null> {
    return prisma.account.findUnique({
      where: {
        provider_user_id: {
          user_id: userId,
          provider,
        },
      },
    })
  }

  async create(data: Prisma.AccountUncheckedCreateInput): Promise<Account> {
    return prisma.account.create({
      data,
    })
  }
}
