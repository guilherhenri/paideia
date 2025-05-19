import { faker } from '@faker-js/faker'
import { PrismaClient } from '@prisma/client'
import { hash } from 'bcryptjs'

const prisma = new PrismaClient()

async function seed() {
  await prisma.course.deleteMany()
  await prisma.user.deleteMany()

  await prisma.user.create({
    data: {
      name: 'Guilherme Henrique',
      email: 'guilherhenri12@gmail.com',
      role: 'ADMIN',
      password_hash: await hash('123456', 1),
    },
  })

  const instructor = await prisma.user.create({
    data: {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      role: 'INSTRUCTOR',
      password_hash: await hash('123456', 1),
      picture: faker.image.avatar(),
    },
  })

  const student = await prisma.user.create({
    data: {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      role: 'STUDENT',
      password_hash: await hash('123456', 1),
      picture: faker.image.avatar(),
    },
  })

  const course = await prisma.course.create({
    data: {
      title: faker.book.title(),
      description: faker.lorem.paragraph(),
      category: faker.commerce.department(),
      logo_image: faker.image.avatar(),
      access_duration_months: 12,
      status: 'approved',
      instructor_id: instructor.id,
      modules: {
        createMany: {
          data: Array.from({ length: 5 }, (_, i) => ({
            title: faker.book.title(),
            description: faker.lorem.paragraph(),
            order: i + 1,
          })),
        },
      },
    },
  })

  Array.from({ length: 5 }, async (_, i) => {
    await prisma.module.create({
      data: {
        title: faker.book.title(),
        description: faker.lorem.paragraph(),
        order: i + 1,
        course_id: course.id,
        lessons: {
          createMany: {
            data: Array.from({ length: 10 }, (_, j) => ({
              title: faker.book.title(),
              description: faker.lorem.paragraph(),
              comment: faker.datatype.boolean()
                ? faker.lorem.paragraph()
                : null,
              order: j + 1,
              provider_type: 'youtube',
              provider_video_id: '1tGSDJBBIDQ',
            })),
          },
        },
      },
    })
  })

  const today = new Date()
  today.setMonth(today.getMonth() + course.access_duration_months)

  await prisma.enrollment.create({
    data: {
      access_expires_at: today,
      course_id: course.id,
      user_id: student.id,
    },
  })
}

seed().then(() => console.log('Database seeded!'))
