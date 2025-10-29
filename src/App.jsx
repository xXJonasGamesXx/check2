import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import React, { useCallback, useMemo } from "react";

const styles = {
  container: {
    fontFamily: "papyrus",
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "20px",
    backgroundColor: "#d7bea6",
  },
  header: {
    textAlign: "center",
  },

  h3: {
    borderBottom: "1px solid #eee",
    paddingBottom: "8px",
  },
  button: {
    margin: "4px",
    padding: "8px 12px",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    backgroundColor: "#007bff",
    color: "white",
    fontSize: "14px",
  },
  buttonDano: {
    backgroundColor: "#dc3545",
  },
  buttonLoja: {
    backgroundColor: "#28a745",
  },

  select: {
    padding: "8px",
    marginRight: "8px",
    borderRadius: "4px",
    border: "1px solid #ccc",
  },
  barraProgresso: {
    width: "100%",
    backgroundColor: "#e0e0e0",
    borderRadius: "4px",
    overflow: "hidden",
    height: "24px",
    position: "relative",
    color: "black",
    fontWeight: "bold",
  },
  barraProgressoCheia: {
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  listItem: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "8px",
    borderBottom: "1px solid #f0f0f0",
  },
};

function SistemaCombate({ hp, setHp, maxHp, atributos, itens, setItens }) {
  const getHpColor = () => {
    const hpPercent = (hp / maxHp) * 100;
    if (hpPercent < 30) return "#dc3545";
    if (hpPercent <= 70) return "#ffc107";
    return "#28a745";
  };

  const hpPercentage = (hp / maxHp) * 100;

  const cura = 10 + atributos.inteligencia;
  const danoRecebido = Math.max(1, 15 - Math.floor(atributos.resistencia / 2));

  const handleCurar = () => {
    const potionIndex = itens.indexOf("Poção de Cura");
    if (potionIndex !== -1) {
      setHp((prevHp) => Math.min(prevHp + cura, maxHp));
      const newItens = [...itens];
      newItens.splice(potionIndex, 1);
      setItens(newItens);
      alert(`Você usou uma poção e curou ${cura} HP!`);
    } else {
      alert("Você não tem poções de cura!");
    }
  };

  const handleDano = () => {
    setHp((prevHp) => Math.max(prevHp - danoRecebido, 0));
  };

  const isCritico = hpPercentage < 30;

  return (
    <div style={styles.componentBox}>
      <h3 style={styles.h3}>Sistema de Combate</h3>
      <div
        style={{
          ...styles.barraProgresso,
        }}
      >
        <div
          style={{
            ...styles.barraProgressoCheia,
            width: `${hpPercentage}%`,
            backgroundColor: getHpColor(),
          }}
        >
          {hp} / {maxHp} HP
        </div>
      </div>
      <p
        style={{
          fontWeight: isCritico ? "bold" : "normal",
          color: isCritico ? "red" : "black",
        }}
      >
        {isCritico ? "VIDA CRÍTICA!" : "Status: Estável"}
      </p>
      <button style={styles.button} onClick={handleCurar}>
        Curar (+{cura} HP)
      </button>
      <button
        style={{ ...styles.button, ...styles.buttonDano }}
        onClick={handleDano}
      >
        Sofrer Dano (-{danoRecebido} HP)
      </button>
    </div>
  );
}

function SistemaXP({ xp, level, handleGainXp, XP_PARA_UPAR }) {
  const xpPercentage = (xp / XP_PARA_UPAR) * 100;

  return (
    <div style={styles.componentBox}>
      <h3 style={styles.h3}>Experiência e Nível</h3>
      <h4>Nível: {level}</h4>
      <div style={styles.barraProgresso}>
        <div
          style={{
            ...styles.barraProgressoCheia,
            width: `${xpPercentage}%`,
            backgroundColor: "#007bff",
            color: "white",
          }}
        >
          {xp} / {XP_PARA_UPAR} XP
        </div>
      </div>
      <button style={styles.button} onClick={() => handleGainXp(50)}>
        Derrotar Inimigo (+50 XP)
      </button>
    </div>
  );
}

function Inventario({ itens }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div style={styles.componentBox}>
      <h3 style={styles.h3}>Inventário</h3>
      <button style={styles.button} onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? "Fechar Inventário" : "Abrir Inventário"}
      </button>
      {isOpen ? (
        <div>
          <h4>Itens na Mochila: ({itens.length})</h4>
          <ul style={styles.list}>
            {itens.length > 0 ? (
              itens.map((item, index) => (
                <li key={`${item}-${index}`} style={styles.listItem}>
                  {item}
                </li>
              ))
            ) : (
              <p>Mochila vazia.</p>
            )}
          </ul>
        </div>
      ) : (
        <p>Mochila Fechada 🎒</p>
      )}
    </div>
  );
}

