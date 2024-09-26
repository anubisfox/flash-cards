import React, { useState, useEffect } from "react";
import { listDecks, deleteDeck } from "../utils/api/index";
import { Link } from "react-router-dom";

function Home() {
    const [decks, setDecks] = useState([]);

    useEffect (()  => {
        const abortController = new AbortController();
        async function fetchData () {
            try {
                const response = await listDecks(abortController.signal);
                setDecks(response);
            } catch (error) {
                if (error.name !== "AbortError") {
                    console.error("Failed to fetch decks:", error);
                }
            }
        }
        fetchData();

        return () => {
            abortController.abort();
        };
    }, []);

    async function handleDelete(deckId) {
        const confirmDelete = window.confirm("Delete this deck? You will not be able to recover it");
        if (confirmDelete) {
            try {
                await deleteDeck(deckId);
                setDecks((currentDecks) => currentDecks.filter(deck => deck.id !== deckId));
            } catch (error) {
                console.error("Failed to delete the deck:", error);
            }
        }
    }
    return (
        <div className="container">
            <Link className="btn btn-secondary mb-2" to="decks/new"> Create Deck</Link>
            <div className="card-deck">
                {decks.map((deck) => {
                    return (
                        <div className="card" style={{ width: "30rem" }} key={deck.id}>
                            <div className="card-body">
                                <div className="card-title">
                                    {`${deck.name}`}
                                </div>
                                <div className="card-subtitle mb-2 text-muted">
                                    {`${deck.cards.length} cards`}
                                </div>
                                <div className="card-text">
                                    {`${deck.description}`}
                                </div>
                                <Link className="btn btn-secondary mx-1" to={`/decks/${deck.id}`}> View </Link>
                                <Link className="btn btn-primary mx-1" to={`/decks/${deck.id}/study`}> Study </Link>
                                <button type="button" className="btn btn-danger mx-1" onClick={() => handleDelete(deck.id)}> Delete </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default Home;