import { useEffect, useState } from "react";
import Link from "next/link";
import "../style/global.css";

export default function Home() {
  const [pokemons, setPokemons] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function fetchPokemonData() {
      const res = await fetch("https://pokeapi.co/api/v2/pokemon?limit=500");
      const data = await res.json();

      const pokemonDetails = await Promise.all(
        data.results.map(async (pokemon, index) => {
          const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${index + 1}`);
          const details = await res.json();
          return {
            name: pokemon.name,
            id: index + 1,
            image: details.sprites.other?.home?.front_default || details.sprites.other["official-artwork"]?.front_default,
          };
        })
      );

      setPokemons(pokemonDetails);
    }

    fetchPokemonData();
  }, []);

  const filteredPokemons = pokemons.filter((pokemon) =>
    pokemon.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="container">
      <h1 className="title">Pokemon Explorer</h1>
      <input
        type="text"
        placeholder="Search Pokémon..."
        className="search-bar"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="pokemon-container">
        {filteredPokemons.map((pokemon) => (
          <Link href={`/pokemon/${pokemon.id}`} key={pokemon.id} legacyBehavior>
            <a className="pokemon-card">
              <img src={pokemon.image} alt={pokemon.name} />
              <h3>{pokemon.name.toUpperCase()}</h3>
            </a>
          </Link>
        ))}
      </div>
    </div>
  );
}