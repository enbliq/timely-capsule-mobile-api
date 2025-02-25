export default () => ({
  // port: parseInt(process.env.PORT) || 3000,
  db: {
    host:
      process.env.NODE_ENV === 'production' ? process.env.DB_HOST : 'localhost',
    port: parseInt(
      process.env.NODE_ENV === 'production' ? process.env.DB_PORT : '5433',
    ),
    username:
      process.env.NODE_ENV === 'production' ? process.env.DB_USER : 'devuser',
    password:
      process.env.NODE_ENV === 'production'
        ? process.env.DB_PASSWORD
        : 'devpassword',
    database:
      process.env.NODE_ENV === 'production' ? process.env.DB_NAME : 'devdb',
    url: process.env.DB_URL,
  },
});
