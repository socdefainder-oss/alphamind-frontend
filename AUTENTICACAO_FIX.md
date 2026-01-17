# Correções de Autenticação - Portal AlphaMind

## Problema Identificado

Os usuários criados no portal estavam "sumindo" ou ficando inválidos após algum tempo, impossibilitando o login e exigindo a criação de uma nova conta.

### Causa Raiz

A aplicação estava fazendo apenas uma verificação local (localStorage) para autenticação, sem validar com o backend se o token ainda era válido. Isso causava os seguintes problemas:

1. **Tokens expirados continuavam sendo aceitos** - A aplicação só verificava se existia um token, não se ele era válido
2. **Nenhuma validação com o servidor** - Não havia comunicação com o backend para confirmar a validade do token
3. **Tokens não eram enviados nas requisições** - O axios não estava configurado para incluir o token automaticamente

## Soluções Implementadas

### 1. Interceptor de Autenticação no Axios ([api.js](src/services/api.js))

**Antes:**
```javascript
const api = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});
```

**Depois:**
- ✅ Adiciona automaticamente o token em todas as requisições via header `Authorization: Bearer ${token}`
- ✅ Intercepta respostas 401/403 (token inválido/expirado)
- ✅ Remove automaticamente tokens inválidos do localStorage
- ✅ Redireciona para login quando detecta token inválido

### 2. Hook de Validação de Autenticação ([src/hooks/useAuth.js](src/hooks/useAuth.js))

Novo hook customizado que:
- ✅ Valida o token com o backend ao carregar páginas protegidas
- ✅ Faz requisição GET para `/me` (ou endpoint de validação do seu backend)
- ✅ Retorna dados do usuário autenticado
- ✅ Mostra loading durante validação
- ✅ Redireciona automaticamente para login se token inválido

**Uso:**
```javascript
const { isLoading, isAuthenticated, user } = useAuth();
```

### 3. Atualização de Todas as Páginas Protegidas

Páginas atualizadas:
- [Dashboard.jsx](src/pages/Dashboard.jsx)
- [Jornada.jsx](src/pages/Jornada.jsx)
- [MeusCursos.jsx](src/pages/MeusCursos.jsx)
- [Provas.jsx](src/pages/Provas.jsx)
- [Avisos.jsx](src/pages/Avisos.jsx)
- [Perfil.jsx](src/pages/Perfil.jsx)

**Mudança:**
- ❌ **Antes:** Verificação simples `if (!localStorage.getItem("token"))`
- ✅ **Depois:** Validação real com backend via `useAuth()`
- ✅ Exibe loading durante validação
- ✅ Usa dados reais do usuário quando disponível

### 4. Melhor Tratamento de Erros no Login ([Login.jsx](src/pages/Login.jsx))

Mensagens de erro específicas baseadas no status HTTP:
- **401** - "Email ou senha inválidos"
- **403** - "Sua conta foi suspensa. Entre em contato com o Instituto"
- **500** - "Erro no servidor. Tente novamente em instantes"
- **Sem resposta** - "Sem conexão com o servidor. Verifique sua internet"

## Configuração Necessária no Backend

Para que essas mudanças funcionem corretamente, o backend precisa ter:

### 1. Endpoint de Validação do Usuário

```javascript
// GET /me
// Headers: Authorization: Bearer {token}
// Resposta de sucesso (200):
{
  "nome": "Nome do Aluno",
  "email": "email@example.com",
  // outros dados do usuário...
}

// Resposta de erro:
// 401 - Token inválido ou ausente
// 403 - Token expirado
```

### 2. Validação de Token em Todas as Rotas Protegidas

Certifique-se de que o backend:
- ✅ Valida o header `Authorization: Bearer {token}` em rotas protegidas
- ✅ Retorna **401** ou **403** quando o token é inválido/expirado
- ✅ Implementa expiração de tokens (ex: JWT com exp claim)

### 3. Exemplo de Middleware (Node.js/Express)

```javascript
const jwt = require('jsonwebtoken');

function authMiddleware(req, res, next) {
  const token = req.headers.authorization?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({ error: 'Token não fornecido' });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch (error) {
    return res.status(403).json({ error: 'Token inválido ou expirado' });
  }
}

// Rota de validação
app.get('/me', authMiddleware, async (req, res) => {
  const user = await User.findById(req.userId);
  res.json({
    nome: user.nome,
    email: user.email,
    // outros dados...
  });
});
```

## Benefícios

✅ **Segurança aprimorada** - Validação real de tokens com o backend
✅ **Melhor experiência do usuário** - Mensagens de erro claras e específicas
✅ **Sessão consistente** - Tokens inválidos são automaticamente removidos
✅ **Manutenção facilitada** - Lógica de autenticação centralizada
✅ **Código mais limpo** - Uso de hooks reutilizáveis

## Teste das Mudanças

1. **Criar uma conta** e fazer login
2. **Testar navegação** entre páginas protegidas
3. **No console do navegador**, executar:
   ```javascript
   // Corromper o token
   localStorage.setItem('token', 'token_invalido');
   // Recarregar qualquer página protegida
   location.reload();
   ```
4. **Verificar** se é redirecionado para login automaticamente
5. **Fazer login novamente** e confirmar que funciona normalmente

## Próximos Passos Recomendados

- [ ] Implementar refresh tokens para sessões mais longas
- [ ] Adicionar logout automático após X minutos de inatividade
- [ ] Implementar "lembrar-me" com tokens de longa duração
- [ ] Adicionar logs de auditoria de sessões
