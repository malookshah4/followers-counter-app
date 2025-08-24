// This script will connect to your database and delete all records
// from the Task and Campaign tables. It will not touch any other data.

import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  console.log('Starting to clear data...');

  // We must delete the 'Task' records first, because they depend on 'Campaign' records.
  const deletedTasks = await prisma.task.deleteMany({});
  console.log(`- Successfully deleted ${deletedTasks.count} tasks.`);

  // Now that the tasks are gone, we can safely delete the campaigns.
  const deletedCampaigns = await prisma.campaign.deleteMany({});
  console.log(`- Successfully deleted ${deletedCampaigns.count} campaigns.`);

  console.log('Cleanup complete.');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    // Make sure to disconnect from the database
    await prisma.$disconnect();
  });