const Db = {
  _seedUsuarios() {
    try {
      const data = localStorage.getItem('usuarios');
      if (data) return;
      const defaultUsers = [
        { login: 'joao', senha: '123', nome: 'João', cargo: 'Oficial' },
        { login: 'maria', senha: '123', nome: 'Maria', cargo: 'Escrevente' },
        { login: 'admin', senha: 'admin', nome: 'Administrador', cargo: 'Admin' }
      ];
      localStorage.setItem('usuarios', JSON.stringify(defaultUsers));
    } catch {}
  },

  autenticar(login, senha) {
    this._seedUsuarios();
    try {
      const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');
      return usuarios.find(u => u.login === login && u.senha === senha) || null;
    } catch { return null; }
  },

  getUsuario(login) {
    try {
      const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');
      return usuarios.find(u => u.login === login) || null;
    } catch { return null; }
  },

  listarUsuarios() {
    this._seedUsuarios();
    try {
      return JSON.parse(localStorage.getItem('usuarios') || '[]');
    } catch { return []; }
  },

  salvarUsuario(usuario) {
    const usuarios = this.listarUsuarios();
    const idx = usuarios.findIndex(u => u.login === usuario.login);
    if (idx >= 0) usuarios[idx] = usuario;
    else usuarios.push(usuario);
    localStorage.setItem('usuarios', JSON.stringify(usuarios));
    return usuario;
  },

  removerUsuario(login) {
    const usuarios = this.listarUsuarios().filter(u => u.login !== login);
    localStorage.setItem('usuarios', JSON.stringify(usuarios));
  },

  _getAll() {
    try {
      return JSON.parse(localStorage.getItem('registros') || '[]');
    } catch {
      return [];
    }
  },

  _saveAll(registros) {
    localStorage.setItem('registros', JSON.stringify(registros));
  },

  getAll(tipo) {
    const registros = this._getAll();
    if (tipo) return registros.filter(r => r.tipo === tipo);
    return registros;
  },

  getById(id) {
    return this._getAll().find(r => r.id === id) || null;
  },

  _proximoIndice(tipo) {
    const contadores = JSON.parse(localStorage.getItem('contadores') || '{}');
    const chave = tipo;
    const atual = (contadores[chave] || 0) + 1;
    contadores[chave] = atual;
    localStorage.setItem('contadores', JSON.stringify(contadores));
    return atual;
  },

  _gerarMatricula(registro) {
    const cns = '065136';
    const codigos = { nascimento: '01', casamento: '02', obito: '04', 'livro-e': '05' };
    const codigo = codigos[registro.tipo] || '00';
    const livro = (registro.livro || '0').replace(/[^0-9A-Za-z]/g, '');
    const folha = (registro.folha || '0').replace(/[^0-9A-Za-z]/g, '');
    const termo = (registro.numeroTermo || '0').replace(/[^0-9A-Za-z]/g, '');
    return cns + '-' + codigo + '-' + livro + '-' + folha + '-' + termo;
  },

  save(registro) {
    const registros = this._getAll();
    const now = new Date().toISOString();
    if (registro.id) {
      const idx = registros.findIndex(r => r.id === registro.id);
      if (idx >= 0) {
        registro.matricula = this._gerarMatricula(registro);
        registro.updatedAt = now;
        registros[idx] = registro;
      }
    } else {
      registro.id = Date.now().toString(36) + Math.random().toString(36).substring(2, 7).toUpperCase();
      registro.indice = this._proximoIndice(registro.tipo);
      registro.matricula = this._gerarMatricula(registro);
      registro.createdAt = now;
      registro.updatedAt = now;
      registros.push(registro);
    }
    this._saveAll(registros);
    return registro;
  },

  delete(id) {
    const registros = this._getAll().filter(r => r.id !== id);
    this._saveAll(registros);
  },

  search(term, tipo) {
    let registros = this._getAll();
    if (tipo) registros = registros.filter(r => r.tipo === tipo);
    if (!term) return registros;
    term = term.toLowerCase();
    return registros.filter(r => {
      const vals = Object.values(r).join(' ').toLowerCase();
      return vals.includes(term);
    });
  },

  count(tipo) {
    return this.getAll(tipo).length;
  },

  emitirCertidao(registroId, dadosCertidao) {
    const registro = this.getById(registroId);
    if (!registro) return null;
    if (!registro.certidoes) registro.certidoes = [];
    const certidao = {
      id: 'CERT-' + Date.now().toString(36).toUpperCase() + Math.random().toString(36).substring(2, 5).toUpperCase(),
      ...dadosCertidao,
      dataEmissao: new Date().toISOString(),
    };
    registro.certidoes.push(certidao);
    this.save(registro);
    return certidao;
  },

  getCertidoes(registroId) {
    const registro = this.getById(registroId);
    return registro ? (registro.certidoes || []) : [];
  }
};
