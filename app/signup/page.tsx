import { Metadata } from 'next'
import SignupForm from '@/components/auth/SignupForm'

export const metadata: Metadata = {
  title: 'サインアップ',
  description: '新しいアカウントを作成してください。',
}

export default function SignupPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <SignupForm />
    </div>
  )
};