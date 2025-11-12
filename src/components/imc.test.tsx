import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { describe, it, expect, beforeEach } from 'vitest';

import IMC from './imc';

const inserirValores = async (peso: string, altura: string) => {
  const pesoInput = screen.getByLabelText(/Peso \(kg\):/i);
  const alturaInput = screen.getByLabelText(/Altura \(m\):/i);
  const calcularButton = screen.getByRole('button', { name: /Calcular IMC/i });

 
  await userEvent.clear(pesoInput);
  await userEvent.clear(alturaInput);
  await userEvent.type(pesoInput, peso);
  await userEvent.type(alturaInput, altura);
  await userEvent.click(calcularButton);
};


describe('IMC component', () => {
  beforeEach(() => {
    render(<IMC />);
  });
  

  it('renders inputs and button', () => {
    expect(screen.getByLabelText(/Peso \(kg\):/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Altura \(m\):/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Calcular IMC/i })).toBeInTheDocument();
  });

  
  it('shows "Abaixo do peso" for IMC < 18.5 and formats to two decimals', async () => {
    await inserirValores('50', '1.8');
    expect(screen.getByText(/Seu IMC é 15\.43 - Abaixo do peso/i)).toBeInTheDocument();
    expect(screen.getByText(/Abaixo do peso/i)).toHaveClass('sucesso');
  });

 
  it('classifies Peso normal, Sobrepeso and Obesidade categories correctly', async () => {
    await inserirValores('80.6', '1.8'); 
    expect(screen.getByText(/Seu IMC é 24\.88 - Peso normal/i)).toBeInTheDocument();
    await inserirValores('81.0', '1.8'); 
    expect(screen.getByText(/Seu IMC é 25\.00 - Sobrepeso/i)).toBeInTheDocument();
    await inserirValores('129.2', '1.8'); 
    expect(screen.getByText(/Seu IMC é 39\.88 - Obesidade grau II/i)).toBeInTheDocument();
  });

  it('shows Obesidade grau III for very high IMC', async () => {
    await inserirValores('130', '1.8');
    expect(screen.getByText(/Seu IMC é 40\.12 - Obesidade grau III/i)).toBeInTheDocument();
  });

  it('shows error when peso is non-positive', async () => {
    await inserirValores('0', '1.7'); 
    expect(screen.getByText('O peso deve ser um valor positivo')).toBeInTheDocument();
    expect(screen.getByText('O peso deve ser um valor positivo')).toHaveClass('erro');
  });

  it('shows error when altura is non-positive', async () => {
    await inserirValores('70', '0');
    expect(screen.getByText('A altura deve ser um valor positivo')).toBeInTheDocument();
    expect(screen.getByText('A altura deve ser um valor positivo')).toHaveClass('erro');
  });
});