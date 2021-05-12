export const MONGODB_URI = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.6o14s.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
export const MONGODB_LOCAL_URI = `mongodb://127.0.0.1:27017/${process.env.DB_NAME}`;

export default MONGODB_LOCAL_URI;