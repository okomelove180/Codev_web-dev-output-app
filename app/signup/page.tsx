import { Metadata } from 'next'
import SignupForm from '@/components/auth/SignupForm'

export const metadata: Metadata = {
  title: 'サインアップ',
  description: '新しいアカウントを作成してください。',
}

export default function SignupPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">アカウント作成</h1>
      <SignupForm />
    </div>
  )
};