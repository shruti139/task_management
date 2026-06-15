import { PrismaClient, TaskStatus, TaskPriority } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Clean existing tasks
  await prisma.task.deleteMany({});
  console.log('Cleared existing tasks.');

  const sampleTasks = [
    {
      title: 'Set up Project Repository',
      description: 'Initialize Git, configure backend and frontend directory structures, and setup initial configurations.',
      status: TaskStatus.DONE,
      priority: TaskPriority.HIGH,
      dueDate: new Date(Date.now() - 24 * 60 * 60 * 1000), // Due yesterday
    },
    {
      title: 'Design Database Schema',
      description: 'Create PostgreSQL tables and relations using Prisma ORM. Seed database with initial mockup datasets.',
      status: TaskStatus.DONE,
      priority: TaskPriority.MEDIUM,
      dueDate: new Date(), // Due today
    },
    {
      title: 'Build REST API Endpoints',
      description: 'Develop full CRUD operations for task resource. Integrate request validations using Zod schema.',
      status: TaskStatus.IN_PROGRESS,
      priority: TaskPriority.HIGH,
      dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // Due in 2 days
    },
    {
      title: 'Create React Dashboard',
      description: 'Develop premium dashboard user interface with rich visual elements, responsive grids, and micro-interactions.',
      status: TaskStatus.TODO,
      priority: TaskPriority.HIGH,
      dueDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000), // Due in 4 days
    },
    {
      title: 'Integrate Client with REST API',
      description: 'Connect React components to the Express backend API. Set up error handling states and loading indicators.',
      status: TaskStatus.TODO,
      priority: TaskPriority.MEDIUM,
      dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // Due in 5 days
    },
    {
      title: 'Write Technical Documentation',
      description: 'Prepare documentation detailing local deployment setup, database structures, and environment parameters.',
      status: TaskStatus.TODO,
      priority: TaskPriority.LOW,
      dueDate: null, // No due date
    },
  ];

  for (const task of sampleTasks) {
    const createdTask = await prisma.task.create({
      data: task,
    });
    console.log(`Created task: ${createdTask.title} (${createdTask.id})`);
  }

  console.log('Seeding completed successfully.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
