import { render, screen, fireEvent } from '@testing-library/react'
import { Button } from '@/components/Button'

describe('Button component', () => {
  it('renderiza o texto corretamente', () => {
    render(<Button>Salvar</Button>)
    expect(screen.getByText('Salvar')).toBeInTheDocument()
  })

  it('executa a função onClick ao ser clicado', () => {
    const onClick = jest.fn()
    render(<Button onClick={onClick}>Enviar</Button>)
    fireEvent.click(screen.getByText('Enviar'))
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it('exibe "Enviando..." quando loading é true e está desabilitado', () => {
    render(<Button loading>Salvar</Button>)
    const button = screen.getByRole('button')
    expect(button).toHaveTextContent('Enviando...')
    expect(button).toBeDisabled()
  })
})
