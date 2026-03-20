'use client'

import { useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { buildSteps, formatWhatsApp, isStepValid } from '@/components/leadFlowUtils'
import type { FormData } from '@/components/leadFlowUtils'
import { insertFormSubmission } from '@/utils/supabase/queries/form-submissions'

const horarios = [
  'Manha cedo',
  'Fim da manha',
  'Horario de almoco',
  'Tarde',
  'Fim da tarde',
  'Noite',
  'Prefiro combinar pelo WhatsApp',
]

const easeSmooth = [0.22, 1, 0.36, 1] as const
const easeExit = [0.4, 0, 1, 1] as const

const slideVariants = {
  initial: { opacity: 0, y: 24, scale: 0.985 },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.38, ease: easeSmooth },
  },
  exit: {
    opacity: 0,
    y: -18,
    scale: 0.99,
    transition: { duration: 0.22, ease: easeExit },
  },
}

const initialFormData: FormData = {
  nome: '',
  whatsapp: '',
  email: '',
  jaTreina: '',
  conheceNTT: '',
  conheceuPorOnde: '',
  melhorHorario: '',
}

export default function NTTLeadFlow() {
  const [started, setStarted] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [sending, setSending] = useState(false)
  const [step, setStep] = useState(0)
  const [submitError, setSubmitError] = useState('')

  const [form, setForm] = useState<FormData>(initialFormData)

  const steps = useMemo(() => buildSteps(form.conheceNTT), [form.conheceNTT])

  useEffect(() => {
    if (step > steps.length - 1) {
      setStep(steps.length - 1)
    }
  }, [step, steps.length])

  const currentStep = steps[step]
  const progress = ((step + 1) / steps.length) * 100

  function updateField<K extends keyof FormData>(field: K, value: FormData[K]) {
    setForm((previous) => ({ ...previous, [field]: value }))
  }

  function isCurrentStepValid() {
    return isStepValid(currentStep, form)
  }

  function nextStep() {
    if (!isCurrentStepValid()) return
    if (step < steps.length - 1) setStep((previous) => previous + 1)
  }

  function prevStep() {
    if (step > 0) setStep((previous) => previous - 1)
  }

  async function handleSubmit() {
    if (!isCurrentStepValid()) return

    try {
      setSending(true)
      setSubmitError('')

      const payload = {
        nome: form.nome.trim(),
        whatsapp: form.whatsapp.trim(),
        email: form.email.trim().toLowerCase(),
        ja_treina: form.jaTreina,
        conhece_ntt: form.conheceNTT,
        conheceu_por_onde:
          form.conheceNTT === 'sim' ? form.conheceuPorOnde.trim() : null,
        melhor_horario: form.melhorHorario,
      }

      const { error } = await insertFormSubmission(payload)

      if (error) {
        throw error
      }

      setSubmitted(true)
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Nao foi possivel enviar agora. Tente novamente.'
      setSubmitError(errorMessage)
    } finally {
      setSending(false)
    }
  }

  function resetAll() {
    setStarted(false)
    setSubmitted(false)
    setSending(false)
    setStep(0)
    setSubmitError('')
    setForm(initialFormData)
  }

  const useFooterActionButtons = !['jaTreina', 'conheceNTT', 'melhorHorario'].includes(
    currentStep,
  )

  return (
    <section className="relative min-h-screen overflow-hidden bg-[#0a0a0a] text-white">
      <BackgroundGlow />

      <div className="relative mx-auto flex min-h-screen w-full max-w-md flex-col px-4 py-5">
        <AnimatePresence mode="wait">
          {!started ? (
            <motion.div
              key="intro"
              variants={slideVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="flex min-h-[92vh] flex-col justify-between rounded-[30px] border border-white/10 bg-white/[0.04] p-5 shadow-[0_20px_80px_rgba(0,0,0,0.45)] backdrop-blur-xl"
            >
              <div>
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05, duration: 0.45 }}
                  className="mb-10 flex items-center justify-center pt-3"
                >
                  <NTTLogo />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.12, duration: 0.48 }}
                >
                  <span className="inline-flex rounded-full border border-cyan-300/15 bg-cyan-300/10 px-3 py-1 text-xs font-medium text-cyan-200">
                    Experiencia NTT
                  </span>

                  <h1 className="mt-5 text-3xl font-semibold leading-tight tracking-[-0.03em]">
                    5 aulas gratis para voce conhecer o NTT no seu ritmo
                  </h1>

                  <p className="mt-4 text-sm leading-6 text-white/68">
                    Responda algumas perguntas rapidas para encontrarmos o melhor
                    horario e organizar seu comeco com mais cuidado.
                  </p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.48 }}
                  className="mt-8 grid gap-3"
                >
                  <IntroCard>Mobile first e rapido de responder</IntroCard>
                  <IntroCard>Uma pergunta por vez, sem atrito</IntroCard>
                  <IntroCard>Contato direto para agendamento</IntroCard>
                </motion.div>

                <p className="mt-4 rounded-xl border border-amber-200/20 bg-amber-300/10 px-3 py-2 text-xs text-amber-100">
                  Configure as variaveis do Supabase antes de publicar.
                </p>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.28, duration: 0.48 }}
              >
                <button
                  type="button"
                  onClick={() => setStarted(true)}
                  className="w-full rounded-2xl bg-gradient-to-r from-cyan-300 to-white px-4 py-3.5 text-sm font-semibold text-black shadow-[0_10px_30px_rgba(120,235,255,0.22)] transition hover:scale-[1.01] active:scale-[0.99]"
                >
                  Comecar agora
                </button>

                <p className="mt-3 text-center text-xs text-white/42">
                  Leva menos de 1 minuto
                </p>
              </motion.div>
            </motion.div>
          ) : submitted ? (
            <motion.div
              key="success"
              variants={slideVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="flex min-h-[92vh] flex-col justify-center rounded-[30px] border border-white/10 bg-white/[0.04] p-6 text-center shadow-[0_20px_80px_rgba(0,0,0,0.45)] backdrop-blur-xl"
            >
              <div className="mb-5 flex justify-center">
                <NTTLogo small />
              </div>

              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-cyan-300/20 bg-cyan-300/10 text-cyan-200">
                OK
              </div>

              <h2 className="mt-5 text-2xl font-semibold tracking-[-0.02em]">
                Recebemos seus dados
              </h2>

              <p className="mt-3 text-sm leading-6 text-white/68">
                Nossa equipe vai entrar em contato para organizar suas 5 aulas
                gratis no melhor horario para voce.
              </p>

              <button
                type="button"
                onClick={resetAll}
                className="mt-8 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3.5 text-sm font-medium text-white"
              >
                Preencher novamente
              </button>
            </motion.div>
          ) : (
            <motion.div
              key="form-shell"
              variants={slideVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="flex min-h-[92vh] flex-col rounded-[30px] border border-white/10 bg-white/[0.04] p-5 shadow-[0_20px_80px_rgba(0,0,0,0.45)] backdrop-blur-xl"
            >
              <div className="mb-6">
                <div className="mb-4 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => {
                      if (step === 0) {
                        setStarted(false)
                      } else {
                        prevStep()
                      }
                    }}
                    className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white/72"
                  >
                    Voltar
                  </button>

                  <div className="flex items-center gap-3">
                    <NTTLogo tiny />
                    <span className="text-xs text-white/45">
                      {step + 1}/{steps.length}
                    </span>
                  </div>
                </div>

                <div className="h-2 w-full overflow-hidden rounded-full bg-white/8">
                  <motion.div
                    className="h-full rounded-full bg-gradient-to-r from-cyan-300 via-cyan-200 to-white"
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.35, ease: easeSmooth }}
                  />
                </div>
              </div>

              <div className="flex flex-1 flex-col justify-between">
                <div className="flex-1">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentStep}
                      variants={slideVariants}
                      initial="initial"
                      animate="animate"
                      exit="exit"
                    >
                      {currentStep === 'nome' && (
                        <QuestionLayout
                          title="Qual e o seu nome?"
                          description="Queremos te chamar do jeito certo."
                        >
                          <input
                            autoFocus
                            type="text"
                            value={form.nome}
                            onChange={(event) =>
                              updateField('nome', event.target.value)
                            }
                            placeholder="Seu nome completo"
                            className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-4 text-base outline-none placeholder:text-white/25 focus:border-cyan-300"
                          />
                        </QuestionLayout>
                      )}

                      {currentStep === 'whatsapp' && (
                        <QuestionLayout
                          title="Qual e o seu WhatsApp?"
                          description="Vamos usar esse numero para falar com voce sobre o agendamento."
                        >
                          <input
                            autoFocus
                            type="tel"
                            value={form.whatsapp}
                            onChange={(event) =>
                              updateField(
                                'whatsapp',
                                formatWhatsApp(event.target.value),
                              )
                            }
                            placeholder="(11) 99999-9999"
                            className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-4 text-base outline-none placeholder:text-white/25 focus:border-cyan-300"
                          />
                        </QuestionLayout>
                      )}

                      {currentStep === 'email' && (
                        <QuestionLayout
                          title="Qual e o seu email?"
                          description="Assim tambem conseguimos te enviar informacoes se precisar."
                        >
                          <input
                            autoFocus
                            type="email"
                            value={form.email}
                            onChange={(event) =>
                              updateField('email', event.target.value)
                            }
                            placeholder="voce@email.com"
                            className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-4 text-base outline-none placeholder:text-white/25 focus:border-cyan-300"
                          />
                        </QuestionLayout>
                      )}

                      {currentStep === 'jaTreina' && (
                        <QuestionLayout
                          title="Voce ja treina hoje?"
                          description="Isso ajuda a equipe a entender seu momento."
                        >
                          <div className="space-y-3">
                            {[
                              { label: 'Sim, ja treino', value: 'sim' },
                              { label: 'Nao treino hoje', value: 'nao' },
                              { label: 'Treino as vezes', value: 'as_vezes' },
                            ].map((option) => (
                              <OptionButton
                                key={option.value}
                                label={option.label}
                                active={form.jaTreina === option.value}
                                onClick={() => {
                                  updateField('jaTreina', option.value)
                                  setTimeout(() => nextStep(), 180)
                                }}
                              />
                            ))}
                          </div>
                        </QuestionLayout>
                      )}

                      {currentStep === 'conheceNTT' && (
                        <QuestionLayout
                          title="Voce ja conhecia o NTT?"
                          description="Queremos entender se esse e seu primeiro contato com a marca."
                        >
                          <div className="space-y-3">
                            {[
                              { label: 'Sim', value: 'sim' },
                              { label: 'Nao', value: 'nao' },
                            ].map((option) => (
                              <OptionButton
                                key={option.value}
                                label={option.label}
                                active={form.conheceNTT === option.value}
                                onClick={() => {
                                  updateField('conheceNTT', option.value)
                                  if (option.value === 'nao') {
                                    updateField('conheceuPorOnde', '')
                                  }
                                  setTimeout(() => nextStep(), 180)
                                }}
                              />
                            ))}
                          </div>
                        </QuestionLayout>
                      )}

                      {currentStep === 'conheceuPorOnde' && (
                        <QuestionLayout
                          title="Por onde voce conheceu o NTT?"
                          description="Instagram, indicacao, rua, evento ou outro canal."
                        >
                          <input
                            autoFocus
                            type="text"
                            value={form.conheceuPorOnde}
                            onChange={(event) =>
                              updateField('conheceuPorOnde', event.target.value)
                            }
                            placeholder="Ex: Instagram, indicacao, evento..."
                            className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-4 text-base outline-none placeholder:text-white/25 focus:border-cyan-300"
                          />
                        </QuestionLayout>
                      )}

                      {currentStep === 'melhorHorario' && (
                        <QuestionLayout
                          title="Qual e o seu melhor horario para agendar suas 5 aulas gratis?"
                          description="Escolha a faixa que faz mais sentido para sua rotina."
                        >
                          <div className="space-y-3">
                            {horarios.map((horario) => (
                              <OptionButton
                                key={horario}
                                label={horario}
                                active={form.melhorHorario === horario}
                                onClick={() => {
                                  updateField('melhorHorario', horario)
                                  setTimeout(() => handleSubmit(), 220)
                                }}
                                disabled={sending}
                              />
                            ))}
                          </div>
                        </QuestionLayout>
                      )}
                    </motion.div>
                  </AnimatePresence>
                </div>

                {submitError ? (
                  <p className="mt-4 rounded-xl border border-red-300/30 bg-red-300/10 px-3 py-2 text-xs text-red-100">
                    {submitError}
                  </p>
                ) : null}

                {useFooterActionButtons ? (
                  <div className="mt-8">
                    {step < steps.length - 1 ? (
                      <button
                        type="button"
                        onClick={nextStep}
                        disabled={!isCurrentStepValid() || sending}
                        className="w-full rounded-2xl bg-gradient-to-r from-cyan-300 to-white px-4 py-3.5 text-sm font-semibold text-black transition disabled:cursor-not-allowed disabled:opacity-35"
                      >
                        Continuar
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={handleSubmit}
                        disabled={!isCurrentStepValid() || sending}
                        className="w-full rounded-2xl bg-gradient-to-r from-cyan-300 to-white px-4 py-3.5 text-sm font-semibold text-black transition disabled:cursor-not-allowed disabled:opacity-35"
                      >
                        {sending ? 'Enviando...' : 'Finalizar cadastro'}
                      </button>
                    )}
                  </div>
                ) : null}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}

