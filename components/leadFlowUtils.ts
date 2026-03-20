export type FormData = {
  nome: string
  whatsapp: string
  email: string
  jaTreina: string
  conheceNTT: string
  conheceuPorOnde: string
  melhorHorario: string
}

export function buildSteps(conheceNTT: string) {
  const flow = ['nome', 'whatsapp', 'email', 'jaTreina', 'conheceNTT']

  if (conheceNTT === 'sim') {
    flow.push('conheceuPorOnde')
  }

  flow.push('melhorHorario')
  return flow
}

export function formatWhatsApp(value: string) {
  const numbers = value.replace(/\D/g, '').slice(0, 11)

  if (numbers.length <= 2) return numbers
  if (numbers.length <= 7) return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`
  return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7)}`
}

export function isStepValid(step: string, form: FormData) {
  switch (step) {
    case 'nome':
      return form.nome.trim().length >= 2
    case 'whatsapp':
      return form.whatsapp.replace(/\D/g, '').length >= 10
    case 'email':
      return /\S+@\S+\.\S+/.test(form.email)
    case 'jaTreina':
      return Boolean(form.jaTreina)
    case 'conheceNTT':
      return Boolean(form.conheceNTT)
    case 'conheceuPorOnde':
      return form.conheceuPorOnde.trim().length >= 2
    case 'melhorHorario':
      return Boolean(form.melhorHorario)
    default:
      return false
  }
}
