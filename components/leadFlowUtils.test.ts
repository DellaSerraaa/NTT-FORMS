import { describe, expect, it } from 'vitest'
import { buildSteps, formatWhatsApp, isStepValid, type FormData } from './leadFlowUtils'

const baseForm: FormData = {
  nome: 'Ana Maria',
  whatsapp: '(11) 99888-7766',
  email: 'ana@email.com',
  jaTreina: 'sim',
  conheceNTT: 'sim',
  conheceuPorOnde: 'Instagram',
  melhorHorario: 'Noite',
}

describe('leadFlowUtils', () => {
  describe('buildSteps', () => {
    it('adds conheceuPorOnde when conheceNTT is sim', () => {
      expect(buildSteps('sim')).toContain('conheceuPorOnde')
    })

    it('skips conheceuPorOnde when conheceNTT is nao', () => {
      expect(buildSteps('nao')).not.toContain('conheceuPorOnde')
    })
  })

  describe('formatWhatsApp', () => {
    it('formats partial values', () => {
      expect(formatWhatsApp('1199')).toBe('(11) 99')
    })

    it('formats full value and strips symbols', () => {
      expect(formatWhatsApp('+55 (11) 99888-7766')).toBe('(55) 11998-8877')
    })
  })

  describe('isStepValid', () => {
    it('validates nome and email', () => {
      expect(isStepValid('nome', baseForm)).toBe(true)
      expect(isStepValid('email', baseForm)).toBe(true)
    })

    it('fails invalid whatsapp', () => {
      expect(
        isStepValid('whatsapp', { ...baseForm, whatsapp: '(11) 9999-99' }),
      ).toBe(false)
    })

    it('fails conheceuPorOnde when too short', () => {
      expect(
        isStepValid('conheceuPorOnde', { ...baseForm, conheceuPorOnde: 'A' }),
      ).toBe(false)
    })
  })
})
