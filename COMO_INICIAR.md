# 🚀 Como Iniciar o Sistema GAV Rubix

## ⚠️ Erro "Proxy erro" ou "Unexpected token"

Este erro significa que o **backend não está rodando**. Siga os passos abaixo:

---

## 📋 Passo a Passo para Iniciar

### 1️⃣ Iniciar o Backend (Flask)

Abra um terminal na pasta do projeto e execute:

```bash
cd backend
python run.py
```

**Ou se estiver usando conda/anaconda:**

```bash
cd backend
conda activate seu-ambiente
python run.py
```

**Você deve ver:**
```
 * Running on http://127.0.0.1:5000
 * Debug mode: on
```

✅ **Mantenha este terminal aberto!**

---

### 2️⃣ Iniciar o Frontend (React)

Abra **outro terminal** (deixe o backend rodando) e execute:

```bash
cd frontend
npm start
```

**Você deve ver:**
```
Compiled successfully!
Local: http://localhost:3000
```

---

### 3️⃣ Acessar o Admin Console

1. Abra o navegador em: `http://localhost:3000`
2. No menu lateral, clique em **"Admin Console"**
3. Você verá a seção **"Configuração de Temas"**
4. Localize o card **"Trabalho Híbrido"**
5. Clique no accordion **"📁 Configuração de Arquivos"** para expandir
6. Adicione os 2 arquivos Excel do SharePoint

---

## 🔍 Verificar se está funcionando

### Backend está rodando?
- Acesse: `http://127.0.0.1:5000/api/admin/themes`
- Deve retornar JSON com os temas

### Frontend está rodando?
- Acesse: `http://localhost:3000`
- Deve abrir a interface do GAV Rubix

---

## ❌ Problemas Comuns

### Erro: "ModuleNotFoundError"
```bash
cd backend
pip install -r requirements.txt
```

### Erro: "Port 5000 already in use"
- Feche outros processos usando a porta 5000
- Ou altere a porta no `backend/run.py`

### Erro: "Cannot find module"
```bash
cd frontend
npm install
```

---

## 📍 Onde Configurar os Arquivos

1. **Admin Console** → Menu lateral
2. **Configuração de Temas** → Seção na página
3. **Card "Trabalho Híbrido"** → Card com o tema
4. **"📁 Configuração de Arquivos"** → Accordion (clique para expandir)
5. **Formulário** → Dentro do accordion expandido
   - Campo: "URL do Arquivo SharePoint"
   - Campo: "Nome do Arquivo (opcional)"
   - Botão: "Adicionar Arquivo"

---

## ✅ Checklist

- [ ] Backend rodando em `http://127.0.0.1:5000`
- [ ] Frontend rodando em `http://localhost:3000`
- [ ] Navegador aberto no Admin Console
- [ ] Accordion "Configuração de Arquivos" expandido
- [ ] Formulário de adicionar arquivo visível

