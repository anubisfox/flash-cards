import React, { useEffect, useState } from "react";
import { Link, useParams, useNavigate} from "react-router-dom";
import { readDeck } from "../utils/api/index";

function Study() {
    const { deckId } = useParams();
    const [deck, setDeck] = useState({});
    const [cards, setCards] = useState([]);
    const [cardNumber, setCardNumber] = useState(1);
    const [front, isFront] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const abortController = new AbortController();
        async function fetchData() {
            try {
                const response = await readDeck(deckId, abortController.signal);
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

    function nextCard(index, total) {
        if (index < total) {
            setCardNumber((prevNumber) => prevNumber +1);
            isFront(true);
        } else {
            if (window.confirm(`Restart cards? Click 'cancel' to return to home page`)) {
                setCardNumber(1);
                isFront(true);
            } else {
                navigate("/");
            }
        }
    }

    function flipCard() {
        isFront((prevFront) => !prevFront);
    }

    function showNextButton() {
        if (!front) {
            return (
                <button
                    onClick={() => nextCard(cardNumber, cards.length)}
                    className="btn btn-primary mx-1"
                >
                    Next
                </button>
            );
        }
        return null;
    }

    function enoughCards() {
        return (
            <div className="card">
                {cards.map((card, index) => {
                    if(index === cardNumber -1) {
                        return (
                            <div className="card-body" key={card.id}>
                                <div className="card-title">
                                    {`Card ${index + 1} of ${cards.length}`}
                                </div>
                                <div className="card-text">
                                    {front ? card.front : card.back}
                                </div>
                                <button onClick={flipCard} className="btn btn-secondary mx-1" aria-label="Flip the card">Flip</button>
                                {showNextButton()}
                            </div>
                        );
                    }
                    return null;
                })}
            </div>
        );
    }

    function notEnoughCards() {
        return (
            <div>
                <h1>Not enough cards.</h1>
                <p>You need at least 3 cards to study. There are {cards.length}{""} cards in this deck.</p>
                <Link to={`/decks/${deck.id}/cards/new`} className="btn btn-primary mx-1">Add Cards</Link>
            </div>
        );
    }

    return (
        <div>
            <nav aria-label="breadcrumbs">
                <ol className="breadcrumb">
                    <li className="breadcrumb-item">
                        <Link to="/">Home</Link>
                    </li>
                    <li className="breadcrumb-item">
                        <Link to={`/decks/${deckId}`}>{deck.name}</Link>
                    </li>
                    <li className="breadcrumb-item active">Study</li>
                </ol>
            </nav>
            <div>
                <h2>{`${deck.name}: Study`}</h2>
                <div>
                    {cards.length < 3 ? notEnoughCards() : enoughCards()}
                </div>
            </div>
        </div>
    );
}

export default Study;