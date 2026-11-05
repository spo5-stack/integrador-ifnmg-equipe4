import type { ClipboardEvent, KeyboardEvent } from "react"
import { useRef } from "react"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

export const TAMANHO_CODIGO = 6

type CodigoOtpInputProps = {
  value: string[]
  onChange: (digitos: string[]) => void
  invalid?: boolean
  ariaDescribedBy?: string
  disabled?: boolean
}

export function CodigoOtpInput({
  value,
  onChange,
  invalid = false,
  ariaDescribedBy,
  disabled = false,
}: CodigoOtpInputProps) {
  const referencias = useRef<(HTMLInputElement | null)[]>([])

  function focarPosicao(indice: number): void {
    referencias.current[indice]?.focus()
  }

  function preencherAPartir(indice: number, texto: string): void {
    const proximos = value.slice()

    for (let posicao = 0; posicao < texto.length; posicao++) {
      const destino = indice + posicao
      if (destino >= TAMANHO_CODIGO) break
      proximos[destino] = texto[posicao]
    }

    onChange(proximos)
    focarPosicao(Math.min(indice + texto.length, TAMANHO_CODIGO - 1))
  }

  function handleChange(indice: number, texto: string): void {
    const apenasDigitos = texto.replace(/\D/g, "")

    if (apenasDigitos.length === 0) {
      const proximos = value.slice()
      proximos[indice] = ""
      onChange(proximos)
      return
    }

    if (apenasDigitos.length > 1) {
      preencherAPartir(indice, apenasDigitos)
      return
    }

    const proximos = value.slice()
    proximos[indice] = apenasDigitos
    onChange(proximos)

    if (indice < TAMANHO_CODIGO - 1) focarPosicao(indice + 1)
  }

  function handleKeyDown(
    indice: number,
    evento: KeyboardEvent<HTMLInputElement>
  ): void {
    if (evento.key === "Backspace" && !value[indice] && indice > 0) {
      evento.preventDefault()
      const proximos = value.slice()
      proximos[indice - 1] = ""
      onChange(proximos)
      focarPosicao(indice - 1)
      return
    }

    if (evento.key === "ArrowLeft" && indice > 0) {
      evento.preventDefault()
      focarPosicao(indice - 1)
    }

    if (evento.key === "ArrowRight" && indice < TAMANHO_CODIGO - 1) {
      evento.preventDefault()
      focarPosicao(indice + 1)
    }
  }

  function handlePaste(
    indice: number,
    evento: ClipboardEvent<HTMLInputElement>
  ): void {
    evento.preventDefault()
    const apenasDigitos = evento.clipboardData
      .getData("text")
      .replace(/\D/g, "")

    if (apenasDigitos.length === 0) return
    preencherAPartir(indice, apenasDigitos)
  }

  return (
    <div
      aria-label="Código de verificação de 6 dígitos"
      className="flex items-center justify-center gap-2 sm:gap-3"
      role="group"
    >
      {Array.from({ length: TAMANHO_CODIGO }, (_, indice) => (
        <Input
          aria-describedby={ariaDescribedBy}
          aria-invalid={invalid}
          aria-label={`Dígito ${indice + 1} de ${TAMANHO_CODIGO}`}
          autoComplete={indice === 0 ? "one-time-code" : "off"}
          className={cn(
            "h-14 w-11 rounded-lg border-input bg-muted p-0 text-center font-heading text-xl font-bold focus-visible:ring-2 sm:w-12",
            invalid && "border-destructive"
          )}
          disabled={disabled}
          inputMode="numeric"
          key={indice}
          maxLength={1}
          onChange={(evento) => handleChange(indice, evento.target.value)}
          onFocus={(evento) => evento.target.select()}
          onKeyDown={(evento) => handleKeyDown(indice, evento)}
          onPaste={(evento) => handlePaste(indice, evento)}
          ref={(elemento) => {
            referencias.current[indice] = elemento
          }}
          type="text"
          value={value[indice] ?? ""}
        />
      ))}
    </div>
  )
}
