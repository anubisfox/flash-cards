import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { readDeck, deleteDeck, deleteCard } from "../utils/api/index";

function Deck() {
    const navigate = useNavigate();
    const { deckId } = useParams();
    const [deck, setDeck]= useState(null);
    const [cards, setCards] = useState([]);

    useEffect(() => {
        const abortController = new AbortController();
        async function fetchData() {
            try {
                const response = await readDeck( deckId, abortController.signal);
                setDeck(response);
                setCards(response.cards || []);
            } catch (error) {
                console.error("Failed to fetch deck:", error);
            }
        }
        fetchData();

        return () => {
            abortController.abort();
        };
    }, [deckId]);

    async function handleDeleteDeck() {
        const confirmDelete = window.confirm("Delete this deck? You will not be able to recover it.");
        if (confirmDelete) {
            try {
                await deleteDeck(deckId);
                navigate("/");
            } catch (error) {
                console.error("Failed to delete the deck:", error);
            }
        }
    }

    async function handleDeleteCard(cardId) {
        const confirmDelete = window.confirm("Delete this card? You will not be able to recover it.");
        if (confirmDelete) {
            try {
                await deleteCard(cardId);
                setCards((currentCards) => currentCards.filter(card => card.id !== cardId));
            } catch (error) {
                console.error("Failed to delete the card:", error);
            }
        }
    }

    function handleEditDeck() {
        navigate(`/decks/${deckId}/edit`);
    }

    function handleStudy() {
        navigate(`/decks/${deckId}/study`);
    }

    function handleAddCard() {
        navigate(`/decks/${deckId}/cards/new`);
    }

    function handleEditCard(card) {
        navigate(`/decks/${deckId}/cards/${card.id}/edit`);
    }

    if (cards.length > 0) {
        return (
            <div>
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item">
                            <Link to="/">Home</Link>
                        </li>
                        <li className="breadcrumb-item active">{deck.name}</li>
                    </ol>
                </nav>
                <div className="card">
                    <div className="card-body">
                        <h2 className="card-title">{deck.name}</h2>
                        <p>{deck.description}</p>
                        <button onClick={handleEditDeck} className="btn btn-secondary mx-1">Edit</button>
                        <button onClick={handleStudy} className="btn btn-primary mx-1">Study</button>
                        <button onClick={handleAddCard} className="btn btn-primary mx-1">Add Cards</button>
                        <button onClick={handleDeleteDeck} className="btn btn-danger mx-1">Delete</button>
                    </div>
                </div>
                <h1>Cards</h1>
                {cards.map((card) => {
                    return (
                        <div className="card-deck" key={card.id}>
                            <div className="card">
                                <div className="card-body">
                                    <div className="row">
                                        <div className="col">{card.front}</div>
                                        <div className="col">{card.back}</div>
                                    </div>
                                    <div className="container row">
                                        <button onClick={() => handleEditCard(card)} className="btn btn-secondary mx-1">Edit</button>
                                        <button onClick={() => handleDeleteCard(card.id)} className="btn btn-danger mx-1">Delete</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        );
    }
}

export default Deck;