"use client";

import styles from './games.module.css';

import { useState, useEffect } from 'react';
import axios from 'axios';

export default function Games() {

    const url = process.env.NEXT_PUBLIC_API_URL;

    const [games, setGames] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [searchGames, setSearchGames] = useState("");
    const [searchPlatform, setSearchPlatform] = useState("");

    useEffect(() => {
        const fetchGames = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`${url}/games`);
                setGames(response.data);
                setLoading(false);
            } catch (error) {
                console.error("Erro ao buscar os games na API");
                setError(
                    "Não foi possível carregar os games. Tente novamente mais tarde! #Sorry"
                );
                setLoading(false);
            }
        };

        fetchGames();
    }, []);

    return (
        <div className={styles.container}>
      <main className={styles.main}>
        <div className={styles.gamesHeader}>
          <h1 className={styles.gamesTitle}>👾 Games Retrô</h1>
          <p className={styles.gamesSubtitle}>
            Explore nossa coleção de games e seus recordes!
          </p>
        </div>

        <div className={styles.searchContainer}>
          <form className={styles.searchForm}>
            <div className={styles.searchFields}>
              <div className={styles.searchField}>
                <label htmlFor="name">Nome do Game:</label>
                <input
                  type="text"
                  id="name"
                  value={searchGames}
                  onChange={(e) => setSearchGames(e.target.value)}
                  placeholder="Buscar pelo nome do game..."
                  className={styles.searchInput}
                />
              </div>

              <div className={styles.searchField}>
                <label htmlFor="platform">Plataforma:</label>
                <input
                  type="text"
                  id="platform"
                  value={searchPlatform}
                  onChange={(e) => setSearchPlatform(e.target.value)}
                  placeholder="Ex: PlayStation, PC, Switch..."
                  className={styles.searchInput}
                />
              </div>
            </div>

            <div className={styles.searchButtons}>
              <button type="submit" className={styles.searchButton}>
                Buscar
              </button>
              <button
                type="button"
                className={styles.clearButton}
                //onClick={handleClearSearch}
              >
                Limpar
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
    )
}