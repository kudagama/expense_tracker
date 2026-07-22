const mongoose = require('mongoose');

async function fixDB() {
  try {
    const uri = "mongodb+srv://saveenkudagama_db_user:Saveen123@cluster0.5ep9gwn.mongodb.net/expensetracker?appName=Cluster0";
    await mongoose.connect(uri);
    console.log('Connected to MongoDB');
    
    const db = mongoose.connection.db;
    
    try {
      await db.collection('monthdatas').dropIndex('month_1');
      console.log('Successfully dropped old month_1 index');
    } catch (e) {
      console.log('Index month_1 might not exist or already dropped:', e.message);
    }
    
    // We should also delete existing documents that don't have a userId to avoid schema validation errors
    const result = await db.collection('monthdatas').deleteMany({ userId: { $exists: false } });
    console.log(`Deleted ${result.deletedCount} old documents missing userId`);
    
  } catch (error) {
    console.error('Error fixing DB:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected');
  }
}

fixDB();
