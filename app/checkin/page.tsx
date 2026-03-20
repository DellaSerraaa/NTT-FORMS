import Image from 'next/image'
import Link from 'next/link'

export default function CheckinPage() {
  return (
    <main className="min-h-screen bg-[#0a0a0a] px-4 py-10 text-white">
      <section className="mx-auto flex w-full max-w-md flex-col items-center rounded-3xl border border-white/10 bg-white/[0.04] p-6 text-center shadow-[0_20px_80px_rgba(0,0,0,0.45)] backdrop-blur-xl">
        <p className="rounded-full border border-cyan-300/15 bg-cyan-300/10 px-3 py-1 text-xs font-medium text-cyan-200">
          NTT Studio
        </p>

        <h1 className="mt-4 text-2xl font-semibold tracking-[-0.03em]">
          Cadastro rapido do evento
        </h1>

        <p className="mt-3 text-sm leading-6 text-white/70">
          Escaneie o QR Code abaixo para abrir o formulario oficial de cadastro.
        </p>

        <div className="mt-6 overflow-hidden rounded-2xl border border-white/10 bg-white p-3">
          <Image
            src="/qr_ntt_forms.png"
            alt="QR Code do formulario NTT Studio"
            width={320}
            height={320}
            priority
            className="h-auto w-full max-w-[320px]"
          />
        </div>

        <Link
          href="/"
          className="mt-6 w-full rounded-2xl bg-gradient-to-r from-cyan-300 to-white px-4 py-3 text-sm font-semibold text-black"
        >
          Abrir formulario agora
        </Link>
      </section>
    </main>
  )
}
