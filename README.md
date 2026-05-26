# Terminho

Minijogos de palavras em portugues para jogar a dois:

- **Termooo**: descubra a palavra de 5 letras.
- **Contexto**: tente chegar na palavra secreta por associacao.
- **Conexo**: encontre 4 grupos de 4 palavras conectadas.

O projeto e estatico, sem backend e sem dependencias de build. Isso deixa o deploy gratuito bem simples.
A cada recarregamento, os jogos sorteiam novos desafios aleatorios.

## Rodar com Docker

```bash
docker compose up --build
```

Depois abra:

```text
http://localhost:8080
```

## Rodar sem Docker

Como e um app estatico, tambem da para abrir `index.html` direto no navegador.

## Deploy gratis

Opcoes simples:

- **GitHub Pages**: ideal para este projeto, porque nao precisa de servidor.
- **Cloudflare Pages**: tambem gratuito e automatico a cada push.
- **Render Static Site**: funciona bem para app estatico.

Para GitHub Pages:

1. Crie um repo chamado `terminho`.
2. Envie estes arquivos para a branch `main`.
3. No GitHub, abra `Settings` > `Pages`.
4. Em `Build and deployment`, selecione `Deploy from a branch`.
5. Escolha `main` e `/root`.

## Proximos passos bons

- Aumentar as listas de palavras e desafios.
- Adicionar modo "desafio do casal" com uma palavra escolhida por voces.
- Salvar placares no navegador com `localStorage`.
- Criar compartilhamento bonito para Contexto e Conexo.