function QuestionLayout({
  title,
  description,
  children,
}: {
  title: string
  description?: string
  children: ReactNode
}) {
  return (
    <div>
      <h1 className="text-[1.95rem] font-semibold leading-[1.08] tracking-[-0.04em]">
        {title}
      </h1>

      {description ? (
        <p className="mt-3 max-w-[30ch] text-sm leading-6 text-white/64">
          {description}
        </p>
      ) : null}

      <div className="mt-8">{children}</div>
    </div>
  )
}

function OptionButton({
  label,
  active,
  onClick,
  disabled = false,
}: {
  label: string
  active: boolean
  onClick: () => void
  disabled?: boolean
}) {
  return (
    <motion.button
      type="button"
      whileTap={{ scale: disabled ? 1 : 0.985 }}
      whileHover={{ scale: disabled ? 1 : 1.01 }}
      onClick={onClick}
      disabled={disabled}
      className={`w-full rounded-2xl border px-4 py-4 text-left text-sm font-medium transition ${
        active
          ? 'border-cyan-300/50 bg-cyan-300/12 text-cyan-100'
          : 'border-white/10 bg-black/20 text-white/86'
      } disabled:cursor-not-allowed disabled:opacity-50`}
    >
      {label}
    </motion.button>
  )
}

function IntroCard({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/20 px-4 py-4 text-sm text-white/74">
      {children}
    </div>
  )
}

function BackgroundGlow() {
  return (
    <>
      <div className="pointer-events-none absolute left-1/2 top-[-140px] h-[320px] w-[320px] -translate-x-1/2 rounded-full bg-cyan-300/10 blur-3xl" />
      <div className="pointer-events-none absolute bottom-[-120px] left-[-60px] h-[240px] w-[240px] rounded-full bg-white/5 blur-3xl" />
      <div className="pointer-events-none absolute right-[-80px] top-[30%] h-[260px] w-[260px] rounded-full bg-cyan-200/5 blur-3xl" />
    </>
  )
}

function NTTLogo({
  small = false,
  tiny = false,
}: {
  small?: boolean
  tiny?: boolean
}) {
  const size = tiny ? 28 : small ? 60 : 90

  return (
    <div
      className="relative flex items-center justify-center"
      style={{ width: size, height: size }}
    >
      <img
        src="/ntt-logo-silver.svg"
        alt="NTT"
        className="h-full w-full object-contain drop-shadow-[0_10px_30px_rgba(255,255,255,0.10)]"
      />
    </div>
  )
}

