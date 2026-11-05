# Configuração de e-mail para recuperação de senha

Este documento explica como configurar o envio de e-mails do fluxo de
recuperação de senha usando **Nodemailer + Gmail**.

O backend usa SMTP. Sem configuração, em `development`, o código de recuperação é
impresso no log do servidor — útil para testar sem enviar e-mail de verdade. Em
`production`, o envio depende obrigatoriamente de SMTP configurado.

---

## 1. Pré-requisitos

- Uma conta Gmail (pessoal ou Google Workspace).
- Verificação em duas etapas ativada na conta.
- Acesso às configurações de segurança da conta.

> **Não use a senha normal do Gmail.** O Gmail exige uma **senha de app**
> (App Password) para SMTP. A senha normal é rejeitada.

---

## 2. Ativar a verificação em duas etapas

1. Acesse <https://myaccount.google.com/security>.
2. Em **Como você faz login no Google**, clique em **Verificação em duas etapas**.
3. Conclua a configuração (celular, chave de segurança ou outro método).

A opção de senha de app só aparece depois que a verificação em duas etapas está
ativa.

---

## 3. Gerar a senha de app

1. Acesse <https://myaccount.google.com/apppasswords>.
   - Se o link não abrir, vá em **Segurança** → **Senhas de app**.
2. Dê um nome para o app, por exemplo `Integrador Aves Backend`.
3. Clique em **Criar**.
4. O Google mostra uma senha de **16 caracteres**, algo como:

   ```text
   abcd efgh ijkl mnop
   ```

5. Copie a senha e guarde-a. Ela não é exibida novamente.

> Remova os espaços ao colar no `.env`:
> `abcdefghijklmnop`.

### Se a opção “Senhas de app” não aparecer

- A verificação em duas etapas não está ativa.
- A conta é de uma organização (Google Workspace) e o administrador bloqueou
  senhas de app.
- A conta usa **Advanced Protection Program**, que não permite senhas de app.
- A conta é muito nova ou tem restrições de segurança.

Nesses casos, use outro provedor SMTP (veja a seção “Alternativas” abaixo).

---

## 4. Configurar o `.env`

No arquivo `backend/.env`, adicione:

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=seuemail@gmail.com
SMTP_PASS=abcdefghijklmnop
MAIL_FROM="Monitoramento Avícola <seuemail@gmail.com>"
```

### O que cada variável faz

| Variável | Obrigatória | Exemplo | Descrição |
| --- | --- | --- | --- |
| `SMTP_HOST` | Sim (para enviar) | `smtp.gmail.com` | Servidor SMTP |
| `SMTP_PORT` | Não | `587` | Porta SMTP (default `587`) |
| `SMTP_SECURE` | Não | `false` | `true` para TLS direto (porta 465); `false` para STARTTLS (porta 587) |
| `SMTP_USER` | Sim (para enviar) | `seuemail@gmail.com` | Conta autenticada no SMTP |
| `SMTP_PASS` | Sim (para enviar) | `abcdefghijklmnop` | Senha de app de 16 caracteres, sem espaços |
| `MAIL_FROM` | Não | `"Monitoramento Avícola <seuemail@gmail.com>"` | Remetente exibido. Se omitido, usa `SMTP_USER` |

O backend considera o SMTP configurado quando `SMTP_HOST`, `SMTP_USER` e
`SMTP_PASS` estão preenchidos.

> O arquivo `.env` não deve ser commitado. Ele já deve estar no `.gitignore`.
> Use o `.env.example` apenas como referência, sem segredos reais.

---

## 5. Reiniciar o servidor

Variáveis de ambiente são lidas na inicialização. Depois de editar o `.env`:

```bash
npm run dev
```

---

## 6. Testar o envio

Com o servidor rodando:

```bash
curl -i -X POST http://localhost:3333/api/auth/forgot-password \
  -H 'Content-Type: application/json' \
  -d '{"email":"seuemail@gmail.com"}'
```

Resposta esperada:

```http
HTTP/1.1 200 OK

{ "mensagem": "Se o e-mail estiver cadastrado, enviaremos um código." }
```

Se o e-mail estiver cadastrado, o código chega na caixa de entrada. Se não
chegar, verifique:

1. o log do servidor (pode haver erro de SMTP);
2. a pasta de spam;
3. se o e-mail informado realmente existe no banco.

### Comportamento sem SMTP

Em `development`, sem `SMTP_HOST`/`SMTP_USER`/`SMTP_PASS`, o código aparece no
log:

```text
[recuperacao-senha] Código para maria@exemplo.com: 123456
```

Em `production`, a ausência de SMTP faz o envio falhar. O erro é registrado no
log do servidor e nenhum código é impresso.

---

## 7. Alternativa: porta 465 com TLS direto

Se a porta 587 estiver bloqueada na sua rede, use:

```env
SMTP_PORT=465
SMTP_SECURE=true
```

Mantenha as demais variáveis iguais.

---

## 8. Alternativas ao Gmail

O backend usa SMTP genérico; qualquer provedor compatível funciona:

| Provedor | Host | Porta | Secure |
| --- | --- | --- | --- |
| Gmail | `smtp.gmail.com` | `587` | `false` |
| Outlook/Microsoft 365 | `smtp.office365.com` | `587` | `false` |
| Brevo | `smtp-relay.brevo.com` | `587` | `false` |
| Mailgun | `smtp.mailgun.org` | `587` | `false` |
| Amazon SES | `email-smtp.<região>.amazonaws.com` | `587` | `false` |

Nesses casos, `SMTP_USER` e `SMTP_PASS` são as credenciais SMTP do provedor, que
podem ser diferentes do e-mail de login.

---

## 9. Problemas comuns

### `Invalid login: 535-5.7.8 Username and Password not accepted`

- A senha usada não é uma senha de app.
- A senha de app foi revogada ou expirou.
- A verificação em duas etapas foi desativada.
- Há espaços na senha; remova-os.

Gere uma nova senha de app e atualize `SMTP_PASS`.

### `Connection timeout` ou `ETIMEDOUT`

- Porta 587/465 bloqueada pela rede ou firewall.
- Tente a porta 465 com `SMTP_SECURE=true`.
- Verifique se o servidor tem saída para a internet.

### `self-signed certificate` / erro de TLS

- Normalmente indica proxy ou interceptação TLS na rede.
- Em ambiente corporativo, use o provedor SMTP permitido pela organização.

### E-mail chega, mas cai no spam

- Gmail pessoal tem limites e reputação limitada para envio automatizado.
- Para volume maior, use um provedor transacional (Brevo, Mailgun, SES etc.).
- Configure SPF/DKIM no domínio do remetente, se aplicável.

### `MAIL_FROM` rejeitado

No Gmail, o remetente geralmente precisa ser a própria conta autenticada ou um
alias autorizado. Se tiver dúvida, omita `MAIL_FROM` e o backend usará
`SMTP_USER`.

---

## 10. Segurança

- Trate `SMTP_PASS` como segredo: nunca commite, nunca exponha em logs.
- Revogue senhas de app que não são mais usadas em
  <https://myaccount.google.com/apppasswords>.
- Se a senha vazar, revogue-a imediatamente e gere outra.
- Em produção, use um provedor transacional com domínio verificado e limites
  adequados.
- O código de recuperação tem validade de 10 minutos, uso único, é armazenado
  com hash e o fluxo tem rate limit por e-mail e por IP.
