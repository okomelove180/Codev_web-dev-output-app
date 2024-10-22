import { render, screen } from '@testing-library/react'
import UserProfilePage from '@/app/users/[userId]/page'

// モックデータ
const mockUser = {
  id: 'user1',
  name: 'John Doe',
  email: 'john@example.com',
  createdAt: new Date('2023-01-01'),
  todayOutputs: 3,
  totalOutputs: 50,
  currentStreak: 7,
  recentOutputs: [],
  learningGoals: [],
  outputCalendar: {},
}

// API関数のモック
jest.mock('@/lib/api', () => ({
  getUserProfile: jest.fn().mockResolvedValue(mockUser),
}))

describe('UserProfilePage', () => {
  it('renders user profile correctly', async () => {
    render(await UserProfilePage({ params: { userId: 'user1' } }))
    
    expect(screen.getByText('John Doe')).toBeInTheDocument()
    expect(screen.getByText('john@example.com')).toBeInTheDocument()
    expect(screen.getByText('Today\'s Outputs')).toBeInTheDocument()
    expect(screen.getByText('3')).toBeInTheDocument()
    expect(screen.getByText('Total Outputs')).toBeInTheDocument()
    expect(screen.getByText('50')).toBeInTheDocument()
    expect(screen.getByText('Current Streak')).toBeInTheDocument()
    expect(screen.getByText('7 days')).toBeInTheDocument()
  })
})