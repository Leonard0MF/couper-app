# Barbearia Couper

## Rodar

```bash
npm install      # só na primeira vez
npm run dev      # abre em http://localhost:5173
npm run build    # gera a versão final em dist/
```

## Onde fica cada coisa

```
index.html              estrutura fixa: topo Cliente/Barbearia, barra inferior, toast
src/
  main.js               ponto de entrada: carrega CSS, dados e desenha a tela
  utils.js              helpers (datas, dinheiro, escape), ícones e a logo
  state.js              dados (S), estado da tela (ui), dados de exemplo, salvar/carregar
  rules.js              regras: horários livres, Clube, pontos, agendar, concluir
  components.js         peças reutilizadas: toast, títulos, cartão de horário, redimensionar foto
  render.js             escolhe qual tela desenhar + commit (salva e redesenha)
  events.js             todos os cliques e uploads (data-act="...")
  views/
    inicio.js           tela Início
    agendar.js          tela Agendar
    cortes.js           tela Cortes
    clube.js            tela Clube (assinatura)
    pontos.js           tela Pontos (fidelidade)
    painel.js           painel da Barbearia
  styles/               um CSS por seção, com os mesmos nomes das telas
    base.css            cores, fontes e utilitários (mexa aqui para mudar a identidade)
  data/mock.json        TODOS os dados de exemplo (veja abaixo)
  assets/logo.png       logo
```

Para mudar uma tela, edite o arquivo dela em `views/` e o CSS correspondente em `styles/`.
Para criar uma ação nova em um botão, use `data-act="nome"` no HTML e trate em `events.js`.

## Dados de exemplo (`src/data/mock.json`)

É só editar o JSON e salvar: o app detecta a mudança e recria os dados sozinho
(as fotos enviadas pela Vitrine são mantidas). O botão "recomeçar" também recria tudo.

| Campo | O que é |
|---|---|
| `shop` | nome, endereço, cidade e horários (`hours`: `"0"` = domingo … `"6"` = sábado; `null` = fechado, `[9, 20]` = 9h às 20h) |
| `services` | serviços: `price` (R$), `min` (duração), `pts` (pontos ganhos), `cut`/`beard` (quanto consome do Clube) |
| `barbers` | barbeiros (`id` é usado na agenda e em `myHistory`) |
| `styles` | cortes da aba Cortes; `sid` = serviço agendado ao tocar em "Quero esse" |
| `plans` | planos do Clube; `best: true` marca o "Mais escolhido" |
| `rewards` | prêmios trocáveis por pontos (`cost` em pontos) |
| `me` | o cliente "logado" na demonstração |
| `myHistory` | atendimentos passados desse cliente (geram os pontos iniciais) |
| `members` | assinantes do Clube que aparecem no painel (`planId` = `id` de um plano) |
| `randomAgenda` | agenda gerada automaticamente: nomes, serviços usados, quantidade por barbeiro/dia, dias antes/depois de hoje e `seed` (mude para sortear outra agenda) |

Cuidado com os `id`: se remover um serviço, barbeiro ou plano, tire também as referências a ele
(`styles[].sid`, `myHistory`, `members[].planId`, `randomAgenda.services`).
