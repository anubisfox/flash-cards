import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { createCard, readDeck } from "../utils/api/index";

function AddCard() {
    const { deckId } = useParams();
    const navigate = useNavigate();
    const initialState ={
        front: '',
        back: '',
    };
    const [newCard, setNewCard] = useState(initialState);
    const [deck, setDeck] = useState({});

    useEffect (() => {
        const abortController = new AbortController();
        async function fetchData() {
            try {
                const response = await readDeck(deckId, abortController.signal);
                setDeck(response);
            } catch (error) {
                if (error.name !== "AbortError") {
                    console.error("Failed to fetch deck:", error);
                }
            }
        }
        fetchData();

        return () => {
            abortController.abort();
        };
    }, [deckId]);

    function handleChange({ target }) {
        setNewCard({
            ...newCard,
            [target.name]: target.value,
        });
    }

    async function handleSubmit(event) {
        event.preventDefault();
        try {
            await createCard(deckId, newCard);
            setNewCard(initialState);
        } catch (error) {
            console.error("Failed to create card:", error);
        }
    }

    function handleDone() {
        navigate(`/decks/${deckId}`);
    }

    return (
        <div>
            <nav aria-label="breadcrumb">
                <ol className="breadcrumb">
                    <li className="breadcrumb-item">
                        <Link to="/">Home</Link>
                    </li>
                    <li className="breadcrumb-item">
                        <Link to={`/decks/${deckId}`}>{deck.name}</Link>
                    </li>
                    <li className="breadcrumb-item active">Add Card</li>
                </ol>
            </nav>
            <form onSubmit={handleSubmit}>
                <h2>{deck.name}: Add Card</h2>
                <div className="form-group">
                    <label htmlFor="front">Front</label>
                    <textarea id="front" name="front" className="form-control" onChange={handleChange} type="text" value={newCard.front} rows="3" />
                </div>
                <div className="form-group">
                    <label htmlFor="back">Back</label>
                    <textarea id="back" name="back" className="form-control" onChange={handleChange} type="text" value={newCard.back} rows="3" />
                </div>
                <button className="btn btn-secondary mx-1" onClick={handleDone}>Done</button>
                <button className="btn btn-primary mx-1" type="submit">Save</button>
            </form>
        </div>
    );
}

export default AddCard;