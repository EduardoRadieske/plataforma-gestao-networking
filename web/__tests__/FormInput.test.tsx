import { render, screen, fireEvent } from '@testing-library/react'
import { FormInput } from '@/components/FormInput'

describe('FormInput component', () => {
  it('renderiza label e input corretamente', () => {
    render(<FormInput label="Email" name="email" />)
    expect(screen.getByLabelText('Email')).toBeInTheDocument()
  })

  it('permite digitar no campo de input', () => {
    render(<FormInput label="Nome" name="nome" />)
    const input = screen.getByLabelText('Nome') as HTMLInputElement
    fireEvent.change(input, { target: { value: 'Eduardo' } })
    expect(input.value).toBe('Eduardo')
  })

  it('aceita atributos adicionais como type e placeholder', () => {
    render(<FormInput label="Senha" type="password" placeholder="Digite sua senha" />)
    const input = screen.getByPlaceholderText('Digite sua senha')
    expect(input).toHaveAttribute('type', 'password')
  })
})