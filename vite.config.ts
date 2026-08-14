import { configDefaults, defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    // `.claude/worktrees/` guarda checkouts INTEIROS do repo (worktrees dos
    // executores do harness). Sem este exclude o vitest daqui varre as cópias,
    // roda cada teste em dobro e mistura o React de lá com o react-dom daqui —
    // dois Reacts, hook quebrado, falha que não existe em lugar nenhum de
    // verdade. Os testes de uma worktree rodam NELA; aqui, só os do repo.
    exclude: [...configDefaults.exclude, '.claude/**'],
  },
});
