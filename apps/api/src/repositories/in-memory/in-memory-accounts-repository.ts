import type { Account, AccountProvider, Prisma } from '@prisma/client'
import { randomUUID } from 'crypto'

import type { AccountsRepository } from '../interfaces/accounts-repository'

export class InMemoryAccountsRepository implements AccountsRepository {
  public accounts: Account[] = []

  async findByUserIdAndProvider({
    userId,
    provider,
  }: {
    userId: string
    provider: AccountProvider
  }): Promise<Account | null> {
    return (
      this.accounts.find(
        (account) =>
          account.user_id === userId && account.provider === provider,
      ) ?? null
    )
  }

  async create(data: Prisma.AccountUncheckedCreateInput): Promise<Account> {
    const account = {
      id: randomUUID(),
      provider: data.provider,
      provider_account_id: data.provider_account_id,
      user_id: data.user_id,
    }

    this.accounts.push(account)

    return account
  }
}
