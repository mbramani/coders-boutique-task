import { PrismaClient, Status } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const assessments = [];
    // eslint-disable-next-line prefer-const
    let currentDate = new Date('2024-11-01');

    function getNextDate() {
        const nextDate = new Date(currentDate);
        currentDate.setDate(currentDate.getDate() + 1);
        return nextDate;
    }

    function getRandomStatus() {
        const statuses = [Status.NOT_STARTED, Status.IN_PROGRESS, Status.COMPLETED];
        return statuses[Math.floor(Math.random() * statuses.length)];
    }

    function getRandomScore(status: Status) {
        if (status === Status.COMPLETED) {
            return Math.floor(Math.random() * 101); // Score between 0 and 100
        }
        return null;
    }

    for (let i = 1; i <= 30; i++) {
        const status = getRandomStatus();
        assessments.push({
            title: `Assessment ${i}`,
            status: status,
            score: getRandomScore(status),
            dateAssigned: getNextDate(),
        });
    }

    for (const assessment of assessments) {
        await prisma.assessment.create({
            data: assessment,
        });
        console.log(`Seeded: ${assessment.title}`);
    }
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });