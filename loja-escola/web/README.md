# Nébula Miúda

Uma loja fictícia de objetos impossíveis: invenções com regras improváveis, descritas de um jeito claro e organizadas em uma jornada de compra simples. O checkout é uma simulação educativa e não processa pagamentos.

## Executar

Abra a pasta `web` em um servidor local, como a extensão Live Server do VS Code. O ViaCEP precisa de uma página servida por HTTP/HTTPS para funcionar corretamente.

## Melhorias realizadas

### Conceito e catálogo

**Nébula Miúda** apresenta invenções que ainda não existem, com personalidade curiosa e linguagem acolhedora:

| Produto | Categoria | Regra atendida |
| --- | --- | --- |
| Zéfiro de Bolso | Clima improvável | Cabe em um bolso e começa com Z |
| Pousada Órbita 8 | Microcosmos | Usada no espaço sideral e serve em uma formiga |
| Jardim Nuvem-Cais | Paisagens | Não cabe em um avião |
| Lume de Uma Vez | Luzes efêmeras | É de uso único |

O catálogo compartilhado está em `js/catalog.js`. Cada produto tem preço fictício, descrições, regra, ficha e uma ilustração emoji com texto alternativo.

### HTML e acessibilidade

- As quatro páginas têm idioma, título, descrição, Open Graph e favicon próprios da loja.
- A estrutura usa regiões semânticas, um título principal por página, links para navegação e botões para ações.
- Os formulários têm rótulos associados, grupos com `fieldset`/`legend`, validação e mensagens com `aria-live`.
- A vitrine apresenta busca, categoria e ordenação; a página de produto carrega o item pelo parâmetro `id` e trata identificadores inexistentes.

### CSS e responsividade

- A paleta, os estados de foco, os cartões, a ficha do produto e os resumos do pedido foram personalizados em `css/styles.css`, sobre o grid, componentes e utilitários Bootstrap.
- A vitrine e o checkout se adaptam a telas estreitas; o foco visível e a preferência por movimento reduzido são respeitados.
- As ilustrações são caracteres emoji e não dependem de arquivos de imagem externos.

### JavaScript e compra

- O produto e a quantidade seguem da página de detalhes ao checkout por `sessionStorage`.
- O checkout atualiza subtotal, entrega e total conforme a quantidade (entrega fictícia grátis a partir de R$ 300,00; abaixo disso, R$ 18,00).
- O formulário valida os campos, formata CEP e telefone durante a digitação e oferece feedback acessível.
- A confirmação mostra produto, quantidade, valor e número do pedido. A página de sucesso redireciona à vitrine se não houver uma compra concluída na sessão.
- Apenas o item escolhido e o resumo necessário para exibir a confirmação ficam em `sessionStorage`; não há processamento de pagamento.

### API utilizada

- **ViaCEP** (`https://viacep.com.br/ws/{CEP}/json/`) preenche logradouro, bairro, cidade e UF. O CEP é validado antes da consulta; respostas HTTP inválidas, CEP inexistente, dados de endereço ausentes e falhas de rede recebem mensagens próprias. O número permanece para preenchimento manual.

### Testes e verificações

Executados neste projeto:

- `node --check` nos cinco arquivos JavaScript e `git diff --check`, sem erros.
- Fluxo em navegador servido por HTTP: vitrine → produto Pousada Órbita 8 → checkout → confirmação.
- Busca sem resultados e filtro de categoria; dois produtos válidos (Pousada Órbita 8 e Jardim Nuvem-Cais) e `produto.html?id=999`.
- Alteração da quantidade com recálculo de subtotal, frete e total; submissão de formulário vazio exibindo validações.
- CEP incompleto, CEP real `01001-000` (endereço retornado em São Paulo) e CEP inexistente `99999-999`.
- Falha de rede simulada para o ViaCEP, com mensagem de recuperação. A falha esperada foi registrada no Console pelo tratamento de erro.
- Atualização do checkout preservando o item da sessão e bloqueio do acesso direto a `sucesso.html` sem pedido concluído.
- Em viewport estreita, as páginas principais não apresentaram rolagem horizontal após ajuste de gutters.

Ainda conferir antes da entrega: navegação completa somente por teclado, validação com Lighthouse, telas de tablet e testes manuais em outros navegadores. No fluxo principal, não foram observados erros de JavaScript no Console.

### Dificuldades e decisões

- Para não repetir nem divergir informações entre páginas, os dados dos produtos ficam em um catálogo único e são lidos pelo identificador da URL.
- O resumo de compra usa dados da sessão e recalcula os totais no checkout, em vez de manter preços fixos no HTML.
- Os endereços e pagamentos são apenas simulados; nenhum dado de pagamento é solicitado ou transmitido.

### Integrantes

- Preencher com os nomes dos integrantes do grupo.
