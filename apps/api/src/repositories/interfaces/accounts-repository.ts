import { Account, type AccountProvider, type Prisma } from '@prisma/client'

export interface AccountsRepository {
  findByUserIdAndProvider(params: {
    userId: string
    provider: AccountProvider
  }): Promise<Account | null>

  create(data: Prisma.AccountUncheckedCreateInput): Promise<Account>
}
