import { render, screen } from '@testing-library/react'
import { Card } from '@/components/Card'

describe('Card component', () => {
  it('renderiza o conteúdo passado via children', () => {
    render(<Card><p>Conteúdo do card</p></Card>)
    expect(screen.getByText('Conteúdo do card')).toBeInTheDocument()
  })

  it('aplica classes adicionais quando fornecidas', () => {
    const { container } = render(<Card className="border">Teste</Card>)
    expect(container.firstChild).toHaveClass('border')
  })
})