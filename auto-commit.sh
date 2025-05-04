#!/bin/bash

# Adiciona todas as mudanças
git add .

# Gera uma lista dos arquivos alterados
CHANGED_FILES=$(git diff --cached --name-only | tr '\n' ',' | sed 's/,$//')

# Cria a mensagem de commit padronizada (ajuste o tipo conforme seu fluxo)
COMMIT_MSG="chore: auto-commit [$CHANGED_FILES] em $(date '+%Y-%m-%d %H:%M:%S')"

# Faz o commit
git commit -m "$COMMIT_MSG"