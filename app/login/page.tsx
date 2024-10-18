import { Metadata } from 'next'
import LoginForm from '@/components/auth/LoginForm'

export const metadata: Metadata = {
  title: 'ログイン',
  description: 'アカウントにログインしてください。',
}

export default function LoginPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <LoginForm />
    </div>
  )
}