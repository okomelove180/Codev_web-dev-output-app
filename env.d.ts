declare namespace NodeJS {
  interface ProcessEnv {
    NEXTAUTH_SECRET: string;
    NEXTAUTH_URL: string;
    OPENAI_API_KEY: string;
    POSTGRES_DATABASE: string;
    POSTGRES_HOST: string;
    POSTGRES_PASSWORD: string;
    POSTGRES_PRISMA_URL: string;
    POSTGRES_URL: string;
    POSTGRES_URL_NON_POOLING: string;
    POSTGRES_URL_NO_SSL: string;
    POSTGRES_USER: string;
    QIITA_ACCESS_TOKEN: string;
    DEV_SERVER_URL: string;
    TEST_USER_EMAIL: string;
    TEST_USER_PASSWORD: string;
  }
}
