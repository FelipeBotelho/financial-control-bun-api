/* eslint-disable drizzle/enforce-delete-with-where */
import { faker } from '@faker-js/faker'
import chalk from 'chalk'
import { db } from './connection'
import { categories, transactions, users } from './schema'
import { createId } from '@paralleldrive/cuid2'

/**
 * Reset database
 */
await db.delete(categories)
await db.delete(transactions)
await db.delete(users)
console.log(chalk.yellowBright('✔️ Database reset!'))

/**
 * Create users
 */

const [admin1, user1] = await db
  .insert(users)
  .values([
    {
      name: 'Felipe Botelho Rodrigues',
      email: 'botelhofelipebotelho@gmail.com',
      role: 'admin',
    },
    {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      role: 'user',
    },
  ])
  .returning()
console.log(chalk.yellowBright('✔️ Created users!'))

/**
 * Create Categories
 */

const availableCategories = await db
  .insert(categories)
  .values([
    {
      name: faker.lorem.sentence(),
      description: faker.lorem.paragraph(),
    },
    {
      name: faker.lorem.sentence(),
      description: faker.lorem.paragraph(),
    },
  ])
  .returning()

console.log(chalk.yellowBright('✔️ Created categories!'))

/**
 * Create transactions
 */
type TransactionInsert = typeof transactions.$inferInsert

const transactionsToInsert: TransactionInsert[] = []
for (let i = 0; i < 100; i++) {
  const id = createId()
  transactionsToInsert.push({
    id,
    userId: faker.helpers.arrayElement([user1.id, admin1.id]),
    amountInCents: Number(faker.commerce.price({ min: 190, max: 990, dec: 0 })),
    categoryId: faker.helpers.arrayElement(
      availableCategories.map((x) => x.id),
    ),
    description: faker.lorem.paragraph(),
    transactionDate: faker.date.recent({ days: 40 }),
    createdAt: faker.date.recent({ days: 40 }),
    transactionType: faker.helpers.arrayElement(['income', 'outcome']),
  })
}
await db.insert(transactions).values(transactionsToInsert)
console.log(chalk.yellowBright('✔️ Created Transactions'))
console.log(chalk.greenBright('Databse seeded successfuly!'))
process.exit(0)
