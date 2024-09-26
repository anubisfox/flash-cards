import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { readDeck, updateDeck } from "../utils/api/index";

function EditDeck() {
    const { deckId } = useParams();
    const navigate = useNavigate();
    const initialDeckState = {
        id: "",
        name: "",
        description: "",
    };
    const [deck, setDeck] = useState(initialDeckState);

    useEffect(() => {
        const abortController = new AbortController();
        async function fetchData() {
            try {
                const response = await readDeck(deckId, abortController.signal);
                setDeck(response);
            } catch (error) {
                console.error("Failed to fetch deck:", error);
            }
        }
        fetchData();

        return () => {
            abortController.abort();
        };
    }, [deckId]);

    function handleChange({ target }) {
        setDeck({
            ...deck, 
            [target.name]: target.value});
    }

    async function handleSubmit(event) {
        event.preventDefault();
        try {
            await updateDeck(deck);
            navigate(`/decks/${deckId}`);
        } catch (error) {
            console.error("Failed to update deck:", error);
        }
    }

    function handleCancel() {
        navigate(`/decks/${deckId}`);
    }

    return (
        <div>
            <nav aria-label="breadcrumb">
                <ol className="breadcrumb">
                    <li classname="breadcrumb-item">
                        <Link to="/">Home</Link>
                    </li>
                    <li className="breadcrumb-item">
                        <Link to={`/decks/${deckId}`}>{deck.name}</Link>
                    </li>
                    <li className="breadcrumb-item active">Edit Deck</li>
                </ol>
            </nav>
            <form onSubmit={handleSubmit}>
                <h1>Edit Deck</h1>
                <div className="form-group">
                    <label htmlFor="name">Name</label>
                    <input id="name" name="name" className="form-control" onChange={handleChange} type="text" value={deck.name} />
                </div>
                <div className="form-group">
                    <label htmlFor="description">Description</label>
                    <textarea id="description" name="description" className="form-control" onChange={handleChange} type="text" value={deck.description} />
                </div>
                <button className="btn btn-secondary mx-1" onClick={handleCancel}>Cancel</button>
                <button className="btn btn-primary mx-1" type="submit">Submit</button>
            </form>
        </div>
    );
}

export default EditDeck;