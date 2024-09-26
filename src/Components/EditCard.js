import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { readCard, readDeck, updateCard } from "../utils/api/index";

function EditCard() {
    const { deckId, cardId } = useParams();
    const navigate = useNavigate();
    const initialDeckState = {
        id: "",
        name: "",
        description: "",
    };
    const initialCardState = {
        id: "",
        front: "",
        back: "",
        deckId: "",
    };

    const [card, setCard] = useState(initialCardState);
    const [deck, setDeck] = useState(initialDeckState);

    useEffect(() => {
        const abortController = new AbortController();
        async function fetchData() {
            try {
                const cardResponse = await readCard(cardId, abortController.signal);
                const deckResponse = await readDeck(deckId, abortController.signal);
                setCard(cardResponse);
                setDeck(deckResponse);
            } catch (error) {
                console.error("Failed to fetch data:", error);
            }
        }
        fetchData();

        return () => {
            abortController.abort();
        };
    }, [cardId, deckId]);

    function handleChange({ target }) {
        setCard({ 
            ...card,
            [target.name]: target.value});
    }

    async function handleSubmit(event) {
        event.preventDefault();
        try {
            await updateCard(card);
            navigate(`/decks/${deckId}`);
        } catch (error) {
            console.error("Failed to update card:", error);
        }
    }

    function handleCancel() {
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
                    <li className="breadcrumb-item active">Edit Card {cardId}</li>
                </ol>
            </nav>
            <form onSubmit={handleSubmit}>
                <h2>Edit Card</h2>
                <div className="form-group">
                    <label htmlFor="front">Front</label>
                    <textarea id="front" name="front" className="form-control" onChange={handleChange} type="text" value={card.front} rows="4" />
                </div>
                <div className="form-group">
                    <label htmlFor="back">Back</label>
                    <textarea id="back" name="back" className="form-control" onChange={handleChange} type="text" value={card.back} rows="4" />
                </div>
                <button className="btn btn-secondary mx-1" onClick={handleCancel}>Cancel</button>
                <button className="btn btn-primary mx-1" type="submit">Save</button>
            </form>
        </div>
    );
}


export default EditCard;