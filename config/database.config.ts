export default () => ({
    port: parseInt(process.env.PORT) || 3000,
    db: {
      host: process.env.NODE_ENV === 'production' ? process.env.PGHOST : 'localhost',
      port: parseInt(process.env.NODE_ENV === 'production' ? process.env.PGPORT : '5433'),
      username: process.env.NODE_ENV === 'production' ? process.env.DBUSER : 'devuser',
      password: process.env.NODE_ENV === 'production' ? process.env.DBPASSWORD : 'devpassword',
      database: process.env.NODE_ENV === 'production' ? process.env.PGDATABASE : 'devdb',
      url: process.env.DATABASE_URL,
    },
  });