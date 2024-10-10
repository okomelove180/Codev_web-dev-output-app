declare namespace NodeJS {
  interface ProcessEnv {
    NEXTAUTH_SECRET: string;
    DATABASE_URL: string;
    OPENAI_API_KEY: string;
    QIITA_ACCESS_TOKEN: string;
    DEV_SERVER_URL: string;
    TEST_USER_EMAIL: string;
    TEST_USER_PASSWORD: string;
  }
}
