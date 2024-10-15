import { createId } from '@paralleldrive/cuid2'
import { integer, pgEnum, pgTable, text, timestamp } from 'drizzle-orm/pg-core'
import { users } from './users'
import { categories } from './categories'
import { relations } from 'drizzle-orm'

export const transactionTypeEnum = pgEnum('transaction_type', [
  'income',
  'outcome',
])

export const transactions = pgTable('transactions', {
  id: text('id')
    .$defaultFn(() => createId())
    .primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => users.id, {
      onDelete: 'cascade',
    }),
  categoryId: text('category_id')
    .notNull()
    .references(() => categories.id, { onDelete: 'cascade' }),
  transactionType: transactionTypeEnum('transaction_type')
    .default('income')
    .notNull(),
  amountInCents: integer('amount_in_cents').notNull(),
  description: text('description'),
  transactionDate: timestamp('transaction_date').notNull().defaultNow(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
})

export const transactionsRelations = relations(transactions, ({ one }) => {
  return {
    user: one(users, {
      fields: [transactions.userId],
      references: [users.id],
      relationName: 'transaction_user',
    }),
    category: one(categories, {
      fields: [transactions.categoryId],
      references: [categories.id],
      relationName: 'transaction_category',
    }),
  }
})
