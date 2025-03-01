import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router";
// import "../../style/global.css";

export default function PokemonDetail({ pokemon }) {
  const router = useRouter();

  if (router.isFallback) {
    return (
      <div className="container">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="pokemon-detail-card">
        <h1 className="detail-title">{pokemon.name.toUpperCase()}</h1>
        <img
          // src={pokemon.sprites.front_default}
          // src={pokemon.sprites.other["official-artwork"].front_default}
          src={pokemon.sprites.other["home"].front_default}
          alt={pokemon.name}
          className="detail-image"
        />
        <p className="detail-info">
          <strong>Type:</strong> {pokemon.types.map((t) => t.type.name).join(", ")}
        </p>
        <p className="detail-info">
          <strong>Abilities:</strong> {pokemon.abilities.map((a) => a.ability.name).join(", ")}
         {/* console.log(pokemon); */}
          
        </p>
        <div className="detail-stats">
          <h2>Stats</h2>
          <ul>
            {pokemon.stats.map((stat, index) => (
              <li key={index}>
                {stat.stat.name}: {stat.base_stat}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="back-button-container">
        <Link href="/" passHref>
          <button className="back-button">← Back</button>
        </Link>
      </div>
    </div>
  );
}

export async function getStaticPaths() {
  const res = await axios.get("https://pokeapi.co/api/v2/pokemon?limit=100");
  const paths = res.data.results.map((_, index) => ({
    params: { id: (index + 1).toString() },
  }));
  return { paths, fallback: true };
}

export async function getStaticProps({ params }) {
  try {
    const res = await axios.get(`https://pokeapi.co/api/v2/pokemon/${params.id}`);
    console.log(res.data)
    return { props: { pokemon: res.data } };
  } catch (error) {
    return { notFound: true };
  }
}