function DiarioMissoes({ missoes, setMissoes, onCompleteMission }) {
  const [novaMissao, setNovaMissao] = useState("");
  const [categoria, setCategoria] = useState("Secundária");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (novaMissao.trim() === "") return;
    const missao = {
      id: Date.now(),
      texto: novaMissao,
      categoria: categoria,
      completa: false,
    };
    setMissoes([...missoes, missao]);
    setNovaMissao("");
  };

  const handleConcluir = (id) => {
    setMissoes(
      missoes.map((m) => (m.id === id ? { ...m, completa: true } : m))
    );
    onCompleteMission();
  };

  const missoesAtivas = missoes.filter((m) => !m.completa);
  const missoesCompletas = missoes.filter((m) => m.completa).length;

  return (
    <div style={styles.componentBox}>
      <h3 style={styles.h3}>Diário de Missões</h3>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={novaMissao}
          onChange={(e) => setNovaMissao(e.target.value)}
          placeholder="Nova missão..."
          style={styles.input}
        />
        <select
          value={categoria}
          onChange={(e) => setCategoria(e.target.value)}
          style={styles.select}
        >
          <option value="Principal">Principal</option>
          <option value="Secundária">Secundária</option>
          <option value="Urgente">Urgente</option>
        </select>
        <button type="submit" style={styles.button}>
          Adicionar
        </button>
      </form>

      <h4>Missões Ativas:</h4>
      <ul style={styles.list}>
        {missoesAtivas.map((m) => (
          <li key={m.id} style={styles.listItem}>
            <span>
              ({m.categoria}) {m.texto}
            </span>
            <button
              style={{ ...styles.button, ...styles.buttonLoja }}
              onClick={() => handleConcluir(m.id)}
            >
              Concluir
            </button>
          </li>
        ))}
      </ul>
      <p>Missões Completas: {missoesCompletas}</p>
    </div>
  );
}

function GeradorEncantamentos() {
  const [palavraBase, setPalavraBase] = useState("");
  const [encantamento, setEncantamento] = useState("");

  const gerar = () => {
    const invertida = palavraBase.split("").reverse().join("");
    const encantamentoGerado = ` "${invertida.toUpperCase()}" `;
    setEncantamento(encantamentoGerado);
  };

  return (
    <div style={styles.componentBox}>
      <p>Gerador de Encantamentos</p>
      <input
        type="text"
        value={palavraBase}
        onChange={(e) => setPalavraBase(e.target.value)}
        placeholder="Palavra mágica base"
        style={styles.input}
      />
      <button style={styles.button} onClick={gerar}>
        Gerar
      </button>
      {encantamento && (
        <p>
          <strong>Encantamento de:</strong> {encantamento}
        </p>
      )}
    </div>
  );
}

