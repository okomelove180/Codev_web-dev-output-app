/// <reference types="jest" />

import '@testing-library/jest-dom'
import { render, screen, fireEvent } from '@testing-library/react'
import { LearningGoals } from '@/components/learning-goals'

const mockGoals = [
  { 
    id: '1', 
    title: 'Learn React', 
    description: 'Master React fundamentals',
    completed: false,
    createdAt: new Date(),
    updatedAt: new Date(),
    userId: 'user1'
  },
  { 
    id: '2', 
    title: 'Master TypeScript', 
    description: 'Understand advanced TypeScript concepts',
    completed: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    userId: 'user1'
  },
]

describe('LearningGoals', () => {
  it('renders learning goals correctly', () => {
    render(<LearningGoals initialGoals={mockGoals} userId="user1" />)
    
    expect(screen.getByText('Learn React')).toBeInTheDocument()
    expect(screen.getByText('Master TypeScript')).toBeInTheDocument()
  })

  it('allows toggling goal completion', () => {
    render(<LearningGoals initialGoals={mockGoals} userId="user1" />)
    
    const checkbox = screen.getByRole('checkbox', { name: 'Learn React' })
    fireEvent.click(checkbox)
    expect(checkbox).toBeChecked()
  })

  it('allows adding new goals', () => {
    render(<LearningGoals initialGoals={mockGoals} userId="user1" />)
    
    const input = screen.getByPlaceholderText('新しい目標')
    const addButton = screen.getByRole('button', { name: '追加' })
    
    fireEvent.change(input, { target: { value: 'Learn Next.js' } })
    fireEvent.click(addButton)
    
    expect(screen.getByText('Learn Next.js')).toBeInTheDocument()
  })
})