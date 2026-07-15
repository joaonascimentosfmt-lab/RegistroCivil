const App = {
  currentSection: 'dashboard',
  editingId: null,
  certidaoTipo: null,
  usuarioLogado: null,

  init() {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('sw.js').catch(() => {});
    }
    this.setupNavigation();
    this.atualizarBadges();
    this.iniciarRelogio();
    setInterval(() => this.atualizarBadges(), 5000);

    const session = sessionStorage.getItem('registroCivilUser');
    if (session) {
      const user = JSON.parse(session);
      this.usuarioLogado = user;
      this.mostrarApp();
    } else {
      document.getElementById('loginScreen').classList.remove('hidden');
    }
  },

  login(event) {
    event.preventDefault();
    const login = document.getElementById('loginUser').value.trim();
    const senha = document.getElementById('loginPass').value;
    const errorEl = document.getElementById('loginError');

    const user = Db.autenticar(login, senha);
    if (!user) {
      errorEl.classList.add('show');
      document.getElementById('loginPass').value = '';
      document.getElementById('loginUser').focus();
      return false;
    }

    errorEl.classList.remove('show');
    this.usuarioLogado = user;
    sessionStorage.setItem('registroCivilUser', JSON.stringify(user));
    this.mostrarApp();
    return false;
  },

  logout() {
    this.usuarioLogado = null;
    sessionStorage.removeItem('registroCivilUser');
    document.getElementById('loginScreen').classList.remove('hidden');
    document.querySelector('.sidebar').classList.remove('open');
    document.getElementById('loginUser').value = '';
    document.getElementById('loginPass').value = '';
    document.getElementById('loginUser').focus();
  },

  mostrarApp() {
    document.getElementById('loginScreen').classList.add('hidden');
    const avatar = document.getElementById('userAvatar');
    const nameEl = document.getElementById('userName');
    const info = document.getElementById('userInfo');
    if (this.usuarioLogado) {
      avatar.textContent = (this.usuarioLogado.nome || this.usuarioLogado.login)[0].toUpperCase();
      nameEl.textContent = this.usuarioLogado.nome || this.usuarioLogado.login;
      info.style.display = 'flex';
    }
    this.navigateTo('dashboard');
  },

  atualizarBadges() {
    const tipos = ['nascimento', 'casamento', 'obito', 'livro-e'];
    tipos.forEach(t => {
      const el = document.getElementById('badge-' + t);
      if (el) el.textContent = Db.count(t);
    });
  },

  iniciarRelogio() {
    const atualizar = () => {
      const el = document.getElementById('clock');
      if (el) el.textContent = new Date().toLocaleString('pt-BR');
    };
    atualizar();
    setInterval(atualizar, 10000);
  },

  /* Navigation */
  setupNavigation() {
    document.querySelectorAll('.nav-item').forEach(el => {
      el.addEventListener('click', () => {
        const section = el.dataset.section;
        if (section) this.navigateTo(section);
      });
    });
    document.querySelector('.menu-toggle')?.addEventListener('click', () => {
      document.querySelector('.sidebar').classList.toggle('open');
    });
    document.querySelectorAll('.modal-close, .modal-overlay').forEach(el => {
      el.addEventListener('click', (e) => {
        if (e.target === el) document.querySelector('.modal-overlay').classList.remove('open');
      });
    });
  },

  navigateTo(section, params) {
    this.currentSection = section;
    this.editingId = null;

    document.querySelectorAll('.nav-item').forEach(el => {
      el.classList.toggle('active', el.dataset.section === section);
    });

    document.querySelectorAll('.section').forEach(el => el.classList.remove('active'));
    const target = document.getElementById('section-' + section);
    if (target) target.classList.add('active');

    document.querySelector('.sidebar').classList.remove('open');

    const titles = {
      dashboard: 'Dashboard',
      nascimento: 'Registro de Nascimento',
      casamento: 'Registro de Casamento',
      obito: 'Registro de Óbito',
      livroE: 'Registro - Livro E',
      certidao: 'Emissão de Certidão',
      consulta: 'Consulta de Registros'
    };
    document.querySelector('.top-bar h2').textContent = titles[section] || 'Sistema';

    switch (section) {
      case 'dashboard': this.loadDashboard(); break;
      case 'nascimento': this.loadTabela('nascimento'); break;
      case 'casamento': this.loadTabela('casamento'); break;
      case 'obito': this.loadTabela('obito'); break;
      case 'livroE': this.loadTabela('livro-e'); break;
      case 'certidao': this.loadCertidao(params); break;
      case 'consulta': this.loadConsulta(); break;
    }
  },

  /* Dashboard */
  loadDashboard() {
    const container = document.querySelector('#section-dashboard .card-body');
    const tipos = [
      { key: 'nascimento', label: 'Nascimentos', icon: '👶', cls: 'blue' },
      { key: 'casamento', label: 'Casamentos', icon: '💍', cls: 'green' },
      { key: 'obito', label: 'Óbitos', icon: '⚰️', cls: 'red' },
      { key: 'livro-e', label: 'Livro E', icon: '📚', cls: 'gold' }
    ];

    let html = '<div class="stats-grid">';
    tipos.forEach(t => {
      const count = Db.count(t.key);
      html += `
        <div class="stat-card" style="cursor:pointer" onclick="App.navigateTo('${t.key}')">
          <div class="stat-icon ${t.cls}">${t.icon}</div>
          <div class="stat-info">
            <h4>${count}</h4>
            <p>${t.label}</p>
          </div>
        </div>`;
    });
    html += '</div>';

    const recentes = Db.getAll().sort((a, b) => b.createdAt?.localeCompare(a.createdAt)).slice(0, 10);
    html += '<div class="card"><div class="card-header"><h3>Registros Recentes</h3></div><div class="card-body">';
    if (recentes.length === 0) {
      html += '<div class="empty-state"><div class="icon">📋</div><h3>Nenhum registro ainda</h3><p>Utilize o menu ao lado para iniciar os registros.</p></div>';
    } else {
      html += '<div class="table-container"><table><thead><tr><th>Matrícula</th><th>Tipo</th><th>Registrado</th><th>Data</th><th>Ações</th></tr></thead><tbody>';
      recentes.forEach(r => {
        const nome = r.nome || r.nomeConjuge1 || r.nomeFalecido || r.partesEnvolvidas || '-';
        const tipoLabel = this.getTipoLabel(r.tipo);
        const mat = r.matricula || '-';
        html += `<tr><td><strong>${this.escapeHtml(mat)}</strong></td><td>${tipoLabel}</td><td>${this.escapeHtml(nome)}</td><td>${this.formatDate(r.createdAt)}</td>
          <td class="actions-cell">
            <button class="btn btn-outline btn-sm" onclick="App.verDetalhe('${r.id}')">👁️</button>
          </td></tr>`;
      });
      html += '</tbody></table></div>';
    }
    html += '</div></div>';
    container.innerHTML = html;
  },

  /* Tabela de registros por tipo */
  loadTabela(tipo) {
    const section = tipo === 'livro-e' ? 'livroE' : tipo;
    const container = document.querySelector(`#section-${section} .table-container`);
    const registros = Db.getAll(tipo).sort((a, b) => b.createdAt?.localeCompare(a.createdAt));
    const tipoLabel = this.getTipoLabel(tipo);

    let html = `<div style="display:flex;gap:12px;margin-bottom:16px;flex-wrap:wrap;align-items:end">
      <div style="flex:1;min-width:200px">
        <input type="text" id="search-${tipo}" placeholder="Buscar..." class="form-group" style="padding:8px 12px;border:1px solid var(--border);border-radius:6px;width:100%" oninput="App.buscarNaTabela('${tipo}')">
      </div>
      <button class="btn btn-primary" onclick="App.novoRegistro('${tipo}')">+ Novo Registro</button>
    </div>`;

    if (registros.length === 0) {
      html += '<div class="empty-state"><div class="icon">📋</div><h3>Nenhum registro de ' + tipoLabel.toLowerCase() + '</h3><p>Clique em "Novo Registro" para adicionar.</p></div>';
    } else {
      html += this.buildTabelaHtml(registros, tipo);
    }
    container.innerHTML = html;
  },

  buildTabelaHtml(registros, tipo) {
    let col1 = 'Nome';
    if (tipo === 'casamento') col1 = 'Cônjuge 1';
    else if (tipo === 'obito') col1 = 'Falecido';
    else if (tipo === 'livro-e') col1 = 'Tipo do Ato';

    let html = '<div class="table-container"><table><thead><tr>';
    html += '<th>Índice</th><th>Matrícula</th><th>Termo</th><th>Livro</th><th>Folha</th>';
    html += `<th>${col1}</th><th>Data do Registro</th><th>Certidões</th><th>Ações</th>`;
    html += '</tr></thead><tbody>';

    registros.forEach(r => {
      const nome = r.nome || r.nomeConjuge1 || r.nomeFalecido || r.tipoAto || '-';
      const termo = r.numeroTermo || r.termo || '-';
      const idx = r.indice ? String(r.indice).padStart(3, '0') : '-';
      const mat = r.matricula || '-';
      const qtdCertidoes = (r.certidoes || []).length;
      html += `<tr>
        <td><strong>${idx}</strong></td>
        <td><code style="font-size:12px;background:var(--accent-light);padding:2px 6px;border-radius:4px">${this.escapeHtml(mat)}</code></td>
        <td>${this.escapeHtml(termo)}</td>
        <td>${this.escapeHtml(r.livro || '-')}</td>
        <td>${this.escapeHtml(r.folha || '-')}</td>
        <td><strong>${this.escapeHtml(nome)}</strong></td>
        <td>${this.formatDate(r.dataRegistro)}</td>
        <td>${qtdCertidoes > 0 ? '<span class="badge" style="background:var(--success-bg);color:var(--success)">' + qtdCertidoes + ' emitida(s)</span>' : '<span style="color:var(--text-secondary)">0</span>'}</td>
        <td class="actions-cell">
          <button class="btn btn-outline btn-sm" onclick="App.verDetalhe('${r.id}')" title="Visualizar">👁️</button>
          <button class="btn btn-outline btn-sm" onclick="App.editarRegistro('${r.id}')" title="Editar">✏️</button>
          <button class="btn btn-outline btn-sm" onclick="App.excluirRegistro('${r.id}')" title="Excluir">🗑️</button>
        </td>
      </tr>`;
    });
    html += '</tbody></table></div>';
    return html;
  },

  buscarNaTabela(tipo) {
    const termo = document.getElementById(`search-${tipo}`)?.value || '';
    const section = tipo === 'livro-e' ? 'livroE' : tipo;
    const container = document.querySelector(`#section-${section} .table-container`);
    const registros = Db.search(termo, tipo).sort((a, b) => b.createdAt?.localeCompare(a.createdAt));
    container.innerHTML = registros.length === 0
      ? '<div class="empty-state"><div class="icon">🔍</div><h3>Nenhum resultado</h3></div>'
      : this.buildTabelaHtml(registros, tipo);
  },

  /* Formulário */
  getCampos(tipo) {
    const campos = {
      'nascimento': [
        { id: 'numeroTermo', label: 'Nº do Termo', type: 'text', required: true },
        { id: 'livro', label: 'Livro', type: 'text', required: true },
        { id: 'folha', label: 'Folha', type: 'text', required: true },
        { id: 'dataRegistro', label: 'Data do Registro', type: 'date', required: true },
        { id: 'nome', label: 'Nome do Registrado', type: 'text', required: true },
        { id: 'dataNascimento', label: 'Data de Nascimento', type: 'date', required: true },
        { id: 'sexo', label: 'Sexo', type: 'select', options: ['Masculino', 'Feminino'], required: true },
        { id: 'horaNascimento', label: 'Hora do Nascimento', type: 'time' },
        { id: 'naturalidade', label: 'Naturalidade (Cidade/UF)', type: 'text' },
        { id: 'nomePai', label: 'Nome do Pai', type: 'text' },
        { id: 'profissaoPai', label: 'Profissão do Pai', type: 'text' },
        { id: 'nomeMae', label: 'Nome da Mãe', type: 'text', required: true },
        { id: 'profissaoMae', label: 'Profissão da Mãe', type: 'text' },
      ],
      'casamento': [
        { id: 'numeroTermo', label: 'Nº do Termo', type: 'text', required: true },
        { id: 'livro', label: 'Livro', type: 'text', required: true },
        { id: 'folha', label: 'Folha', type: 'text', required: true },
        { id: 'dataRegistro', label: 'Data do Registro', type: 'date', required: true },
        { id: 'nomeConjuge1', label: 'Nome do Cônjuge 1', type: 'text', required: true },
        { id: 'nomeConjuge2', label: 'Nome do Cônjuge 2', type: 'text', required: true },
        { id: 'dataCasamento', label: 'Data do Casamento', type: 'date', required: true },
        { id: 'regimeBens', label: 'Regime de Bens', type: 'select', options: ['Comunhão Universal', 'Comunhão Parcial', 'Separação Total de Bens', 'Participação Final nos Aquestos'], required: true },
      ],
      'obito': [
        { id: 'numeroTermo', label: 'Nº do Termo', type: 'text', required: true },
        { id: 'livro', label: 'Livro', type: 'text', required: true },
        { id: 'folha', label: 'Folha', type: 'text', required: true },
        { id: 'dataRegistro', label: 'Data do Registro', type: 'date', required: true },
        { id: 'nomeFalecido', label: 'Nome do Falecido', type: 'text', required: true },
        { id: 'dataObito', label: 'Data do Óbito', type: 'date', required: true },
        { id: 'causaObito', label: 'Causa do Óbito', type: 'text' },
        { id: 'localObito', label: 'Local do Óbito', type: 'text' },
      ],
      'livro-e': [
        { id: 'numeroTermo', label: 'Nº do Termo', type: 'text', required: true },
        { id: 'livro', label: 'Livro', type: 'text', required: true },
        { id: 'folha', label: 'Folha', type: 'text', required: true },
        { id: 'dataRegistro', label: 'Data do Registro', type: 'date', required: true },
        { id: 'tipoAto', label: 'Tipo do Ato', type: 'text', required: true },
        { id: 'partesEnvolvidas', label: 'Partes Envolvidas', type: 'text' },
        { id: 'descricao', label: 'Descrição', type: 'textarea' },
      ]
    };
    return campos[tipo] || [];
  },

  novoRegistro(tipo) {
    this.editingId = null;
    this.renderForm(tipo);
  },

  editarRegistro(id) {
    const registro = Db.getById(id);
    if (!registro) return;
    this.editingId = id;
    this.renderForm(registro.tipo, registro);
  },

  renderForm(tipo, data) {
    const section = tipo === 'livro-e' ? 'livroE' : tipo;
    const container = document.querySelector(`#section-${section} .table-container`);
    const campos = this.getCampos(tipo);
    const titulo = data ? 'Editar Registro' : 'Novo Registro';

    const indiceDisplay = data ? String(data.indice || '').padStart(3, '0') : Db.count(tipo) + 1;
    const matriculaDisplay = data ? (data.matricula || '-') : Db._gerarMatricula(tipo, Db.count(tipo) + 1);

    let html = `<div class="card"><div class="card-header"><h3>${titulo}</h3>
      <button class="btn btn-outline btn-sm" onclick="App.loadTabela('${tipo}')">← Voltar</button>
    </div><div class="card-body">`;

    html += `<div class="form-grid" style="margin-bottom:16px;padding:12px;background:var(--primary-lighter);border-radius:6px">`;
    html += `<div class="form-group"><label>Índice</label><input type="text" value="${indiceDisplay}" disabled style="background:var(--bg);font-weight:700;font-size:16px"></div>`;
    html += `<div class="form-group"><label>Matrícula</label><input type="text" value="${matriculaDisplay}" disabled style="background:var(--bg);font-weight:700;font-size:14px"></div>`;
    html += '</div>';

    html += `<form id="form-${tipo}" onsubmit="return App.salvar(event, '${tipo}')">`;
    html += '<div class="form-grid">';

    campos.forEach(c => {
      const value = data ? (data[c.id] || '') : '';
      const req = c.required ? 'required' : '';
      if (c.type === 'select') {
        const opts = c.options.map(o => `<option value="${o}" ${value === o ? 'selected' : ''}>${o}</option>`).join('');
        html += `<div class="form-group">
          <label for="${c.id}">${c.label}${c.required ? ' *' : ''}</label>
          <select id="${c.id}" ${req}>${opts}</select>
        </div>`;
      } else if (c.type === 'textarea') {
        html += `<div class="form-group full">
          <label for="${c.id}">${c.label}${c.required ? ' *' : ''}</label>
          <textarea id="${c.id}" ${req}>${this.escapeHtml(value)}</textarea>
        </div>`;
      } else {
        html += `<div class="form-group">
          <label for="${c.id}">${c.label}${c.required ? ' *' : ''}</label>
          <input type="${c.type}" id="${c.id}" value="${this.escapeHtml(value)}" ${req}>
        </div>`;
      }
    });

    html += '<div class="form-group full"><label for="observacoes">Observações</label><textarea id="observacoes">' +
      (data ? this.escapeHtml(data.observacoes || '') : '') + '</textarea></div>';

    html += '</div>';

    html += `<div class="form-actions">
      <button type="button" class="btn btn-outline" onclick="App.loadTabela('${tipo}')">Cancelar</button>
      <button type="submit" class="btn btn-primary">💾 Salvar Registro</button>
    </div>`;

    html += '</form></div></div>';
    container.innerHTML = html;
  },

  salvar(event, tipo) {
    event.preventDefault();
    const campos = this.getCampos(tipo);
    const data = { tipo };

    campos.forEach(c => {
      const el = document.getElementById(c.id);
      if (el) data[c.id] = el.value;
    });

    const obs = document.getElementById('observacoes');
    if (obs) data.observacoes = obs.value;

    if (this.editingId) {
      const original = Db.getById(this.editingId);
      if (original) {
        Object.assign(data, { id: original.id, createdAt: original.createdAt, certidoes: original.certidoes || [] });
      }
    }

    const saved = Db.save(data);
    this.showToast('Registro salvo com sucesso! Termo nº ' + (saved.numeroTermo || ''), 'success');
    this.atualizarBadges();
    this.loadTabela(tipo);
  },

  excluirRegistro(id) {
    if (!confirm('Tem certeza que deseja excluir este registro?')) return;
    const registro = Db.getById(id);
    Db.delete(id);
    this.atualizarBadges();
    this.showToast('Registro excluído.', 'warning');
    if (registro) this.loadTabela(registro.tipo);
  },

  /* Detalhes */
  verDetalhe(id) {
    const r = Db.getById(id);
    if (!r) return;

    const container = document.querySelector('.modal-body');
    const tipoLabel = this.getTipoLabel(r.tipo);
    const campos = this.getCampos(r.tipo);

    const idx = r.indice ? String(r.indice).padStart(3, '0') : '-';
    const mat = r.matricula || '-';

    let html = `<div style="margin-bottom:16px;display:flex;gap:12px;align-items:center;flex-wrap:wrap">
      <span class="badge" style="background:var(--primary-lighter);color:var(--primary);font-size:13px;padding:4px 12px">${tipoLabel}</span>
      <span class="badge" style="background:var(--accent-light);color:#92400e;font-size:13px;padding:4px 12px">Índice ${idx}</span>
      <span class="badge" style="background:var(--success-bg);color:var(--success);font-size:13px;padding:4px 12px;font-family:monospace">${this.escapeHtml(mat)}</span>
    </div>`;
    html += '<div class="detail-grid">';

    campos.forEach(c => {
      const val = r[c.id] || '-';
      html += `<div class="detail-item"><span class="label">${c.label}</span><span class="value">${this.escapeHtml(val)}</span></div>`;
    });

    if (r.observacoes) {
      html += `<div class="detail-item" style="grid-column:1/-1"><span class="label">Observações</span><span class="value">${this.escapeHtml(r.observacoes)}</span></div>`;
    }

    html += '</div>';

    const certidoes = Db.getCertidoes(id);
    if (certidoes.length > 0) {
      html += `<h4 style="margin-top:20px;margin-bottom:12px">Certidões Emitidas (${certidoes.length})</h4>`;
      html += '<div class="table-container"><table><thead><tr><th>Nº</th><th>Tipo</th><th>Data</th><th>Finalidade</th></tr></thead><tbody>';
      certidoes.forEach(c => {
        html += `<tr><td>${this.escapeHtml(c.id)}</td><td>${this.escapeHtml(c.tipoCertidao || '-')}</td>
          <td>${this.formatDate(c.dataEmissao)}</td><td>${this.escapeHtml(c.finalidade || '-')}</td></tr>`;
      });
      html += '</tbody></table></div>';
    }

    html += `<div class="form-actions" style="margin-top:16px">
      <button class="btn btn-accent" onclick="App.navigateTo('certidao', {registroId:'${id}'})">📄 Emitir Certidão</button>
      <button class="btn btn-outline" onclick="App.editarRegistro('${id}'); document.querySelector('.modal-overlay').classList.remove('open')">✏️ Editar</button>
      <button class="btn btn-outline" onclick="document.querySelector('.modal-overlay').classList.remove('open')">Fechar</button>
    </div>`;

    container.innerHTML = html;
    document.querySelector('.modal-overlay').classList.add('open');
    document.querySelector('.modal-overlay h3').textContent = 'Detalhes do Registro';
  },

  /* Certidão */
  loadCertidao(params) {
    const container = document.querySelector('#section-certidao .card-body');

    let html = '<div class="form-grid">';
    html += `<div class="form-group">
      <label for="cert-tipo">Tipo de Registro</label>
      <select id="cert-tipo" onchange="App.carregarRegistrosParaCertidao()">
        <option value="">Selecione...</option>
        <option value="nascimento">Nascimento</option>
        <option value="casamento">Casamento</option>
        <option value="obito">Óbito</option>
        <option value="livro-e">Livro E</option>
      </select>
    </div>`;
    html += `<div class="form-group">
      <label for="cert-registro">Registro</label>
      <select id="cert-registro"><option value="">Selecione o tipo primeiro</option></select>
    </div>`;
    html += `<div class="form-group">
      <label for="cert-tipoCertidao">Tipo de Certidão</label>
      <select id="cert-tipoCertidao">
        <option value="Inteiro Teor">Inteiro Teor</option>
        <option value="Resumida">Resumida</option>
        <option value="Informativa">Informativa</option>
      </select>
    </div>`;
    html += `<div class="form-group">
      <label for="cert-finalidade">Finalidade</label>
      <input type="text" id="cert-finalidade" placeholder="Ex: Segunda via">
    </div>`;
    html += `<div class="form-group">
      <label for="cert-valor">Valor (R$)</label>
      <input type="number" id="cert-valor" step="0.01" min="0">
    </div>`;
    html += `<div class="form-group full">
      <label for="cert-observacoes">Observações</label>
      <textarea id="cert-observacoes"></textarea>
    </div>`;
    html += '</div>';

    html += `<div class="form-actions">
      <button class="btn btn-primary" onclick="App.emitirCertidao()">📄 Emitir Certidão</button>
    </div>`;

    html += '<div id="cert-resultado" style="margin-top:16px"></div>';

    container.innerHTML = html;

    if (params?.registroId) {
      const r = Db.getById(params.registroId);
      if (r) {
        setTimeout(() => {
          const tipoSelect = document.getElementById('cert-tipo');
          tipoSelect.value = r.tipo;
          this.carregarRegistrosParaCertidao(r.id);
        }, 100);
      }
    }
  },

  carregarRegistrosParaCertidao(selectedId) {
    const tipo = document.getElementById('cert-tipo').value;
    const select = document.getElementById('cert-registro');
    if (!tipo) {
      select.innerHTML = '<option value="">Selecione o tipo primeiro</option>';
      return;
    }
    const registros = Db.getAll(tipo);
    select.innerHTML = '<option value="">Selecione o registro...</option>';
    registros.forEach(r => {
      const nome = r.nome || r.nomeConjuge1 || r.nomeFalecido || r.tipoAto || r.id;
      const mat = r.matricula || r.numeroTermo || '';
      const sel = r.id === selectedId ? 'selected' : '';
      select.innerHTML += `<option value="${r.id}" ${sel}>[${mat}] ${nome}</option>`;
    });
  },

  emitirCertidao() {
    const registroId = document.getElementById('cert-registro').value;
    const tipoCertidao = document.getElementById('cert-tipoCertidao').value;
    const finalidade = document.getElementById('cert-finalidade').value;
    const valor = document.getElementById('cert-valor').value;
    const observacoes = document.getElementById('cert-observacoes').value;

    if (!registroId) { this.showToast('Selecione um registro.', 'error'); return; }

    const certidao = Db.emitirCertidao(registroId, { tipoCertidao, finalidade, valor, observacoes });
    if (!certidao) { this.showToast('Erro ao emitir certidão.', 'error'); return; }

    const container = document.getElementById('cert-resultado');
    container.innerHTML = `
      <div class="card">
        <div class="card-header"><h3>✅ Certidão Emitida</h3></div>
        <div class="card-body">
          <div class="detail-grid">
            <div class="detail-item"><span class="label">Nº da Certidão</span><span class="value">${certidao.id}</span></div>
            <div class="detail-item"><span class="label">Tipo</span><span class="value">${tipoCertidao}</span></div>
            <div class="detail-item"><span class="label">Data de Emissão</span><span class="value">${this.formatDate(certidao.dataEmissao)}</span></div>
            <div class="detail-item"><span class="label">Finalidade</span><span class="value">${finalidade || '-'}</span></div>
            <div class="detail-item"><span class="label">Valor</span><span class="value">${valor ? 'R$ ' + parseFloat(valor).toFixed(2) : '-'}</span></div>
          </div>
        </div>
      </div>`;
    this.atualizarBadges();
    this.showToast('Certidão emitida com sucesso! Nº ' + certidao.id, 'success');
  },

  /* Consulta Geral */
  loadConsulta() {
    const container = document.querySelector('#section-consulta .card-body');
    let html = `<div class="filters">
      <div class="form-group">
        <label>Filtrar por Tipo</label>
        <select id="consulta-tipo" onchange="App.executarConsulta()">
          <option value="">Todos</option>
          <option value="nascimento">Nascimento</option>
          <option value="casamento">Casamento</option>
          <option value="obito">Óbito</option>
          <option value="livro-e">Livro E</option>
        </select>
      </div>
      <div class="form-group" style="flex:2">
        <label>Buscar</label>
        <input type="text" id="consulta-termo" placeholder="Buscar por qualquer informação..." oninput="App.executarConsulta()">
      </div>
    </div>`;
    html += '<div id="consulta-resultados"></div>';
    container.innerHTML = html;
    this.executarConsulta();
  },

  executarConsulta() {
    const tipo = document.getElementById('consulta-tipo')?.value || '';
    const termo = document.getElementById('consulta-termo')?.value || '';
    const container = document.getElementById('consulta-resultados');
    if (!container) return;

    const resultados = Db.search(termo, tipo || null).sort((a, b) => b.createdAt?.localeCompare(a.createdAt));

    if (resultados.length === 0) {
      container.innerHTML = '<div class="empty-state"><div class="icon">🔍</div><h3>Nenhum resultado encontrado</h3></div>';
      return;
    }

    let html = `<p style="margin-bottom:12px;color:var(--text-secondary)">${resultados.length} registro(s) encontrado(s)</p>`;
    html += '<div class="table-container"><table><thead><tr><th>Matrícula</th><th>Tipo</th><th>Principal</th><th>Data</th><th>Ações</th></tr></thead><tbody>';

    resultados.forEach(r => {
      const tipoLabel = this.getTipoLabel(r.tipo);
      const nome = r.nome || r.nomeConjuge1 || r.nomeFalecido || r.tipoAto || '-';
      const mat = r.matricula || '-';
      html += `<tr>
        <td><code style="font-size:12px;background:var(--accent-light);padding:2px 6px;border-radius:4px">${this.escapeHtml(mat)}</code></td>
        <td><span class="badge" style="background:var(--primary-lighter)">${tipoLabel}</span></td>
        <td><strong>${this.escapeHtml(nome)}</strong></td>
        <td>${this.formatDate(r.dataRegistro)}</td>
        <td class="actions-cell">
          <button class="btn btn-outline btn-sm" onclick="App.verDetalhe('${r.id}')">👁️</button>
          <button class="btn btn-accent btn-sm" onclick="App.navigateTo('certidao',{registroId:'${r.id}'})">📄</button>
        </td>
      </tr>`;
    });
    html += '</tbody></table></div>';
    container.innerHTML = html;
  },

  /* Utilitários */
  getTipoLabel(tipo) {
    const labels = { 'nascimento': 'Nascimento', 'casamento': 'Casamento', 'obito': 'Óbito', 'livro-e': 'Livro E' };
    return labels[tipo] || tipo;
  },

  formatDate(dateStr) {
    if (!dateStr) return '-';
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString('pt-BR');
  },

  escapeHtml(str) {
    if (!str) return '';
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  },

  showToast(msg, type) {
    const container = document.querySelector('.toast-container');
    const toast = document.createElement('div');
    toast.className = 'toast ' + (type || '');
    toast.textContent = msg;
    container.appendChild(toast);
    setTimeout(() => { toast.remove(); }, 4000);
  }
};

document.addEventListener('DOMContentLoaded', () => App.init());