function RankingHerois({ party, setParty }) {
  const [nome, setNome] = useState("");
  const [classe, setClasse] = useState("Guerreiro");

  const rankingOrdenado = useMemo(() => {
    return [...party].sort((a, b) => b.nivel - a.nivel);
  }, [party]);

  const handleAdd = () => {
    if (nome.trim() === "") return;
    setParty([...party, { nome, classe, nivel: 1 }]);
    setNome("");
  };

  const handleLevelChange = (nomeMembro, delta) => {
    setParty(
      party.map((m) =>
        m.nome === nomeMembro
          ? { ...m, nivel: Math.max(1, m.nivel + delta) }
          : m
      )
    );
  };

  return (
    <div style={styles.componentBox}>
      <h3 style={styles.h3}>Ranking dos Heróis (Party)</h3>
      <div>
        <input
          type="text"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          placeholder="Nome do companheiro"
          style={styles.input}
        />
        <select
          value={classe}
          onChange={(e) => setClasse(e.target.value)}
          style={styles.select}
        >
          <option value="Guerreiro">Guerreiro</option>
          <option value="Mago">Mago</option>
          <option value="Arqueiro">Arqueiro</option>
          <option value="Arqueiro">Paladino</option>
          <option value="Arqueiro">Clerigo</option>
          <option value="Arqueiro">Monge</option>
        </select>
        <button style={styles.button} onClick={handleAdd}>
          Adicionar
        </button>
      </div>

      <ul style={styles.list}>
        {rankingOrdenado.map((membro, index) => (
          <li key={membro.nome} style={styles.listItem}>
            <span>
              <strong>
                #{index + 1} {membro.nome}
              </strong>{" "}
              ({membro.classe}) - Nv. {membro.nivel}
            </span>
            <div>
              <button
                style={styles.button}
                onClick={() => handleLevelChange(membro.nome, 1)}
              >
                +
              </button>
              <button
                style={styles.button}
                onClick={() => handleLevelChange(membro.nome, -1)}
              >
                -
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

function SistemaAtributos({ pontos, setPontos, atributos, setAtributos }) {
  const handleIncrement = (attr) => {
    if (pontos > 0) {
      setPontos(pontos - 1);
      setAtributos({ ...atributos, [attr]: atributos[attr] + 1 });
    }
  };

  const handleDecrement = (attr) => {
    if (atributos[attr] > 0) {
      setPontos(pontos + 1);
      setAtributos({ ...atributos, [attr]: atributos[attr] - 1 });
    }
  };

  return (
    <div style={styles.componentBox}>
      <h3 style={styles.h3}>Atributos</h3>
      <h4>Pontos para distribuir: {pontos}</h4>
      <ul style={styles.list}>
        {Object.keys(atributos).map((attr) => (
          <li key={attr} style={styles.listItem}>
            <span style={{ textTransform: "capitalize" }}>
              {attr}: <strong>{atributos[attr]}</strong>
            </span>
            <div>
              <button
                style={styles.button}
                onClick={() => handleIncrement(attr)}
                disabled={pontos === 0}
              >
                +
              </button>
              <button
                style={styles.button}
                onClick={() => handleDecrement(attr)}
                disabled={atributos[attr] === 0}
              >
                -
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

function PainelPersonagem({ info, setInfo }) {
  const [showStatus, setShowStatus] = useState(false);

  const handleChange = (e) => {
    setInfo({ ...info, [e.target.name]: e.target.value });
  };

  return (
    <div style={styles.componentBox}>
      <h3 style={styles.h3}>Painel do Personagem</h3>
      <div>
        <label>Nome: </label>
        <input
          type="text"
          name="nome"
          value={info.nome}
          onChange={handleChange}
          style={styles.input}
        />
      </div>
      <div style={{ margin: "10px 0" }}>
        <label>Raça: </label>
        <select
          name="raca"
          value={info.raca}
          onChange={handleChange}
          style={styles.select}
        >
          <option value="Humano">Humano</option>
          <option value="Elfo">Elfo</option>
          <option value="Anão">Anão</option>
          <option value="Draconato">Draconato</option>
          <option value="Tifling">Tifling</option>
          <option value="Halfing">Halfing</option>
        </select>
      </div>
      <div style={{ margin: "10px 0" }}>
        <label>Classe: </label>
        <select
          name="classe"
          value={info.classe}
          onChange={handleChange}
          style={styles.select}
        >
          <option value="Guerreiro">Guerreiro</option>
          <option value="Mago">Mago</option>
          <option value="Arqueiro">Arqueiro</option>
          <option value="Paladino">Paladino</option>
          <option value="Clerigo">Clerigo</option>
          <option value="Monge">Monge</option>
        </select>
      </div>
      <button style={styles.button} onClick={() => setShowStatus(!showStatus)}>
        {showStatus ? "Esconder Status" : "Mostrar Status"}
      </button>
      {showStatus && (
        <div>
          <h4>Efeitos Ativos:</h4>
          <ul style={styles.list}>
            <li style={styles.listItem}>Bênção do Trapaceiro</li>
            <li style={styles.listItem}>Fadiga (-1 RES)</li>
          </ul>
        </div>
      )}
    </div>
  );
}

function SistemaEconomico({ gold, setGold, itens, setItens }) {
  const [showLoja, setShowLoja] = useState(false);

  const lojaItens = [
    { nome: "Poção de Cura", preco: 15 },
    { nome: "Flecha de Prata (10x)", preco: 25 },
    { nome: "Espada Longa", preco: 75 },
  ];

  const handleBuy = (item) => {
    if (gold >= item.preco) {
      setGold(gold - item.preco);
      setItens([...itens, item.nome]);
      alert(`Item "${item.nome}" comprado!`);
    } else {
      alert("Ouro insuficiente!");
    }
  };

  return (
    <div style={styles.componentBox}>
      <h3 style={styles.h3}>Economia</h3>
      <h4>Ouro: {gold} moedas</h4>
      <button style={styles.button} onClick={() => setGold(gold + 25)}>
        Ganhar Ouro (Teste)
      </button>

      <hr
        style={{ margin: "15px 0", border: "0", borderTop: "1px solid #eee" }}
      />

      <button style={styles.button} onClick={() => setShowLoja(!showLoja)}>
        {showLoja ? "Fechar Loja" : "Abrir Loja"}
      </button>

      {showLoja && (
        <div>
          <h4>Loja do Mercador</h4>
          <ul style={styles.list}>
            {lojaItens.map((item) => (
              <li key={item.nome} style={styles.listItem}>
                <span>
                  {item.nome} - <strong>{item.preco} Ouro</strong>
                </span>
                <button
                  style={{ ...styles.button, ...styles.buttonLoja }}
                  onClick={() => handleBuy(item)}
                  disabled={gold < item.preco}
                >
                  Comprar
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default function App() {
  const XP_PARA_UPAR = 300;

  const [atributos, setAtributos] = useState({
    forca: 1,
    resistencia: 1,
    inteligencia: 1,
    sorte: 1,
  });
  const [pontosAtributo, setPontosAtributo] = useState(10);

  const maxHp = useMemo(
    () => 100 + atributos.resistencia * 10,
    [atributos.resistencia]
  );

  const [hp, setHp] = useState(maxHp);
  const [xp, setXp] = useState(0);
  const [level, setLevel] = useState(1);
  const [missoes, setMissoes] = useState([]);
  const [gold, setGold] = useState(50);
  const [personagemInfo, setPersonagemInfo] = useState({
    nome: "",
    raca: "Humano",
    classe: "Guerreiro",
  });
  const [itens, setItens] = useState(["Espada de Aço", "Mapa Antigo"]);

  const [party, setParty] = useState([
    { nome: personagemInfo.nome, classe: personagemInfo.classe, nivel: level },
  ]);

  React.useEffect(() => {
    setParty((prevParty) =>
      prevParty.map((m, index) =>
        index === 0
          ? {
              ...m,
              nome: personagemInfo.nome,
              classe: personagemInfo.classe,
              level: level,
            }
          : m
      )
    );
  }, [personagemInfo.nome, personagemInfo.classe, level]);

  React.useEffect(() => {
    const hpPercent = hp / maxHp;
    const newMaxHp = 100 + atributos.resistencia * 10;
    setHp(Math.round(newMaxHp * hpPercent));
  }, [atributos.resistencia, hp, maxHp]);

  const handleGainXp = (amount) => {
    const newTotalXp = xp + amount;
    const niveisGanhos = Math.floor(newTotalXp / XP_PARA_UPAR);
    const xpRestante = newTotalXp % XP_PARA_UPAR;

    setXp(xpRestante);

    if (niveisGanhos > 0) {
      const newLevel = level + niveisGanhos;
      setLevel(newLevel);
      setPontosAtributo((prev) => prev + niveisGanhos * 3);
      alert(`LEVEL UP! Você alcançou o nível ${newLevel}!`);
    }
  };

  const handleCompleteMission = () => {
    handleGainXp(100);
    setGold((prevGold) => prevGold + 25);
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1>{personagemInfo.nome.toUpperCase() || "Check Point 2"}</h1>
      </header>

      <div style={styles.grid}>
        <PainelPersonagem info={personagemInfo} setInfo={setPersonagemInfo} />

        <SistemaAtributos
          pontos={pontosAtributo}
          setPontos={setPontosAtributo}
          atributos={atributos}
          setAtributos={setAtributos}
        />

        <SistemaCombate
          hp={hp}
          setHp={setHp}
          maxHp={maxHp}
          atributos={atributos}
          itens={itens}
          setItens={setItens}
        />

        <SistemaXP
          xp={xp}
          level={level}
          handleGainXp={handleGainXp}
          XP_PARA_UPAR={XP_PARA_UPAR}
        />

        <SistemaEconomico
          gold={gold}
          setGold={setGold}
          itens={itens}
          setItens={setItens}
        />

        <Inventario itens={itens} />

        <DiarioMissoes
          missoes={missoes}
          setMissoes={setMissoes}
          onCompleteMission={handleCompleteMission}
        />

        <RankingHerois party={party} setParty={setParty} />

        <GeradorEncantamentos />
      </div>
    </div>
  );
}
