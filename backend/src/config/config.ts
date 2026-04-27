const config = {
  port: process.env.PORT as number | undefined || 3000,
  mail_user: process.env.MAIL_USER,
  mail_password: process.env.MAIL_PASSWORD,
  jwt_secret: process.env.JWT_SECRET as string,
  redis_password: process.env.REDIS_PASSWORD as string,
  redis_host: process.env.REDIS_HOST as string,
  redis_username: process.env.REDIS_USERNAME as string,
  redis_port: Number(process.env.REDIS_PORT),
  auth_token: process.env.AUTH_TOKEN as string,
};

export default config;
