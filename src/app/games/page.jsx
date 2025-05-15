"use client";

import styles from './games.module.css';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import axios from 'axios';
import Link from 'next/link';

export default function Games() {

    const url = process.env.NEXT_PUBLIC_API_URL;

    const [games, setGames] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Variáveis do input
    const [searchGames, setSearchGames] = useState("");
    const [searchPlatform, setSearchPlatform] = useState("");

    const router = useRouter();
    const searchParams = useSearchParams();

    const name = searchParams.get("name") || "";
    const platform = searchParams.get("platform") || "";

    const updateUrl = (params) => {
        const newParams = new URLSearchParams();
    
        if (params.name) {
          newParams.set("name", params.name);
        }
    
        if (params.platform) {
          newParams.set("platform", params.platform);
        }
    
        router.push(
          `/games${newParams.toString() ? `?${newParams.toString()}` : ""}`
        );
      };

    const handleSearch = (e) => {
        e.preventDefault()

        updateUrl({name: searchGames, platform: searchPlatform});
    }

    useEffect(() => {
        const fetchGames = async () => {
          try {
            // Construir URL com parâmetros de busca
            let apiUrl = `${url}/games`;
            const queryParams = new URLSearchParams();
    
            if (name) queryParams.append("name", name);
            if (platform) queryParams.append("platform", platform);
    
            if (queryParams.toString()) {
              apiUrl += `?${queryParams.toString()}`;
            }
    
            const response = await axios.get(apiUrl);
            setGames(response.data.games);
            setError(null);
          } catch (error) {
            console.error("Erro ao buscar os jogos na API");
            setError(
              "Não foi possível carregar os jogos. Tente novamente mais tarde! #Sorry"
            );
            setLoading(false);
          }
        };
    
        fetchGames();
        setSearchGames(name);
        setSearchPlatform(platform);
      }, [name, platform]);

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
                    <form onSubmit={handleSearch} className={styles.searchForm}>
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

                {/* Lista de Games */}
                <div className={styles.gameGrid}>
                    {games.length === 0 ? (
                        <div className={styles.noGames}>
                            <p>Nenhum game encontrado.</p>
                        </div>
                    ) : (
                        games.map((game) => (
                            <div key={game.id} className={styles.gameCard}>
                                <div className={styles.gameCardHeader}>
                                    <h3 className={styles.gameTitle}>{game.name}</h3>
                                </div>
                                <div className={styles.gameCardBody}>
                                    <p>
                                        <strong>Plataforma:</strong> {game.platform}
                                    </p>
                                    <p>
                                        <strong>ID:</strong> {game.id.substring(0, 8)}...
                                    </p>
                                    <p>
                                        <strong>Criado em:</strong>{" "}
                                        {new Date(game.createdAt).toLocaleDateString()}
                                    </p>
                                </div>
                                <div className={styles.gameCardFooter}>
                                    <Link href={`/games/${game.id}`} className={styles.gameLink}>
                                        Ver detalhes
                                    </Link>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </main>
        </div>
    )
}