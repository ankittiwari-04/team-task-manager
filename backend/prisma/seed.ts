import { PrismaClient, Role, TaskPriority, TaskStatus } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const adminPassword = await bcrypt.hash('Admin123!', 12);
  const memberPassword = await bcrypt.hash('Member123!', 12);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@demo.com' },
    update: {},
    create: { name: 'Alex Admin', email: 'admin@demo.com', password: adminPassword, role: Role.ADMIN }
  });

  const member1 = await prisma.user.upsert({
    where: { email: 'sarah@demo.com' },
    update: {},
    create: { name: 'Sarah Chen', email: 'sarah@demo.com', password: memberPassword, role: Role.MEMBER }
  });

  const member2 = await prisma.user.upsert({
    where: { email: 'james@demo.com' },
    update: {},
    create: { name: 'James Park', email: 'james@demo.com', password: memberPassword, role: Role.MEMBER }
  });

  const project1 = await prisma.project.upsert({
    where: { id: 'demo-project-001' },
    update: {},
    create: {
      id: 'demo-project-001',
      name: 'Website Redesign',
      description: 'Complete overhaul of the company website with new branding and improved UX.',
      color: '#6366f1',
      ownerId: admin.id,
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    }
  });

  const project2 = await prisma.project.upsert({
    where: { id: 'demo-project-002' },
    update: {},
    create: {
      id: 'demo-project-002',
      name: 'Mobile App Launch',
      description: 'Q3 launch of the iOS and Android companion app.',
      color: '#10b981',
      ownerId: admin.id,
      dueDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000)
    }
  });

  await prisma.projectMember.createMany({
    data: [
      { projectId: project1.id, userId: admin.id, role: Role.ADMIN },
      { projectId: project1.id, userId: member1.id, role: Role.MEMBER },
      { projectId: project1.id, userId: member2.id, role: Role.MEMBER },
      { projectId: project2.id, userId: admin.id, role: Role.ADMIN },
      { projectId: project2.id, userId: member1.id, role: Role.MEMBER }
    ],
    skipDuplicates: true
  });

  const tasks = [
    { title: 'Design new homepage mockups', status: TaskStatus.DONE, priority: TaskPriority.HIGH, assigneeId: member1.id, projectId: project1.id, daysOffset: -5 },
    { title: 'Build navigation component', status: TaskStatus.IN_PROGRESS, priority: TaskPriority.HIGH, assigneeId: member2.id, projectId: project1.id, daysOffset: 2 },
    { title: 'Write API documentation', status: TaskStatus.IN_REVIEW, priority: TaskPriority.MEDIUM, assigneeId: admin.id, projectId: project1.id, daysOffset: 1 },
    { title: 'Set up CI/CD pipeline', status: TaskStatus.TODO, priority: TaskPriority.URGENT, assigneeId: member1.id, projectId: project1.id, daysOffset: -2 },
    { title: 'User testing sessions', status: TaskStatus.TODO, priority: TaskPriority.MEDIUM, assigneeId: member2.id, projectId: project1.id, daysOffset: 7 },
    { title: 'Design app wireframes', status: TaskStatus.DONE, priority: TaskPriority.HIGH, assigneeId: member1.id, projectId: project2.id, daysOffset: -10 },
    { title: 'Implement push notifications', status: TaskStatus.IN_PROGRESS, priority: TaskPriority.HIGH, assigneeId: member2.id, projectId: project2.id, daysOffset: 5 },
    { title: 'App store submission', status: TaskStatus.TODO, priority: TaskPriority.URGENT, assigneeId: admin.id, projectId: project2.id, daysOffset: 14 }
  ];

  for (const [i, task] of tasks.entries()) {
    const { daysOffset, projectId, ...taskData } = task;
    await prisma.task.create({
      data: {
        ...taskData,
        projectId,
        creatorId: admin.id,
        position: i,
        dueDate: new Date(Date.now() + daysOffset * 24 * 60 * 60 * 1000),
        tags: i % 2 === 0 ? ['frontend', 'design'] : ['backend']
      }
    });
  }

  await prisma.activityLog.createMany({
    data: [
      { userId: admin.id, action: 'Created project Website Redesign', projectId: project1.id },
      { userId: member1.id, action: 'Completed task: Design new homepage mockups', projectId: project1.id },
      { userId: admin.id, action: 'Added Sarah Chen to Website Redesign', projectId: project1.id }
    ]
  });
}

main()
  .then(() => {
    process.stdout.write('Seed complete.\n');
  })
  .catch((e) => {
    process.stderr.write(e.message);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
