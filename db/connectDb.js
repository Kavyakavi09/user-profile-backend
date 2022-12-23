import mongoose from 'mongoose';

mongoose.set('strictQuery', false);
const connect = async () => {
  try {
    await mongoose.connect(`${process.env.MONGODB_URL}`);
    console.log('Successfully connected with the Database 👍👌');
  } catch (error) {
    console.error('something went wrong ❌', error);
  }
};

export default connect;
