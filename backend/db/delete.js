// import mongoose from 'mongoose';

// export default async function deleteAllData() {
//   try {
//     // Get the list of all collections in the database
//     const collections = await mongoose.connection.db.listCollections().toArray();
    
//     // Loop through each collection and delete all documents
//     for (const collection of collections) {
//       const model = mongoose.model(collection.name);
//       await model.deleteMany({});
//       console.log(`Deleted all documents in the ${collection.name} collection`);
//     }
    
//     console.log('All documents deleted from all collections.');
//   } catch (err) {
//     console.error('Error deleting data:', err);
//   }
// }
